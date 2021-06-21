export type Followers = {
    id: number;
    subscriber: number;
    publisher: number;
};

export type FollowersWithUser = {
    followingId: number;
    userNamePublisher: string;
    publisherId: number;
};

export type IdsForFollowers = {
    subscriber: number;
    publisher: number;
};
