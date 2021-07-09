export type Follower = {
    id: number;
    subscriber: number;
    publisher: number;
};

export type PublisherPayload = {
    followingId: number;
    nicknamePublisher: string;
    publisherId: number;
};

export type IdsForFollowers = {
    subscriber: number;
    publisher: number;
};

export type SubscriberPayload = {
    publisherId: number;
    nicknameSubscriber: string;
    subscriberId: number;
};
