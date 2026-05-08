import { useNavigate, useLocation } from "react-router-dom";
import { postDownload } from "../api/apiConfig";
import { ReactComponent as AiandLogo } from "../assets/images/aiand_logo.svg";
import { ReactComponent as MainIcon } from "../assets/images/main_icon.svg";
import { ReactComponent as SettingIcon } from "../assets/images/setting_icon.svg";
import { ReactComponent as InfoIcon } from "../assets/images/info_icon.svg";
import { ReactComponent as DownloadIcon } from "../assets/images/download_icon.svg";

const menu_list = [
    { Icon: MainIcon, label: "메인", path: "/main" },
    { Icon: SettingIcon, label: "시스템 설정", path: "/system-setting" },
    { Icon: InfoIcon, label: "정보관리", path: "/info-manage" },
    {
        Icon: DownloadIcon,
        label: "데이터 추출",
        path: "/download",
        isApi: true,
    },
];

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = async (menu) => {
        console.log("MENU CLICKED");
        if (menu.isApi) {
            console.log("Download 요청");
            const result = await postDownload();
            console.log("Download 응답:", result);
            return;
        }
        navigate(menu.path);
    };

    return (
        <header className="w-full h-[180px] flex-shrink-0 flex items-center px-6 bg-[#30363E] pl-[50px] pr-[50px]">
            <div className="w-full h-[120px] flex items-center gap-[50px]">
                <div className="flex items-center">
                    <AiandLogo style={{ height: 60, width: "auto" }} />
                </div>
                <span className="flex text-[40px] items-center font-semibold text-white">
                    <span className="font-extrabold">
                        생산동 TWB 공정&nbsp;
                    </span>
                    <span className="font-semibold">에릭슨 테스터</span>
                </span>
            </div>

            <div className="flex items-center gap-[30px]">
                {menu_list.map((menu) => {
                    const isActive =
                        !menu.isApi && location.pathname.startsWith(menu.path);
                    return (
                        <div
                            key={menu.label}
                            className="flex flex-col justify-center items-center gap-2 cursor-pointer"
                            onClick={() => handleMenuClick(menu)}
                        >
                            <div
                                className={`w-[95px] h-[95px] rounded-[20px] flex items-center justify-center transition-colors ${
                                    isActive ? "bg-[#67A0F0]" : "bg-[#454C56]"
                                }`}
                            >
                                <menu.Icon className="w-[60px] h-[60px]" />
                            </div>
                            <span className="text-white text-[20px] whitespace-nowrap">
                                {menu.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </header>
    );
}
