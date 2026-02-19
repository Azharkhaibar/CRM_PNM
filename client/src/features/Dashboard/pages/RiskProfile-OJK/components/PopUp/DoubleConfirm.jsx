import { Button } from '@/components/ui/button';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

export default function DoubleConfirm({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'confirm',
  confirmText = 'Ya',
  cancelText = 'Batal',
  okText = 'OK',
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-white/5 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        <h3 className="text-lg font-semibold text-gray-950 mb-2">{title}</h3>
        <p className="text-base text-gray-950 mb-6 whitespace-pre-line">{message}</p>
        <div className="flex justify-end gap-2">
          {type === 'confirm' ? (
            <>
              <Button variant="outline" onClick={onClose}>
                {cancelText}
              </Button>
              <Button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {confirmText}
              </Button>
            </>
          ) : (
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
              {okText}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}