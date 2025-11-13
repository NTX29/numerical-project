import React from "react";

type Column<T> = {
    key: keyof T;
    label: string;
    format?: (value: T[keyof T]) => React.ReactNode;
};

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
}

export function Table<T>({ columns, data }: TableProps<T>) {
    return (
        <div className="relative overflow-x-auto w-[70%] shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="bg-gray-200">
                        {columns.map((col) => (
                            <th key={String(col.key)} className="px-6 py-3" scope="col">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, i) => (
                        <tr
                            key={i}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                        >
                            {columns.map((col) => (
                                <td
                                    key={String(col.key)}
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                    {col.format
                                        ? col.format(row[col.key])
                                        : String(row[col.key])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
