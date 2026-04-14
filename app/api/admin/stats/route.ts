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
    const predictions = await Prediction.find({});

    const stats: any = {
      champions: {},
      mvps: {},
      playIn: {
        westSunsVsClippersWinner: {},
        westWarriorsVsBlazersWinner: {},
        westEighthSeedWinner: {},
        east76ersVsHeatWinner: {},
        eastHornetsVsMagicWinner: {},
        eastEighthSeedWinner: {},
      },
      total: predictions.length
    };

    predictions.forEach(p => {
       // aggregate champions
       if (p.champion) {
         stats.champions[p.champion] = (stats.champions[p.champion] || 0) + 1;
       }
       // aggregate MVPs
       if (p.finalsMVP) {
         stats.mvps[p.finalsMVP] = (stats.mvps[p.finalsMVP] || 0) + 1;
       }
       
       // Play-in
       if (p.playInSelections) {
         Object.keys(stats.playIn).forEach(key => {
            const winner = p.playInSelections[key];
            if (winner) {
              stats.playIn[key][winner] = (stats.playIn[key][winner] || 0) + 1;
            }
         });
       }
    });

    return NextResponse.json({ success: true, stats }, { status: 200 });

  } catch (error: any) {
    console.error('Failed to get stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
