'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { TalkingPhoto } from '@/types/heygen';
import { Loader2, Image as ImageIcon, Filter } from 'lucide-react';

interface AvatarListProps {
    onSelect: (photo: any) => void;
    selectedAvatarId?: string;
}

export default function AvatarList({ onSelect, selectedAvatarId }: AvatarListProps) {
    const [talkingPhotos, setTalkingPhotos] = useState<TalkingPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCustomOnly, setShowCustomOnly] = useState(true);

    useEffect(() => {
        const fetchTalkingPhotos = async () => {
            try {
                const response = await axios.get('/api/heygen/avatars');
                console.log('Talking Photos response:', response.data);

                let fetchedPhotos: TalkingPhoto[] = [];
                if (response.data.data && Array.isArray(response.data.data.talking_photos)) {
                    fetchedPhotos = response.data.data.talking_photos;
                } else {
                    console.warn('Unexpected talking photos response structure', response.data);
                }

                const uniquePhotos = Array.from(
                    new Map(fetchedPhotos.map(item => [item.talking_photo_id, item])).values()
                );
                setTalkingPhotos(uniquePhotos);
            } catch (err) {
                setError('Failed to load talking photos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTalkingPhotos();
    }, []);

    const isCustomPhoto = (photo: TalkingPhoto): boolean => {
        const name = photo.talking_photo_name.toLowerCase();
        const customKeywords = [
            'daniele', 'visionario', 'trader', 'stratega', 'ufficio',
            'sala conferenze', 'giacca', 'beige', 'professionale',
            'finanza', 'business', 'consulente', 'analista'
        ];
        return customKeywords.some(keyword => name.includes(keyword));
    };

    const filteredPhotos = talkingPhotos.filter(photo => {
        if (showCustomOnly && !isCustomPhoto(photo)) {
            return false;
        }
        return photo.talking_photo_name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-3">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                <p className="text-sm text-gray-500">Loading talking photos...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 p-4 text-center">{error}</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-2 mb-3">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-800">Talking Photos</h2>
                </div>
                <p className="text-xs text-gray-600 mb-3">Select a photo to create your video</p>

                <div className="mb-3 p-2 bg-white rounded-md border">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showCustomOnly}
                            onChange={(e) => setShowCustomOnly(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <Filter className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700 font-medium">Show only my custom photos</span>
                    </label>
                </div>

                <input
                    type="text"
                    placeholder="Search photos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="px-4 py-2 bg-gray-50 border-b text-xs text-gray-600">
                {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''} available
                {showCustomOnly && <span className="ml-2 text-blue-600">(custom only)</span>}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {filteredPhotos.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No talking photos found</p>
                        {showCustomOnly && (
                            <button
                                onClick={() => setShowCustomOnly(false)}
                                className="mt-2 text-xs text-blue-600 hover:underline"
                            >
                                Show all photos
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filteredPhotos.map((photo) => (
                            <div
                                key={photo.talking_photo_id}
                                className={`cursor-pointer border-2 rounded-lg overflow-hidden hover:shadow-lg transition-all transform hover:scale-105 ${selectedAvatarId === photo.talking_photo_id
                                        ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg'
                                        : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                onClick={() => onSelect(photo)}
                            >
                                <div className="relative">
                                    <img
                                        src={photo.preview_image_url}
                                        alt={photo.talking_photo_name}
                                        className="w-full h-32 object-cover"
                                    />
                                    {selectedAvatarId === photo.talking_photo_id && (
                                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 bg-white">
                                    <p className="text-xs font-medium text-center truncate text-gray-800">
                                        {photo.talking_photo_name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
