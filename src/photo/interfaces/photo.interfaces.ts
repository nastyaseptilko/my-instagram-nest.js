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

export type PhotoAndFollowingFieldsFromDatabase = {
    photos_photo_id: number;
    photos_user_id: number;
    photos_caption: string | null;
    photos_imageUrl: string;
    photos_filter: string | null;
    f_follow_id: number | null;
    f_subscriber_id: number | null;
    f_publisher_id: number | null;
};

export type PhotoWithFollowing = {
    photoId: number;
    userId: number;
    caption: string | null;
    imageUrl: string;
    filter: string | null;
};

export type PhotoUpdatePayload = {
    caption: string;
};
