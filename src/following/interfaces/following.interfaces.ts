export type Followers = {
    id: number;
    subscriber: number;
    publisher: number;
};

export type FollowersWithUser = {
    followingId: number;
    nicknamePublisher: string;
    publisherId: number;
};

export type IdsForFollowers = {
    subscriber: number;
    publisher: number;
};
