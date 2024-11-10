import React from "react";

type Deadline = {
    id: number;
    name: string;
    date: string;
};

function DeadlinesList() {
    const deadlines: Deadline[] = [];

    return (
        <div className="flex flex-col items-center py-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
                Deadlines
            </h2>
            <table className="w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                <thead>
                    <tr className="bg-t2 text-gray-100">
                        <th className="text-white px-4 py-2 font-semibold text-center">
                            Deadline
                        </th>
                        <th className="text-white px-4 py-2 font-semibold text-center">
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {deadlines.map((deadline) => (
                        <tr
                            key={deadline.id}
                            className="bg-c5 border-t text-gray-200"
                        >
                            <td className="text-blackpx-4 py-2 text-center">
                                {deadline.name}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {new Date(deadline.date).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DeadlinesList;
