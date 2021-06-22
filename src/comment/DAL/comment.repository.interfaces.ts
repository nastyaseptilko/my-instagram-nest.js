export type CommentAndUserFieldsFromDatabase = {
    comments_comment_id: number;
    comments_text: string;
    comments_user_id: number;
    comments_photo_id: number;
    u_user_id: number;
    u_fullName: string | null;
    u_nickname: string;
    u_web_site: string | null;
    u_bio: string | null;
    u_email: string;
    u_password: string;
};
