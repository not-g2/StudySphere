export interface Announcement {
    _id: number;
    title: string;
    description: string;
    user?: {
        _id: string;
        name: string;
    };
    createdAt?: string;
}
