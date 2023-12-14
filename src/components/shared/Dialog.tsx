import { useEffect, useRef, useState, FC } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Modal {
  open?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  hasCloseBtn?: boolean;
}

export const Modal: FC<Modal> = ({
  open = false,
  children,
  onClose = null,
  hasCloseBtn = true,
}) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [isOpen, setisOpen] = useState(open);

  // Behavior when clsosing the modal
  const handleOnClose = () => {
    const modalHtml = modalRef.current;
    onClose && onClose(); //Defined onCLose behavior
    modalHtml?.close(); // Close the modal
  };
  useEffect(() => {
    setisOpen(open);
  }, [open]);

  useEffect(() => {
    const modalHTML = modalRef.current;
    if (modalHTML) {
      return isOpen ? modalHTML.showModal() : modalHTML.close();
    }
  }, [isOpen]);

  return (
    <dialog
      className="p-5 rounded-md w-[300px] min-h-[400px] overflow-hidden"
      ref={modalRef}
    >
      {hasCloseBtn && (
        <div className="flex justify-end">
          <button
            className="btn btn-circle p-0 btn-xs left-full"
            onClick={() => handleOnClose()}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      {children}
    </dialog>
  );
};
