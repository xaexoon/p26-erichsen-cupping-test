import { API_BASE } from "../api/config";
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useMainWs } from "../api/socketConfig";
import {
    getMain,
    postMainRefresh,
    postSaveStart,
    postSaveFinish,
} from "../api/apiConfig";
import Modal from "../components/Modal";

const STEP_LABELS = ["공정 시작", "클램프 정지", "공정 종료"];

const formatDate = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

function CameraStream() {
    const [streamKey, setStreamKey] = useState(Date.now());
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!hasError) return;
        const timer = setTimeout(() => {
            setStreamKey(Date.now());
            setHasError(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [hasError]);

    return (
        <div className="w-full h-full bg-black rounded-[30px] overflow-hidden flex items-center justify-center">
            {!hasError ? (
                <img
                    key={streamKey}
                    src={`${API_BASE}/video/stream?t=${streamKey}`}
                    alt="camera stream"
                    className="w-full h-full object-contain"
                    onError={() => setHasError(true)}
                />
            ) : (
                <div className="flex flex-col items-center gap-[10px]">
                    <span className="text-white text-[24px]">
                        카메라 연결 중...
                    </span>
                    <span className="text-[#8F99A6] text-[18px]">
                        스트림 재연결 시도 중
                    </span>
                </div>
            )}
        </div>
    );
}

export default function Main() {
    // 정적 데이터 (API에서 1회만 로드)
    const [options, setOptions] = useState({
        product_options: [],
        worker_options: [],
    });

    // 실시간 데이터 (WebSocket으로 갱신)
    const [live, setLive] = useState({
        status: null,
        inspection_result: [],
    });

    const { data: wsData } = useMainWs();

    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedWorker, setSelectedWorker] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // 저장 세션 시작 시간 (저장 시작 시점에 기록)
    const sessionStartTimeRef = useRef(null);

    const [isClearModalOpen, setIsClearModalOpen] = useState(false);

    // 둘 다 선택되었는지 확인
    const isReady = selectedProduct !== "" && selectedWorker !== "";

    // 파생값
    const progress = live.status?.progress ?? -1;
    const inspectionResults = live.inspection_result ?? [];
    const inspectionCount = inspectionResults.length;

    const handleSaveToggle = async () => {
        if (isSaving) {
            // ===== 저장 종료 (파라미터 없음) =====
            try {
                const result = await postSaveFinish();
                console.log("저장 종료 응답:", result);

                if (result?.success) {
                    setIsSaving(false);
                }
            } catch (err) {
                console.error("저장 종료 에러:", err);
            }
        } else {
            // ===== 저장 시작 (품번/작업자 id 전달) =====
            if (!isReady) return;

            try {
                const param = {
                    data: {
                        product_id: selectedProduct,
                        worker_id: selectedWorker,
                    },
                };
                const result = await postSaveStart(param);
                console.log("저장 시작 응답:", result);

                if (result?.success) {
                    setIsSaving(true);
                }
            } catch (err) {
                console.error("저장 시작 에러:", err);
            }
        }
    };

    // 1) 첫 렌더 시 옵션 목록 가져오기
    useEffect(() => {
        console.log("getMain 호출 시작!");

        getMain()
            .then((res) => {
                console.log("getMain 응답:", res);
                if (res?.success) {
                    setOptions(res.data);
                }
            })
            .catch((err) => {
                console.error("getMain 에러:", err);
            });
    }, []);

    // 2) WS 실시간 갱신
    useEffect(() => {
        if (wsData?.type !== "main" || !wsData?.success) return;

        console.log("WS 수신:", wsData);
        setLive(wsData.data);
    }, [wsData]);

    return (
        <div className="w-full h-full flex-1 bg-[#454C56] rounded-[25px]">
            <div className="flex h-full gap-[50px] pl-[30px] p-[30px]">
                {/* 왼쪽 */}
                <div className="flex flex-col flex-1 gap-[40px] h-full min-h-0">
                    {/* 상단 상태 카드 */}
                    <div className="flex h-[150px]">
                        <div className="flex w-full bg-[#30363E] items-center justify-center rounded-[15px]">
                            <div className="flex flex-col items-center justify-center flex-1">
                                <span className="text-[#8F99A6] text-[28px]">
                                    모드
                                </span>
                                <span className="text-[#67A0F0] text-[40px]">
                                    {live.status?.mode ?? "-"}
                                </span>
                            </div>
                            <div className="w-[2px] h-[80px] bg-[#4C555E]"></div>
                            <div className="flex flex-col items-center justify-center flex-1">
                                <span className="text-[#8F99A6] text-[28px]">
                                    변위
                                </span>
                                <span className="text-[#67A0F0] text-[40px]">
                                    {live.status?.displacement_mm ?? "-"}
                                    <span className="text-[24px] pl-[10px]">
                                        mm
                                    </span>
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center flex-1">
                                <span className="text-[#8F99A6] text-[28px]">
                                    하중
                                </span>
                                <span className="text-[#67A0F0] text-[40px]">
                                    {live.status?.load_kgf ?? "-"}
                                    <span className="text-[24px] pl-[10px]">
                                        kgf
                                    </span>
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center flex-1">
                                <span className="text-[#8F99A6] text-[28px]">
                                    최대하중
                                </span>
                                <span className="text-[#67A0F0] text-[40px]">
                                    {live.status?.max_load_kgf ?? "-"}
                                    <span className="text-[24px] pl-[10px]">
                                        kgf
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 품번/작업자 + 버튼 */}
                    <div className="flex h-[120px] w-full gap-[30px]">
                        <div className="flex flex-col justify-center flex-1 gap-[10px]">
                            <div className="flex gap-[30px]">
                                <span className="flex w-[120px] text-white items-center justify-end text-[32px]">
                                    품번
                                </span>
                                <div className="flex flex-1 items-center justify-center h-[55px]">
                                    <Listbox
                                        value={selectedProduct}
                                        onChange={setSelectedProduct}
                                        disabled={isSaving}
                                    >
                                        <div className="relative w-full h-full">
                                            <ListboxButton
                                                className={`w-full h-full bg-[#30363E] rounded-[10px] text-white text-center text-[28px] flex items-center justify-center ${
                                                    isSaving
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "cursor-pointer"
                                                }`}
                                            >
                                                {options.product_options.find(
                                                    (p) =>
                                                        p.id ===
                                                        selectedProduct,
                                                )?.product_name ?? "품번 선택"}
                                            </ListboxButton>
                                            <ListboxOptions className="absolute z-10 w-full mt-2 bg-[#30363E] rounded-[10px] py-2 max-h-[300px] overflow-auto shadow-lg focus:outline-none">
                                                {options.product_options.map(
                                                    (product) => (
                                                        <ListboxOption
                                                            key={product.id}
                                                            value={product.id}
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
                                                            {
                                                                product.product_name
                                                            }
                                                        </ListboxOption>
                                                    ),
                                                )}
                                            </ListboxOptions>
                                        </div>
                                    </Listbox>
                                </div>
                            </div>

                            <div className="flex gap-[30px]">
                                <span className="flex w-[120px] text-white items-center justify-end text-[32px]">
                                    작업자
                                </span>
                                <div className="flex flex-1 items-center justify-center h-[55px]">
                                    <Listbox
                                        value={selectedWorker}
                                        onChange={setSelectedWorker}
                                        disabled={isSaving}
                                    >
                                        <div className="relative w-full h-full">
                                            <ListboxButton
                                                className={`w-full h-full bg-[#30363E] rounded-[10px] text-white text-center text-[28px] flex items-center justify-center ${
                                                    isSaving
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "cursor-pointer"
                                                }`}
                                            >
                                                {options.worker_options.find(
                                                    (w) =>
                                                        w.id === selectedWorker,
                                                )?.worker_name ?? "작업자 선택"}
                                            </ListboxButton>
                                            <ListboxOptions className="absolute z-10 w-full mt-2 bg-[#30363E] rounded-[10px] py-2 max-h-[300px] overflow-auto shadow-lg focus:outline-none">
                                                {options.worker_options.map(
                                                    (worker) => (
                                                        <ListboxOption
                                                            key={worker.id}
                                                            value={worker.id}
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
                                                            {worker.worker_name}
                                                        </ListboxOption>
                                                    ),
                                                )}
                                            </ListboxOptions>
                                        </div>
                                    </Listbox>
                                </div>
                            </div>
                        </div>

                        {/* 저장 시작 / Clear */}
                        <div className="flex h-full items-center justify-center gap-[30px]">
                            <button
                                disabled={!isSaving && !isReady}
                                onClick={handleSaveToggle}
                                className={`flex w-[180px] h-full rounded-[15px] ${
                                    isSaving
                                        ? "bg-[#727982] cursor-pointer"
                                        : isReady
                                          ? "bg-[#67A0F0] cursor-pointer"
                                          : "bg-[#727982] cursor-not-allowed"
                                }`}
                            >
                                <span
                                    className={`flex w-full items-center justify-center text-[32px] ${
                                        isSaving || isReady
                                            ? "text-white"
                                            : "text-[#454C56]"
                                    }`}
                                >
                                    {isSaving ? "저장 종료" : "저장 시작"}
                                </span>
                            </button>
                            <button
                                onClick={() => setIsClearModalOpen(true)}
                                className="flex w-[120px] h-full rounded-[15px] bg-[#E28207] cursor-pointer"
                            >
                                <span className="flex w-full items-center justify-center text-[32px] text-white">
                                    Clear
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* 테이블 영역 */}
                    <div className="w-full flex-1 min-h-0 bg-[#30363E] rounded-[15px] overflow-y-auto">
                        <table className="w-full">
                            <thead className="h-[40px] text-white">
                                <tr>
                                    <th className="w-[11%] text-[20px]">
                                        순번
                                    </th>
                                    <th className="w-[34%] text-[20px]">
                                        날짜 / 시간
                                    </th>
                                    <th className="w-[27%] text-[20px]">
                                        변위 (mm)
                                    </th>
                                    <th className="w-[27%] text-[20px]">
                                        최대하중 (kgf)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-white text-center">
                                {inspectionResults.map((item, i) => (
                                    <tr
                                        key={item.idx}
                                        className={`h-[50px] ${
                                            i % 2 === 0
                                                ? "bg-[#454C56]"
                                                : "bg-[#3A4048]"
                                        }`}
                                    >
                                        <td className="py-[8px]">{i + 1}</td>
                                        <td className="py-[8px]">
                                            {item.check_time}
                                        </td>
                                        <td className="py-[8px]">
                                            {item.displacement}
                                        </td>
                                        <td className="py-[8px]">
                                            {item.displacement}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 오른쪽 */}
                <div className="flex flex-col flex-1 gap-[40px] min-h-0">
                    <div className="flex h-[150px]">
                        <div className="flex w-full justify-center items-center">
                            <div className="flex flex-col gap-[20px]">
                                <div className="flex items-center">
                                    {STEP_LABELS.map((label, i) => (
                                        <Fragment key={label}>
                                            <div
                                                className={`w-[60px] h-[60px] rounded-full border-[5px] shrink-0 ${
                                                    progress >= i
                                                        ? "bg-[#D6E7FF] border-[#67A0F0]"
                                                        : "bg-[#454C56] border-[#30363E]"
                                                }`}
                                            ></div>
                                            {i < STEP_LABELS.length - 1 && (
                                                <div
                                                    className={`w-[270px] h-[7px] ${
                                                        progress >= i + 1
                                                            ? "bg-[#67A0F0]"
                                                            : "bg-[#30363E]"
                                                    }`}
                                                ></div>
                                            )}
                                        </Fragment>
                                    ))}
                                </div>

                                <div className="flex justify-between">
                                    {STEP_LABELS.map((label) => (
                                        <div
                                            key={label}
                                            className="flex justify-center w-[60px]"
                                        >
                                            <span className="text-white text-[32px] font-extrabold leading-none font-[SUIT] whitespace-nowrap">
                                                {label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-1 min-h-0">
                        <CameraStream />
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                onConfirm={async () => {
                    const now = formatDate(new Date());
                    console.log("Clear 요청 시간:", now);

                    const result = await postMainRefresh(now);
                    console.log("Main Refresh 응답:", result);

                    setIsClearModalOpen(false);
                }}
                title="데이터 삭제"
                message={`테이블의 모든 데이터를 지우시겠습니까?\n(${inspectionCount}개 항목)`}
                confirmText="삭제"
                cancelText="취소"
            />
        </div>
    );
}
