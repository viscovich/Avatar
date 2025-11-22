import { NextResponse } from 'next/server';
import { heygenClient } from '@/lib/heygen-client';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Pass the body directly to HeyGen v2 API
        // Expected body should match HeyGen v2 structure: { video_inputs: [...], ... }
        const response = await heygenClient.post('/v2/video/generate', body);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error generating v2 video:', error.response?.data || error.message);
        return NextResponse.json(
            { error: 'Failed to generate v2 video', details: error.response?.data || error.message },
            { status: error.response?.status || 500 }
        );
    }
}
