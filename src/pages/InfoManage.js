import { useEffect, useState } from "react";
import { ReactComponent as RefreshIcon } from "../assets/images/refresh_icon.svg";
import { ReactComponent as SearchIcon } from "../assets/images/search_icon.svg";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { getSystemSetting } from "../api/apiConfig";

const COLUMNS = [
    { key: "no", label: "순번", width: "w-[80px]" },
    { key: "car", label: "차종", width: "w-[140px]" },
    { key: "code", label: "품번", width: "w-[160px]" },
    { key: "name", label: "품명", width: "flex-1" },
    { key: "a_name", label: "A 이름", width: "w-[120px]" },
    { key: "a_thick", label: "A 두께", width: "w-[100px]" },
    { key: "b_name", label: "B 이름", width: "w-[120px]" },
    { key: "b_thick", label: "B 두께", width: "w-[100px]" },
    { key: "result", label: "판정값", width: "w-[120px]" },
];

const data = Array.from({ length: 15 }, (_, i) => ({
    no: i + 1,
    car: "P32R",
    code: "SDBA650875",
    name: "FRT DOOR INR L/R",
    a_name: "SP7818",
    a_thick: 0.65,
    b_name: "SP7818",
    b_thick: 1.4,
    result: "60% 이상",
}));

function Divider() {
    return <div className="w-full h-[2px] bg-[#454C56]" />;
}

export default function InfoManage() {
    const [infoSetting, setInfoSetting] = useState(null);

    useEffect(() => {
        getSystemSetting()
            .then((res) => {
                setInfoSetting(res.data);
                console.log("info data :", infoSetting);
            })
            .catch((error) => {
                console.error("API 에러:", error);
            });
    }, []);

    return (
        <div className="flex w-full h-full rounded-[25px] gap-[20px]">
            <div className="flex flex-col w-full h-full px-[30px] gap-[30px] overflow-hidden">
                {/* Search */}
                <div className="flex w-full h-[80px] gap-[20px] items-center flex-shrink-0">
                    <div className="flex items-center justify-center w-[165px] h-full bg-[#67A0F0] text-white text-[28px] rounded-[10px]">
                        검색 필터
                    </div>

                    <div className="relative flex flex-1 h-full">
                        <input
                            className="w-full h-full bg-[#454C56] text-white text-[24px] pl-[20px] pr-[60px] rounded-[10px] outline-none"
                            placeholder="검색어를 입력하세요"
                        />
                        <SearchIcon className="absolute right-[20px] top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="flex w-[70px] h-full items-center justify-center rounded-[10px] cursor-pointer">
                        <RefreshIcon />
                    </div>
                </div>

                <Divider />

                {/* 테이블 컨테이너 - 남은 높이 모두 사용 + 스크롤 */}
                <div className="flex-1 min-h-0 border-[2px] border-[#404750] rounded-[15px] overflow-hidden">
                    <SimpleBar style={{ height: "100%" }}>
                        <table className="w-full text-white text-[22px]">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-[#454C56]">
                                    {COLUMNS.map((col) => (
                                        <th
                                            key={col.key}
                                            className="py-[15px] font-normal text-white border-r border-[#262A31] last:border-r-0"
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#5A6168]">
                                {data.map((row, i) => (
                                    <tr
                                        key={i}
                                        className={
                                            i % 2 === 0
                                                ? "bg-[#31363E]"
                                                : "bg-[#262A31]"
                                        }
                                    >
                                        {COLUMNS.map((col) => (
                                            <td
                                                key={col.key}
                                                className="py-[15px] text-center border-r border-[#5A6168] last:border-r-0"
                                            >
                                                {row[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </SimpleBar>
                </div>
            </div>
        </div>
    );
}
