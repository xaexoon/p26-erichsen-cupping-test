import { API_BASE } from "./config";
const API_URL = `${API_BASE}`;

export const postDownload = async () => {
    try {
        const res = await fetch(`${API_URL}/download`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error("Download Error : ", error);
        return null;
    }
};

export const getMain = async () => {
    try {
        const res = await fetch(`${API_URL}/main`);
        const json = await res.json();
        console.log("main data :", json);
        return json;
    } catch (error) {
        console.error("API 에러:", error);
        return null;
    }
};

export const postMainRefresh = async (time) => {
    try {
        const res = await fetch(`${API_URL}/main_refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ time }),
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error("Main Refresh Error : ", error);
        return null;
    }
};

export const getSystemSetting = async () => {
    try {
        const res = await fetch(`${API_URL}/system_setting`);
        const json = res.json();
        console.log("system setting data :", json);
        return json;
    } catch (error) {
        console.error("API 에러:", error);
        return null;
    }
};

export const getInfoSetting = async () => {
    try {
        const res = await fetch(`${API_URL}/info_setting`);
        const json = res.json();
        console.log("info setting data :", json);
        return json;
    } catch (error) {
        console.error("API 에러:", error);
        return null;
    }
};
