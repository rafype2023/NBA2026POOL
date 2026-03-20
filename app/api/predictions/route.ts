import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Prediction from '@/models/Prediction';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Create new prediction document
    const newPrediction = new Prediction(body);
    await newPrediction.save();

    return NextResponse.json(
      { success: true, prediction: newPrediction },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to create prediction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
