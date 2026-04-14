export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    authorName: string | null;
    profilePhoto: string | null;
    bio: string | null;
    createdAt?: string;
}

export interface SavedArticle {
    id: number;
    articleId: number;
    title: string;
    category: string;
}