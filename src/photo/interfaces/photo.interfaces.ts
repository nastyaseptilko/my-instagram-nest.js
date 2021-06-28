export type Photo = {
    id: number;
    userId: number;
    caption: string | null;
    imageUrl: string;
    filter: string | null;
};

export type CreatePhotoPayload = {
    userId: number;
    imageUrl: string;
    caption: string;
    filter: string;
};

export type PhotoWithFollowing = {
    photoId: number;
    userId: number;
    caption: string | null;
    imageUrl: string;
    filter: string | null;
    nickname: string;
};

export type PhotoUpdatePayload = {
    caption: string;
};
