export interface Avatar {
    avatar_id: string;
    avatar_name: string;
    gender: string;
    preview_image_url: string;
    preview_video_url?: string;
}

export interface TalkingPhoto {
    talking_photo_id: string;
    talking_photo_name: string;
    preview_image_url: string;
}

export interface Voice {
    voice_id: string;
    name: string;
    language: string;
    gender: string;
    preview_audio?: string;
}

export interface VideoInput {
    character: {
        type: string;
        avatar_id?: string;
        avatar_style?: string;
        talking_photo_id?: string;
    };
    voice: {
        type: string;
        voice_id?: string;
        input_text?: string;
        audio_url?: string;
    };
    script?: {
        type: string;
        input_text: string;
    };
}

export interface GenerateVideoRequest {
    video_inputs: VideoInput[];
    test?: boolean;
    aspect_ratio?: string;
}
