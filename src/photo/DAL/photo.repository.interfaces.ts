export type PhotoAndFollowingFieldsFromDatabase = {
    photos_photo_id: number;
    photos_user_id: number;
    photos_caption: string | null;
    photos_image_url: string;
    photos_filter: string | null;
    f_follow_id: number | null;
    f_subscriber_id: number | null;
    f_publisher_id: number | null;
    u_user_id: number;
    u_full_name: string | null;
    u_nickname: string;
    u_web_site: string | null;
    u_bio: string | null;
    u_email: string;
    u_password: string;
};
