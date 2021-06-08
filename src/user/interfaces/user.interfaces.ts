export type User = {
    id: number;
    name: string | null;
    userName: string;
    webSite: string | null;
    bio: string | null;
    email: string;
    password: string | null;
};

export type CreateUserPayload = {
    name: string;
    userName: string;
    webSite: string;
    bio: string;
    email: string;
    password: string;
};

export type UpdateUserPayload = {
    name: string;
    userName: string;
    webSite: string;
    bio: string;
};
