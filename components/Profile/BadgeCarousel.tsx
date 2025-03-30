import styles from "./marquee.module.css";

const images = [
    "/rock.jpeg",
    "/default-profile.png",
    "/reward1.jpeg",
    "/reward2.jpeg",
    "/ppt.png",
    "/pdf.png",
    "/folder.png",
    "/rock.jpeg",
    "/default-profile.png",
    "/reward1.jpeg",
    "/reward2.jpeg",
];

export default function InfiniteScroll() {
    return (
        <div
            className="w-full flex flex-col items-center justify-center"
            style={{ "--num-items": images.length } as React.CSSProperties}
        >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
                🏆 Achievements
            </h2>
            {images.length > 0 ? (
                <div className={styles.marquee}>
                    <div className={styles.marquee_track}>
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={styles.marquee_item}
                                style={
                                    {
                                        "--item-position": `${index - 1}`,
                                    } as React.CSSProperties
                                }
                            >
                                <img
                                    src={image}
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
