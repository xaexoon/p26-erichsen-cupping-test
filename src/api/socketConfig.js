import { WS_BASE } from "./config";
import { useEffect, useRef, useState } from "react";

const BASE_URL = `${WS_BASE}/ws/status`;
const RECONNECT_TIME = 3000;

export const useMainWs = () => {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState("disconnected");
    const wsRef = useRef(null);

    useEffect(() => {
        let shouldReconnect = true;
        let reconnectTimer = null;

        const connect = () => {
            const ws = new WebSocket(BASE_URL);
            wsRef.current = ws;
            ws.onopen = () => setStatus("connected");
            ws.onmessage = (e) => {
                setData(JSON.parse(e.data));
                console.log(e.data);
            };
            ws.onclose = () => {
                setStatus("disconnected");
                if (shouldReconnect) {
                    reconnectTimer = setTimeout(connect, RECONNECT_TIME);
                }
            };
        };

        connect();

        return () => {
            shouldReconnect = false;
            clearTimeout(reconnectTimer);
            wsRef.current?.close();
        };
    }, []);

    return { data, status };
};
