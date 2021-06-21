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
    userName: string;
};

export type PhotoUpdatePayload = {
    caption: string;
};
