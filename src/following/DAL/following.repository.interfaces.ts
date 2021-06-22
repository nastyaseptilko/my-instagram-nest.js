export type FollowersAndUserFieldsFromDatabase = {
    following_follow_id: number;
    following_subscriber_id: number;
    following_publisher_id: number;
    u_user_id: number;
    u_fullName: string | null;
    u_nickname: string;
    u_web_site: string | null;
    u_bio: string | null;
    u_email: string;
    u_password: string | null;
};
