import { useEffect, useState } from "react";
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/react";

import { getSystemSetting } from "../api/apiConfig";

const WEIGHT_UNITS = ["kgf", "N"];

export default function SystemSetting() {
    const splitSize = (str) => str?.split("x") ?? ["", ""];

    const [weightUnit, setWeightUnit] = useState("kgf");
    const [settingData, setSettingData] = useState(null);
    const [videoW, videoH] = splitSize(settingData?.video_size);
    const [offsetX, offsetY] = splitSize(settingData?.offset_size);
    const [reportW, reportH] = splitSize(settingData?.report_size);

    useEffect(() => {
        getSystemSetting()
            .then((res) => {
                console.log("API 응답:", res);
                setSettingData(res.data);
            })
            .catch((err) => {
                console.log("API 에러:", err);
            });
    }, []);

    return (
        <div className="w-full h-full flex-1 bg-[#454C56] rounded-[25px]">
            <div className="flex h-full p-[30px]">
                {/* 통합 카드 */}
                <div className="flex flex-col flex-1 bg-[#30363E] rounded-[20px]">
                    {/* 상단: 통합 제목 + 변경 적용 버튼 */}
                    <div className="flex items-center justify-center w-full relative h-[85px] mt-[30px] px-[30px]">
                        <span className="text-[40px] text-white">
                            검사 및 카메라 설정
                        </span>
                        <button className="absolute right-[30px] flex w-[145px] h-[60px] items-center justify-center bg-[#67A0F0] rounded-[10px] text-white text-[28px] cursor-pointer">
                            변경 적용
                        </button>
                    </div>

                    {/* 상단 가로 구분선 */}
                    <div className="h-[2px] bg-[#454C56] mx-[30px] mt-[20px]" />

                    {/* 좌우 영역 */}
                    <div className="flex flex-1">
                        {/* 왼쪽: 검사 설정 영역 */}
                        <div className="flex flex-col gap-[30px] p-[30px] flex-1 items-center">
                            {/* IP / 포트번호 */}
                            <div className="flex h-[55px] gap-[20px] items-center w-[807px]">
                                <label className="w-[200px] text-white text-[32px]">
                                    IP / 포트번호
                                </label>
                                <input
                                    className="w-[400px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px]"
                                    defaultValue={settingData?.ip_address}
                                />
                                <input
                                    className="w-[167px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px]"
                                    defaultValue={settingData?.port}
                                />
                            </div>

                            <div className="w-full h-[2px] bg-[#454C56]"></div>

                            {/* 명령주기 / 무게 단위 / 판정도 */}
                            <div className="flex flex-col gap-[20px] w-[807px]">
                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        명령주기
                                    </label>
                                    <input
                                        type="number"
                                        className="w-[445px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px] text-center"
                                        defaultValue={
                                            settingData?.command_cycle_ms
                                        }
                                    />
                                    <span className="text-white text-[32px]">
                                        msec
                                    </span>
                                </div>

                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        무게 단위
                                    </label>
                                    <Listbox
                                        value={weightUnit}
                                        onChange={setWeightUnit}
                                    >
                                        <div className="relative w-[445px] h-full">
                                            <ListboxButton className="w-full h-full bg-[#454C56] text-white text-[28px] rounded-[10px] text-center flex items-center justify-center">
                                                {weightUnit}
                                            </ListboxButton>
                                            <ListboxOptions className="absolute z-10 w-full mt-2 bg-[#454C56] rounded-[10px] py-2 max-h-[300px] overflow-auto shadow-lg focus:outline-none">
                                                {WEIGHT_UNITS.map((unit) => (
                                                    <ListboxOption
                                                        key={unit}
                                                        value={unit}
                                                        className={({
                                                            active,
                                                            selected,
                                                        }) =>
                                                            `cursor-pointer px-4 py-2 text-[24px] text-center ${
                                                                active
                                                                    ? "bg-[#67A0F0] text-white"
                                                                    : "text-white"
                                                            } ${selected ? "font-bold" : ""}`
                                                        }
                                                    >
                                                        {unit}
                                                    </ListboxOption>
                                                ))}
                                            </ListboxOptions>
                                        </div>
                                    </Listbox>
                                </div>

                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        판정도
                                    </label>
                                    <input
                                        type="number"
                                        className="w-[445px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px] text-center"
                                        defaultValue={
                                            settingData?.judgment_value
                                        }
                                    />
                                    <span className="text-white text-[32px]">
                                        %
                                    </span>
                                </div>
                            </div>

                            <div className="w-full h-[2px] bg-[#454C56]"></div>

                            {/* load gain × 3 */}
                            <div className="flex flex-col gap-[20px] w-[807px]">
                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        load gain
                                    </label>
                                    <input
                                        className="w-[445px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px] text-center"
                                        defaultValue={
                                            settingData?.load_gain_kgf
                                        }
                                    />
                                    <span className="text-white text-[32px]">
                                        kgf/mV
                                    </span>
                                </div>

                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        load gain
                                    </label>
                                    <input
                                        className="w-[445px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px] text-center"
                                        defaultValue={settingData?.load_gain_n}
                                    />
                                    <span className="text-white text-[32px]">
                                        N/mV
                                    </span>
                                </div>

                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        load gain
                                    </label>
                                    <input
                                        className="w-[445px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px] text-center"
                                        defaultValue={settingData?.load_gain_mm}
                                    />
                                    <span className="text-white text-[32px]">
                                        mm/mV
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 세로 구분선 */}
                        <div className="w-[2px] bg-[#454C56] my-[30px]" />

                        {/* 오른쪽: 카메라 설정 영역 */}
                        <div className="flex flex-col gap-[30px] p-[30px] flex-1 items-center">
                            <div className="flex flex-col gap-[20px] w-[807px]">
                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        영상 수집 주기
                                    </label>
                                    <input
                                        className="w-[445px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px] text-center"
                                        defaultValue={
                                            settingData?.camera_collect_cycle_ms
                                        }
                                    />
                                    <span className="text-white text-[32px]">
                                        msec
                                    </span>
                                </div>

                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        영상 사이즈
                                    </label>
                                    <div className="flex w-[445px] h-full">
                                        <input
                                            className="flex flex-1 w-0 bg-[#454C56] text-white text-[28px] rounded-[10px] text-center"
                                            defaultValue={videoW}
                                        />
                                        <span className="flex text-white text-[32px] items-center justify-center px-[10px]">
                                            ×
                                        </span>
                                        <input
                                            className="flex flex-1 w-0 bg-[#454C56] text-white text-[28px] rounded-[10px] text-center"
                                            defaultValue={videoH}
                                        />
                                    </div>
                                    <span className="text-white text-[32px]">
                                        px
                                    </span>
                                </div>

                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        오프셋 X,Y
                                    </label>
                                    <div className="flex w-[445px] h-full gap-[42px]">
                                        <input
                                            className="flex flex-1 w-0 bg-[#454C56] text-white text-[28px] rounded-[10px] text-center"
                                            defaultValue={offsetX}
                                        />
                                        <input
                                            className="flex flex-1 w-0 bg-[#454C56] text-white text-[28px] rounded-[10px] text-center"
                                            defaultValue={offsetY}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full h-[2px] bg-[#454C56]"></div>

                            <div className="flex flex-col gap-[20px] w-[807px]">
                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        리포트 사이즈
                                    </label>
                                    <div className="flex w-[445px] h-full">
                                        <input
                                            className="flex flex-1 w-0 bg-[#454C56] text-white text-[28px] rounded-[10px] text-center"
                                            defaultValue={reportW}
                                        />
                                        <span className="flex text-white text-[32px] items-center justify-center px-[10px]">
                                            ×
                                        </span>
                                        <input
                                            className="flex flex-1 w-0 bg-[#454C56] text-white text-[28px] rounded-[10px] text-center"
                                            defaultValue={reportH}
                                        />
                                    </div>
                                    <span className="text-white text-[32px]">
                                        px
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
