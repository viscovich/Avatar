'use client';

import { useState } from 'react';
import AvatarList from '@/components/AvatarList';
import VideoCreator from '@/components/VideoCreator';
import { TalkingPhoto } from '@/types/heygen';

export default function Home() {
    const [selectedPhoto, setSelectedPhoto] = useState<TalkingPhoto | null>(null);

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">HeyGen Avatar Creator</h1>
                    <p className="text-lg text-gray-600">Create stunning videos with AI avatars</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800">Select an Avatar</h2>
                            <span className="text-sm text-gray-500">Click to select</span>
                        </div>
                        <AvatarList onSelect={setSelectedPhoto} selectedAvatarId={selectedPhoto?.talking_photo_id} />
                    </div>

                    <div className="lg:col-span-5">
                        <div className="sticky top-8 h-[calc(100vh-100px)]">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Video</h2>
                            <VideoCreator selectedPhoto={selectedPhoto} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
