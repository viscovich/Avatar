import { NextResponse } from 'next/server';
import { heygenClient } from '@/lib/heygen-client';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Received v4 generate request body:', JSON.stringify(body, null, 2));
        // Pass the body directly to HeyGen v4 API
        // Endpoint based on search: /v2/video/av4/generate (or similar, verify if fails)
        // If this endpoint is incorrect, we might need to adjust.
        const response = await heygenClient.post('/v2/video/av4/generate', body);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error generating v4 video:', error.response?.data || error.message);
        return NextResponse.json(
            { error: 'Failed to generate v4 video', details: error.response?.data || error.message },
            { status: error.response?.status || 500 }
        );
    }
}
