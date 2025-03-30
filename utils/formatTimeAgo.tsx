const formatTimeAgo = (date: Date | null): string => {
    if (!date) return "";
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "Less than 1 hr ago";
    if (diffInHours < 24)
        return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
};

export default formatTimeAgo