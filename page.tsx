'use client'
import React, { useState } from 'react';
import { Charts } from '@/components/charts_regression';

const RegressionPage = () => {
    const [data, setData] = useState<{ x: number; y: number }[]>([]);
    const [size, setSize] = useState("");
    const [xvalues, setXvalues] = useState("");
    const [resultMatrix, setResultMatrix] = useState("");
    const [answers, setAnswers] = useState<{ a0: number, a1: number, fx: number } | null>(null);
    const keepX = parseInt(xvalues.toString());
    // let keepn = parseInt(size.toString());


    const addData = (dataPoint: number, index: number, field: 'x' | 'y' | 'z') => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: dataPoint };
        setData(newData);
        return newData;
    }

    const addTable = (n: string) => {
        setSize(n);
        const newData = [];
        for (let i = 0; i < parseInt(n); i++) {
            newData.push({
                x: 0, y: 0
            });
        }
        setData(newData);
    }

    const fetchAPIData = async () => {
        try {
            const response = await fetch('/api/regression');
            const result = await response.json();

            if (!Array.isArray(result) || result.length === 0) {
                alert("ไม่พบข้อมูลในฐานข้อมูล");
                return;
            }

            // ใช้เฉพาะ x และ y จาก Database
            const formattedData = result.map((row: { x: number, y: number }) =>
                ({ x: Number(row.x), y: Number(row.y) }));

            setData(formattedData);
            setSize(formattedData.length.toString());

            // ตั้งค่า xvalues เป็นค่า x ตัวท้ายสุด
            setXvalues(formattedData[formattedData.length - 1].x.toString());

            console.log("Loaded data:", formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("เกิดข้อผิดพลาดในการดึงข้อมูลจากฐานข้อมูล");
        }
    };



    interface DataPoint {
        x: number;
        y: number;
    }

    const regressionCalculate = (data: DataPoint[]) => {
        const n = data.length;
        let x0 = 0, fx0 = 0, nx0 = 0, nfx0 = 0;
        for (let i = 0; i < n; i++) {
            x0 += data[i].x;
            fx0 += data[i].y;
            nx0 += data[i].x ** 2;
            nfx0 += data[i].x * data[i].y;
        }
        const a1 = ((n * nfx0) - (x0 * fx0)) / ((n * nx0) - (x0 ** 2));
        const a0 = (fx0 - (a1 * x0)) / n;
        const fx = a0 + a1 * keepX;


        const matrixText = `
            [ ${n.toString().padEnd(6)} ${x0.toString().padEnd(6)} ] [ a0 ] = [ ${fx0} ]
            [ ${x0.toString().padEnd(6)} ${nx0.toString().padEnd(6)} ] [ a1 ]   [ ${nfx0} ]
        `;

        setResultMatrix(matrixText);
        setAnswers({ a0, a1, fx });

    }

    return (
        <div>
            <div className="flex flex-row justify-center items-center mt-10 mb-5">
                <button
                    onClick={fetchAPIData}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold p-3 rounded"
                >
                    API
                </button>
                <div className="flex flex-col space-y-2">
                    <button className="bg-white p-4 m-2 rounded shadow-md">
                        <input
                            type="number"
                            placeholder="Enter number of points"
                            value={size}
                            onChange={(e) => addTable(e.target.value)}

                        />
                    </button>
                </div>
                <button className="bg-white p-4 m-2 rounded shadow-md">
                    <input
                        type="number"
                        placeholder="Enter x value"
                        value={xvalues}
                        onChange={(e) => setXvalues(e.target.value)}
                    />
                </button>
            </div>

            <div className="flex flex-row justify-center items-center mt-10 mb-5">
                <div className="flex flex-col space-y-2">
                    {data.map((_, index) => (
                        <div key={index} className="bg-white p-4 m-2 rounded shadow-md">
                            <input
                                type="number"
                                placeholder={`x${index}`}
                                className="border p-2 rounded"
                                value={data[index]?.x ?? ""}
                                onChange={(e) => addData(parseFloat(e.target.value), index, 'x')}
                            />

                            <input
                                type="number"
                                placeholder={`f(x${index})`}
                                className="border p-2 rounded"
                                value={data[index]?.y ?? ""}
                                onChange={(e) => addData(parseFloat(e.target.value), index, 'y')}
                            />

                        </div>
                    ))}
                    <button
                        onClick={() => regressionCalculate(data)}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Calculate
                    </button>

                </div>

            </div>
            <div className="flex flex-row justify-center items-center mt-10 mb-5">
                <div className="flex flex-col space-y-2">

                    {resultMatrix && (
                        <pre className="bg-gray-100 p-4 rounded text-lg font-mono whitespace-pre mt-4">
                            {resultMatrix}
                        </pre>
                    )}

                    {answers && (
                        <div className="bg-white p-4 rounded shadow-md mt-2 text-lg">
                            <p>a0 = {answers.a0.toFixed(6)}</p>
                            <p>a1 = {answers.a1.toFixed(6)}</p>
                            <p>f(x) = {answers.fx.toFixed(6)}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-row justify-center items-center mt-10 mb-5">
                <Charts
                    data={data}
                    a0={answers?.a0 ?? 0}
                    a1={answers?.a1 ?? 0}
                    fx={answers?.fx ?? 0}
                    xvalue={parseFloat(xvalues) || 0}
                />
            </div>
        </div>
    )
}
export default RegressionPage