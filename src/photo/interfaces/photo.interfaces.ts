export type Photo = {
    id: number;
    userId: number;
    caption: string | null;
    imageUrl: string;
};

export type CreatePhotoPayload = {
    userId: number;
    imageUrl: string;
    caption: string;
};
