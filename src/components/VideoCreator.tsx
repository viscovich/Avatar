'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { TalkingPhoto } from '@/types/heygen';
import { Loader2, Wand2, Settings2, RefreshCw, MonitorPlay, Copy } from 'lucide-react';

interface VideoCreatorProps {
    selectedPhoto: TalkingPhoto | null;
}

export default function VideoCreator({ selectedPhoto }: VideoCreatorProps) {
    const [script, setScript] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [voices, setVoices] = useState<any[]>([]);
    const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
    const [loadingVoices, setLoadingVoices] = useState(false);
    const [videoId, setVideoId] = useState<string>('');
    const [videoStatus, setVideoStatus] = useState<string>('');
    const [videoUrl, setVideoUrl] = useState<string>('');

    // Advanced controls
    const [scale, setScale] = useState<number>(1.0);
    const [offsetX, setOffsetX] = useState<number>(0);
    const [offsetY, setOffsetY] = useState<number>(0);
    const [backgroundType, setBackgroundType] = useState<'color' | 'image'>('color');
    const [backgroundColor, setBackgroundColor] = useState<string>('#1a2332');
    const [backgroundImage, setBackgroundImage] = useState<string>('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('9:16'); // Default to 9:16
    const [showAdvanced, setShowAdvanced] = useState(true);
    const [hasTransparency, setHasTransparency] = useState(false);

    // Reset settings when photo changes
    useEffect(() => {
        console.log('VideoCreator received selectedPhoto:', selectedPhoto);
        if (selectedPhoto) {
            setScale(1.0);
            setOffsetX(0);
            setOffsetY(0);
            setHasTransparency(false);
        }
    }, [selectedPhoto]);

    // Fetch voices on mount
    useEffect(() => {
        const fetchVoices = async () => {
            setLoadingVoices(true);
            try {
                const response = await axios.get('/api/heygen/voices');
                if (response.data && response.data.data && Array.isArray(response.data.data.voices)) {
                    setVoices(response.data.data.voices);
                    if (response.data.data.voices.length > 0) {
                        setSelectedVoiceId(response.data.data.voices[0].voice_id);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch voices', err);
            } finally {
                setLoadingVoices(false);
            }
        };
        fetchVoices();
    }, []);

    // Poll for video status
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (videoId && videoStatus !== 'completed' && videoStatus !== 'failed') {
            intervalId = setInterval(async () => {
                try {
                    const response = await axios.get(`/api/heygen/status?video_id=${videoId}`);
                    const data = response.data.data;

                    if (data) {
                        setVideoStatus(data.status);
                        if (data.status === 'completed') {
                            setVideoUrl(data.video_url);
                            setLoading(false);
                        } else if (data.status === 'failed') {
                            setError(data.error || 'Video generation failed');
                            setLoading(false);
                        }
                    }
                } catch (err) {
                    console.error('Failed to check status', err);
                }
            }, 3000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [videoId, videoStatus]);

    const handleGenerate = async () => {
        if (!selectedPhoto || !script || !selectedVoiceId) return;

        setLoading(true);
        setError('');
        setResult(null);
        setVideoId('');
        setVideoStatus('');
        setVideoUrl('');

        try {
            const endpoint = '/api/heygen/generate/v2';

            const background = backgroundType === 'color'
                ? { type: 'color', value: backgroundColor }
                : { type: 'image', url: backgroundImage };

            const payload = {
                video_inputs: [
                    {
                        character: {
                            type: 'talking_photo',
                            talking_photo_id: selectedPhoto.talking_photo_id,
                            scale: scale,
                            offset: {
                                x: offsetX,
                                y: offsetY
                            }
                        },
                        voice: {
                            type: 'text',
                            voice_id: selectedVoiceId,
                            input_text: script,
                        },
                        background: background
                    },
                ],
                test: true,
                aspect_ratio: aspectRatio,
            };

            const response = await axios.post(endpoint, payload);
            setResult(response.data);

            if (response.data.data && response.data.data.video_id) {
                setVideoId(response.data.data.video_id);
                setVideoStatus('processing');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.details || err.response?.data?.error || 'Failed to generate video');
            setLoading(false);
        }
    };

    const handleResetSettings = () => {
        setScale(1.0);
        setOffsetX(0);
        setOffsetY(0);
        setBackgroundColor('#1a2332');
        setBackgroundType('color');
    };

    if (!selectedPhoto) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed rounded-lg bg-gray-50">
                <MonitorPlay className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-center">Select a photo from the left to start</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                {/* Left Column: Preview */}
                <div className="w-1/2 bg-gray-100 p-4 flex items-center justify-center border-r relative">
                    <div
                        className={`relative bg-gray-900 overflow-hidden group shadow-lg transition-all duration-300 mx-auto flex-shrink-0 ${aspectRatio === '16:9'
                            ? 'w-full aspect-video'
                            : 'h-full aspect-[9/16]'
                            }`}
                        style={{ maxHeight: '100%', maxWidth: '100%' }}
                    >
                        {/* Background Layer */}
                        <div
                            className="absolute inset-0 w-full h-full transition-colors duration-300"
                            style={{
                                backgroundColor: backgroundType === 'color' ? backgroundColor : undefined,
                                backgroundImage: backgroundType === 'image' ? `url(${backgroundImage})` : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />

                        {/* Image Layer with Transforms */}
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            {/* Debug info - remove later */}
                            <div className="absolute top-0 left-0 bg-black/80 text-white text-[10px] p-1 z-50 max-w-full truncate hidden group-hover:block">
                                {selectedPhoto.preview_image_url}
                            </div>

                            <img
                                src={selectedPhoto.preview_image_url}
                                alt={`Preview of ${selectedPhoto.talking_photo_name}`}
                                className="max-h-full max-w-full object-contain transition-transform duration-100 ease-out"
                                style={{
                                    transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`
                                }}
                                onError={(e) => {
                                    console.error('Error loading preview image:', e);
                                    // Try to force reload or show error visual
                                    (e.target as HTMLImageElement).style.border = '2px solid red';
                                }}
                                onLoad={() => console.log('Image loaded successfully')}
                            />
                        </div>

                        {/* Overlay Info */}
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                            {aspectRatio} Preview
                        </div>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={handleResetSettings}
                                className="bg-black/50 text-white p-1.5 rounded hover:bg-black/70 backdrop-blur-sm"
                                title="Reset View"
                            >
                                <RefreshCw className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Result Video Overlay */}
                        {videoUrl && (
                            <div className="absolute inset-0 bg-black z-50 flex items-center justify-center">
                                <video
                                    src={videoUrl}
                                    controls
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    onLoadedMetadata={(e) => {
                                        const video = e.target as HTMLVideoElement;
                                        console.log(`Video loaded: ${video.videoWidth}x${video.videoHeight}`);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Controls */}
                <div className="w-1/2 flex flex-col h-full">
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {/* Script & Voice */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Script</label>
                                <textarea
                                    className="w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 min-h-[100px] resize-none"
                                    placeholder="Enter script..."
                                    value={script}
                                    onChange={(e) => setScript(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Voice</label>
                                <select
                                    value={selectedVoiceId}
                                    onChange={(e) => setSelectedVoiceId(e.target.value)}
                                    className="w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500"
                                >
                                    {voices.map((voice: any) => (
                                        <option key={voice.voice_id} value={voice.voice_id}>
                                            {voice.name} ({voice.language})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Visual Settings */}
                        <div className="border-t pt-3">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-gray-800 flex items-center">
                                    <Settings2 className="w-4 h-4 mr-2" />
                                    Visual Settings
                                </h3>
                            </div>

                            <div className="space-y-4 bg-gray-50 p-3 rounded-md text-xs">
                                {/* Avatar ID Display */}
                                <div className="flex items-center justify-between p-2 bg-white border rounded-md group">
                                    <div className="flex flex-col overflow-hidden mr-2">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Avatar ID</span>
                                        <code className="text-xs text-gray-800 truncate font-mono select-all" title={selectedPhoto.talking_photo_id}>
                                            {selectedPhoto.talking_photo_id}
                                        </code>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(selectedPhoto.talking_photo_id);
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Copy ID"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Zoom */}
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-gray-600">Zoom</label>
                                        <span className="text-gray-500">{scale.toFixed(1)}x</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2.0"
                                        step="0.1"
                                        value={scale}
                                        onChange={(e) => setScale(parseFloat(e.target.value))}
                                        className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>

                                {/* Position Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-gray-600">Horizontal (X)</label>
                                            <span className="text-gray-500">{offsetX}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="-200"
                                            max="200"
                                            step="10"
                                            value={offsetX}
                                            onChange={(e) => setOffsetX(parseInt(e.target.value))}
                                            className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-gray-600">Vertical (Y)</label>
                                            <span className="text-gray-500">{offsetY}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="-200"
                                            max="200"
                                            step="10"
                                            value={offsetY}
                                            onChange={(e) => setOffsetY(parseInt(e.target.value))}
                                            className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                </div>

                                {/* Transparency & Background Logic */}
                                <div className="pt-2 border-t border-gray-100">
                                    <div className="flex items-center mb-3">
                                        <input
                                            type="checkbox"
                                            id="hasTransparency"
                                            checked={hasTransparency}
                                            onChange={(e) => setHasTransparency(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <label htmlFor="hasTransparency" className="ml-2 text-xs text-gray-600 select-none cursor-pointer">
                                            Image has transparent background
                                        </label>
                                    </div>

                                    {/* Show Background controls ONLY if needed: Zoom < 1, Offset is large, or Transparency is checked */}
                                    {(scale < 1.0 || Math.abs(offsetX) > 100 || Math.abs(offsetY) > 100 || hasTransparency) && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                            <label className="block text-gray-600 mb-2">Background Color</label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="color"
                                                    value={backgroundColor}
                                                    onChange={(e) => {
                                                        setBackgroundColor(e.target.value);
                                                        setBackgroundType('color');
                                                    }}
                                                    className="h-8 w-8 border rounded cursor-pointer p-0.5 bg-white shadow-sm"
                                                />
                                                <div className="flex-1 grid grid-cols-5 gap-1">
                                                    {['#1a2332', '#000000', '#ffffff', '#2d3748', '#4a5568'].map(color => (
                                                        <button
                                                            key={color}
                                                            onClick={() => {
                                                                setBackgroundColor(color);
                                                                setBackgroundType('color');
                                                            }}
                                                            className={`h-6 rounded border transition-all ${backgroundColor === color && backgroundType === 'color' ? 'ring-2 ring-blue-500 scale-110' : 'border-gray-200 hover:scale-105'}`}
                                                            style={{ backgroundColor: color }}
                                                            title={color}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="p-2 bg-red-50 text-red-600 rounded text-xs">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Footer Action */}
                    <div className="p-3 border-t bg-gray-50">
                        {result && !videoUrl && (
                            <div className="mb-2 text-center text-xs text-blue-600 flex items-center justify-center">
                                <Loader2 className="animate-spin w-3 h-3 mr-1" />
                                Generating... ({videoStatus || 'starting'})
                            </div>
                        )}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !script || !selectedVoiceId || !selectedPhoto}
                            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                            <span>{loading ? 'Generating...' : 'Generate Video'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
