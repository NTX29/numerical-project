import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

type ChartDataPoint = {
    x0: number;
    x1: number;
    fx0: number;
    fx1: number;
    area: number;
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: {
        payload: ChartDataPoint;
        [key: string]: unknown; // อนุญาต props อื่นจาก Recharts
    }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0) {
        const p = payload[0].payload;
        return (
            <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
                <p><strong>x0:</strong> {p.x0.toFixed(6)}</p>
                <p><strong>f(x0):</strong> {p.fx0.toFixed(6)}</p>
                <p><strong>x1:</strong> {p.x1.toFixed(6)}</p>
                <p><strong>f(x1):</strong> {p.fx1.toFixed(6)}</p>
                <p><strong>area:</strong> {p.area.toFixed(6)}</p>
            </div>
        );
    }
    return null;
};
interface ChartsProps {
    data: ChartDataPoint[];
}

export function Charts({ data }: ChartsProps) {
    return (
        <div className="w-full h-96 flex flex-row justify-center items-center bg">
            <LineChart width={600} height={400} data={data}>
                <XAxis dataKey="x0" label={{ value: "X0", position: "insideBottom", offset: -5, }} />
                <YAxis dataKey="fx0" label={{ value: "f(x0)", position: "insideLeft", offset: 0, angle: -90 }} />
                <Line
                    type="monotone"
                    dataKey="fx0"
                    stroke="#ff0000ff"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />

              <Tooltip content={<CustomTooltip />} />


            </LineChart>
        </div>
    );
}
