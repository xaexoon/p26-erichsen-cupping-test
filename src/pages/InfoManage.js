import { useEffect, useState } from "react";
import { ReactComponent as RefreshIcon } from "../assets/images/refresh_icon.svg";
import { ReactComponent as SearchIcon } from "../assets/images/search_icon.svg";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import {
    getInfoSetting,
    getInfoSettingBySeq,
    putInfoSetting,
    postInfoSetting,
    deleteInfoSetting,
} from "../api/apiConfig";
import Modal from "../components/Modal";

const COLUMNS = [
    { key: "idx", label: "순번", width: "w-[80px]" },
    { key: "car_type", label: "차종", width: "w-[140px]" },
    { key: "part_no", label: "품번", width: "w-[160px]" },
    { key: "product_name", label: "품명", width: "" },
    { key: "material_a_name", label: "A 이름", width: "w-[200px]" },
    { key: "material_a_thin", label: "A 두께", width: "w-[100px]" },
    { key: "material_b_name", label: "B 이름", width: "w-[200px]" },
    { key: "material_b_thin", label: "B 두께", width: "w-[100px]" },
    { key: "judgment_value", label: "판정값", width: "w-[120px]" },
];

const FORM_COLUMNS = COLUMNS.filter((f) => f.key !== "idx");

const EMPTY_FORM = FORM_COLUMNS.reduce(
    (acc, f) => ({ ...acc, [f.key]: "" }),
    {},
);

