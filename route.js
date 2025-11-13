import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise'; 


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST, 
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


export async function GET() {
    try {
        const connection = await pool.getConnection();

        const [idRows] = await connection.execute(
            'SELECT DISTINCT data_id FROM re_table'
        );

        const allDatasetIds = idRows.map(row => row.data_id);

        if (allDatasetIds.length === 0) {
            connection.release(); 
            return NextResponse.json([]);
        }

        const randomIndex = Math.floor(Math.random() * allDatasetIds.length);
        const randomId = allDatasetIds[randomIndex];
        const [rows] = await connection.execute(
            'SELECT x, y FROM re_table WHERE data_id = ?',
            [randomId]
        );

        connection.release(); 
        return NextResponse.json(rows);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Database error' },
            { status: 500 }
        );
    }
}