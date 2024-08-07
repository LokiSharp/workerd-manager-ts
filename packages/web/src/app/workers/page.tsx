'use client'

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

function Workers() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`//${process.env.NEXT_PUBLIC_API_URL}/worker`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            if (response.ok) {
                const data = await response.json();
                setData(data);
            } else {
                // Handle errors
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            <p>Workers Page</ p>
            {data ? (
                <div>{JSON.stringify(data)}</div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default dynamic(() => Promise.resolve(Workers), { ssr: false })