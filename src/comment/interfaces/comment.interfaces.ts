export type Comment = {
    id: number;
    text: string;
    userId: number;
    photoId: number;
};

export type CreateCommentPayload = {
    text: string;
    userId: number;
    photoId: number;
};

export type UpdateCommentPayload = {
    text: string;
};

export type CommentWithUser = {
    commentId: number;
    text: string;
    userName: string;
    userId: number;
};

export type ReplaceEmailsParams = {
    emails: string[];
    comment: string;
};
