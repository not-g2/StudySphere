"use client";
import dynamic from "next/dynamic";

const Loading: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-c1">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
            <p className="mt-4 text-white text-lg font-medium">Loading...</p>
        </div>
    );
};

export default dynamic(() => Promise.resolve(Loading), { ssr: false });

