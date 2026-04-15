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
    // Return all predictions except Clave-Clave
    const predictions = await Prediction.find({ name: { $ne: 'Clave-Clave' } }).sort({ name: 1 });

    return NextResponse.json({ success: true, predictions }, { status: 200 });

  } catch (error: any) {
    console.error('Failed to get report data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
