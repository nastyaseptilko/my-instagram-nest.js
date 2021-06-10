export type Photo = {
    id: number;
    userId: number;
    caption: string | null;
    imagePath: string;
};

export type CreatePhoto = {
    userId: number;
    caption: string;
    imagePath: string;
};
