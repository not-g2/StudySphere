"use client";

import { useEffect, useRef } from "react";
import BadgeTier from "./BadgeTier";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    ownedBadges: Array<{ _id: string; badgeLink: string }>;
}

export default function Modal({ isOpen, onClose, ownedBadges }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                ref={modalRef}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h1 className="text-xl font-semibold">Achievements</h1>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✖
                    </button>
                </div>

                <div>
                    <BadgeTier
                        title="Bronze"
                        images={[
                            "./Badges/Sign_up.png",
                            "./Badges/1_Level.png",
                            "./Badges/1_Assm.png",
                            "./Badges/1_Level.png",
                            "./Badges/Create_Group.png",
                            "./Badges/Join_Course.png",
                            "./Badges/10_Days.png",
                        ]}
                        ownedBadges={ownedBadges}
                    />
                    <BadgeTier
                        title="Silver"
                        images={[
                            "./Badges/5_Assm.png",
                            "./Badges/5_Level.png",
                            "./Badges/10_Group.png",
                            "./Badges/25_Min_Focus.png",
                            "./Badges/1_Attend.png",
                            "./Badges/30_Days.png",
                        ]}
                        ownedBadges={ownedBadges}
                    />
                    <BadgeTier
                        title="Gold"
                        images={[
                            "./Badges/3_Hrs_Focus.png",
                            "./Badges/7_Attend.png",
                            "./Badges/10_Assm.png",
                            "./Badges/10_Level.png",
                            "./Badges/50_Group.png",
                            "./Badges/100_Days.png",
                        ]}
                        ownedBadges={ownedBadges}
                    />
                    <BadgeTier
                        title="Platinum"
                        images={[
                            "./Badges/20_Level.png",
                            "./Badges/24_Hrs_Focus.png",
                            "./Badges/30_Attend.png",
                            "./Badges/50_Assm.png",
                            "./Badges/365_Days.png",
                        ]}
                        ownedBadges={ownedBadges}
                    />
                    <BadgeTier
                        title="Legendary"
                        images={[
                            "./Badges/7_Days_Focus.png",
                            "./Badges/50_Level.png",
                            "./Badges/100_Assm.png",
                            "./Badges/100_Group.png",
                            "./Badges/1000_Days.png",
                        ]}
                        ownedBadges={ownedBadges}
                    />
                    <BadgeTier
                        title="Cosmic"
                        images={[
                            "./Badges/100_Level.png",
                            "./Badges/All_Achievements.png",
                            "./Badges/0_Attend.png",
                        ]}
                        ownedBadges={ownedBadges}
                    />
                </div>
            </div>
        </div>
    );
}
