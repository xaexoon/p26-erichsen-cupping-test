import { useEffect, useState } from "react";
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/react";

import { getSystemSetting, putSystemSetting } from "../api/apiConfig";

// 초기 폼 상태
// 주의: video_size / offset_size / report_size 에는 사이즈 문자열이 아닌 ID(숫자)가 저장됩니다.
const INITIAL_FORM = {
    idx: null,
    ip_address: "",
    port: "",
    command_cycle_ms: "",
    weight_unit: null,
    judgment_value: "",
    load_gain_kgf: "",
    load_gain_n: "",
    load_gain_mm: "",
    camera_collect_cycle_ms: "",
    video_size: null, // ID (= video_size_id)
    offset_size: null, // ID
    report_size: null, // ID
    // 백엔드에서 내려주는 단위 텍스트 (셀렉트 박스 옆에 표시)
    video_size_unit: "",
    offset_size_unit: "",
    report_size_unit: "",
};

// 옵션 정규화
// - 문자열 배열: 인덱스를 1-indexed ID로 부여 → [{value:1,label:'540x480'}, ...]
// - 객체 배열 (weight_unit): 그대로 사용
const normalizeOptions = (opts) =>
    (opts ?? []).map((opt, idx) => {
        if (typeof opt === "string" || typeof opt === "number") {
            return { value: idx, label: String(opt) };
        }
        // 객체인 경우 value/label 키 보정
        return {
            value: opt.value ?? opt.id,
            label: opt.label ?? opt.name ?? String(opt.value ?? opt.id),
        };
    });

