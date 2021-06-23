export type Like = {
    id: number;
    userId: number;
    photoId: number;
};

export type CreateLikePayload = {
    userId: number;
    photoId: number;
};
