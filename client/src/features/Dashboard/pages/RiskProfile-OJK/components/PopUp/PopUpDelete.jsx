import { Button } from "@/components/ui/button";

export default function PopUpDelete({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  itemNomor,
  itemJudul,
  itemAspekNomor,
  itemAspekJudul,
  itemType,
  onConfirm,
  onCancel,
  confirmText = "Hapus",
  cancelText = "Batal",
  isLoading = false
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/5 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md border border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-800 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-gray-700 text-sm">{description}</p>
          
          {/* Item details */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <div className="space-y-3">
              {/* Aspek info */}
              {itemAspekNomor && itemAspekJudul && (
                <div className="pb-3 border-b border-gray-200">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-600">Dalam Aspek</span>
                  </div>
                  <div className="space-y-1 pl-2">
                    <div className="flex text-sm">
                      <span className="w-16 text-gray-600">No. Aspek</span>
                      <span className="font-medium text-gray-900">: {itemAspekNomor}</span>
                    </div>
                    <div className="flex text-sm">
                      <span className="w-16 text-gray-600">Judul</span>
                      <span className="font-medium text-gray-900 line-clamp-2">: {itemAspekJudul}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Main item info */}
              <div className="space-y-2">
                {itemNomor && (
                  <div className="flex items-start text-sm">
                    <span className="w-16 text-gray-600">Nomor</span>
                    <span className="font-medium text-gray-900">: {itemNomor}</span>
                  </div>
                )}
                
                {itemJudul && (
                  <div className="flex items-start text-sm">
                    <span className="w-16 text-gray-600">Judul</span>
                    <span className="font-medium text-gray-900 flex-1 line-clamp-3">: {itemJudul}</span>
                  </div>
                )}
                
                <div className="flex items-center pt-2 border-t border-gray-100 text-sm">
                  <span className="w-16 text-gray-600">Tipe</span>
                  <span className="font-medium text-gray-900">: {itemType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-red-700 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.404 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-xs text-red-800">
                Tindakan ini tidak dapat dibatalkan. Semua data terkait akan hilang.
              </span>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-2 p-5 border-t border-gray-300 bg-gray-50 rounded-b-lg">
          <Button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-400 rounded text-gray-700 text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-700 text-white rounded text-sm hover:bg-red-800 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>{confirmText}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}