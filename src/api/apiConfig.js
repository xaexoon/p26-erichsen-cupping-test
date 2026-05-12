import axios from "axios";
import { API_BASE } from "./config";

// axios 인스턴스 생성 - 공통 설정을 한 곳에서 관리
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

export const postDownload = async () => {
    try {
        const res = await api.post("/download");
        return res.data;
    } catch (error) {
        console.error("Download Error:", error);
        return null;
    }
};

export const getMain = async () => {
    try {
        const res = await api.get("/main");
        console.log("main data:", res.data);
        return res.data;
    } catch (error) {
        console.error("API 에러:", error);
        return null;
    }
};

export const postMainRefresh = async (time) => {
    try {
        const res = await api.post("/main_refresh", { time });
        return res.data;
    } catch (error) {
        console.error("Main Refresh Error:", error);
        return null;
    }
};

export const getSystemSetting = async () => {
    try {
        const res = await api.get("/system_setting");
        console.log("system setting data:", res.data);
        return res.data;
    } catch (error) {
        console.error("API 에러:", error);
        return null;
    }
};

export const putSystemSetting = async (data) => {
    try {
        const res = await api.put("/system_setting", data);
        console.log("system setting 저장 응답:", res.data);
        return res.data;
    } catch (error) {
        console.error("API 에러:", error);
        return null;
    }
};

// ################## 정보관리 ##################

export const getInfoSetting = async () => {
    try {
        const res = await api.get("/info_setting");
        console.log("info setting data:", res.data);
        return res.data;
    } catch (error) {
        console.error("API 에러:", error);
        return null;
    }
};

export const getInfoSettingBySeq = async (seq) => {
    try {
        const res = await api.get(`/info_setting/${seq}`);
        console.log("info setting data:", res.data);
        return res.data;
    } catch (error) {
        console.error("API 에러:", error);
        return null;
    }
};

export const postInfoSettingRefresh = async () => {
    try {
        const res = await api.post("/info_setting/refresh");
        return res.data;
    } catch (error) {
        console.error("API 에러:", error);
        return null;
    }
};
