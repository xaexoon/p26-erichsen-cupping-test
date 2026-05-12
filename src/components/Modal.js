export default function Modal({
    isOpen,
    onClose,
    onConfirm,
    title = "확인",
    message = "",
    confirmText = "확인",
    cancelText = "취소",
    showCancel = true,
    confirmColor = "bg-[#E74C3C]",
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-[#454C56] rounded-[20px] w-[500px] p-[40px] flex flex-col gap-[30px]"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-white text-[32px] font-bold text-center">
                    {title}
                </h2>

                <p className="text-white text-[24px] text-center whitespace-pre-line">
                    {message}
                </p>

                <div className="flex gap-[20px] justify-center">
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="w-[150px] h-[60px] rounded-[15px] bg-[#727982] text-white text-[28px] cursor-pointer"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={onConfirm ?? onClose}
                        className={`w-[150px] h-[60px] rounded-[15px] text-white text-[28px] cursor-pointer ${confirmColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
