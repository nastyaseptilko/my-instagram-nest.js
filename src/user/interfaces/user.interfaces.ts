export type User = {
    id: number;
    fullName: string | null;
    nickname: string;
    webSite: string | null;
    bio: string | null;
    email: string;
    password: string | null;
};

export type CreateUserPayload = {
    fullName?: string;
    nickname: string;
    webSite?: string;
    bio?: string;
    email: string;
    password?: string;
};

export type UpdateUserPayload = {
    fullName?: string;
    nickname?: string;
    webSite?: string;
    bio?: string;
};
