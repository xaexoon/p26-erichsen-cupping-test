import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Main from "./pages/Main";
import SystemSetting from "./pages/SystemSetting";
import InfoManage from "./pages/InfoManage";

export default function App() {
    return (
        <div className="flex flex-col w-screen h-screen bg-[#31363E] overflow-hidden">
            <Header />
            <main className="w-full h-full flex-1 overflow-hidden flex items-center justify-center p-[25px]">
                <Routes>
                    <Route path="/" element={<Navigate to="/main" replace />} />

                    <Route path="/main" element={<Main />} />
                    <Route path="/system-setting" element={<SystemSetting />} />
                    <Route path="/info-manage" element={<InfoManage />} />
                    <Route path="*" element={<Navigate to="/main" replace />} />
                </Routes>
            </main>
        </div>
    );
}