function InfoModal({
    isOpen,
    mode = "add",
    initialData = null,
    onSubmit,
    onDelete,
    onClose,
}) {
    const [formData, setFormData] = useState(EMPTY_FORM);

    useEffect(() => {
        if (!isOpen) return;

        if (mode === "edit" && initialData) {
            const filled = FORM_COLUMNS.reduce(
                (acc, f) => ({ ...acc, [f.key]: initialData[f.key] ?? "" }),
                {},
            );
            setFormData(filled);
        } else {
            setFormData(EMPTY_FORM);
        }
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const updateField = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = () => {
        const payload = {
            ...formData,
            material_a_thin: Number(formData.material_a_thin),
            material_b_thin: Number(formData.material_b_thin),
            judgment_value: Number(formData.judgment_value),
        };
        if (mode === "edit" && initialData?.idx != null) {
            payload.idx = initialData.idx;
        }
        onSubmit(payload);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-[#30363E] rounded-[20px] w-[830px] h-[946px] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between px-[40px] pt-[30px] pb-[20px] flex-shrink-0">
                    <h2 className="text-white text-[36px] font-semibold">
                        {mode === "add" ? "항목 추가" : "항목 수정"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white text-[32px] w-[40px] h-[40px] flex items-center justify-center cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* 폼 영역 (스크롤) */}
                <div className="flex-1 overflow-y-auto px-[40px]">
                    <div className="flex flex-col gap-[24px] pb-[10px]">
                        {FORM_COLUMNS.map((field) => (
                            <div
                                key={field.key}
                                className="flex flex-col gap-[10px]"
                            >
                                <label className="text-[#9CA39E] text-[24px]">
                                    {field.label}
                                </label>
                                <input
                                    className="w-full h-[68px] bg-[#262A31] text-white text-[24px] px-[20px] rounded-[10px] outline-none"
                                    value={formData[field.key]}
                                    onChange={updateField(field.key)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 버튼 (고정) */}
                <div className="flex gap-[16px] px-[40px] pt-[20px] pb-[30px] flex-shrink-0">
                    {mode === "edit" && (
                        <button
                            onClick={() => onDelete?.(initialData)}
                            className="flex-1 h-[70px] rounded-[12px] bg-[#E74C3C] text-white text-[28px] font-semibold cursor-pointer"
                        >
                            삭제
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        className="flex-1 h-[70px] rounded-[12px] bg-[#67A0F0] text-white text-[28px] font-semibold cursor-pointer"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}

function Divider() {
    return <div className="w-full h-[2px] bg-[#454C56]" />;
}

export default function InfoManage() {
    const [infoData, setInfoData] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: "add",
        selectedRow: null,
    });
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [resultModal, setResultModal] = useState(null);

    const closeModal = () => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
    };

    // 결과 모달 헬퍼 — 다른 모달들도 모두 닫음
    const showSuccess = (title, message) => {
        closeModal();
        setDeleteTarget(null);
        setResultModal({ title, message, isError: false });
    };

    const showError = (title, message) => {
        closeModal();
        setDeleteTarget(null);
        setResultModal({ title, message, isError: true });
    };

    const fetchData = (kw = "") => {
        getInfoSetting(kw)
            .then((res) => {
                console.log("info data :", res?.data);
                setInfoData(res?.data ?? []);
            })
            .catch((error) => {
                console.error("API 에러:", error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddModal = () => {
        setModalState({ isOpen: true, mode: "add", selectedRow: null });
    };

    const openEditModal = async (row) => {
        if (!row?.idx) return;

        try {
            const res = await getInfoSettingBySeq(row.idx);
            if (res?.success) {
                setModalState({
                    isOpen: true,
                    mode: "edit",
                    selectedRow: res.data,
                });
            } else {
                showError(
                    "조회 실패",
                    res?.message ?? "데이터 조회에 실패했습니다.",
                );
            }
        } catch (err) {
            console.error("상세 조회 에러:", err);
            showError("오류", "조회 중 오류가 발생했습니다.");
        }
    };

    const handleSubmit = async (payload) => {
        console.log(`${modalState.mode} 요청:`, payload);
        const isAdd = modalState.mode === "add";

        try {
            const api = isAdd ? postInfoSetting : putInfoSetting;
            const res = await api({ data: payload });
            console.log(`${modalState.mode} 응답:`, res);

            if (res?.success) {
                fetchData(keyword);
                showSuccess(
                    isAdd ? "추가 완료" : "수정 완료",
                    isAdd
                        ? "항목이 추가되었습니다."
                        : "수정사항이 저장되었습니다.",
                );
            } else {
                showError(
                    isAdd ? "추가 실패" : "수정 실패",
                    res?.message ?? "저장에 실패했습니다.",
                );
            }
        } catch (err) {
            console.error("저장 에러:", err);
            showError("오류", "저장 중 오류가 발생했습니다.");
        }
    };

    // 삭제 버튼 클릭 → 확인 모달 띄우기
    const handleDelete = (row) => {
        if (!row?.idx) return;
        setDeleteTarget(row);
    };

    // 확인 모달에서 "삭제" 클릭 → 실제 API 호출
    const confirmDelete = async () => {
        if (!deleteTarget?.idx) return;

        console.log("삭제 요청:", deleteTarget.idx);

        try {
            const res = await deleteInfoSetting({
                data: { idx: deleteTarget.idx },
            });
            console.log("삭제 응답:", res);

            if (res?.success) {
                fetchData(keyword);
                showSuccess("삭제 완료", "정상적으로 삭제되었습니다.");
            } else {
                showError("삭제 실패", res?.message ?? "삭제에 실패했습니다.");
            }
        } catch (err) {
            console.error("삭제 에러:", err);
            showError("오류", "삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="flex w-full h-full rounded-[25px] gap-[20px]">
            <div className="flex flex-col w-full h-full px-[30px] gap-[30px] overflow-hidden">
                {/* Search */}
                <div className="flex w-full h-[80px] gap-[20px] items-center flex-shrink-0">
                    <div className="relative flex flex-1 h-full">
                        <input
                            className="w-full h-full bg-[#454C56] text-white text-[24px] pl-[20px] pr-[60px] rounded-[10px] outline-none"
                            placeholder="검색어를 입력하세요"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") fetchData(keyword);
                            }}
                        />
                        <SearchIcon className="absolute right-[20px] top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div
                        className="flex w-[70px] h-full items-center justify-center rounded-[10px] cursor-pointer"
                        onClick={() => fetchData(keyword)}
                    >
                        <RefreshIcon />
                    </div>

                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center w-[165px] h-full bg-[#67A0F0] text-white text-[28px] rounded-[10px] cursor-pointer"
                    >
                        항목 추가
                    </button>
                </div>

                <Divider />

                {/* 테이블 */}
                <div className="flex-1 min-h-0 border-[2px] border-[#404750] rounded-[15px] overflow-hidden">
                    <SimpleBar style={{ height: "100%" }}>
                        <table className="w-full text-white text-[22px]">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-[#454C56]">
                                    {COLUMNS.map((col) => (
                                        <th
                                            key={col.key}
                                            className={`py-[15px] font-normal text-white border-r border-[#262A31] last:border-r-0 ${col.width}`}
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#5A6168]">
                                {infoData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={COLUMNS.length}
                                            className="py-[40px] text-center text-[#8F99A6]"
                                        >
                                            데이터가 없습니다
                                        </td>
                                    </tr>
                                ) : (
                                    infoData.map((row, i) => (
                                        <tr
                                            key={row.idx ?? i}
                                            onClick={() => openEditModal(row)}
                                            className={`cursor-pointer hover:brightness-125 ${
                                                i % 2 === 0
                                                    ? "bg-[#31363E]"
                                                    : "bg-[#262A31]"
                                            }`}
                                        >
                                            {COLUMNS.map((col) => (
                                                <td
                                                    key={col.key}
                                                    className="py-[15px] text-center border-r border-[#5A6168] last:border-r-0"
                                                >
                                                    {col.key === "idx"
                                                        ? i + 1
                                                        : (row[col.key] ?? "-")}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </SimpleBar>
                </div>
            </div>

            {/* 추가/수정 모달 */}
            <InfoModal
                isOpen={modalState.isOpen}
                mode={modalState.mode}
                initialData={modalState.selectedRow}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                onClose={closeModal}
            />

            {/* 삭제 확인 모달 */}
            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                title="삭제 확인"
                message={`'${deleteTarget?.product_name ?? ""}' 항목을\n정말 삭제하시겠습니까?`}
                confirmText="삭제"
                cancelText="취소"
            />

            {/* 결과 알림 모달 (성공/실패 공용) */}
            <Modal
                isOpen={!!resultModal}
                onClose={() => setResultModal(null)}
                onConfirm={() => setResultModal(null)}
                title={resultModal?.title ?? ""}
                message={resultModal?.message ?? ""}
                confirmText="확인"
                showCancel={false}
                confirmColor={
                    resultModal?.isError ? "bg-[#E74C3C]" : "bg-[#67A0F0]"
                }
            />
        </div>
    );
}
