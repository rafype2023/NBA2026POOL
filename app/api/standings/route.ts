import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Prediction from '@/models/Prediction';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();
    const predictions = await Prediction.find({}).lean();
    
    // Find master record with case-insensitive check
    const master = predictions.find((p: any) => p.name?.toUpperCase() === 'CLAVE-CLAVE');
    if (!master) {
      return NextResponse.json({ success: true, standings: [] });
    }

    // Dynamic Team Resolution Helper
    const getTeamsForSeries = (seriesId: string, bracket: any, playin: any) => {
        switch (seriesId) {
            case 'west_r1_s1': return ['okc', playin?.westEighthSeedWinner];
            case 'west_r1_s2': return ['hou', 'den'];
            case 'west_r1_s3': return ['lal', 'min'];
            case 'west_r1_s4': return ['sas', playin?.westSunsVsClippersWinner];

            case 'west_r2_s1': return [bracket?.west_r1_s1?.winner, bracket?.west_r1_s2?.winner];
            case 'west_r2_s2': return [bracket?.west_r1_s3?.winner, bracket?.west_r1_s4?.winner];
            case 'west_cf': return [bracket?.west_r2_s1?.winner, bracket?.west_r2_s2?.winner];

            case 'east_r1_s1': return ['det', playin?.eastEighthSeedWinner];
            case 'east_r1_s2': return ['cle', 'orl'];
            case 'east_r1_s3': return ['nyk', 'tor'];
            case 'east_r1_s4': return ['bos', playin?.eastHeatVsHawksWinner];

            case 'east_r2_s1': return [bracket?.east_r1_s1?.winner, bracket?.east_r1_s2?.winner];
            case 'east_r2_s2': return [bracket?.east_r1_s3?.winner, bracket?.east_r1_s4?.winner];
            case 'east_cf': return [bracket?.east_r2_s1?.winner, bracket?.east_r2_s2?.winner];

            case 'finals': return [bracket?.west_cf?.winner, bracket?.east_cf?.winner];
            
            default: return [];
        }
    };

    // Generic Series Scoring
    const getScore = (roundType: string, uTeams: any[], uWinner: string, uGames: number, mTeams: any[], mWinner: string, mGames: number) => {
        let correctTeams = 0;
        if (mTeams.includes(uTeams[0]) && uTeams[0]) correctTeams++;
        if (mTeams.includes(uTeams[1]) && uTeams[1] && uTeams[0] !== uTeams[1]) correctTeams++;

        const hasWinner = (uWinner === mWinner) && !!mWinner;
        const hasGames = (String(uGames).trim() === String(mGames).trim()) && !!mGames;

        if (!hasWinner) return 0; // 0 points if winner is completely wrong

        if (roundType === 'r1') {
            if (correctTeams === 2) return hasGames ? 3.5 : 3.0;
            return hasGames ? 2.5 : 2.0;

        } else if (roundType === 'semis' || roundType === 'cf') {
            if (correctTeams === 2) return hasGames ? 4.5 : 4.0;
            return hasGames ? 3.5 : 3.0;

        } else if (roundType === 'finals') {
            let s = correctTeams === 2 ? 5.5 : 5.0;
            if (hasGames) s += 1.0;
            return s;
        }
        
        return 0;
    };

    const standings = predictions
      .filter((p: any) => p.name?.toUpperCase() !== 'CLAVE-CLAVE')
      .map((p: any) => {
        let scorePlayin = 0;
        let scoreR1 = 0;
        let scoreSemis = 0;
        let scoreCf = 0;
        let scoreFinals = 0;

        // Play-In Scoring (1 pt per correct winner)
        ['westSunsVsClippersWinner', 'westWarriorsVsBlazersWinner', 'westEighthSeedWinner', 
         'eastHeatVsHawksWinner', 'east76ersVsHornetsWinner', 'eastEighthSeedWinner'].forEach(k => {
             if (p.playInSelections?.[k] === master.playInSelections?.[k] && master.playInSelections?.[k]) {
                 scorePlayin += 1;
             }
         });

        const r1Keys = ['west_r1_s1','west_r1_s2','west_r1_s3','west_r1_s4','east_r1_s1','east_r1_s2','east_r1_s3','east_r1_s4'];
        const semisKeys = ['west_r2_s1','west_r2_s2','east_r2_s1','east_r2_s2'];
        const cfKeys = ['west_cf', 'east_cf'];
        
        const b = p.bracketSelections || {};
        const mb = master.bracketSelections || {};
        const ppi = p.playInSelections || {};
        const mpi = master.playInSelections || {};

        // R1
        r1Keys.forEach(k => {
            const ut = getTeamsForSeries(k, b, ppi);
            const mt = getTeamsForSeries(k, mb, mpi);
            scoreR1 += getScore('r1', ut, b[k]?.winner, b[k]?.games, mt, mb[k]?.winner, mb[k]?.games);
        });

        // Semis
        semisKeys.forEach(k => {
            const ut = getTeamsForSeries(k, b, ppi);
            const mt = getTeamsForSeries(k, mb, mpi);
            scoreSemis += getScore('semis', ut, b[k]?.winner, b[k]?.games, mt, mb[k]?.winner, mb[k]?.games);
        });

        // CF
        cfKeys.forEach(k => {
            const ut = getTeamsForSeries(k, b, ppi);
            const mt = getTeamsForSeries(k, mb, mpi);
            scoreCf += getScore('cf', ut, b[k]?.winner, b[k]?.games, mt, mb[k]?.winner, mb[k]?.games);
        });

        // Finals
        const utf = getTeamsForSeries('finals', b, ppi);
        const mtf = getTeamsForSeries('finals', mb, mpi);
        scoreFinals += getScore('finals', utf, b['finals']?.winner, b['finals']?.games, mtf, mb['finals']?.winner, mb['finals']?.games);

        let totalPoints = scorePlayin + scoreR1 + scoreSemis + scoreCf + scoreFinals;

        // Optionally, factor in champion bonus or tie breakers here if requested later
        if(b['finals']?.winner === mb['finals']?.winner && !!mb['finals']?.winner) {
            // "if the player has the two correct and the champions is 5.5 points..." -> Handled in 'finals' getScore
        }

        return {
            id: p._id.toString(),
            name: p.name,
            champion: p.champion, // to show who they picked
            scorePlayin,
            scoreR1,
            scoreSemis,
            scoreCf,
            scoreFinals,
            totalPoints
        };
    });

    standings.sort((a: any, b: any) => b.totalPoints - a.totalPoints);
    
    standings.forEach((s: any, i: number) => s.rank = i + 1);

    return NextResponse.json({ success: true, standings });
  } catch (err: any) {
    console.error('Standings API Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
