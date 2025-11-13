import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';

const dataPoint = (x: number, y: number) => ({ x, y });

interface ChartsProps {
    data: { x: number; y: number }[];
    a0: number;
    a1: number;
    fx: number;
    xvalue: number;
}

export const Charts: React.FC<ChartsProps> = ({ data, a0, a1, fx, xvalue }) => {

    const regressionLine = data.map(point => ({
        x: point.x,
        y: a0 + a1 * point.x
    }));

    const predictedPoint = dataPoint(xvalue, fx);

    return (
        <ScatterChart
            width={600}
            height={400}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="X" />
            <YAxis type="number" dataKey="y" name="Y" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />

 
            <Scatter name="Data Points" data={data} fill="#8884d8" />

    
            <Line type="monotone" dataKey="y" data={regressionLine} stroke="#ff7300" dot={false} name="Regression Line" />

    
            <Scatter name="Predicted f(x)" data={[predictedPoint]} fill="#00C49F" />
        </ScatterChart>
    );
};
