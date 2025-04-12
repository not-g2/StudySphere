export interface userProps {
    _id: string;
    xp: number;
    streakCount: number;
    rewards: string[];
    phoneNumber: string;
    name: string;
    level: number;
    image: {
        url: string;
    };
    email: string;
    auraPoints: number;
    unlockedBadges: Array<{ _id: string; badgeLink: string }>;
}
