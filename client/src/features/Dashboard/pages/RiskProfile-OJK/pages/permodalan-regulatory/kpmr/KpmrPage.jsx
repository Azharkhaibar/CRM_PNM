import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useHeaderStore } from "../../../store/headerStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { Plus, Trash2, Copy, FileWarning, ArrowBigLeft, ArrowBigRight, ChevronDown, ChevronUp, Edit, Save, X } from "lucide-react";
import { createAspek } from "../../../utils/factory/createAspek";
import { createPertanyaan } from "../../../utils/factory/createPertanyaan";
import { normalizeKpmrRows, normalizeKpmrAspek, normalizeKpmrPertanyaan } from "../../../utils/normalize/normalizeKpmrRows";
import { useDropdownPortal } from "@/features/Dashboard/pages/RiskProfile-OJK/hooks/useDropdownPortal";
import PopUpDelete from "../../../components/PopUp/PopUpDelete";

// Komponen untuk menampilkan item indicator dengan memoization
const IndicatorItem = React.memo(({ label, value, onChange, color, loading = false, editMode = false }) => (
  <div className="rounded-xl px-2 py-2 text-white" style={{ backgroundColor: color }}>
    <div className="text-xs font-bold text-center mb-1">{label}</div>
    <Textarea
      className="bg-white text-center text-black text-xs min-h-[100px]"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading || !editMode}
      placeholder="masukan deskripsi level"
    />
  </div>
));

IndicatorItem.displayName = "IndicatorItem";

