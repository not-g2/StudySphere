"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./marquee.module.css";
import Modal from "./Modal";

interface InfiniteScrollProps {
    images: Array<{ _id: string; badgeLink: string }>;
}

export default function InfiniteScroll({ images }: InfiniteScrollProps) {
    const marqueeRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const onClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const noOfImages = images.length;
        const marqueeLength = marqueeRef.current?.offsetWidth || 0;
        setShouldAnimate(noOfImages * 160 > marqueeLength);
    }, [images]);

    return (
        <div
            className="w-full flex flex-col items-center justify-center"
            style={{ "--num-items": images.length } as React.CSSProperties}
        >
            <div className="flex justify-between items-center w-full mb-6">
                <h2 className="text-4xl font-bold text-gray-800">
                    🏆 Achievements
                </h2>
                <button
                    onClick={(e) => {
                        setIsOpen(true);
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    View All
                </button>
                <Modal isOpen={isOpen} onClose={onClose} ownedBadges={images} />
            </div>

            {images.length > 0 ? (
                <div
                    className={
                        shouldAnimate ? `${styles.marquee}` : "flex flex-row"
                    }
                    ref={marqueeRef}
                >
                    <div
                        className={
                            shouldAnimate
                                ? `${styles.marquee_track}`
                                : "flex-row flex"
                        }
                        ref={trackRef}
                    >
                        {images.map((image, index) => (
                            <div
                                key={image._id}
                                className={
                                    shouldAnimate
                                        ? `${styles.marquee_item}`
                                        : ""
                                }
                                style={
                                    shouldAnimate
                                        ? ({
                                              "--item-position": `${index - 1}`,
                                          } as React.CSSProperties)
                                        : {}
                                }
                            >
                                <img
                                    src={image.badgeLink}
                                    alt="Achievement Badge"
                                    className="w-40 h-40 rounded-lg shadow-md border-4 border-gray-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-lg text-gray-500">No Achievements Found</p>
            )}
        </div>
    );
}
