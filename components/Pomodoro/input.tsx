"use client";
import React, { useState, useEffect, useRef } from "react";

interface TagInputProps {
    buttonRef: React.RefObject<HTMLButtonElement>;
    settaginput: (tag: string) => void;
    user_id: string | null;
    user_token: string | null;
    taginput: string;
}

const TagInput: React.FC<TagInputProps> = ({
    buttonRef,
    settaginput,
    taginput,
    user_id,
    user_token,
}) => {
    const [tags, setTags] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchTags = async () => {
            if (!user_id || !user_token) return;

            try {
                const response = await fetch(
                    `http://localhost:8000/api/pomodoro/fetchalltags/${user_id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user_token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data.subjectList);
                setTags(data.subjectList);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchTags();
    }, [user_id, user_token]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
                setTimeout(() => {
                    if (buttonRef.current) {
                        buttonRef.current.click(); // Triggers handleAddTag()
                    }
                }, 0);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [buttonRef]);

    return (
        <div className="relative w-60" ref={dropdownRef}>
            <input
                className="mt-10 mb-10 rounded-lg text-white w-60 h-10 text-lg text-center border border-gray-400 bg-transparent"
                placeholder="Enter Tag"
                value={taginput}
                onChange={(e) => settaginput(e.target.value)}
                onFocus={() => {
                    setShowDropdown(true);
                    settaginput("");
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && buttonRef.current) {
                        buttonRef.current.click();
                    }
                }}
            />
            {showDropdown && tags.length > 0 && (
                <ul className="absolute -mt-9 z-10 w-full bg-gray-800 border border-gray-600 rounded-md shadow-md">
                    {tags.map((tag, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-gray-700 cursor-pointer text-white text-center"
                            onClick={() => {
                                if (tag === "Default") {
                                    settaginput("");
                                } else {
                                    settaginput(tag);
                                }
                                setShowDropdown(false);
                                setTimeout(() => {
                                    if (buttonRef.current) {
                                        buttonRef.current.click(); // Triggers handleAddTag()
                                    }
                                }, 0);
                            }}
                        >
                            {tag}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TagInput;
