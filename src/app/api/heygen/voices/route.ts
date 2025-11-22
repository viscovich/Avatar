import { NextResponse } from 'next/server';
import { heygenClient } from '@/lib/heygen-client';

export async function GET() {
    try {
        const response = await heygenClient.get('/v2/voices');
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error fetching voices:', error.response?.data || error.message);
        return NextResponse.json(
            { error: 'Failed to fetch voices', details: error.response?.data || error.message },
            { status: error.response?.status || 500 }
        );
    }
}
