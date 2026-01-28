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

const IndicatorItem = React.memo(({ label, value, onChange, color, loading = false, editMode = false }) => (
  <div className="rounded-xl px-2 py-2 text-white" style={{ backgroundColor: color }}>
    <div className="text-base font-bold text-center mb-1">{label}</div>
    <Textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading || !editMode}
      placeholder="masukan deskripsi level"
      className="bg-white text-center text-black text-md min-h-[100px]"
    />
  </div>
));

IndicatorItem.displayName = "IndicatorItem";

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
  const [draftPertanyaan, setDraftPertanyaan] = useState(null);
  const dropdownPertanyaanBtnRef = useRef(null);
  const [dropdownPertanyaanRect, setDropdownPertanyaanRect] = useState(null);
  const dropdownPertanyaanListRef = useRef(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteContext, setDeleteContext] = useState({
    type: '',
    aspekIndex: null,
    pertanyaanIndex: null
  });

  const safeActivePertanyaanIndex = 
    activePertanyaanIndex !== null && 
    activePertanyaanIndex >= 0 && 
    activePertanyaanIndex < pertanyaanList.length 
      ? activePertanyaanIndex 
      : -1;

  // Fungsi untuk mendapatkan currentPertanyaan dengan aman
  const getCurrentPertanyaan = () => {
    if (editModePertanyaan && draftPertanyaan) {
      return draftPertanyaan;
    }
    
    if (safeActivePertanyaanIndex >= 0 && pertanyaanList[safeActivePertanyaanIndex]) {
      return pertanyaanList[safeActivePertanyaanIndex];
    }
    
    return draftPertanyaan || createEmptyPertanyaan();
  };

  const currentPertanyaan = getCurrentPertanyaan();
  
  const hasPertanyaan = Array.isArray(pertanyaanList) && pertanyaanList.length > 0;
  const [showPertanyaanForm, setShowPertanyaanForm] = useState(true);

  // Setup dropdown positioning when opened
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

  // Reset edit mode when active question changes
  useEffect(() => {
    setEditModePertanyaan(false);
    setOriginalPertanyaan(null);
    setDraftPertanyaan(null);
  }, [activePertanyaanIndex]);

  // PERUBAHAN PENTING: Otomatis masuk ke mode buat baru ketika pertama kali atau tidak ada pertanyaan dipilih
  useEffect(() => {
    // Jika tidak ada pertanyaan sama sekali di daftar, atau activePertanyaanIndex = -1
    if (!hasPertanyaan || activePertanyaanIndex === -1) {
      setEditModePertanyaan(true); // Otomatis masuk edit mode
      if (!draftPertanyaan) {
        setDraftPertanyaan(createEmptyPertanyaan()); // Buat draft kosong
      }
    }
  }, [hasPertanyaan, activePertanyaanIndex]);

  function createEmptyPertanyaan() {
    return {
      id: crypto.randomUUID(),
      nomor: "",
      pertanyaan: "",
      skor: {},
      indicator: {
        strong: "",
        satisfactory: "",
        fair: "",
        marginal: "",
        unsatisfactory: "",
      },
      evidence: "",
    };
  }

  // Format question label for dropdown display
  const formatPertanyaanLabel = useCallback((pertanyaan, index) => {
    if (!pertanyaan) return "Buat Pertanyaan Baru";
    
    const nomor = pertanyaan.nomor || (index + 1);
    const pertanyaanText = pertanyaan.pertanyaan || "Tanpa Pertanyaan";
    const copyText = pertanyaan.pertanyaan?.includes("(Copy)") ? " (Copy)" : "";
    
    return `${nomor} – ${pertanyaanText.substring(0, 50)}${pertanyaanText.length > 50 ? "..." : ""}${copyText}`;
  }, []);

  // Update draft pertanyaan saat dalam edit mode
  const handleChangeDraftPertanyaan = useCallback((path, value) => {
    if (!draftPertanyaan || !editModePertanyaan) return;
    
    const updatedDraft = { ...draftPertanyaan };
    const keys = path.split('.');
    let current = updatedDraft;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) current[key] = {};
      current = current[key];
    }
    
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
    
    setDraftPertanyaan(updatedDraft);
  }, [draftPertanyaan, editModePertanyaan]);

  // Update specific field in the active question (non-edit mode)
  const handleChangePertanyaanField = useCallback((path, value) => {
    if (aspekIndex === null || safeActivePertanyaanIndex === -1) return;

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

  // Update score for the active quarter
  const handleSkorChange = useCallback((value) => {
    if (aspekIndex === null || safeActivePertanyaanIndex === -1) return;

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

  // Update draft skor for the active quarter
  const handleDraftSkorChange = useCallback((value) => {
    if (!draftPertanyaan || !editModePertanyaan) return;

    const q = activeQuarter.toUpperCase();
    const updatedDraft = {
      ...draftPertanyaan,
      skor: {
        ...draftPertanyaan.skor,
        [q]: value,
      },
    };
    
    setDraftPertanyaan(updatedDraft);
  }, [draftPertanyaan, editModePertanyaan, activeQuarter]);

  // Enter question edit mode
  const handleEditPertanyaan = useCallback(() => {
    if (safeActivePertanyaanIndex === -1) return;
    
    const pertanyaan = pertanyaanList[safeActivePertanyaanIndex];
    setOriginalPertanyaan(structuredClone(pertanyaan));
    setDraftPertanyaan(structuredClone(pertanyaan));
    setEditModePertanyaan(true);
  }, [safeActivePertanyaanIndex, pertanyaanList]);

  // Add new question
  const handleAddNewPertanyaan = useCallback(() => {
    if (aspekIndex === null) return;

    const pertanyaanToAdd = draftPertanyaan || createEmptyPertanyaan();
    
    if (!pertanyaanToAdd.pertanyaan?.trim()) {
      alert("Pertanyaan tidak boleh kosong!");
      return;
    }
    
    const q = activeQuarter.toUpperCase();
    const skorValue = pertanyaanToAdd.skor?.[q];
    if (skorValue !== undefined && skorValue !== null && skorValue !== "") {
      const skorNum = Number(skorValue);
      if (isNaN(skorNum) || skorNum < 1 || skorNum > 5) {
        alert("Skor harus antara 1 dan 5!");
        return;
      }
    }

    const newPertanyaan = {
      ...pertanyaanToAdd,
      id: crypto.randomUUID(),
    };
    
    const updatedRows = rows.map((r, i) =>
      i === aspekIndex
        ? { 
            ...r, 
            pertanyaanList: [...(r.pertanyaanList || []), newPertanyaan] 
          }
        : r
    );

    setRows(updatedRows);

    const newIndex = (rows[aspekIndex]?.pertanyaanList || []).length;
    setActivePertanyaanIndex(newIndex);
    
    // SETELAH BERHASIL MENAMBAH, RESET KE DRAFT KOSONG UNTUK PERTANYAAN BARU BERIKUTNYA
    setEditModePertanyaan(true); // Tetap dalam edit mode
    setOriginalPertanyaan(null);
    setDraftPertanyaan(createEmptyPertanyaan()); // Reset ke draft kosong
    
    setTimeout(() => {
      if (typeof onSaveData === 'function') {
        const saveSuccess = onSaveData(updatedRows);
        if (!saveSuccess) {
          alert("⚠️ Pertanyaan berhasil ditambah tapi gagal disimpan!");
        }
      }
    }, 100);
  }, [aspekIndex, draftPertanyaan, rows, setRows, setActivePertanyaanIndex, activeQuarter, onSaveData]);

  // Save updated question
   // Save updated question
  const handleUpdatePertanyaan = useCallback(() => {
    if (aspekIndex === null || safeActivePertanyaanIndex === -1 || !draftPertanyaan) return;
    
    if (!draftPertanyaan.pertanyaan?.trim()) {
      alert("Pertanyaan tidak boleh kosong!");
      return;
    }

    const q = activeQuarter.toUpperCase();
    const skorValue = draftPertanyaan.skor?.[q];
    if (skorValue !== undefined && skorValue !== null && skorValue !== "") {
      const skorNum = Number(skorValue);
      if (isNaN(skorNum) || skorNum < 1 || skorNum > 5) {
        alert("Skor harus antara 1 dan 5!");
        return;
      }
    }

    setRows((prev) => {
      const updatedRows = prev.map((row, ri) => {
        if (ri !== aspekIndex) return row;
        
        return {
          ...row,
          pertanyaanList: (row.pertanyaanList || []).map((p, pi) =>
            pi === safeActivePertanyaanIndex ? draftPertanyaan : p
          ),
        };
      });
      
      // PERBAIKAN: Simpan ke storage setelah state diupdate
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          onSaveData(updatedRows);
        }
      }, 0);
      
      return updatedRows;
    });
    
    setEditModePertanyaan(false);
    setOriginalPertanyaan(null);
    setDraftPertanyaan(null);
  }, [aspekIndex, safeActivePertanyaanIndex, draftPertanyaan, activeQuarter, setRows, onSaveData]);

  // Cancel question editing
  const handleCancelEditPertanyaan = useCallback(() => {
    const confirmed = window.confirm(
      "Batalkan perubahan? Semua perubahan yang belum disimpan akan hilang."
    );
    
    if (!confirmed) return;
    
    if (originalPertanyaan && aspekIndex !== null && safeActivePertanyaanIndex >= 0) {
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
    setDraftPertanyaan(null);
  }, [originalPertanyaan, aspekIndex, safeActivePertanyaanIndex, setRows, onSaveData]);

  // Duplicate current question
  const handleCopyPertanyaan = useCallback(() => {
    if (aspekIndex === null || safeActivePertanyaanIndex === -1 || !currentPertanyaan) return;

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

    const newIndex = (rows[aspekIndex]?.pertanyaanList || []).length;
    setActivePertanyaanIndex(newIndex);
    setEditModePertanyaan(false);
    setOriginalPertanyaan(null);
    setDraftPertanyaan(null);
    
    setTimeout(() => {
      if (typeof onSaveData === 'function') {
        const saveSuccess = onSaveData(updatedRows);
        if (!saveSuccess) {
          alert("⚠️ Pertanyaan berhasil disalin tapi gagal disimpan!");
        }
      }
    }, 100);
  }, [aspekIndex, safeActivePertanyaanIndex, currentPertanyaan, rows, setRows, setActivePertanyaanIndex, onSaveData]);

  // Open delete confirmation dialog for question
  const handleOpenPertanyaanDeleteDialog = useCallback(() => {
    if (aspekIndex === null || safeActivePertanyaanIndex === -1 || !currentPertanyaan) return;
    
    // Dapatkan data aspek dari rows berdasarkan aspekIndex
    const aspekData = rows[aspekIndex];
    
    setItemToDelete({
      name: currentPertanyaan.pertanyaan || 'pertanyaan ini',
      nomor: currentPertanyaan.nomor || '-',
      judul: currentPertanyaan.pertanyaan || 'Tidak ada judul',
      aspekNomor: aspekData?.nomor || '-',
      aspekJudul: aspekData?.judul || '-'
    });
    setDeleteContext({
      type: 'pertanyaan',
      aspekIndex: aspekIndex,
      pertanyaanIndex: safeActivePertanyaanIndex
    });
    setDeleteDialogOpen(true);
  }, [aspekIndex, safeActivePertanyaanIndex, currentPertanyaan, rows]);

  // Handle delete confirmation
  const handleConfirmDelete = useCallback(() => {
    if (!itemToDelete || !deleteContext.type) return;

    setDeleteDialogOpen(false);
    
    if (deleteContext.type === 'pertanyaan') {
      const { aspekIndex, pertanyaanIndex } = deleteContext;
      
      if (aspekIndex === null || pertanyaanIndex === null) {
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
      
      const nextIndex = updatedRows[aspekIndex]?.pertanyaanList?.length > 0 
        ? Math.max(0, pertanyaanIndex - 1) 
        : -1;
      setActivePertanyaanIndex(nextIndex);
      
      setItemToDelete(null);
      setDeleteContext({ type: '', aspekIndex: null, pertanyaanIndex: null });
      
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          const saveSuccess = onSaveData(updatedRows);
          if (!saveSuccess) {
            console.error("⚠️ Pertanyaan berhasil dihapus tapi gagal menyimpan!");
          }
        }
      }, 100);
    }
    
    setItemToDelete(null);
    setDeleteContext({ type: '', aspekIndex: null, pertanyaanIndex: null });
  }, [itemToDelete, deleteContext, rows, setRows, setActivePertanyaanIndex, onSaveData]);

  // Clear question selection
  const handleClearPertanyaanSelection = useCallback(() => {
    setActivePertanyaanIndex(-1);
    setEditModePertanyaan(true);
    setOriginalPertanyaan(null);
    setDraftPertanyaan(createEmptyPertanyaan());
    setOpenPertanyaanList(false);
  }, []);

  const handleSelectPertanyaan = (index) => {
    setActivePertanyaanIndex(index);
    setOpenPertanyaanList(false);
    setEditModePertanyaan(false); // Keluar dari edit mode ketika memilih pertanyaan yang ada
    setOriginalPertanyaan(null);
    setDraftPertanyaan(null);
  };

  // Tentukan apakah field input harus disabled
  const isFieldDisabled = () => {
    if (loading) return true;
    
    // Jika tidak ada pertanyaan yang dipilih (membuat pertanyaan baru), field harus ENABLED
    if (safeActivePertanyaanIndex === -1) return false;
    
    // Jika dalam mode edit, field harus ENABLED
    if (editModePertanyaan) return false;
    
    // Default: disabled
    return true;
  };

  // Tentukan editMode untuk komponen child
  const isEditModeForComponents = editModePertanyaan || safeActivePertanyaanIndex === -1;

  // Tentukan config tombol utama
  const getMainButtonConfig = () => {
    // Jika edit mode DAN safeActivePertanyaanIndex = -1 (mode buat baru)
    if (editModePertanyaan && safeActivePertanyaanIndex === -1) {
      return {
        onClick: handleAddNewPertanyaan,
        title: "Tambah Pertanyaan Baru",
        icon: <Plus className="w-4 h-4" />,
        className: "bg-emerald-600 hover:bg-emerald-700"
      };
    }
    // Jika edit mode untuk pertanyaan yang sudah ada
    else if (editModePertanyaan) {
      return {
        onClick: handleUpdatePertanyaan,
        title: "Simpan Perubahan",
        icon: <Save className="w-4 h-4" />,
        className: "bg-green-600 hover:bg-green-700"
      };
    }
    // Default: tambah pertanyaan baru
    else {
      return {
        onClick: handleAddNewPertanyaan,
        title: "Tambah Pertanyaan Baru",
        icon: <Plus className="w-4 h-4" />,
        className: "bg-emerald-600 hover:bg-emerald-700"
      };
    }
  };

  const mainButtonConfig = getMainButtonConfig();

  return (
    <div className="w-full relative">
      <div className="bg-blue-700 text-white px-4 py-3 flex justify-between items-center border-t border-l border-r rounded-t-lg border-slate-700">
        <div className="text-2xl tracking-wider font-bold">Pertanyaan ({activeQuarter?.toUpperCase()})</div>
        <div className="flex items-center gap-2">
          {loading && (
            <div className="text-xs bg-slate-700 text-white px-2 py-1 rounded">
              Memproses...
            </div>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPertanyaanForm(!showPertanyaanForm)}
            className="bg-slate-900 text-white hover:bg-slate-800 text-md px-3 border border-black"
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

          {safeActivePertanyaanIndex >= 0 && hasPertanyaan && !editModePertanyaan && (
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
              className={`h-9 w-9 rounded-full ${mainButtonConfig.className}`}
              onClick={mainButtonConfig.onClick}
              title={mainButtonConfig.title}
              disabled={loading}
            >
              {mainButtonConfig.icon}
            </Button>

            {!editModePertanyaan && safeActivePertanyaanIndex >= 0 && hasPertanyaan && (
              <Button
                size="icon"
                className="h-9 w-9 rounded-full bg-amber-600 hover:bg-amber-700"
                onClick={handleCopyPertanyaan}
                disabled={loading}
                title="Salin Pertanyaan"
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}

            {!editModePertanyaan && safeActivePertanyaanIndex >= 0 && hasPertanyaan && (
              <Button
                size="icon"
                className="h-9 w-9 rounded-full bg-rose-600 hover:bg-rose-700"
                onClick={handleOpenPertanyaanDeleteDialog}
                disabled={loading}
                title="Hapus Pertanyaan"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {showPertanyaanForm && (
        <div className="bg-blue-700 text-white px-4 pb-4 border-b border-l border-r border-slate-700 space-y-3 rounded-b-lg">
          <div className="w-full bg-slate-200 rounded-lg p-0.5" />

          <div className="mt-3">
            <label className="font-semibold text-base tracking-wide ml-1 text-white">
              Pilih Pertanyaan
            </label>
            <button
              ref={dropdownPertanyaanBtnRef}
              onClick={() => setOpenPertanyaanList((v) => !v)}
              className="w-full mt-1 bg-white text-md text-slate-800 px-3 py-2 rounded-md flex justify-between border border-slate-300 hover:bg-slate-50"
              disabled={loading || !hasPertanyaan}
            >
              <span className="truncate">
                {safeActivePertanyaanIndex >= 0 && hasPertanyaan 
                  ? formatPertanyaanLabel(currentPertanyaan, safeActivePertanyaanIndex) 
                  : "Buat Pertanyaan Baru"}
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
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 border-b border-slate-200 text-slate-600 bg-blue-50"
                  >
                     Buat Pertanyaan Baru
                  </button>

                  {hasPertanyaan && pertanyaanList.map((pertanyaan, idx) => (
                    <button
                      key={pertanyaan.id ?? idx}
                      onClick={() => handleSelectPertanyaan(idx)}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 ${
                        idx === safeActivePertanyaanIndex ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700"
                      }`}
                    >
                      {formatPertanyaanLabel(pertanyaan, idx)}
                    </button>
                  ))}
                </div>,
                document.body
              )}
          </div>

          {/* Tampilkan form ketika dalam mode buat baru atau ada pertanyaan yang dipilih */}
          {(editModePertanyaan || safeActivePertanyaanIndex >= 0) && (
            <>
              <div className="flex gap-2 text-slate-800 mt-3">
                <div className="w-[5%]">
                  <label className="text-white text-base tracking-wide ml-1 font-semibold">Nomor</label>
                  <Input
                    className="bg-white h-8 border-slate-300"
                    value={currentPertanyaan?.nomor ?? ""}
                    onChange={(e) => 
                      isEditModeForComponents
                        ? handleChangeDraftPertanyaan("nomor", e.target.value)
                        : handleChangePertanyaanField("nomor", e.target.value)
                    }
                    disabled={isFieldDisabled()}
                    placeholder="1 - 5"
                  />
                </div>

                <div className="w-[8%]">
                  <label className="text-white text-base tracking-wide ml-1 font-semibold">Skor untuk {activeQuarter?.toUpperCase()}</label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    step="1"
                    className="bg-white h-8 text-slate-800 border-slate-300"
                    value={currentPertanyaan?.skor?.[activeQuarter.toUpperCase()] ?? ""}
                    onChange={(e) => 
                      isEditModeForComponents
                        ? handleDraftSkorChange(e.target.value)
                        : handleSkorChange(e.target.value)
                    }
                    disabled={isFieldDisabled()}
                    placeholder="masukan skor"
                  />
                </div>

                <div className="w-[87%]">
                  <label className="text-white text-base tracking-wide ml-1 font-semibold">Pertanyaan</label>
                  <Input
                    className="bg-white h-8 border-slate-300"
                    value={currentPertanyaan?.pertanyaan ?? ""}
                    onChange={(e) => 
                      isEditModeForComponents
                        ? handleChangeDraftPertanyaan("pertanyaan", e.target.value)
                        : handleChangePertanyaanField("pertanyaan", e.target.value)
                    }
                    disabled={isFieldDisabled()}
                    placeholder="masukan pertanyaan"
                  />
                </div>
              </div>

              <div>
                <div className="font-bold text-lg py-2 text-white">Description Level</div>
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
                      value={currentPertanyaan?.indicator?.[key] ?? ""}
                      onChange={(v) => 
                        isEditModeForComponents
                          ? handleChangeDraftPertanyaan(`indicator.${key}`, v)
                          : handleChangePertanyaanField(`indicator.${key}`, v)
                      }
                      loading={loading}
                      editMode={isEditModeForComponents}
                    />
                  ))}
                </div>
              </div>

              <div className="text-slate-800">
                <label className="text-white text-base tracking-wide ml-1 font-semibold">Evidence</label>
                <Textarea
                  className="bg-white min-h-[60px] border-slate-300"
                  value={currentPertanyaan?.evidence ?? ""}
                  onChange={(e) => 
                    isEditModeForComponents
                      ? handleChangeDraftPertanyaan("evidence", e.target.value)
                      : handleChangePertanyaanField("evidence", e.target.value)
                  }
                  disabled={isFieldDisabled()}
                  placeholder="masukan penjelasan"
                />
              </div>
            </>
          )}
        </div>
      )}

      {!showPertanyaanForm && (
        <div className="w-full" />
      )}

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

function AspekPanel({ rows = [], setRows, activeQuarter, onSaveData }) {
  const [activeAspekIndex, setActiveAspekIndex] = useState(-1);
  const [activePertanyaanIndex, setActivePertanyaanIndex] = useState(-1);
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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteContext, setDeleteContext] = useState({
    type: '',
    aspekIndex: null,
    pertanyaanIndex: null
  });

  const normalizedRows = useMemo(() => normalizeKpmrRows(rows), [rows]);

  const safeActiveAspekIndex =
    activeAspekIndex !== null && activeAspekIndex >= 0 && activeAspekIndex < normalizedRows.length
      ? activeAspekIndex
      : -1;

  const safeActiveAspek = safeActiveAspekIndex >= 0 ? normalizedRows[safeActiveAspekIndex] : null;
  
  // PERBAIKAN: Fungsi untuk mendapatkan data aspek dengan aman
  const getAspekData = () => {
    if (editModeAspek) {
      return draftAspek;
    }
    
    if (safeActiveAspek) {
      return {
        nomor: safeActiveAspek.nomor ?? "",
        judul: safeActiveAspek.judul ?? "",
        bobot: safeActiveAspek.bobot ?? "",
      };
    }
    
    return draftAspek;
  };

  const aspek = getAspekData();

  // PERUBAHAN PENTING: Otomatis masuk ke mode buat baru ketika pertama kali atau tidak ada aspek dipilih
  useEffect(() => {
    // Jika tidak ada aspek sama sekali di daftar, atau activeAspekIndex = -1
    if (rows.length === 0 || activeAspekIndex === -1) {
      setEditModeAspek(true); // Otomatis masuk edit mode
      if (!draftAspek.nomor && !draftAspek.judul && !draftAspek.bobot) {
        setDraftAspek({ nomor: "", judul: "", bobot: "" }); // Pastikan draft kosong
      }
    }
  }, [rows.length, activeAspekIndex]);

  // Setup dropdown positioning for aspect selection
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

  // Reset question selection when aspect changes
  useEffect(() => {
    setActivePertanyaanIndex(-1);
    setEditModePertanyaan(false);
  }, [safeActiveAspekIndex]);

  // Sync draft aspect with active aspect data
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

  // Format aspect label for dropdown display
  const formatAspekLabel = useCallback((row, index) => {
    if (!row) return "Buat Aspek Baru";
    return `${row.nomor || ''} – ${row.judul || ''} (Bobot: ${row.bobot || ''}%)`;
  }, []);

  // Update aspect field in draft
  const handleChangeAspek = useCallback((key, value) => {
    setDraftAspek((p) => ({ ...p, [key]: value }));
  }, []);

  // Validate aspect completeness
  const isAspekIncomplete = useCallback((aspekData) => {
    return !aspekData?.judul?.trim() || Number(aspekData?.bobot) <= 0;
  }, []);

  // Add new aspect
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
      
      const updatedRows = [...rows, newAspek];
      
      setRows(updatedRows);
      
      const newIndex = updatedRows.length - 1;
      setActiveAspekIndex(newIndex);
      setActivePertanyaanIndex(-1);
      setEditModePertanyaan(true); // Otomatis aktifkan edit mode untuk pertanyaan
      
      // SETELAH BERHASIL MENAMBAH, RESET KE DRAFT KOSONG UNTUK ASPEK BARU BERIKUTNYA
      setEditModeAspek(true); // Tetap dalam edit mode
      setOriginalAspek(null);
      setDraftAspek({ nomor: "", judul: "", bobot: "" });
      
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          try {
            const saveSuccess = onSaveData(updatedRows);
            
            if (!saveSuccess) {
              alert("⚠️ Aspek berhasil ditambah tapi gagal disimpan ke storage!");
            }
          } catch (error) {
            console.error("Error saving data:", error);
            alert("⚠️ Error saat menyimpan data!");
          }
        }
        setLoading(false);
      }, 150);
    } catch (error) {
      console.error("Error adding aspek:", error);
      alert("❌ Gagal menambah aspek.");
      setLoading(false);
    }
  }, [draftAspek, isAspekIncomplete, rows, setRows, onSaveData]);

  // Save updated aspect
  const handleUpdateAspek = useCallback(() => {
    if (safeActiveAspekIndex === -1) return;
    
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
      setDraftAspek({ nomor: "", judul: "", bobot: "" });
      
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          const success = onSaveData(updatedRows);
          if (!success) {
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

  // Enter aspect edit mode
  const handleEditAspek = useCallback(() => {
    if (safeActiveAspekIndex === -1) return;
    
    const aspekData = rows[safeActiveAspekIndex];
    setOriginalAspek(structuredClone(aspekData));
    
    setDraftAspek({
      nomor: aspekData.nomor ?? "",
      judul: aspekData.judul ?? "",
      bobot: aspekData.bobot ?? "",
    });
    
    setEditModeAspek(true);
  }, [safeActiveAspekIndex, rows]);

  // Cancel aspect editing
  const handleCancelEditAspek = useCallback(() => {
    const confirmed = window.confirm(
      "Batalkan perubahan? Semua perubahan yang belum disimpan akan hilang."
    );
    
    if (!confirmed) return;
    
    if (originalAspek && safeActiveAspekIndex >= 0) {
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

  // Duplicate current aspect
  const handleCopyAspek = useCallback(() => {
    if (safeActiveAspekIndex === -1) return;

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
      setActivePertanyaanIndex(-1);
      setEditModeAspek(false);
      setOriginalAspek(null);
      setDraftAspek({ nomor: "", judul: "", bobot: "" });
      
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          const saveSuccess = onSaveData(updatedRows);
          if (!saveSuccess) {
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

  // Open delete confirmation dialog for aspect
  const handleOpenAspekDeleteDialog = useCallback(() => {
    if (safeActiveAspekIndex === -1) return;

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

  // Handle aspect deletion confirmation
  const handleConfirmDeleteAspek = useCallback(() => {
    if (!itemToDelete || !deleteContext.type) return;

    setDeleteDialogOpen(false);
    
    if (deleteContext.type === 'aspek') {
      const { aspekIndex } = deleteContext;
      
      if (aspekIndex === null) {
        return;
      }
      
      const updatedRows = rows.filter((_, idx) => idx !== aspekIndex);
      
      setRows(updatedRows);
      
      const nextIndex = updatedRows.length > 0 ? 0 : -1;
      setActiveAspekIndex(nextIndex);
      setActivePertanyaanIndex(-1);
      setEditModeAspek(nextIndex === -1); // Jika tidak ada aspek, masuk edit mode
      setOriginalAspek(null);
      setDraftAspek({ nomor: "", judul: "", bobot: "" });
      
      setItemToDelete(null);
      setDeleteContext({ type: '', aspekIndex: null, pertanyaanIndex: null });
      
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          const saveSuccess = onSaveData(updatedRows);
          if (!saveSuccess) {
            console.error("⚠️ Aspek berhasil dihapus tapi gagal menyimpan!");
          }
        }
      }, 100);
    }
    
    setItemToDelete(null);
    setDeleteContext({ type: '', aspekIndex: null, pertanyaanIndex: null });
  }, [itemToDelete, deleteContext, rows, setRows, setActiveAspekIndex, onSaveData]);

  // Clear aspect selection
  const handleClearAspekSelection = useCallback(() => {
    setActiveAspekIndex(-1);
    setActivePertanyaanIndex(-1);
    setEditModeAspek(true); // Otomatis masuk edit mode
    setEditModePertanyaan(true);
    setOriginalAspek(null);
    setDraftAspek({ nomor: "", judul: "", bobot: "" });
    setOpenAspekList(false);
  }, []);

  const handleSelectAspek = (index) => {
    setActiveAspekIndex(index);
    setOpenAspekList(false);
    setEditModeAspek(false); // Keluar dari edit mode ketika memilih aspek yang ada
    setOriginalAspek(null);
    setDraftAspek({ nomor: "", judul: "", bobot: "" });
  };

  // Tentukan apakah field input harus disabled
  const isFieldDisabled = () => {
    if (loading) return true;
    
    // Jika tidak ada aspek yang dipilih (membuat aspek baru), field harus ENABLED
    if (safeActiveAspekIndex === -1) return false;
    
    // Jika dalam mode edit, field harus ENABLED
    if (editModeAspek) return false;
    
    // Default: disabled
    return true;
  };

  // Tentukan config tombol utama
  const getMainButtonConfig = () => {
    // Jika edit mode DAN safeActiveAspekIndex = -1 (mode buat baru)
    if (editModeAspek && safeActiveAspekIndex === -1) {
      return {
        onClick: handleAddNewAspek,
        title: "Tambah Aspek Baru",
        icon: <Plus className="w-4 h-4" />,
        className: "bg-emerald-600 hover:bg-emerald-700"
      };
    }
    // Jika edit mode untuk aspek yang sudah ada
    else if (editModeAspek) {
      return {
        onClick: handleUpdateAspek,
        title: "Simpan Perubahan",
        icon: <Save className="w-4 h-4" />,
        className: "bg-green-600 hover:bg-green-700"
      };
    }
    // Default: tambah aspek baru
    else {
      return {
        onClick: handleAddNewAspek,
        title: "Tambah Aspek Baru",
        icon: <Plus className="w-4 h-4" />,
        className: "bg-emerald-600 hover:bg-emerald-700"
      };
    }
  };

  const mainButtonConfig = getMainButtonConfig();

  return (
    <div className="w-full space-y-3">
      <div className="bg-blue-700 text-white px-4 py-3 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl tracking-wider font-bold">Aspek</h2>
          <div className="flex items-center gap-2">
            {loading && (
              <div className="text-xs bg-slate-700 text-white px-2 py-1 rounded">
                Memproses...
              </div>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAspekForm(!showAspekForm)}
              className="bg-slate-900 text-white hover:bg-slate-800 text-md px-3 border border-black"
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

            {safeActiveAspekIndex >= 0 && !editModeAspek && (
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
              onClick={mainButtonConfig.onClick}
              className={mainButtonConfig.className}
              disabled={loading}
              title={mainButtonConfig.title}
            >
              {mainButtonConfig.icon}
            </Button>

            {!editModeAspek && safeActiveAspekIndex >= 0 && (
              <Button
                size="icon"
                onClick={handleCopyAspek}
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-700"
                title="Salin Aspek"
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}

            {!editModeAspek && safeActiveAspekIndex >= 0 && (
              <Button 
                size="icon" 
                onClick={handleOpenAspekDeleteDialog} 
                disabled={loading} 
                className="bg-rose-600 hover:bg-rose-700"
                title="Hapus Aspek"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        
        
        {showAspekForm && (
          <>
          <div className="w-full bg-slate-200 rounded-lg p-0.5 mt-2" />
            <div className="w-full flex gap-2 mt-3">
              <div className="w-[10%]">
                <label className="font-semibold text-md tracking-wide ml-1 text-white">No</label>
                <Input
                  placeholder="No"
                  value={aspek.nomor}
                  onChange={(e) => handleChangeAspek("nomor", e.target.value)}
                  className="bg-white text-slate-950 border-slate-300"
                  disabled={isFieldDisabled()}
                />
              </div>

              <div className="w-[10%]">
                <label className="font-semibold text-md tracking-wid ml-1 text-white">Bobot</label>
                <Input
                  type="number"
                  placeholder="max 100%"
                  min="0"
                  max="100"
                  step="0.01"
                  value={aspek.bobot}
                  onChange={(e) => handleChangeAspek("bobot", e.target.value)}
                  className="bg-white text-slate-950 border-slate-300"
                  disabled={isFieldDisabled()}
                />
              </div>

              <div className="w-[80%]">
                <label className="font-semibold text-md tracking-wid ml-1 text-white">Aspek</label>
                <Input
                  placeholder="masukan aspek"
                  value={aspek.judul}
                  onChange={(e) => handleChangeAspek("judul", e.target.value)}
                  className="bg-white text-slate-950 border-slate-300"
                  disabled={isFieldDisabled()}
                />
              </div>
            </div>

          <div className="mt-3">
           <label className="font-semibold text-normal tracking-wide ml-1 mb-1 text-white">
                Pilih Aspek
              </label>
            <button
              ref={dropdownAspekBtnRef}
              onClick={() => setOpenAspekList((v) => !v)}
              className="w-full  bg-white text-slate-800 px-3 py-2  rounded-md text-md flex justify-between border border-slate-300 hover:bg-slate-50"
              disabled={loading}
            >
              <span className="truncate text-md">
                {safeActiveAspekIndex >= 0 && safeActiveAspek
                  ? formatAspekLabel(safeActiveAspek, safeActiveAspekIndex) 
                  : "Buat Aspek Baru"}
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
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 border-b border-slate-200 text-slate-600 text-md bg-blue-50"
                    disabled={loading}
                  >
                    ← Buat Aspek Baru
                  </button>

                  {normalizedRows.map((row, idx) => (
                    <button
                      key={row.id}
                      onClick={() => handleSelectAspek(idx)}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 ${
                        idx === safeActiveAspekIndex ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700"
                      } text-md`}
                      disabled={loading}
                    >
                      {formatAspekLabel(row, idx)}
                    </button>
                  ))}
                </div>,
                document.body
              )}
          </div>
          </>
        )}

        {!showAspekForm && (
          <div className="w-full" />
        )}
      </div>

      {/* Tampilkan PertanyaanPanel ketika ada aspek yang aktif */}
      {safeActiveAspekIndex >= 0 && safeActiveAspek && (
        <PertanyaanPanel
          aspekIndex={safeActiveAspekIndex}
          pertanyaanList={safeActiveAspek.pertanyaanList || []}
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

      {/* Tampilkan pesan ketika dalam mode buat aspek baru (tanpa aspek aktif) */}
      {safeActiveAspekIndex === -1 && editModeAspek && (
        <div className="w-full bg-slate-100 rounded-lg p-4 text-center text-slate-500">
          <p className="text-sm">Tambahkan aspek terlebih dahulu untuk mengelola pertanyaan.</p>
        </div>
      )}

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
  const [selectedQuarters, setSelectedQuarters] = useState(["Q1", "Q2", "Q3", "Q4"]);
  const paginationRef = useRef(null);

  const minZoom = 100;
  const maxZoom = 125;
  const stepZoom = 5;
  const pageSize = 7;

  const normalizedRows = useMemo(() => normalizeKpmrRows(rows), [rows]);

  // Toggle quarter selection for display
  const toggleQuarter = (quarter) => {
    setSelectedQuarters(prev => {
      if (prev.includes(quarter)) {
        return prev.filter(q => q !== quarter);
      } else {
        return [...prev, quarter];
      }
    });
  };

  const selectAllQuarters = () => {
    setSelectedQuarters(["Q1", "Q2", "Q3", "Q4"]);
  };

  const clearAllQuarters = () => {
    setSelectedQuarters([]);
  };

  const allQuartersSelected = selectedQuarters.length === 4;
  const hasSelectedQuarters = selectedQuarters.length > 0;
  const totalPages = Math.max(1, Math.ceil(normalizedRows.length / pageSize));

  const scrollLeft = () => {
    paginationRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    paginationRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const pagedRows = normalizedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Determine background color based on score value
  const skorBg = (skor) => {
    const num = Number(skor);
    if (num >= 4.5) return "bg-red-500 text-white";
    if (num >= 3.5) return "bg-orange-400 text-white";
    if (num >= 2.5) return "bg-yellow-400 text-black";
    if (num >= 1.5) return "bg-lime-400 text-black";
    if (num > 0) return "bg-green-500 text-white";
    return "bg-gray-100 text-gray-500";
  };

  // Calculate average score per quarter for an aspect
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

  // Get averages for selected quarters only
  const getSelectedQuarterAvgs = (aspek) => {
    const result = {};
    selectedQuarters.forEach(quarter => {
      result[quarter] = getQuarterAvg(aspek, quarter);
    });
    return result;
  };

  // Calculate global summary across all aspects for selected quarters
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

  const handleZoomIn = () => setZoom((z) => Math.min(maxZoom, z + stepZoom));
  const handleZoomOut = () => setZoom((z) => Math.max(minZoom, z - stepZoom));
  const handleSliderChange = (e) => setZoom(Number(e.target.value));
  const handlePageClick = (page) => setCurrentPage(page);

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
      <div className="flex justify-between mb-2 pr-2">
        <div>
          <h1 className="text-2xl font-semibold">Data Likuiditas Produk - Kualitas Penerapan Manajemen Risiko</h1>
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

      {!hasSelectedQuarters && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700">
            <FileWarning className="w-4 h-4" />
            <span className="text-sm font-medium">Tidak ada quarter yang dipilih. Silakan pilih minimal satu quarter untuk ditampilkan.</span>
          </div>
        </div>
      )}

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
                    <tr className="bg-gray-100 font-semibold">
                      <td colSpan={2} className="border border-black px-2 py-2 align-top whitespace-normal break-words">
                        Aspek {aspek.nomor} : {aspek.judul} (Bobot: {aspek.bobot}%)
                      </td>

                      {hasSelectedQuarters ? (
                        selectedQuarters.map((quarter) => (
                          <td key={quarter} className={`border border-black px-2 py-2 text-center font-bold align-top ${quarterAvgs[quarter] !== "-" ? skorBg(quarterAvgs[quarter]) : ""}`}>
                            {quarterAvgs[quarter]}
                          </td>
                        ))
                      ) : (
                        <td className="border border-black px-2 py-2 text-center align-top">-</td>
                      )}

                      <td className="border border-black px-2 py-2 bg-blue-950 text-white text-center">1 (Strong)</td>
                      <td className="border border-black px-2 py-2 bg-blue-950 text-white text-center">2 (Satisfactory)</td>
                      <td className="border border-black px-2 py-2 bg-blue-950 text-white text-center">3 (Fair)</td>
                      <td className="border border-black px-2 py-2 bg-blue-950 text-white text-center">4 (Marginal)</td>
                      <td className="border border-black px-2 py-2 bg-blue-950 text-white text-center">5 (Unsatisfactory)</td>
                      <td className="border border-black px-2 py-2 bg-blue-900 text-white text-center">Evidence</td>
                    </tr>

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

      {totalPages > 1 && (
        <div className="mt-3 flex justify-center items-center gap-2">
          {totalPages > 7 && (
            <button
              type="button"
              onClick={scrollLeft}
              className="h-8 w-8 flex items-center justify-center rounded-md border bg-white text-blue-600 font-bold hover:bg-blue-500 hover:text-white"
            >
              <ArrowBigLeft className="w-4 h-4" />
            </button>
          )}

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

export default function KpmrPage({ rows, setRows, search, onSaveData }) {
  const { activeQuarter } = useHeaderStore();

  // Filter rows based on search input
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
    <div className="w-full space-y-6">
      <AspekPanel 
        rows={rows} 
        setRows={setRows}  
        activeQuarter={activeQuarter}
        onSaveData={onSaveData}
      />

      <TableKpmr 
        rows={filteredRows} 
        activeQuarter={activeQuarter} 
      />
    </div>
  );
}