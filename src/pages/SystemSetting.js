import { useState } from "react";
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/react";

const WEIGHT_UNITS = ["kgf", "N"];

export default function SystemSetting() {
    const [weightUnit, setWeightUnit] = useState("kgf");

    return (
        <div className="w-full h-full flex-1 bg-[#454C56] rounded-[25px]">
            <div className="flex h-full gap-[30px] pl-[30px] p-[30px]">
                {/* 왼쪽 */}
                <div className="flex flex-1 bg-[#30363E] rounded-[20px]">
                    <div className="flex flex-col gap-[30px] p-[30px] flex-1 items-center">
                        {/* 제목 */}
                        <div className="flex items-center justify-center w-full relative h-[85px]">
                            <span className="text-[40px] text-white">
                                검사 설정
                            </span>
                            <div className="absolute right-0 flex w-[145px] h-[60px] items-center justify-center bg-[#67A0F0] rounded-[10px] text-white text-[28px] cursor-pointer">
                                <span>변경 적용</span>
                            </div>
                        </div>

                        <div className="w-full h-[2px] bg-[#454C56]"></div>

                        {/* IP / 포트번호 */}
                        <div className="flex h-[55px] gap-[20px] items-center w-[807px]">
                            <label className="w-[200px] text-white text-[32px]">
                                IP / 포트번호
                            </label>
                            <input className="w-[400px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px]" />
                            <input className="w-[167px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px]" />
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
                                <input className="w-[445px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px] text-center" />
                                <span className="text-white text-[32px]">
                                    kgf/mV
                                </span>
                            </div>

                            <div className="flex h-[55px] gap-[20px] items-center">
                                <label className="w-[200px] text-white text-[32px] text-right">
                                    load gain
                                </label>
                                <input className="w-[445px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px] text-center" />
                                <span className="text-white text-[32px]">
                                    N/mV
                                </span>
                            </div>

                            <div className="flex h-[55px] gap-[20px] items-center">
                                <label className="w-[200px] text-white text-[32px] text-right">
                                    load gain
                                </label>
                                <input className="w-[445px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px] text-center" />
                                <span className="text-white text-[32px]">
                                    mm/mV
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 오른쪽 */}
                <div className="flex flex-1 bg-[#30363E] rounded-[20px]">
                    <div className="flex flex-col gap-[30px] p-[30px] flex-1 items-center">
                        <div className="flex items-center justify-center w-full relative h-[85px]">
                            <span className="text-[40px] text-white">
                                카메라 설정
                            </span>
                            <div className="absolute right-0 flex w-[145px] h-[60px] items-center justify-center bg-[#67A0F0] rounded-[10px] text-white text-[28px] cursor-pointer">
                                <span>변경 적용</span>
                            </div>
                        </div>

                        <div className="w-full h-[2px] bg-[#454C56]"></div>

                        <div className="flex flex-col gap-[20px] w-[807px]">
                            <div className="flex h-[55px] gap-[20px] items-center">
                                <label className="w-[200px] text-white text-[32px] text-right">
                                    영상 수집 주기
                                </label>
                                <input className="w-[445px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px] text-center" />
                                <span className="text-white text-[32px]">
                                    msec
                                </span>
                            </div>

                            <div className="flex h-[55px] gap-[20px] items-center">
                                <label className="w-[200px] text-white text-[32px] text-right">
                                    영상 사이즈
                                </label>
                                <div className="flex w-[445px] h-full">
                                    <input className="flex flex-1 w-0 bg-[#454C56] text-white text-[28px] rounded-[10px] text-center" />
                                    <span className="flex text-white text-[32px] items-center justify-center px-[10px]">
                                        ×
                                    </span>
                                    <input className="flex flex-1 w-0 bg-[#454C56] text-white text-[28px] rounded-[10px] text-center" />
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
                                    <input className="flex flex-1 w-0 bg-[#454C56] text-white text-[28px] rounded-[10px] text-center" />
                                    <input className="flex flex-1 w-0 bg-[#454C56] text-white text-[28px] rounded-[10px] text-center" />
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
                                    <input className="flex flex-1 w-0 bg-[#454C56] text-white text-[28px] rounded-[10px] text-center" />
                                    <span className="flex text-white text-[32px] items-center justify-center px-[10px]">
                                        ×
                                    </span>
                                    <input className="flex flex-1 w-0 bg-[#454C56] text-white text-[28px] rounded-[10px] text-center" />
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
    );
}
