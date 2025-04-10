export interface Session {
    user: {
        id: string;
        token: string;
    };
    email: string;
    isAdmin: boolean;
}
