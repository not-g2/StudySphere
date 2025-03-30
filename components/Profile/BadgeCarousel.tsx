"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./marquee.module.css";

interface InfiniteScrollProps {
    images: Array<{ _id: string; badgeLink: string }>;
}

export default function InfiniteScroll({ images }: InfiniteScrollProps) {
    const marqueeRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        if (marqueeRef.current && trackRef.current) {
            const marqueeWidth = marqueeRef.current.offsetWidth;
            const trackWidth = trackRef.current.scrollWidth;
            setShouldAnimate(trackWidth > marqueeWidth);
        }
    }, [images]);

    return (
        <div
            className="w-full flex flex-col items-center justify-center"
            style={{ "--num-items": images.length } as React.CSSProperties}
        >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
                🏆 Achievements
            </h2>
            {images.length > 0 ? (
                <div className={styles.marquee} ref={marqueeRef}>
                    <div className={styles.marquee_track} ref={trackRef}>
                        {shouldAnimate
                            ? images.map((image, index) => (
                                  <div
                                      key={image._id}
                                      className={styles.marquee_item}
                                      style={
                                          {
                                              "--item-position": `${index - 1}`,
                                          } as React.CSSProperties
                                      }
                                  >
                                      <img
                                          src={image.badgeLink}
                                          alt="Achievement Badge"
                                          className="w-40 h-40 rounded-lg shadow-md border-4 border-gray-300"
                                      />
                                  </div>
                              ))
                            : images.map((image, index) => (
                                  <div key={image._id}>
                                      <img src={image.badgeLink} />
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