// Komponen panel untuk mengelola pertanyaan dalam aspek
function PertanyaanPanel({
  aspekIndex,
  pertanyaanList = [],
  activePertanyaanIndex,
  setActivePertanyaanIndex,
  activeQuarter,
  loading = false,
  editModePertanyaan,
  setEditModePertanyaan,
  onSaveData,
  rows,
  setRows,
}) {
  const [openPertanyaanList, setOpenPertanyaanList] = useState(false);
  const [originalPertanyaan, setOriginalPertanyaan] = useState(null);
  const dropdownPertanyaanBtnRef = useRef(null);
  const [dropdownPertanyaanRect, setDropdownPertanyaanRect] = useState(null);
  const dropdownPertanyaanListRef = useRef(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteContext, setDeleteContext] = useState({
    type: '', // 'aspek' atau 'pertanyaan'
    aspekIndex: null,
    pertanyaanIndex: null
  });

  const safeActivePertanyaanIndex = 
    activePertanyaanIndex !== null && 
    activePertanyaanIndex >= 0 && 
    activePertanyaanIndex < pertanyaanList.length 
      ? activePertanyaanIndex 
      : null;

  const currentPertanyaan = safeActivePertanyaanIndex !== null ? pertanyaanList[safeActivePertanyaanIndex] : null;
  const hasPertanyaan = Array.isArray(pertanyaanList) && pertanyaanList.length > 0;
  const [showPertanyaanForm, setShowPertanyaanForm] = useState(true);

  // Setup position dropdown pertanyaan saat terbuka
  useEffect(() => {
    if (!openPertanyaanList || !dropdownPertanyaanBtnRef.current) return;

    const updatePosition = () => {
      const rect = dropdownPertanyaanBtnRef.current.getBoundingClientRect();
      setDropdownPertanyaanRect({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [openPertanyaanList]);

  useDropdownPortal({
    open: openPertanyaanList,
    setOpen: setOpenPertanyaanList,
    triggerRef: dropdownPertanyaanBtnRef,
    containerRef: dropdownPertanyaanListRef,
  });

  // Reset edit mode saat pertanyaan aktif berubah
  useEffect(() => {
    setEditModePertanyaan(false);
    setOriginalPertanyaan(null);
  }, [activePertanyaanIndex]);

  // Format label untuk dropdown pertanyaan
  const formatPertanyaanLabel = useCallback((pertanyaan) => {
    if (!pertanyaan) return "Pilih atau Tambah Pertanyaan Baru";
    
    const nomor = pertanyaan.nomor || "";
    const pertanyaanText = pertanyaan.pertanyaan || "Tanpa Pertanyaan";
    const copyText = pertanyaan.pertanyaan?.includes("(Copy)") ? " (Copy)" : "";
    
    return `${nomor} – ${pertanyaanText.substring(0, 50)}${pertanyaanText.length > 50 ? "..." : ""}${copyText}`;
  }, []);

  // Handle perubahan field pertanyaan
  const handleChangePertanyaanField = useCallback((path, value) => {
    if (aspekIndex === null || safeActivePertanyaanIndex === null) return;

    setRows((prev) =>
      prev.map((row, ri) => {
        if (ri !== aspekIndex) return row;

        return {
          ...row,
          pertanyaanList: (row.pertanyaanList || []).map((p, pi) => {
            if (pi !== safeActivePertanyaanIndex) return p;

            const updatedPertanyaan = { ...p };
            const keys = path.split('.');
            let current = updatedPertanyaan;
            
            for (let i = 0; i < keys.length - 1; i++) {
              const key = keys[i];
              if (!current[key]) current[key] = {};
              current = current[key];
            }
            
            const lastKey = keys[keys.length - 1];
            current[lastKey] = value;
            
            return updatedPertanyaan;
          }),
        };
      })
    );
  }, [aspekIndex, safeActivePertanyaanIndex, setRows]);

  // Handle perubahan skor
  const handleSkorChange = useCallback((value) => {
    if (aspekIndex === null || safeActivePertanyaanIndex === null) return;

    const q = activeQuarter.toUpperCase();

    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== aspekIndex) return r;

        const list = [...r.pertanyaanList];
        const p = list[safeActivePertanyaanIndex];

        list[safeActivePertanyaanIndex] = {
          ...p,
          skor: { ...(p.skor || {}), [q]: value },
        };

        return { ...r, pertanyaanList: list };
      })
    );
  }, [aspekIndex, safeActivePertanyaanIndex, activeQuarter, setRows]);

  // Save data ke storage
  const saveDataToStorage = useCallback(() => {
    if (typeof onSaveData === 'function') {
      return onSaveData();
    } else if (typeof window !== 'undefined' && typeof window.saveKpmrData === 'function') {
      try {
        const success = window.saveKpmrData();
        if (success) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }
    return false;
  }, [onSaveData]);

  // Masuk mode edit pertanyaan
  const handleEditPertanyaan = useCallback(() => {
    if (safeActivePertanyaanIndex === null) return;
    
    const pertanyaan = pertanyaanList[safeActivePertanyaanIndex];
    setOriginalPertanyaan(structuredClone(pertanyaan));
    setEditModePertanyaan(true);
  }, [safeActivePertanyaanIndex, pertanyaanList]);

  // Update pertanyaan
  const handleUpdatePertanyaan = useCallback(() => {
    if (aspekIndex === null || safeActivePertanyaanIndex === null) return;
    
    if (!currentPertanyaan?.pertanyaan?.trim()) {
      alert("Pertanyaan tidak boleh kosong!");
      return;
    }

    // Validasi skor
    const q = activeQuarter.toUpperCase();
    const skorValue = currentPertanyaan?.skor?.[q];
    if (skorValue !== undefined && skorValue !== null && skorValue !== "") {
      const skorNum = Number(skorValue);
      if (isNaN(skorNum) || skorNum < 1 || skorNum > 5) {
        alert("Skor harus antara 1 dan 5!");
        return;
      }
    }

    setEditModePertanyaan(false);
    setOriginalPertanyaan(null);
    
    // Simpan ke localStorage
    setTimeout(() => {
      if (typeof onSaveData === 'function') {
        const success = onSaveData();
        if (success) {
        } else {
          alert("⚠️ Pertanyaan berhasil diupdate tapi gagal disimpan!");
        }
      }
    }, 100);
  }, [aspekIndex, safeActivePertanyaanIndex, currentPertanyaan, activeQuarter, onSaveData]);

  // Tambah pertanyaan baru
  const handleAddNewPertanyaan = useCallback(() => {
    if (aspekIndex === null) return;

    const updatedRows = rows.map((r, i) =>
      i === aspekIndex
        ? { 
            ...r, 
            pertanyaanList: [...(r.pertanyaanList || []), createPertanyaan()] 
          }
        : r
    );

    setRows(updatedRows);

    const newIndex = pertanyaanList.length;
    setActivePertanyaanIndex(newIndex);
    setEditModePertanyaan(false);
    setOriginalPertanyaan(null);
    
    // Simpan ke localStorage
    setTimeout(() => {
      if (typeof onSaveData === 'function') {
        const saveSuccess = onSaveData(updatedRows);
        if (saveSuccess) {
        } else {
          alert("⚠️ Pertanyaan berhasil ditambah tapi gagal disimpan!");
        }
      }
    }, 100);
  }, [aspekIndex, pertanyaanList.length, rows, setRows, setActivePertanyaanIndex, onSaveData]);

  // Batal edit pertanyaan
  const handleCancelEditPertanyaan = useCallback(() => {
    if (originalPertanyaan && aspekIndex !== null && safeActivePertanyaanIndex !== null) {
      setRows((prev) =>
        prev.map((row, ri) => {
          if (ri !== aspekIndex) return row;
          
          return {
            ...row,
            pertanyaanList: (row.pertanyaanList || []).map((p, pi) =>
              pi === safeActivePertanyaanIndex ? originalPertanyaan : p
            ),
          };
        })
      );
      
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          onSaveData();
        }
      }, 100);
    }
    
    setEditModePertanyaan(false);
    setOriginalPertanyaan(null);
  }, [originalPertanyaan, aspekIndex, safeActivePertanyaanIndex, setRows, onSaveData]);

  // Salin pertanyaan
  const handleCopyPertanyaan = useCallback(() => {
    if (aspekIndex === null || safeActivePertanyaanIndex === null || !currentPertanyaan) return;

    const copiedPertanyaan = {
      ...structuredClone(currentPertanyaan),
      id: crypto.randomUUID(),
      pertanyaan: `${currentPertanyaan.pertanyaan || 'Pertanyaan'} (Copy)`,
    };

    const updatedRows = rows.map((r, i) =>
      i === aspekIndex
        ? { 
            ...r, 
            pertanyaanList: [...(r.pertanyaanList || []), copiedPertanyaan] 
          }
        : r
    );

    setRows(updatedRows);

    const newIndex = pertanyaanList.length;
    setActivePertanyaanIndex(newIndex);
    setEditModePertanyaan(false);
    setOriginalPertanyaan(null);
    
    // Simpan ke localStorage
    setTimeout(() => {
      if (typeof onSaveData === 'function') {
        const saveSuccess = onSaveData(updatedRows);
        if (saveSuccess) {
        } else {
          alert("⚠️ Pertanyaan berhasil disalin tapi gagal disimpan!");
        }
      }
    }, 100);
  }, [aspekIndex, safeActivePertanyaanIndex, currentPertanyaan, pertanyaanList.length, rows, setRows, setActivePertanyaanIndex, onSaveData]);

  // Buka dialog hapus pertanyaan
 const handleOpenPertanyaanDeleteDialog = useCallback(() => {
  if (aspekIndex === null || safeActivePertanyaanIndex === null || !currentPertanyaan) return;
  
  setItemToDelete({
    name: currentPertanyaan.pertanyaan || 'pertanyaan ini',
    nomor: currentPertanyaan.nomor || '-',
    judul: currentPertanyaan.pertanyaan || 'Tidak ada judul',
    aspekNomor: rows[aspekIndex]?.nomor || '-',
    aspekJudul: rows[aspekIndex]?.judul || '-'
  });
  setDeleteContext({
    type: 'pertanyaan',
    aspekIndex: aspekIndex,
    pertanyaanIndex: safeActivePertanyaanIndex
  });
  setDeleteDialogOpen(true);
}, [aspekIndex, safeActivePertanyaanIndex, currentPertanyaan, rows]);

  // Handle konfirmasi hapus
  const handleConfirmDelete = useCallback(() => {
    if (!itemToDelete || !deleteContext.type) return;

    setLoading(true);
    
    if (deleteContext.type === 'pertanyaan') {
      const { aspekIndex, pertanyaanIndex } = deleteContext;
      
      if (aspekIndex === null || pertanyaanIndex === null) {
        setLoading(false);
        setDeleteDialogOpen(false);
        return;
      }
      
      const updatedRows = rows.map((row, ri) => {
        if (ri !== aspekIndex) return row;
        
        const updatedPertanyaanList = (row.pertanyaanList || []).filter((_, pi) => pi !== pertanyaanIndex);
        
        return {
          ...row,
          pertanyaanList: updatedPertanyaanList,
        };
      });

      setRows(updatedRows);
      
      const nextIndex = Math.max(0, pertanyaanIndex - 1);
      setActivePertanyaanIndex(pertanyaanIndex > 0 ? nextIndex : null);
      
      // Tutup popup SEKARANG
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setDeleteContext({ type: '', aspekIndex: null, pertanyaanIndex: null });
      
      // Simpan ke localStorage secara async
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          const saveSuccess = onSaveData(updatedRows);
          if (saveSuccess) {
          } else {
            console.error("⚠️ Pertanyaan berhasil dihapus tapi gagal menyimpan!");
          }
        }
        setLoading(false);
      }, 100);
    }
    
    // Reset state untuk jaga-jaga
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setDeleteContext({ type: '', aspekIndex: null, pertanyaanIndex: null });
  }, [itemToDelete, deleteContext, rows, setRows, setActivePertanyaanIndex, onSaveData]);

  // Batalkan pilihan pertanyaan
  const handleClearPertanyaanSelection = useCallback(() => {
    setActivePertanyaanIndex(null);
    setEditModePertanyaan(false);
    setOriginalPertanyaan(null);
    setOpenPertanyaanList(false);
  }, []);

  return (
    <div className="w-full relative">
      <div className="bg-gradient-to-r from-blue-700 to-sky-600 text-white px-4 py-3 flex justify-between items-center border-t border-l border-r rounded-t-lg border-slate-700">
        <div className="text-lg font-bold">Pertanyaan ({activeQuarter?.toUpperCase()})</div>
        <div className="flex items-center gap-2">
          {loading && (
            <div className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded">
              Memproses...
            </div>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPertanyaanForm(!showPertanyaanForm)}
            className="bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm px-3 border-slate-600"
            disabled={loading}
          >
            {showPertanyaanForm ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Sembunyikan
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Tampilkan
              </>
            )}
          </Button>

          {safeActivePertanyaanIndex !== null && !editModePertanyaan && (
            <Button
              size="icon"
              onClick={handleEditPertanyaan}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
              title="Edit Pertanyaan"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}

          {editModePertanyaan && (
            <Button
              size="icon"
              onClick={handleCancelEditPertanyaan}
              className="bg-gray-600 hover:bg-gray-700"
              disabled={loading}
              title="Batal Edit"
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700"
              onClick={editModePertanyaan ? handleUpdatePertanyaan : handleAddNewPertanyaan}
              title={editModePertanyaan ? "Update Pertanyaan" : "Tambah Pertanyaan"}
              disabled={loading}
            >
              {editModePertanyaan ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>

            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-amber-600 hover:bg-amber-700"
              onClick={handleCopyPertanyaan}
              disabled={safeActivePertanyaanIndex === null || loading}
              title="Salin Pertanyaan"
            >
              <Copy className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-rose-600 hover:bg-rose-700"
              onClick={handleOpenPertanyaanDeleteDialog}
              disabled={safeActivePertanyaanIndex === null || loading}
              title="Hapus Pertanyaan"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {showPertanyaanForm && (
        <div className="bg-gradient-to-r from-blue-700 to-sky-600 text-white px-4 pb-4 border-b border-l border-r border-slate-700 space-y-3 rounded-b-lg">
          <div className="w-full bg-slate-200 rounded-lg p-0.5" />

          <div className="mt-3">
            <label className="font-semibold text-sm ml-1 text-slate-200">
              Pilih Pertanyaan
            </label>
            <button
              ref={dropdownPertanyaanBtnRef}
              onClick={() => setOpenPertanyaanList((v) => !v)}
              className="w-full mt-1 bg-white text-sm text-slate-800 px-3 py-2 rounded-md flex justify-between border border-slate-300 hover:bg-slate-50"
              disabled={loading || !hasPertanyaan}
            >
              <span className="truncate">
                {currentPertanyaan ? formatPertanyaanLabel(currentPertanyaan) : "Pilih atau Tambah Pertanyaan Baru"}
              </span>
              <span>▾</span>
            </button>

            {openPertanyaanList &&
              dropdownPertanyaanRect &&
              createPortal(
                <div
                  ref={dropdownPertanyaanListRef}
                  className="fixed bg-white text-slate-800 rounded-md shadow-lg max-h-[220px] overflow-auto z-[9999] border border-slate-200"
                  style={{
                    top: dropdownPertanyaanRect.top,
                    left: dropdownPertanyaanRect.left,
                    width: dropdownPertanyaanRect.width,
                  }}
                >
                  <button
                    onClick={() => {
                      handleClearPertanyaanSelection();
                      setOpenPertanyaanList(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 border-b border-slate-200 text-slate-600"
                  >
                    ← Kosongkan Pilihan
                  </button>

                  {hasPertanyaan && pertanyaanList.map((pertanyaan, idx) => (
                    <button
                      key={pertanyaan.id ?? idx}
                      onClick={() => {
                        setActivePertanyaanIndex(idx);
                        setOpenPertanyaanList(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 ${
                        idx === safeActivePertanyaanIndex ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700"
                      }`}
                    >
                      {formatPertanyaanLabel(pertanyaan)}
                    </button>
                  ))}
                </div>,
                document.body
              )}
          </div>

          {currentPertanyaan && (
            <>
              <div className="flex gap-2 text-slate-800 mt-3">
                <div className="w-[5%]">
                  <label className="text-slate-200 text-sm font-semibold">Nomor</label>
                  <Input
                    className="bg-white h-8 border-slate-300"
                    value={currentPertanyaan.nomor ?? ""}
                    onChange={(e) => handleChangePertanyaanField("nomor", e.target.value)}
                    disabled={loading || !editModePertanyaan}
                    placeholder="1 - 5"
                  />
                </div>

                <div className="w-[8%]">
                  <label className="text-slate-200 text-sm font-semibold">Skor untuk {activeQuarter?.toUpperCase()}</label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    step="1"
                    className="bg-white h-8 text-slate-800 border-slate-300"
                    value={currentPertanyaan.skor?.[activeQuarter.toUpperCase()] ?? ""}
                    onChange={(e) => handleSkorChange(e.target.value)}
                    disabled={loading || !editModePertanyaan}
                  />
                </div>

                <div className="w-[87%]">
                  <label className="text-slate-200 text-sm font-semibold">Pertanyaan</label>
                  <Input
                    className="bg-white h-8 border-slate-300"
                    value={currentPertanyaan.pertanyaan ?? ""}
                    onChange={(e) => handleChangePertanyaanField("pertanyaan", e.target.value)}
                    disabled={loading || !editModePertanyaan}
                    placeholder="masukan pertanyaan"
                  />
                </div>
              </div>

              <div>
                <div className="font-semibold text-sm py-2 text-slate-200">Indicator</div>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    ["Strong", "strong", "#162556"],
                    ["Satisfactory", "satisfactory", "#162556"],
                    ["Fair", "fair", "#162556"],
                    ["Marginal", "marginal", "#162556"],
                    ["Unsatisfactory", "unsatisfactory", "#162556"],
                  ].map(([label, key, color]) => (
                    <IndicatorItem
                      key={key}
                      label={label}
                      color={color}
                      value={currentPertanyaan.indicator?.[key] ?? ""}
                      onChange={(v) => handleChangePertanyaanField(`indicator.${key}`, v)}
                      loading={loading}
                      editMode={editModePertanyaan}
                    />
                  ))}
                </div>
              </div>

              <div className="text-slate-800">
                <label className="text-slate-200 text-sm font-semibold">Evidence</label>
                <Textarea
                  className="bg-white min-h-[60px] border-slate-300"
                  value={currentPertanyaan.evidence ?? ""}
                  onChange={(e) => handleChangePertanyaanField("evidence", e.target.value)}
                  disabled={loading || !editModePertanyaan}
                  placeholder="masukan penjelasan"
                />
              </div>
            </>
          )}

          {!hasPertanyaan && (
            <div className="py-6 text-center text-sm text-slate-300">
              Tidak ada pertanyaan. Tambahkan pertanyaan terlebih dahulu.
            </div>
          )}
        </div>
      )}

      {!showPertanyaanForm && (
        <div className="w-full" />
      )}

      {/* Popup Delete untuk Pertanyaan */}
<PopUpDelete
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
  title="Hapus Pertanyaan"
  description="Apakah Anda yakin ingin menghapus pertanyaan ini? Tindakan ini tidak dapat dibatalkan."
  itemName={itemToDelete?.name || ''}
  itemNomor={itemToDelete?.nomor || ''}
  itemJudul={itemToDelete?.judul || ''}
  itemAspekNomor={itemToDelete?.aspekNomor || ''}
  itemAspekJudul={itemToDelete?.aspekJudul || ''}
  itemType="pertanyaan"
  onConfirm={handleConfirmDelete}
  onCancel={() => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setDeleteContext({ type: '', aspekIndex: null, pertanyaanIndex: null });
  }}
  confirmText="Hapus"
  cancelText="Batal"
  isLoading={loading}
/>
    </div>
  );
}

// Komponen panel utama untuk mengelola aspek KPMR
function AspekPanel({ rows = [], setRows, activeQuarter, onSaveData }) {
  const [activeAspekIndex, setActiveAspekIndex] = useState(null);
  const [activePertanyaanIndex, setActivePertanyaanIndex] = useState(null);
  const [editModeAspek, setEditModeAspek] = useState(false);
  const [editModePertanyaan, setEditModePertanyaan] = useState(false);
  const [originalAspek, setOriginalAspek] = useState(null);
  const [draftAspek, setDraftAspek] = useState({ nomor: "", judul: "", bobot: "" });
  const [openAspekList, setOpenAspekList] = useState(false);
  const [showAspekForm, setShowAspekForm] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const dropdownAspekBtnRef = useRef(null);
  const dropdownAspekListRef = useRef(null);
  const [dropdownAspekRect, setDropdownAspekRect] = useState(null);

  // State untuk popup delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteContext, setDeleteContext] = useState({
    type: '', // 'aspek' atau 'pertanyaan'
    aspekIndex: null,
    pertanyaanIndex: null
  });

  // Normalize rows
  const normalizedRows = useMemo(() => normalizeKpmrRows(rows), [rows]);

  // Pastikan indeks aspek aktif valid
  const safeActiveAspekIndex =
    activeAspekIndex !== null && activeAspekIndex >= 0 && activeAspekIndex < normalizedRows.length
      ? activeAspekIndex
      : null;

  const safeActiveAspek = safeActiveAspekIndex !== null ? normalizedRows[safeActiveAspekIndex] : null;
  const aspek = editModeAspek ? draftAspek : (safeActiveAspek ?? draftAspek);

  // Setup position dropdown aspek saat terbuka
  useEffect(() => {
    if (!openAspekList || !dropdownAspekBtnRef.current) return;

    const updatePosition = () => {
      const rect = dropdownAspekBtnRef.current.getBoundingClientRect();
      setDropdownAspekRect({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [openAspekList]);

  useDropdownPortal({
    open: openAspekList,
    setOpen: setOpenAspekList,
    triggerRef: dropdownAspekBtnRef,
    containerRef: dropdownAspekListRef,
  });

  // Reset indeks pertanyaan saat aspek berubah
  useEffect(() => {
    setActivePertanyaanIndex(null);
    setEditModePertanyaan(false);
  }, [safeActiveAspekIndex]);

  // Sync draft aspek dengan data aspek aktif
  useEffect(() => {
    if (safeActiveAspek && !editModeAspek) {
      const newDraft = {
        nomor: safeActiveAspek.nomor ?? "",
        judul: safeActiveAspek.judul ?? "",
        bobot: safeActiveAspek.bobot ?? "",
      };

      setDraftAspek((prev) =>
        JSON.stringify(prev) === JSON.stringify(newDraft) ? prev : newDraft
      );
    } else if (!safeActiveAspek && !editModeAspek) {
      setDraftAspek({
        nomor: "",
        judul: "",
        bobot: "",
      });
      setEditModeAspek(false);
      setOriginalAspek(null);
    }
  }, [safeActiveAspek, editModeAspek]);

  // Format label untuk dropdown aspek
  const formatAspekLabel = useCallback((row) => 
    row ? `${row.nomor} – ${row.judul} (Bobot: ${row.bobot}%)` : "-", 
  []);

  // Handle perubahan field aspek
  const handleChangeAspek = useCallback((key, value) => {
    setDraftAspek((p) => ({ ...p, [key]: value }));
  }, []);

  // Cek kelengkapan aspek
  const isAspekIncomplete = useCallback((aspekData) => {
    return !aspekData?.judul?.trim() || Number(aspekData?.bobot) <= 0;
  }, []);

  // Save data ke storage
  const saveDataToStorage = useCallback(() => {
    if (typeof onSaveData === 'function') {
      return onSaveData();
    } else if (typeof window !== 'undefined' && typeof window.saveKpmrData === 'function') {
      try {
        const success = window.saveKpmrData();
        if (success) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }
    return false;
  }, [onSaveData]);

  // Masuk mode edit aspek
  const handleEditAspek = useCallback(() => {
    if (safeActiveAspekIndex === null) return;
    
    const aspekData = rows[safeActiveAspekIndex];
    setOriginalAspek(structuredClone(aspekData));
    
    setDraftAspek({
      nomor: aspekData.nomor ?? "",
      judul: aspekData.judul ?? "",
      bobot: aspekData.bobot ?? "",
    });
    
    setEditModeAspek(true);
  }, [safeActiveAspekIndex, rows]);

  // Update aspek
  const handleUpdateAspek = useCallback(() => {
    if (safeActiveAspekIndex === null) return;
    
    if (isAspekIncomplete(draftAspek)) {
      alert("Lengkapi data aspek sebelum mengupdate.");
      return;
    }

    const bobotNum = Number(draftAspek.bobot);
    if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
      alert("Bobot harus antara 0 dan 100.");
      return;
    }

    setLoading(true);
    try {
      const updatedAspek = {
        ...rows[safeActiveAspekIndex],
        nomor: draftAspek.nomor || "-",
        judul: draftAspek.judul.trim(),
        bobot: bobotNum,
      };

      const updatedRows = rows.map((row, idx) => 
        idx === safeActiveAspekIndex ? updatedAspek : row
      );
      
      setRows(updatedRows);
      
      setEditModeAspek(false);
      setOriginalAspek(null);
      
      // Simpan ke localStorage
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          const success = onSaveData(updatedRows);
          if (success) {
          } else {
            alert("⚠️ Aspek berhasil diupdate tapi gagal disimpan!");
          }
        }
        setLoading(false);
      }, 100);
      
    } catch (error) {
      alert("❌ Gagal mengupdate aspek.");
      setLoading(false);
    }
  }, [draftAspek, safeActiveAspekIndex, rows, setRows, isAspekIncomplete, onSaveData]);

  // Tambah aspek baru
  const handleAddNewAspek = useCallback(() => {
    if (isAspekIncomplete(draftAspek)) {
      alert("Lengkapi data aspek sebelum menambah.");
      return;
    }

    const bobotNum = Number(draftAspek.bobot);
    if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
      alert("Bobot harus antara 0 dan 100.");
      return;
    }
    
    setLoading(true);
    
    try {
      const newAspek = {
        ...createAspek(),
        nomor: draftAspek.nomor || "-",
        judul: draftAspek.judul.trim(),
        bobot: bobotNum,
      };
      
      // Buat updated rows
      const updatedRows = [...rows, newAspek];
      
      // Update state
      setRows(updatedRows);
      
      // Set active index
      const newIndex = updatedRows.length - 1;
      setActiveAspekIndex(newIndex);
      setActivePertanyaanIndex(null);
      
      // Reset draft
      setDraftAspek({
        nomor: "",
        judul: "",
        bobot: "",
      });
      
      // Simpan ke localStorage dengan delay untuk memastikan state sudah update
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          try {
            const saveSuccess = onSaveData(updatedRows);
            
            if (saveSuccess === true || saveSuccess === undefined) {
            } else if (saveSuccess === false) {
              alert("⚠️ Aspek berhasil ditambah tapi gagal disimpan ke storage!");
            }
          } catch (error) {
            console.error("Error saving data:", error);
            alert("⚠️ Error saat menyimpan data!");
          }
        }
        setLoading(false);
      }, 150); // Tambah delay sedikit lebih lama
    } catch (error) {
      console.error("Error adding aspek:", error);
      alert("❌ Gagal menambah aspek.");
      setLoading(false);
    }
  }, [draftAspek, isAspekIncomplete, rows, setRows, onSaveData]);

  // Batal edit aspek
  const handleCancelEditAspek = useCallback(() => {
    if (originalAspek && safeActiveAspekIndex !== null) {
      setRows((prev) =>
        prev.map((row, idx) =>
          idx === safeActiveAspekIndex ? originalAspek : row
        )
      );
      
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          onSaveData();
        }
      }, 100);
    }
    
    setEditModeAspek(false);
    setOriginalAspek(null);
    setDraftAspek({
      nomor: "",
      judul: "",
      bobot: "",
    });
  }, [originalAspek, safeActiveAspekIndex, setRows, onSaveData]);

  // Salin aspek
  const handleCopyAspek = useCallback(() => {
    if (safeActiveAspekIndex === null) return;

    const source = rows[safeActiveAspekIndex];

    setLoading(true);
    try {
      const copiedAspek = {
        ...createAspek(),
        nomor: `${source.nomor}`,
        judul: `${source.judul} (Copy)`,
        bobot: source.bobot,
        pertanyaanList: (source.pertanyaanList || []).map((p) => ({
          ...structuredClone(p),
          id: crypto.randomUUID(),
        })),
      };

      const updatedRows = [...rows, copiedAspek];
      
      setRows(updatedRows);
      setActiveAspekIndex(updatedRows.length - 1);
      setActivePertanyaanIndex(null);
      setEditModeAspek(false);
      setOriginalAspek(null);
      
      // Simpan ke localStorage
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          const saveSuccess = onSaveData(updatedRows);
          if (saveSuccess) {
          } else {
            alert("⚠️ Aspek berhasil disalin tapi gagal disimpan!");
          }
        }
        setLoading(false);
      }, 100);
    } catch (error) {
      alert("❌ Gagal menyalin aspek.");
      setLoading(false);
    }
  }, [safeActiveAspekIndex, rows, setRows, onSaveData]);

  // Buka dialog hapus aspek
const handleOpenAspekDeleteDialog = useCallback(() => {
  if (safeActiveAspekIndex === null) return;

  const aspek = rows[safeActiveAspekIndex];

  setItemToDelete({
    name: aspek.judul || 'aspek ini',
    nomor: aspek.nomor || '-',
    judul: aspek.judul || 'Tidak ada judul',
    bobot: aspek.bobot || '-'
  });
  setDeleteContext({
    type: 'aspek',
    aspekIndex: safeActiveAspekIndex,
    pertanyaanIndex: null
  });
  setDeleteDialogOpen(true);
}, [safeActiveAspekIndex, rows]);

  // Handle konfirmasi hapus aspek
  const handleConfirmDeleteAspek = useCallback(() => {
    if (!itemToDelete || !deleteContext.type) return;

    setLoading(true);
    
    if (deleteContext.type === 'aspek') {
      const { aspekIndex } = deleteContext;
      
      if (aspekIndex === null) {
        setLoading(false);
        setDeleteDialogOpen(false);
        return;
      }
      
      const updatedRows = rows.filter((_, idx) => idx !== aspekIndex);
      
      setRows(updatedRows);
      
      const nextIndex = updatedRows.length > 0 ? 0 : null;
      setActiveAspekIndex(nextIndex);
      setActivePertanyaanIndex(null);
      setEditModeAspek(false);
      setOriginalAspek(null);
      
      // Tutup popup SEKARANG
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setDeleteContext({ type: '', aspekIndex: null, pertanyaanIndex: null });
      
      // Simpan secara async
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          const saveSuccess = onSaveData(updatedRows);
          if (saveSuccess) {
          } else {
            console.error("⚠️ Aspek berhasil dihapus tapi gagal menyimpan!");
          }
        }
        setLoading(false);
      }, 100);
    }
    
    // Reset state untuk jaga-jaga
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setDeleteContext({ type: '', aspekIndex: null, pertanyaanIndex: null });
  }, [itemToDelete, deleteContext, rows, setRows, setActiveAspekIndex, setActivePertanyaanIndex, onSaveData]);

  // Batalkan pilihan aspek
  const handleClearAspekSelection = useCallback(() => {
    setActiveAspekIndex(null);
    setActivePertanyaanIndex(null);
    setEditModeAspek(false);
    setEditModePertanyaan(false);
    setOriginalAspek(null);
    setDraftAspek({ nomor: "", judul: "", bobot: "" });
    setOpenAspekList(false);
  }, []);

  return (
    <div className="w-full space-y-3">
      <div className="bg-gradient-to-r from-blue-700 to-sky-600 text-white px-4 py-3 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Aspek</h2>
          <div className="flex items-center gap-2">
            {loading && (
              <div className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded">
                Memproses...
              </div>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAspekForm(!showAspekForm)}
              className="bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm px-3 border-slate-600"
              disabled={loading}
            >
              {showAspekForm ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Sembunyikan
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Tampilkan
                </>
              )}
            </Button>

            {safeActiveAspekIndex !== null && !editModeAspek && (
              <Button
                size="icon"
                onClick={handleEditAspek}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
                title="Edit Aspek"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}

            {editModeAspek && (
              <Button
                size="icon"
                onClick={handleCancelEditAspek}
                className="bg-gray-600 hover:bg-gray-700"
                disabled={loading}
                title="Batal Edit"
              >
                <X className="w-4 h-4" />
              </Button>
            )}

            <Button 
              size="icon" 
              onClick={editModeAspek ? handleUpdateAspek : handleAddNewAspek}
              className={editModeAspek ? "bg-green-600 hover:bg-green-700" : "bg-emerald-600 hover:bg-emerald-700"}
              disabled={loading}
              title={editModeAspek ? "Update Aspek" : "Tambah Aspek"}
            >
              {editModeAspek ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>

            <Button
              size="icon"
              onClick={handleCopyAspek}
              disabled={safeActiveAspekIndex === null || loading}
              className="bg-amber-600 hover:bg-amber-700"
              title="Salin Aspek"
            >
              <Copy className="w-4 h-4" />
            </Button>

            <Button 
              size="icon" 
              onClick={handleOpenAspekDeleteDialog} 
              disabled={safeActiveAspekIndex === null || loading} 
              className="bg-rose-600 hover:bg-rose-700"
              title="Hapus Aspek"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="w-full bg-slate-200 rounded-lg p-0.5 mt-1" />
        
        {showAspekForm && (
          <>
            <div className="w-full flex gap-2 mt-3">
              <div className="w-[10%]">
                <label className="font-semibold text-sm ml-2 text-slate-200">No</label>
                <Input
                  placeholder="No"
                  value={aspek.nomor}
                  onChange={(e) => handleChangeAspek("nomor", e.target.value)}
                  className="bg-white text-slate-950 border-slate-300"
                  disabled={loading || (safeActiveAspekIndex !== null && !editModeAspek)}
                />
              </div>

              <div className="w-[10%]">
                <label className="font-semibold text-sm ml-2 text-slate-200">Bobot</label>
                <Input
                  type="number"
                  placeholder="max 100%"
                  min="0"
                  max="100"
                  step="0.01"
                  value={aspek.bobot}
                  onChange={(e) => handleChangeAspek("bobot", e.target.value)}
                  className="bg-white text-slate-950 border-slate-300"
                  disabled={loading || (safeActiveAspekIndex !== null && !editModeAspek)}
                />
              </div>

              <div className="w-[80%]">
                <label className="font-semibold text-sm ml-2 text-slate-200">Aspek</label>
                <Input
                  placeholder="masukan aspek"
                  value={aspek.judul}
                  onChange={(e) => handleChangeAspek("judul", e.target.value)}
                  className="bg-white text-slate-950 border-slate-300"
                  disabled={loading || (safeActiveAspekIndex !== null && !editModeAspek)}
                />
              </div>
            </div>

            <button
              ref={dropdownAspekBtnRef}
              onClick={() => setOpenAspekList((v) => !v)}
              className="w-full mt-3 bg-white text-slate-800 px-3 py-2 rounded-md flex justify-between border border-slate-300 hover:bg-slate-50"
              disabled={loading}
            >
              <span className="truncate">
                {safeActiveAspek ? formatAspekLabel(safeActiveAspek) : "Pilih atau Tambah Aspek Baru"}
              </span>
              <span>▾</span>
            </button>

            {openAspekList &&
              dropdownAspekRect &&
              createPortal(
                <div
                  ref={dropdownAspekListRef}
                  className="fixed bg-white rounded-md shadow-lg max-h-[220px] overflow-auto z-[9999] border border-slate-200"
                  style={{
                    top: dropdownAspekRect.top,
                    left: dropdownAspekRect.left,
                    width: dropdownAspekRect.width,
                  }}
                >
                  <button
                    onClick={() => {
                      handleClearAspekSelection();
                      setOpenAspekList(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 border-b border-slate-200 text-slate-600 text-sm"
                    disabled={loading}
                  >
                    ← Kosongkan Pilihan
                  </button>

                  {normalizedRows.map((row, idx) => (
                    <button
                      key={row.id}
                      onClick={() => {
                        setActiveAspekIndex(idx);
                        setOpenAspekList(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 ${
                        idx === safeActiveAspekIndex ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700"
                      } text-sm`}
                      disabled={loading}
                    >
                      {formatAspekLabel(row)}
                    </button>
                  ))}
                </div>,
                document.body
              )}
          </>
        )}

        {!showAspekForm && (
          <div className="w-full" />
        )}
      </div>

      {safeActiveAspek && (
        <PertanyaanPanel
          aspekIndex={safeActiveAspekIndex}
          pertanyaanList={safeActiveAspek.pertanyaanList}
          activePertanyaanIndex={activePertanyaanIndex}
          setActivePertanyaanIndex={setActivePertanyaanIndex}
          activeQuarter={activeQuarter}
          loading={loading}
          editModePertanyaan={editModePertanyaan}
          setEditModePertanyaan={setEditModePertanyaan}
          onSaveData={onSaveData}
          rows={rows}
          setRows={setRows}
        />
      )}

      {/* Popup Delete untuk Aspek */}
 <PopUpDelete
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
  title="Hapus Aspek"
  description="Apakah Anda yakin ingin menghapus aspek ini? Tindakan ini tidak dapat dibatalkan."
  itemName={itemToDelete?.name || ''}
  itemNomor={itemToDelete?.nomor || ''}
  itemJudul={itemToDelete?.judul || ''}
  itemBobot={itemToDelete?.bobot || ''}
  itemType="aspek"
  onConfirm={handleConfirmDeleteAspek}
  onCancel={() => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setDeleteContext({ type: '', aspekIndex: null, pertanyaanIndex: null });
  }}
  confirmText="Hapus"
  cancelText="Batal"
  isLoading={loading}
/>
    </div> 
  );
}

function TableKpmr({ rows = [], activeQuarter }) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuarters, setSelectedQuarters] = useState(["Q1", "Q2", "Q3", "Q4"]); // Default: semua quarter terpilih
  const paginationRef = useRef(null);

  const minZoom = 100;
  const maxZoom = 125;
  const stepZoom = 5;
  const pageSize = 7;

  // Normalize rows
  const normalizedRows = useMemo(() => normalizeKpmrRows(rows), [rows]);

  // Handler untuk toggle quarter
  const toggleQuarter = (quarter) => {
    setSelectedQuarters(prev => {
      if (prev.includes(quarter)) {
        // Jika quarter sudah dipilih, hapus dari list
        return prev.filter(q => q !== quarter);
      } else {
        // Jika quarter belum dipilih, tambahkan ke list
        return [...prev, quarter];
      }
    });
  };

  // Handler untuk select semua quarter
  const selectAllQuarters = () => {
    setSelectedQuarters(["Q1", "Q2", "Q3", "Q4"]);
  };

  // Handler untuk clear semua quarter
  const clearAllQuarters = () => {
    setSelectedQuarters([]);
  };

  // Cek apakah semua quarter terpilih
  const allQuartersSelected = selectedQuarters.length === 4;

  // Cek apakah ada quarter yang terpilih
  const hasSelectedQuarters = selectedQuarters.length > 0;

  // Hitung total halaman
  const totalPages = Math.max(1, Math.ceil(normalizedRows.length / pageSize));

  // Fungsi scroll pagination
  const scrollLeft = () => {
    paginationRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    paginationRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  // Data untuk halaman aktif
  const pagedRows = normalizedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Tentukan warna background berdasarkan skor
  const skorBg = (skor) => {
    const num = Number(skor);
    if (num >= 4.5) return "bg-red-500 text-white";
    if (num >= 3.5) return "bg-orange-400 text-white";
    if (num >= 2.5) return "bg-yellow-400 text-black";
    if (num >= 1.5) return "bg-lime-400 text-black";
    if (num > 0) return "bg-green-500 text-white";
    return "bg-gray-100 text-gray-500";
  };

  // Hitung rata-rata skor per quarter untuk aspek
  const getQuarterAvg = (aspek, quarter) => {
    const list = aspek.pertanyaanList || [];
    if (list.length === 0) return "-";

    const skorValues = list
      .map((q) => {
        const skorValue = q.skor?.[quarter] || q.skor?.[quarter.toLowerCase()];
        if (skorValue !== "" && skorValue !== undefined && skorValue !== null) {
          const num = Number(skorValue);
          if (num >= 1 && num <= 5) return num;
        }
        return null;
      })
      .filter((v) => v !== null);

    if (skorValues.length === 0) return "-";

    const avg = skorValues.reduce((a, b) => a + b, 0) / skorValues.length;
    return avg.toFixed(2);
  };

  // Ambil semua rata-rata quarter untuk aspek (hanya yang dipilih)
  const getSelectedQuarterAvgs = (aspek) => {
    const result = {};
    selectedQuarters.forEach(quarter => {
      result[quarter] = getQuarterAvg(aspek, quarter);
    });
    return result;
  };

  // Hitung global summary per quarter dari semua aspek (hanya yang dipilih)
  const calculateGlobalSummary = () => {
    const summary = { Q1: [], Q2: [], Q3: [], Q4: [] };

    normalizedRows.forEach((aspek) => {
      ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
        const avg = getQuarterAvg(aspek, quarter);
        if (avg !== "-") {
          summary[quarter].push(Number(avg));
        }
      });
    });

    const result = {};
    selectedQuarters.forEach((quarter) => {
      if (summary[quarter].length === 0) {
        result[quarter] = "-";
      } else {
        const total = summary[quarter].reduce((a, b) => a + b, 0);
        result[quarter] = (total / summary[quarter].length).toFixed(2);
      }
    });

    return result;
  };

  const globalSummary = calculateGlobalSummary();

  // Handler zoom
  const handleZoomIn = () => setZoom((z) => Math.min(maxZoom, z + stepZoom));
  const handleZoomOut = () => setZoom((z) => Math.max(minZoom, z - stepZoom));
  const handleSliderChange = (e) => setZoom(Number(e.target.value));
  const handlePageClick = (page) => setCurrentPage(page);

  // Tampilkan pesan jika tidak ada data
  if (!Array.isArray(normalizedRows) || normalizedRows.length === 0) {
    return (
      <div className="flex items-center border rounded-xl justify-center gap-2 p-6 text-sm text-gray-500">
        <FileWarning />
        <span>Belum ada data untuk ditampilkan</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header dengan kontrol zoom dan tombol quarter */}
      <div className="flex justify-between mb-2 pr-2">
        <div>
          <h1 className="text-2xl font-semibold">Data Permodalan - KPMR</h1>
          <div className="text-sm text-gray-600">
            Quarter Aktif: <span className="font-bold bg-blue-100 px-2 py-1 rounded">{activeQuarter?.toUpperCase()}</span>
            <span className="ml-2 text-gray-500">•</span>
            <span className="ml-2">Tampilkan Quarter:</span>
            <span className="ml-2 font-medium">
              {hasSelectedQuarters ? selectedQuarters.join(", ") : "Tidak ada yang dipilih"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Tombol Quarter Selection */}
          <div className="flex items-center gap-1">
            <div className="flex flex-col">
              <div className="flex gap-1">
                {["Q1", "Q2", "Q3", "Q4"].map((quarter) => {
                  const isSelected = selectedQuarters.includes(quarter);
                  return (
                    <button
                      key={quarter}
                      type="button"
                      onClick={() => toggleQuarter(quarter)}
                      className={`h-8 w-8 flex items-center justify-center rounded-md border text-sm font-semibold transition-colors ${
                        isSelected 
                          ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700" 
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                      title={`Klik untuk ${isSelected ? 'sembunyikan' : 'tampilkan'} ${quarter}`}
                    >
                      {quarter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kontrol Zoom */}
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={handleZoomOut} 
              className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white text-xl font-bold shadow hover:bg-blue-800"
            >
              −
            </button>
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium mb-1">{zoom}%</span>
              <input 
                type="range" 
                min={minZoom} 
                max={maxZoom} 
                step={stepZoom} 
                value={zoom} 
                onChange={handleSliderChange} 
                className="w-40 accent-slate-700" 
              />
            </div>
            <button 
              type="button" 
              onClick={handleZoomIn} 
              className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white text-xl font-bold shadow hover:bg-blue-800"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Warning jika tidak ada quarter yang dipilih */}
      {!hasSelectedQuarters && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700">
            <FileWarning className="w-4 h-4" />
            <span className="text-sm font-medium">Tidak ada quarter yang dipilih. Silakan pilih minimal satu quarter untuk ditampilkan.</span>
          </div>
        </div>
      )}

      {/* Container tabel dengan zoom */}
      <div className="w-full overflow-auto border shadow">
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left", display: "block", width: "100%" }}>
          <table className="table-fixed text-sm w-full border-collapse">
            <colgroup>
              <col style={{ width: "3%" }} />
              <col style={{ width: "20%" }} />
              {hasSelectedQuarters && selectedQuarters.map((quarter) => (
                <col key={`col-${quarter}`} style={{ width: "4%" }} />
              ))}
              {!hasSelectedQuarters && <col style={{ width: "4%" }} />}
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>

            <thead>
              <tr>
                <th colSpan={2} className="border border-black px-2 py-2 bg-blue-900 text-white text-left">Kualitas Penerapan Manajemen Risiko</th>
                
                {/* Header untuk quarter yang dipilih */}
                {hasSelectedQuarters ? (
                  selectedQuarters.map((quarter) => (
                    <th key={quarter} className="border border-black px-2 py-2 bg-blue-900 text-white text-center">
                      {quarter}<br/>Skor
                    </th>
                  ))
                ) : (
                  <th className="border border-black px-2 py-2 bg-blue-900 text-white text-center">
                    Pilih Quarter
                  </th>
                )}
                
                <th colSpan={5} className="border border-black px-2 py-2 bg-blue-950 text-white text-center">Description Level</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white text-center">Evidence</th>
              </tr>
            </thead>

            <tbody>
              {pagedRows.map((aspek, ai) => {
                const list = aspek.pertanyaanList || [];
                const quarterAvgs = getSelectedQuarterAvgs(aspek);

                return (
                  <React.Fragment key={`aspek-${ai}`}>
                    {/* Baris header aspek */}
                    <tr className="bg-gray-100 font-semibold">
                      <td colSpan={2} className="border border-black px-2 py-2 align-top whitespace-normal break-words">
                        Aspek {aspek.nomor} : {aspek.judul} (Bobot: {aspek.bobot}%)
                      </td>

                      {/* Cell rata-rata per quarter yang dipilih */}
                      {hasSelectedQuarters ? (
                        selectedQuarters.map((quarter) => (
                          <td key={quarter} className={`border border-black px-2 py-2 text-center font-bold align-top ${quarterAvgs[quarter] !== "-" ? skorBg(quarterAvgs[quarter]) : ""}`}>
                            {quarterAvgs[quarter]}
                          </td>
                        ))
                      ) : (
                        <td className="border border-black px-2 py-2 text-center align-top">-</td>
                      )}

                      {/* Header indicator */}
                      <td className="border border-black px-2 py-2 bg-blue-950 text-white text-center">1 (Strong)</td>
                      <td className="border border-black px-2 py-2 bg-blue-950 text-white text-center">2 (Satisfactory)</td>
                      <td className="border border-black px-2 py-2 bg-blue-950 text-white text-center">3 (Fair)</td>
                      <td className="border border-black px-2 py-2 bg-blue-950 text-white text-center">4 (Marginal)</td>
                      <td className="border border-black px-2 py-2 bg-blue-950 text-white text-center">5 (Unsatisfactory)</td>
                      <td className="border border-black px-2 py-2 bg-blue-900 text-white text-center">Evidence</td>
                    </tr>

                    {/* Baris pertanyaan */}
                    {list.length === 0 ? (
                      <tr>
                        <td colSpan={hasSelectedQuarters ? selectedQuarters.length + 8 : 9} className="border px-2 py-2 text-center text-gray-400">
                          Belum ada pertanyaan
                        </td>
                      </tr>
                    ) : (
                      list.map((q, qi) => (
                        <tr key={`q-${ai}-${qi}`} className="hover:bg-gray-50">
                          <td className="border border-black px-2 py-2 text-center align-top">{q.nomor || qi + 1}</td>
                          <td className="border border-black px-2 py-2 align-top whitespace-normal break-words">{q.pertanyaan || "-"}</td>

                          {/* Cell skor per quarter yang dipilih */}
                          {hasSelectedQuarters ? (
                            selectedQuarters.map((quarter) => {
                              const skorValue = q.skor?.[quarter] || q.skor?.[quarter.toLowerCase()];
                              const hasSkor = skorValue !== "" && skorValue !== undefined && skorValue !== null;

                              return (
                                <td key={quarter} className={`border border-black px-2 py-2 text-center font-bold ${hasSkor ? skorBg(skorValue) : ""}`}>
                                  {hasSkor ? skorValue : "-"}
                                </td>
                              );
                            })
                          ) : (
                            <td className="border border-black px-2 py-2 text-center align-top">-</td>
                          )}

                          {/* Cell indicator */}
                          <td className="border border-black px-2 py-2 align-top whitespace-normal break-words text-center">{q.indicator?.strong || "-"}</td>
                          <td className="border border-black px-2 py-2 align-top whitespace-normal break-words text-center">{q.indicator?.satisfactory || "-"}</td>
                          <td className="border border-black px-2 py-2 align-top whitespace-normal break-words text-center">{q.indicator?.fair || "-"}</td>
                          <td className="border border-black px-2 py-2 align-top whitespace-normal break-words text-center">{q.indicator?.marginal || "-"}</td>
                          <td className="border border-black px-2 py-2 align-top whitespace-normal break-words text-center">{q.indicator?.unsatisfactory || "-"}</td>
                          <td className="border border-black px-2 py-2 align-top whitespace-normal break-words text-center">{q.evidence || "-"}</td>
                        </tr>
                      ))
                    )}
                  </React.Fragment>
                );
              })}

              {/* Baris global summary */}
              {hasSelectedQuarters && (
                <tr className="font-bold">
                  <td colSpan={2}>
                    <div className="border border-black px-2 py-2 text-center font-semibold text-white bg-blue-900">Summary</div>
                  </td>
                  {selectedQuarters.map((quarter) => {
                    const value = globalSummary[quarter];
                    const hasValue = value !== "-";
                    
                    return (
                      <td 
                        key={quarter} 
                        className={`border border-black px-2 py-2 text-center ${hasValue ? skorBg(value) : ""}`}
                      >
                        {hasValue ? value : "-"}
                      </td>
                    );
                  })}
                  <td colSpan={6} className="border border-white"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-3 flex justify-center items-center gap-2">
          {/* Tombol scroll kiri */}
          {totalPages > 7 && (
            <button
              type="button"
              onClick={scrollLeft}
              className="h-8 w-8 flex items-center justify-center rounded-md border bg-white text-blue-600 font-bold hover:bg-blue-500 hover:text-white"
            >
              <ArrowBigLeft className="w-4 h-4" />
            </button>
          )}

          {/* List halaman */}
          <div className="max-w-[420px] overflow-x-hidden">
            <div
              ref={paginationRef}
              className="flex gap-2 px-2 py-1 overflow-x-auto scroll-smooth"
            >
              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageClick(page)}
                    className={
                      "min-w-8 h-8 px-3 flex items-center justify-center rounded-md border text-sm font-semibold transition-colors duration-150 shrink-0 hover:bg-blue-900 hover:text-white " +
                      (isActive
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-gray-300 text-blue-600")
                    }
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tombol scroll kanan */}
          {totalPages > 7 && (
            <button
              type="button"
              onClick={scrollRight}
              className="h-8 w-8 flex items-center justify-center rounded-md border bg-white text-blue-600 font-bold hover:bg-blue-500 hover:text-white"
            >
              <ArrowBigRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Komponen utama halaman KPMR
export default function KpmrPage({ rows, setRows, search, onSaveData }) {
  const { activeQuarter } = useHeaderStore();

  // Filter baris berdasarkan pencarian
  const filteredRows = useMemo(() => {
    return rows.filter((aspek) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        aspek.judul?.toLowerCase().includes(s) ||
        aspek.nomor?.toString().includes(s) ||
        aspek.pertanyaanList?.some((q) =>
          q.pertanyaan?.toLowerCase().includes(s)
        )
      );
    });
  }, [rows, search]);

  return (
    <div className="w-[1600px] space-y-6">
      {/* Panel aspek untuk input data */}
      <AspekPanel 
        rows={rows} 
        setRows={setRows}  
        activeQuarter={activeQuarter}
        onSaveData={onSaveData}
      />

      {/* Tabel untuk menampilkan data */}
      <TableKpmr 
        rows={filteredRows} 
        activeQuarter={activeQuarter} 
      />
    </div>
  );
}