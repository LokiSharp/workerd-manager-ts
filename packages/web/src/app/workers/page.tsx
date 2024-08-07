'use client'

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { authFetch } from "../auth-fetch";

function Workers() {
    const [data, setData] = useState(null);
    const flag = useRef<boolean>(true);
    useEffect(() => {

        async function fetchData() {
            if (flag.current) {
                flag.current = false;
                return;
            }
            const response = await authFetch(`//${process.env.NEXT_PUBLIC_API_URL}/worker`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
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
