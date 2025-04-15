import React from "react";

interface Reward {
    name: string;
    reqPoints: number;
    picture: string;
    onRedeem: () => void;
}

const CardComp: React.FC<Reward> = ({ name, reqPoints, picture, onRedeem }) => {
    return (
        <div className="max-w-[350px] overflow-hidden bg-white rounded-lg shadow-lg border-black border-4">
            <img
                src={picture}
                alt={name}
                className="w-full h-[200px] object-cover p-2"
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-sm text-gray-500">
                    Redeem this reward with your collected coins
                </p>
            </div>
            <div className="flex justify-between items-center p-4 pt-2">
                <div className="flex items-center gap-2">
                    <svg
                        className="h-5 w-5 text-amber-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="4"></circle>
                        <path d="M12 4v2"></path>
                        <path d="M12 12h2"></path>
                    </svg>
                    <span className="font-medium">{reqPoints}</span>
                </div>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    onClick={() => onRedeem()}
                >
                    Redeem
                </button>
            </div>
        </div>
    );
};

export default CardComp;
