import { NextResponse } from 'next/server';
import { heygenClient } from '@/lib/heygen-client';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('video_id');

    if (!videoId) {
        return NextResponse.json({ error: 'video_id is required' }, { status: 400 });
    }

    try {
        const response = await heygenClient.get('/v1/video_status.get', {
            params: { video_id: videoId }
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error checking video status:', error.response?.data || error.message);
        return NextResponse.json(
            { error: 'Failed to check video status', details: error.response?.data || error.message },
            { status: error.response?.status || 500 }
        );
    }
}
