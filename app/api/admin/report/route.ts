import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Prediction from '@/models/Prediction';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.code !== process.env.Admin) {
      return NextResponse.json({ success: false, error: 'Acceso Denegado' }, { status: 401 });
    }

    await dbConnect();
    const predictions = await Prediction.find({}).lean();
    
    const master = predictions.find((p: any) => p.name?.toUpperCase() === 'CLAVE-CLAVE');
    const userPredictions = predictions.filter((p: any) => p.name?.toUpperCase() !== 'CLAVE-CLAVE');
    userPredictions.sort((a: any, b: any) => a.name.localeCompare(b.name));

    if (!master) {
      return NextResponse.json({ success: true, predictions: userPredictions }, { status: 200 });
    }

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
            case 'east_r1_s4': return ['bos', playin?.east76ersVsHeatWinner];

            case 'east_r2_s1': return [bracket?.east_r1_s1?.winner, bracket?.east_r1_s2?.winner];
            case 'east_r2_s2': return [bracket?.east_r1_s3?.winner, bracket?.east_r1_s4?.winner];
            case 'east_cf': return [bracket?.east_r2_s1?.winner, bracket?.east_r2_s2?.winner];

            case 'finals': return [bracket?.west_cf?.winner, bracket?.east_cf?.winner];
            
            default: return [];
        }
    };

    const getScore = (roundType: string, uTeams: any[], uWinner: string, uGames: number, mTeams: any[], mWinner: string, mGames: number) => {
        let correctTeams = 0;
        if (mTeams.includes(uTeams[0]) && uTeams[0]) correctTeams++;
        if (mTeams.includes(uTeams[1]) && uTeams[1] && uTeams[0] !== uTeams[1]) correctTeams++;

        const hasWinner = (uWinner === mWinner) && !!mWinner;
        const hasGames = (String(uGames).trim() === String(mGames).trim()) && !!mGames;

        if (!hasWinner) return 0;

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

    const enrichedPredictions = userPredictions.map((p: any) => {
        const pCopy = JSON.parse(JSON.stringify(p)); // Deep copy to mutate easily

        const b = pCopy.bracketSelections || {};
        const mb = master.bracketSelections || {};
        const ppi = pCopy.playInSelections || {};
        const mpi = master.playInSelections || {};

        // Play-In Scoring
        const playInKeys = ['westSunsVsClippersWinner', 'westWarriorsVsBlazersWinner', 'westEighthSeedWinner', 
         'east76ersVsHeatWinner', 'eastHornetsVsMagicWinner', 'eastEighthSeedWinner'];
         
        pCopy.playInScores = {};
        playInKeys.forEach(k => {
             if (ppi[k] === mpi[k] && mpi[k]) {
                 pCopy.playInScores[k] = 1.0;
             } else {
                 pCopy.playInScores[k] = 0;
             }
        });

        // Bracket Scoring
        const r1Keys = ['west_r1_s1','west_r1_s2','west_r1_s3','west_r1_s4','east_r1_s1','east_r1_s2','east_r1_s3','east_r1_s4'];
        const semisKeys = ['west_r2_s1','west_r2_s2','east_r2_s1','east_r2_s2'];
        const cfKeys = ['west_cf', 'east_cf'];

        r1Keys.forEach(k => {
            const ut = getTeamsForSeries(k, b, ppi);
            const mt = getTeamsForSeries(k, mb, mpi);
            if (!pCopy.bracketSelections) pCopy.bracketSelections = {};
            if (!pCopy.bracketSelections[k]) pCopy.bracketSelections[k] = {};
            pCopy.bracketSelections[k].score = getScore('r1', ut, b[k]?.winner, b[k]?.games, mt, mb[k]?.winner, mb[k]?.games);
        });

        semisKeys.forEach(k => {
            const ut = getTeamsForSeries(k, b, ppi);
            const mt = getTeamsForSeries(k, mb, mpi);
            if (!pCopy.bracketSelections[k]) pCopy.bracketSelections[k] = {};
            pCopy.bracketSelections[k].score = getScore('semis', ut, b[k]?.winner, b[k]?.games, mt, mb[k]?.winner, mb[k]?.games);
        });

        cfKeys.forEach(k => {
            const ut = getTeamsForSeries(k, b, ppi);
            const mt = getTeamsForSeries(k, mb, mpi);
            if (!pCopy.bracketSelections[k]) pCopy.bracketSelections[k] = {};
            pCopy.bracketSelections[k].score = getScore('cf', ut, b[k]?.winner, b[k]?.games, mt, mb[k]?.winner, mb[k]?.games);
        });

        const utf = getTeamsForSeries('finals', b, ppi);
        const mtf = getTeamsForSeries('finals', mb, mpi);
        if (!pCopy.bracketSelections['finals']) pCopy.bracketSelections['finals'] = {};
        pCopy.bracketSelections['finals'].score = getScore('finals', utf, b['finals']?.winner, b['finals']?.games, mtf, mb['finals']?.winner, mb['finals']?.games);

        return pCopy;
    });

    return NextResponse.json({ success: true, predictions: enrichedPredictions }, { status: 200 });

  } catch (error: any) {
    console.error('Failed to get report data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
