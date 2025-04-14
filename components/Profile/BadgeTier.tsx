"use client";
import clsx from "clsx";
import badgeData from "@/data/test.badges.json";

interface BadgeTierProps {
    title: string;
    images?: string[];
    ownedBadges?: Array<{ _id: string; badgeLink: string }>;
}

export default function BadgeTier({
    title,
    images = [],
    ownedBadges,
}: BadgeTierProps) {
    const color = clsx({
        "text-[#e3a869]": title === "Bronze",
        "text-[#333333]": title === "Silver",
        "text-[#FDEC8B]": title === "Gold",
        "text-[#555555]": title === "Platinum",
        "text-[#DA70D6]": title === "Legendary",
        "text-[#FF4500]": title === "Cosmic",
    });

    const extractFileName = (url: string) => {
        return (
            url
                .split("/")
                .pop()
                ?.split(".")[0]
                ?.replace(/_[a-zA-Z0-9]+$/, "")
                .toLowerCase() + ".png" || ""
        );
    };

    const badgeLookup = new Map(
        badgeData.map((badge) => [
            badge.badgeLink.toLowerCase(),
            { title: badge.title, content: badge.content },
        ])
    );

    const getLocalFileName = (filePath: string) => {
        return filePath.split("/").pop()?.toLowerCase() || "";
    };

    const ownedBadgeNames = new Set(
        ownedBadges?.map((badge) => extractFileName(badge.badgeLink))
    );

    // Clean filenames for local badges and compare
    const missingBadges = images.filter(
        (src) => !ownedBadgeNames.has(getLocalFileName(src))
    );

    return (
        <div className="flex flex-col justify-between items-center border-b pb-2 mb-4">
            <h2 className={`text-xl font-semibold mb-2 ${color}`}>{title}</h2>
            {images.length > 0 && (
                <div className="flex flex-row gap-x-4">
                    {images.map((src, index) => {
                        const info = badgeLookup.get(
                            src.replace("./Badges/", "").toLowerCase()
                        );
                        console.log(src, info);
                        return (
                            <div key={index} className="relative group w-max">
                                <img
                                    className={clsx("w-20 h-20", {
                                        "grayscale opacity-15":
                                            missingBadges.includes(src),
                                    })}
                                    src={src}
                                    alt={`${title} badge`}
                                />
                                <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 bg-gray-600 text-white opacity-0 bg-opacity-70 group-hover:opacity-100 text-center p-2 transition-opacity duration-300 rounded whitespace-nowrap text-sm text-ellipsis">
                                    {info?.title}
                                    <div>{info?.content}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
