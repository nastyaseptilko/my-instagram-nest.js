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

export type CommentAndUserFieldsFromDatabase = {
    comments_comment_id: number;
    comments_text: string;
    comments_user_id: number;
    comments_photo_id: number;
    u_user_id: number;
    u_name: string | null;
    u_userName: string;
    u_webSite: string | null;
    u_bio: string | null;
    u_email: string;
    u_password: string;
};

export type CommentWithUser = {
    commentId: number;
    text: string;
    userName: string;
    userId: number;
};