export default function SystemSetting() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [options, setOptions] = useState({
        weight_unit: [],
        video_size: [],
        offset_size: [],
        report_size: [],
    });

    // input용 onChange (key 기반)
    const handleChange = (key) => (e) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    // Listbox용 onChange (key 기반)
    const handleSelect = (key) => (val) => {
        setForm((prev) => ({ ...prev, [key]: val }));
    };

    const getMaindata = async () => {
        try {
            const res = await getSystemSetting();
            console.log("getSystemSetting 응답:", res);
            if (!res?.success) return;

            const data = res.data;

            // 옵션 정규화 (문자열/객체 배열 모두 {value, label}로 통일)
            const rawOptions = data.options ?? {};
            setOptions({
                weight_unit: normalizeOptions(rawOptions.weight_unit),
                video_size: normalizeOptions(rawOptions.video_size),
                offset_size: normalizeOptions(rawOptions.offset_size),
                report_size: normalizeOptions(rawOptions.report_size),
            });

            setForm({
                idx: data.idx ?? null,
                ip_address: data.ip_address ?? "",
                port: data.port ?? "",
                command_cycle_ms: data.command_cycle_ms ?? "",
                weight_unit: data.weight_unit_id ?? null,
                judgment_value: data.judgment_value ?? "",
                load_gain_kgf: data.load_gain_kgf ?? "",
                load_gain_n: data.load_gain_n ?? "",
                load_gain_mm: data.load_gain_mm ?? "",
                camera_collect_cycle_ms: data.camera_collect_cycle_ms ?? "",
                // ✨ 사이즈 필드는 *_id 값을 사용 (옵션 리스트의 value와 매칭됨)
                video_size: data.video_size_id ?? null,
                offset_size: data.offset_size_id ?? null,
                report_size: data.report_size_id ?? null,
                // 단위 텍스트 (백엔드에서 options 바깥에 내려줌)
                video_size_unit: data.video_size_unit ?? "",
                offset_size_unit: data.offset_size_unit ?? "",
                report_size_unit: data.report_size_unit ?? "",
            });
        } catch (err) {
            console.error("getSystemSetting 에러:", err);
        }
    };

    // 최초 로드
    useEffect(() => {
        getMaindata();
    }, []);

    // 변경 적용 핸들러
    const handleApply = async () => {
        // 백엔드 PUT API가 *_id 키로 받는다고 가정 (GET 응답 구조와 일관성 유지)
        // 만약 백엔드가 다른 키 이름을 쓴다면 이 부분만 조정하시면 됩니다.
        const payload = {
            idx: form.idx,
            ip_address: form.ip_address,
            port: Number(form.port),
            command_cycle_ms: Number(form.command_cycle_ms),
            weight_unit_id: form.weight_unit,
            judgment_value: Number(form.judgment_value),
            load_gain_kgf: Number(form.load_gain_kgf),
            load_gain_n: Number(form.load_gain_n),
            load_gain_mm: Number(form.load_gain_mm),
            camera_collect_cycle_ms: Number(form.camera_collect_cycle_ms),
            video_size_id: form.video_size,
            offset_size_id: form.offset_size,
            report_size_id: form.report_size,
        };

        console.log("변경 적용 payload:", payload);
        console.log("video size id : ", payload.video_size_id);

        try {
            const res = await putSystemSetting({ data: payload });
            console.log("putSystemSetting 응답:", res);

            if (res?.success) {
                getMaindata();
                alert("설정이 저장되었습니다.");
            } else {
                alert("저장 실패");
            }
        } catch (err) {
            console.error("putSystemSetting 에러:", err);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    // 셀렉트 박스 렌더링 헬퍼 (영상/오프셋/리포트 사이즈 공통)
    const renderSizeSelect = (key, optionList) => (
        <Listbox value={form[key]} onChange={handleSelect(key)}>
            <div className="relative w-[445px] h-full">
                <ListboxButton className="w-full h-full bg-[#454C56] text-white text-[28px] rounded-[10px] text-center flex items-center justify-center">
                    {optionList.find((o) => o.value === form[key])?.label ??
                        "선택"}
                </ListboxButton>
                <ListboxOptions className="absolute z-10 w-full mt-2 bg-[#454C56] rounded-[10px] py-2 max-h-[300px] overflow-auto shadow-lg focus:outline-none">
                    {optionList.map((opt) => (
                        <ListboxOption
                            key={opt.value}
                            value={opt.value}
                            className={({ active, selected }) =>
                                `cursor-pointer px-4 py-2 text-[24px] text-center ${
                                    active
                                        ? "bg-[#67A0F0] text-white"
                                        : "text-white"
                                } ${selected ? "font-bold" : ""}`
                            }
                        >
                            {opt.label}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );

    return (
        <div className="w-full h-full flex-1 bg-[#454C56] rounded-[25px]">
            <div className="flex h-full p-[30px]">
                <div className="flex flex-col flex-1 bg-[#30363E] rounded-[20px]">
                    {/* 상단: 제목 + 변경 적용 */}
                    <div className="flex items-center justify-center w-full relative h-[85px] mt-[30px] px-[30px]">
                        <span className="text-[40px] text-white">
                            검사 및 카메라 설정
                        </span>
                        <button
                            onClick={handleApply}
                            className="absolute right-[30px] flex w-[145px] h-[60px] items-center justify-center bg-[#67A0F0] rounded-[10px] text-white text-[28px] cursor-pointer"
                        >
                            변경 적용
                        </button>
                    </div>

                    <div className="h-[2px] bg-[#454C56] mx-[30px] mt-[20px]" />

                    <div className="flex flex-1">
                        {/* 왼쪽: 검사 설정 */}
                        <div className="flex flex-col gap-[30px] p-[30px] flex-1 items-center">
                            {/* IP / 포트번호 */}
                            <div className="flex h-[55px] gap-[20px] items-center w-[807px]">
                                <label className="w-[200px] text-white text-[32px]">
                                    IP / 포트번호
                                </label>
                                <input
                                    className="w-[400px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px]"
                                    value={form.ip_address}
                                    onChange={handleChange("ip_address")}
                                />
                                <input
                                    className="w-[167px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px]"
                                    value={form.port}
                                    onChange={handleChange("port")}
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
                                        value={form.command_cycle_ms}
                                        onChange={handleChange(
                                            "command_cycle_ms",
                                        )}
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
                                        value={form.weight_unit}
                                        onChange={handleSelect("weight_unit")}
                                    >
                                        <div className="relative w-[445px] h-full">
                                            <ListboxButton className="w-full h-full bg-[#454C56] text-white text-[28px] rounded-[10px] text-center flex items-center justify-center">
                                                {options.weight_unit.find(
                                                    (u) =>
                                                        u.value ===
                                                        form.weight_unit,
                                                )?.label ?? "선택"}
                                            </ListboxButton>
                                            <ListboxOptions className="absolute z-10 w-full mt-2 bg-[#454C56] rounded-[10px] py-2 max-h-[300px] overflow-auto shadow-lg focus:outline-none">
                                                {options.weight_unit.map(
                                                    (unit) => (
                                                        <ListboxOption
                                                            key={unit.value}
                                                            value={unit.value}
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
                                                            {unit.label}
                                                        </ListboxOption>
                                                    ),
                                                )}
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
                                        value={form.judgment_value}
                                        onChange={handleChange(
                                            "judgment_value",
                                        )}
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
                                        value={form.load_gain_kgf}
                                        onChange={handleChange("load_gain_kgf")}
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
                                        value={form.load_gain_n}
                                        onChange={handleChange("load_gain_n")}
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
                                        value={form.load_gain_mm}
                                        onChange={handleChange("load_gain_mm")}
                                    />
                                    <span className="text-white text-[32px]">
                                        mm/mV
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="w-[2px] bg-[#454C56] my-[30px]" />

                        {/* 오른쪽: 카메라 설정 */}
                        <div className="flex flex-col gap-[30px] p-[30px] flex-1 items-center">
                            <div className="flex flex-col gap-[20px] w-[807px]">
                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        영상 수집 주기
                                    </label>
                                    <input
                                        className="w-[445px] h-full bg-[#454C56] text-white text-[28px] px-[15px] rounded-[10px] text-center"
                                        value={form.camera_collect_cycle_ms}
                                        onChange={handleChange(
                                            "camera_collect_cycle_ms",
                                        )}
                                    />
                                    <span className="text-white text-[32px]">
                                        msec
                                    </span>
                                </div>

                                {/* 영상 사이즈 - Listbox + 단위 */}
                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        영상 사이즈
                                    </label>
                                    {renderSizeSelect(
                                        "video_size",
                                        options.video_size,
                                    )}
                                    <span className="text-white text-[32px]">
                                        {form.video_size_unit}
                                    </span>
                                </div>

                                {/* 오프셋 X,Y - Listbox + 단위 */}
                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        오프셋 X,Y
                                    </label>
                                    {renderSizeSelect(
                                        "offset_size",
                                        options.offset_size,
                                    )}
                                    <span className="text-white text-[32px]">
                                        {form.offset_size_unit}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full h-[2px] bg-[#454C56]"></div>

                            <div className="flex flex-col gap-[20px] w-[807px]">
                                {/* 리포트 사이즈 - Listbox + 단위 */}
                                <div className="flex h-[55px] gap-[20px] items-center">
                                    <label className="w-[200px] text-white text-[32px] text-right">
                                        리포트 사이즈
                                    </label>
                                    {renderSizeSelect(
                                        "report_size",
                                        options.report_size,
                                    )}
                                    <span className="text-white text-[32px]">
                                        {form.report_size_unit}
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
