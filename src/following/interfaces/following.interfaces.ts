export type Following = {
    id: number;
    subscriber: number;
    publisher: number;
};

export type FollowingAndUserFieldsFromDatabase = {
    following_follow_id: number;
    following_subscriber_id: number;
    following_publisher_id: number;
    u_user_id: number;
    u_name: string | null;
    u_userName: string;
    u_webSite: string | null;
    u_bio: string | null;
    u_email: string;
    u_password: string | null;
};

export type FollowingWithUser = {
    followingId: number;
    userNamePublisher: string;
    publisherId: number;
};

export type IdsForFollowing = {
    subscriber: number;
    publisher: number;
};
