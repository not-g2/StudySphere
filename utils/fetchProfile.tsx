const fetchProfile = async (token: string) => {
    if (!token) return;
    const PORT = process.env.NEXT_PUBLIC_PORT || 8000;
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/desc/profile`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch profile");
    }

    return res.json();
};

export default fetchProfile;
