import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { useHeaderStore } from "../../../store/headerStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Copy, TriangleAlert, X, FileWarning, ArrowBigLeftDash, ArrowBigRightDash, ChevronDown, ChevronUp, Edit, Save } from "lucide-react";
import { useDropdownPortal } from "@/features/Dashboard/pages/RiskProfile-OJK/hooks/useDropdownPortal";
import { computeDerived } from "@/features/Dashboard/pages/RiskProfile-OJK/utils/compute/computeDerived";
import { createParameter } from "../../../utils/factory/createParameter";
import { createNilai } from "../../../utils/factory/createNilai";
import PopUpDelete from "../../../components/PopUp/PopUpDelete";

// main page
export default function InherentPage({
  rows,
  setRows,
  search,
  active,
  onSaveData,
}) {
  const { activeQuarter } = useHeaderStore();
  
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        row.judul?.toLowerCase().includes(s) ||
        row.nomor?.toString().includes(s)
      );
    });
  }, [rows, search]);

  return (
    <div className="w-full space-y-6">
      <ParameterPanel rows={rows} setRows={setRows} active={active} onSaveData={onSaveData}/>
      <TableInherent rows={filteredRows} activeQuarter={activeQuarter} />
    </div>
  );
}

//komponent parameter panel
function ParameterPanel({ rows, setRows, active, onSaveData }) {
  const [activeParamIndex, setActiveParamIndex] = useState(null);
  const [activeNilaiIndex, setActiveNilaiIndex] = useState(-1);
  const [showParameterForm, setShowParameterForm] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [editMode, setEditMode] = useState(false);
  const [originalParameter, setOriginalParameter] = useState(null);
  const [draftParameter, setDraftParameter] = useState(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteContext, setDeleteContext] = useState({
    type: '',
    paramIndex: null,
    nilaiIndex: null
  });

  const [openUnderlying, setOpenUnderlying] = useState(false);
  const [openParamList, setOpenParamList] = useState(false);
  const dropdownBtnRef = useRef(null);
  const [dropdownRect, setDropdownRect] = useState(null);
  const dropdownListRef = useRef(null);

  useEffect(() => {
    if (!openParamList || !dropdownBtnRef.current) return;

    const updatePosition = () => {
      const rect = dropdownBtnRef.current.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [openParamList]);

  useDropdownPortal({
    open: openParamList,
    setOpen: setOpenParamList,
    triggerRef: dropdownBtnRef,
    containerRef: dropdownListRef,
  });

  useEffect(() => {
    if (!active) setOpenParamList(false);
  }, [active]);

  const safeActiveParamIndex =
    activeParamIndex !== null &&
    activeParamIndex >= 0 &&
    activeParamIndex < rows.length
      ? activeParamIndex
      : null;

  const safeActiveParam =
    safeActiveParamIndex !== null ? rows[safeActiveParamIndex] : null;

  // Reset draft ketika parameter berubah di luar edit mode
  useEffect(() => {
    if (!editMode && safeActiveParam) {
      setDraftParameter(null);
      setOriginalParameter(null);
    }
  }, [safeActiveParamIndex, editMode]);

  function createEmptyParameter() {
    return {
      nomor: "",
      judul: "",
      bobot: "",
      kategori: {
        model: "",
        prinsip: "",
        jenis: "",
        underlying: [],
      },
    };
  }

  useEffect(() => {
    if (safeActiveParam && !editMode) {
      setDraftParameter({
        nomor: safeActiveParam.nomor ?? "",
        judul: safeActiveParam.judul ?? "",
        bobot: safeActiveParam.bobot ?? "",
        kategori: {
          model: safeActiveParam.kategori?.model ?? "",
          prinsip: safeActiveParam.kategori?.prinsip ?? "",
          jenis: safeActiveParam.kategori?.jenis ?? "",
          underlying: Array.isArray(safeActiveParam.kategori?.underlying)
            ? safeActiveParam.kategori.underlying
            : [],
        },
      });
    } else if (!safeActiveParam && !editMode) {
      setDraftParameter(createEmptyParameter());
      setEditMode(false);
      setOriginalParameter(null);
    }
  }, [safeActiveParam, editMode]);

  const currentParameter = draftParameter || createEmptyParameter();

  // Handler untuk update kategori pada draft
  const handleChangeKategori = useCallback((key, value) => {
    if (!draftParameter) return;
    
    setDraftParameter(prev => {
      if (!prev) return createEmptyParameter();
      
      const updatedDraft = { ...prev };
      
      if (key === "model") {
        updatedDraft.kategori = {
          ...updatedDraft.kategori,
          model: value,
        };

        if (value === "open_end") {
          updatedDraft.kategori.underlying = [];
        }
        if (value === "terstruktur") {
          updatedDraft.kategori.jenis = "";
        }
      } else {
        updatedDraft.kategori = {
          ...updatedDraft.kategori,
          [key]: value,
        };
      }

      return updatedDraft;
    });
  }, [draftParameter]);

  // Handler untuk update field parameter pada draft
  const handleChangeParameter = useCallback((key, value) => {
    if (!draftParameter) return;
    
    setDraftParameter(prev => ({ 
      ...prev || createEmptyParameter(), 
      [key]: value 
    }));
  }, [draftParameter]);

  const isKategoriIncomplete = useCallback((param) => {
    const k = param?.kategori || {};
    
    if (k.model === "tanpa_model") {
      return false;
    }
    
    if (!k.model || !k.prinsip) return true;
    
    if (k.model === "open_end" && !k.jenis) return true;
    
    if (
      k.model === "terstruktur" &&
      (!Array.isArray(k.underlying) || k.underlying.length === 0)
    ) {
      return true;
    }
    
    return false;
  }, []);

  const saveDataToStorage = useCallback(() => {
    if (typeof onSaveData === 'function') {
      return onSaveData();
    } else if (typeof window !== 'undefined' && typeof window.saveInherentData === 'function') {
      try {
        const success = window.saveInherentData();
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

  // Aktifkan edit mode untuk parameter yang sedang dipilih
  const handleEditParam = useCallback(() => {
    if (safeActiveParamIndex === null) return;
    
    const param = rows[safeActiveParamIndex];
    setOriginalParameter(structuredClone(param));
    setDraftParameter({
      nomor: param.nomor ?? "",
      judul: param.judul ?? "",
      bobot: param.bobot ?? "",
      kategori: {
        model: param.kategori?.model ?? "",
        prinsip: param.kategori?.prinsip ?? "",
        jenis: param.kategori?.jenis ?? "",
        underlying: Array.isArray(param.kategori?.underlying)
          ? param.kategori.underlying
          : [],
      },
    });
    setEditMode(true);
  }, [safeActiveParamIndex, rows]);

  // Update parameter dengan data dari draft
  const handleUpdateParam = useCallback(() => {
    if (!draftParameter || safeActiveParamIndex === null || !editMode) {
      return;
    }
    
    if (isKategoriIncomplete(draftParameter)) {
      alert("Lengkapi kategori sebelum mengupdate parameter.");
      return;
    }

    const bobotNum = Number(draftParameter.bobot);
    if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
      alert("Bobot harus antara 0 dan 100.");
      return;
    }

    if (!draftParameter.judul.trim()) {
      alert("Judul parameter tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      const updatedParam = {
        ...rows[safeActiveParamIndex],
        nomor: draftParameter.nomor || "-",
        judul: draftParameter.judul.trim(),
        bobot: bobotNum,
        kategori: {
          model: draftParameter.kategori.model || "",
          prinsip: draftParameter.kategori.prinsip || "",
          jenis: draftParameter.kategori.jenis || "",
          underlying: Array.isArray(draftParameter.kategori.underlying)
            ? draftParameter.kategori.underlying
            : [],
        },
      };

      setRows((prev) => 
        prev.map((row, idx) => 
          idx === safeActiveParamIndex ? updatedParam : row
        )
      );
      
      setEditMode(false);
      setOriginalParameter(null);
      setDraftParameter(null);
      
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          const success = onSaveData();
          
          if (!success) {
            alert("❌ Parameter berhasil diupdate tapi gagal disimpan!");
          }
          
          setLoading(false);
        }
      }, 100);
      
    } catch (error) {
      alert("❌ Gagal mengupdate parameter.");
      setLoading(false);
    }
  }, [draftParameter, safeActiveParamIndex, rows, setRows, isKategoriIncomplete, onSaveData, editMode]);

  // Tambah parameter baru dari draft
const handleAddNewParameter = useCallback(() => {
  if (!draftParameter) return;
  
  const bobotNum = Number(draftParameter.bobot);
  if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
    alert("Bobot harus antara 0 dan 100.");
    return;
  }
  
  if (isKategoriIncomplete(draftParameter)) {
    alert("Lengkapi kategori sebelum menambah parameter.");
    return;
  }
  
  if (!draftParameter.judul.trim()) {
    alert("Judul parameter tidak boleh kosong.");
    return;
  }
  
  setLoading(true);
  
  try {
    const newParam = {
      ...createParameter(),
      nomor: draftParameter.nomor || "-",
      judul: draftParameter.judul.trim(),
      bobot: bobotNum,
      kategori: {
        model: draftParameter.kategori.model || "",
        prinsip: draftParameter.kategori.prinsip || "",
        jenis: draftParameter.kategori.jenis || "",
        underlying: Array.isArray(draftParameter.kategori.underlying)
          ? draftParameter.kategori.underlying
          : [],
      },
      nilaiList: [] 
    };
    
    const updatedRows = [...rows, newParam];
    
    setRows(updatedRows);
    setActiveParamIndex(updatedRows.length - 1);
    setActiveNilaiIndex(-1);
    setDraftParameter(createEmptyParameter());
    setEditMode(false);
    
    if (typeof onSaveData === 'function') {
      setTimeout(() => {
        const saveSuccess = onSaveData(updatedRows);
        
        if (saveSuccess) {
          console.log("Parameter berhasil ditambahkan dan disimpan!");
        } else {
          alert("Parameter berhasil ditambahkan tapi gagal disimpan ke storage!");
        }
        
        setLoading(false);
      }, 50);
    } else {
      setLoading(false);
    }
    
  } catch (error) {
    console.error("Gagal menambah parameter:", error);
    alert("Gagal menambah parameter.");
    setLoading(false);
  }
}, [draftParameter, isKategoriIncomplete, rows, setRows, onSaveData]);

  // Batalkan edit dan kembalikan ke state sebelumnya
  const handleCancelEdit = useCallback(() => {
    const confirmed = window.confirm(
      "Batalkan perubahan? Semua perubahan yang belum disimpan akan hilang."
    );
    
    if (!confirmed) return;
    
    if (originalParameter && safeActiveParamIndex !== null) {
      setRows((prev) =>
        prev.map((row, idx) =>
          idx === safeActiveParamIndex ? originalParameter : row
        )
      );
      
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          onSaveData();
        }
      }, 100);
    }
    
    setEditMode(false);
    setOriginalParameter(null);
    setDraftParameter(safeActiveParam ? null : createEmptyParameter());
  }, [originalParameter, safeActiveParamIndex, setRows, onSaveData, safeActiveParam]);

  // Salin parameter yang sedang aktif
const handleCopyParam = useCallback(() => {
  if (safeActiveParamIndex === null) return;

  const source = rows[safeActiveParamIndex];

  setLoading(true);
  try {
    const copiedParam = {
      ...createParameter(),
      nomor: `${source.nomor}`,
      judul: `${source.judul} (Copy)`,
      bobot: source.bobot,
      kategori: structuredClone(source.kategori || {}),
      nilaiList: Array.isArray(source.nilaiList) 
        ? source.nilaiList.map(nilai => ({
            ...structuredClone(nilai),
            judul: {
              ...nilai.judul,
              text: nilai.judul?.text ? `${nilai.judul.text}` : 'Nilai (Copy)'
            }
          }))
        : []
    };

    setRows((prev) => {
      const next = [...prev, copiedParam];
      setActiveParamIndex(next.length - 1);
      return next;
    });
    
    setTimeout(() => {
      if (typeof onSaveData === 'function') {
        const saveSuccess = onSaveData();

        if (!saveSuccess) {
          setLoading(false);       
          alert("Gagal menyimpan ke storage"); 
          return;
        }
        setLoading(false);
      }
    }, 100);
  } catch (error) {
    alert("Gagal menyalin parameter.");
    setLoading(false);
  }
}, [safeActiveParamIndex, rows, setRows, onSaveData]);

  // Tampilkan dialog konfirmasi hapus parameter
  const handleDeleteParam = useCallback(() => {
    if (safeActiveParamIndex === null) return;

    const param = rows[safeActiveParamIndex];
    
    setItemToDelete({
      name: param.judul || 'parameter ini',
      nomor: param.nomor || '-',
      judul: param.judul || 'Tidak ada judul'
    });
    setDeleteContext({
      type: 'parameter',
      paramIndex: safeActiveParamIndex,
      nilaiIndex: null
    });
    setDeleteDialogOpen(true);
  }, [safeActiveParamIndex, rows]);

  // Eksekusi penghapusan setelah konfirmasi
  const handleConfirmDelete = useCallback(() => {
    if (!itemToDelete || !deleteContext.type) return;

    setLoading(true);
    
    if (deleteContext.type === 'parameter') {
      const { paramIndex } = deleteContext;
      
      if (paramIndex === null) {
        setLoading(false);
        setDeleteDialogOpen(false);
        return;
      }
      
      const updatedRows = rows.filter((_, idx) => idx !== paramIndex);
      
      setRows(updatedRows);
      
      const nextIndex = updatedRows.length > 0 ? 0 : null;
      setActiveParamIndex(nextIndex);
      setActiveNilaiIndex(-1);
      setEditMode(false);
      setOriginalParameter(null);
      setDraftParameter(null);
      
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setDeleteContext({ type: '', paramIndex: null, nilaiIndex: null });
      
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          const saveSuccess = onSaveData(updatedRows);
          if (!saveSuccess) {
            console.error("❌ Parameter berhasil dihapus tapi gagal menyimpan!");
          }
        }
        setLoading(false);
      }, 100);
    } 
    else if (deleteContext.type === 'nilai') {
      const { paramIndex, nilaiIndex } = deleteContext;
      
      if (paramIndex === null || nilaiIndex === null) {
        setLoading(false);
        setDeleteDialogOpen(false);
        return;
      }
      
      const updatedRows = rows.map((row, ri) => {
        if (ri !== paramIndex) return row;
        
        const updatedNilaiList = (row.nilaiList || []).filter((_, ni) => ni !== nilaiIndex);
        
        return {
          ...row,
          nilaiList: updatedNilaiList,
        };
      });

      setRows(updatedRows);
      
      const nextIndex = updatedRows[paramIndex]?.nilaiList?.length > 0 
        ? Math.max(0, nilaiIndex - 1) 
        : -1;
      setActiveNilaiIndex(nextIndex);

      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setDeleteContext({ type: '', paramIndex: null, nilaiIndex: null });
      
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          const saveSuccess = onSaveData(updatedRows);
          
          if (!saveSuccess) {
            console.error("❌ Parameter berhasil dihapus tapi gagal menyimpan!");
          }
        }
        setLoading(false);
      }, 100);
    }
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setDeleteContext({ type: '', paramIndex: null, nilaiIndex: null });
  }, [itemToDelete, deleteContext, rows, setRows, onSaveData]);

  const formatLabel = useCallback((row) => {
    const k = row.kategori || {};

    const kategoriText = [
      k.model,
      k.prinsip,
      k.jenis,
      ...(k.underlying || []),
    ]
      .filter(Boolean)
      .join(" / ");

    return `${row.nomor} – ${row.judul} (Bobot: ${row.bobot}%)${
      kategoriText ? " | " + kategoriText : ""
    }`;
  }, []);

  const handleClearSelection = useCallback(() => {
    setActiveParamIndex(null);
    setActiveNilaiIndex(-1);
    setEditMode(false);
    setOriginalParameter(null);
    setDraftParameter(createEmptyParameter());
    setOpenParamList(false);
  }, []);

  const handleOpenNilaiDeleteDialog = useCallback((nilai, nilaiIndex) => {
    setItemToDelete({
      name: nilai.judul?.text || 'nilai ini',
      nomor: nilai.nomor || '-',
      judul: nilai.judul?.text || 'Tidak ada judul'
    });
    setDeleteContext({
      type: 'nilai',
      paramIndex: safeActiveParamIndex,
      nilaiIndex: nilaiIndex
    });
    setDeleteDialogOpen(true);
  }, [safeActiveParamIndex]);

  // Tentukan apakah field input harus disabled
  const isFieldDisabled = () => {
    if (loading) return true;
    if (!safeActiveParam && !editMode) return false;
    if (editMode) return false;
    return true;
  };

  return (
    <div className="w-full space-y-3">
      <div className="bg-blue-700 text-white px-4 py-3 rounded-lg border border-black">
        <div className="flex justify-between items-center">
          <div className="text-2xl tracking-wider font-bold">
            <span>Parameter</span>
          </div>

          <div className="flex items-center gap-2">
            {loading && (
              <div className="text-md bg-slate-700 text-slate-200 px-2 py-1 rounded">
                Memproses...
              </div>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowParameterForm(!showParameterForm)}
              className="bg-slate-900 text-white hover:bg-slate-800 text-md px-3 border border-black"
              disabled={loading}
            >
              {showParameterForm ? (
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

            {safeActiveParamIndex !== null && !editMode && (
              <Button
                size="icon"
                onClick={handleEditParam}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
                title="Edit Parameter"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}

            {editMode && (
              <Button
                size="icon"
                onClick={handleCancelEdit}
                className="bg-gray-600 hover:bg-gray-700"
                disabled={loading}
                title="Batal Edit"
              >
                <X className="w-4 h-4" />
              </Button>
            )}

            <Button 
              size="icon" 
              onClick={editMode ? handleUpdateParam : handleAddNewParameter}
              className={editMode ? "bg-green-600 hover:bg-green-700" : "bg-emerald-600 hover:bg-emerald-700"}
              disabled={loading}
              title={editMode ? "Update Parameter" : "Tambah Parameter"}
            >
              {editMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>

            {!editMode && safeActiveParamIndex !== null && (
              <Button
                size="icon"
                onClick={handleCopyParam}
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-700"
                title="Salin Parameter"
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}

            {!editMode && safeActiveParamIndex !== null && (
              <Button 
                size="icon" 
                onClick={handleDeleteParam} 
                disabled={loading} 
                className="bg-rose-600 hover:bg-rose-700"
                title="Hapus Parameter"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {showParameterForm && (
          <>
            {isKategoriIncomplete(currentParameter) && currentParameter.kategori.model !== "tanpa_model" ? (
              <div className="w-full mt-2 p-1 flex items-center gap-2 justify-center bg-amber-50 text-amber-700 rounded border border-amber-200">
                <TriangleAlert className="w-4 h-4" />
                <span className="text-base font-semibold">Kategori belum diselesaikan</span>
              </div>
            ) : (
              <div className="w-full bg-slate-200 rounded p-0.5 mt-2" />
            )}
              
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-3 items-start">
              <div className="flex flex-col">
                <label className="font-semibold text-base tracking-wide ml-1 mb-1 text-slate-200">
                  Model Produk
                </label>
                <select
                  className="bg-white text-slate-800 text-md rounded px-2 py-2 border border-black"
                  value={currentParameter.kategori.model}
                  onChange={(e) =>
                    handleChangeKategori("model", e.target.value)
                  }
                  disabled={isFieldDisabled()}
                >
                  <option value="">Pilih Model</option>
                  <option value="tanpa_model">Tanpa Model</option>
                  <option value="open_end">Open-End</option>
                  <option value="terstruktur">Terstruktur</option>
                </select>
              </div>

              {currentParameter.kategori.model === "open_end" && (
                <div className="flex flex-col lg:col-span-2">
                  <label className="font-semibold text-base tracking-wide ml-1 mb-1 text-slate-200">
                    Jenis Reksa Dana
                  </label>

                  <div className="flex gap-4 items-center">
                    <select
                      className="flex-1 bg-white text-slate-800 text-md rounded px-2 py-2 border border-black"
                      value={currentParameter.kategori.jenis}
                      onChange={(e) =>
                        handleChangeKategori("jenis", e.target.value)
                      }
                      disabled={isFieldDisabled()}
                    >
                      <option value="">Pilih Jenis</option>
                      <option value="pasar_uang">Pasar Uang</option>
                      <option value="pendapatan_tetap">Pendapatan Tetap</option>
                      <option value="campuran">Campuran</option>
                      <option value="saham">Saham</option>
                      <option value="indeks">Indeks</option>
                      
                    </select>

                    {currentParameter.kategori.model !== "tanpa_model" && (
                      <div className="flex gap-4 shrink-0">
                        <label className="flex items-center gap-2 text-base font-semibold cursor-pointer select-none text-slate-200">
                          <input
                            type="checkbox"
                            checked={currentParameter.kategori.prinsip === "syariah"}
                            onChange={() =>
                              handleChangeKategori(
                                "prinsip",
                                currentParameter.kategori.prinsip === "syariah"
                                  ? ""
                                  : "syariah"
                              )
                            }
                            disabled={isFieldDisabled()}
                            className="accent-emerald-500 h-4 w-4"
                          />
                          <span>Syariah</span>
                        </label>

                        <label className="flex items-center gap-2 text-base font-semibold cursor-pointer select-none text-slate-200">
                          <input
                            type="checkbox"
                            checked={currentParameter.kategori.prinsip === "konvensional"}
                            onChange={() =>
                              handleChangeKategori(
                                "prinsip",
                                currentParameter.kategori.prinsip === "konvensional"
                                  ? ""
                                  : "konvensional"
                              )
                            }
                            disabled={isFieldDisabled()}
                            className="accent-slate-500 h-4 w-4 "
                          />
                          <span>Konvensional</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentParameter.kategori.model === "terstruktur" && (
                <div className="flex flex-col lg:col-span-2">
                  <label className="font-semibold text-base tracking-wide ml-1 mb-1 text-slate-200">
                    Aset Dasar
                  </label>

                  <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                      <button
                        type="button"
                        className="w-full bg-white text-slate-800 text-md rounded px-2 py-1.5 flex justify-between items-center border border-black"
                        onClick={() => setOpenUnderlying((v) => !v)}
                        disabled={isFieldDisabled()}
                      >
                        <span className="truncate">
                          {currentParameter.kategori.underlying.length > 0
                            ? currentParameter.kategori.underlying.join(", ")
                            : "Pilih Aset Dasar"}
                        </span>
                        <span>▾</span>
                      </button>

                      {openUnderlying && (
                        <div className="absolute z-50 mt-1 w-full bg-white rounded shadow-lg text-md text-slate-800 border border-black">
                          {[
                            { key: "indeks", label: "Indeks" },
                            { key: "eba", label: "Efek Beragun Aset(EBA)" },
                            { key: "dinfra", label: "Dana Investasi Infrastruktur" },
                            { key: "obligasi", label: "Obligasi" },
                          ].map((u) => {
                            const checked = currentParameter.kategori.underlying.includes(u.key);

                            return (
                              <label
                                key={u.key}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-slate-700"
                                  checked={checked}
                                  onChange={(e) => {
                                    if (isFieldDisabled()) return;
                                    
                                    const next = e.target.checked
                                      ? [...currentParameter.kategori.underlying, u.key]
                                      : currentParameter.kategori.underlying.filter(
                                          (x) => x !== u.key
                                        );

                                    handleChangeKategori("underlying", next);
                                  }}
                                  disabled={isFieldDisabled()}
                                />
                                <span>{u.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {currentParameter.kategori.model !== "tanpa_model" && (
                      <div className="flex gap-4 shrink-0">
                        <label className="flex items-center gap-2 text-base font-semibold cursor-pointer select-none text-slate-200">
                          <input
                            type="checkbox"
                            checked={currentParameter.kategori.prinsip === "syariah"}
                            onChange={() =>
                              handleChangeKategori(
                                "prinsip",
                                currentParameter.kategori.prinsip === "syariah"
                                  ? ""
                                  : "syariah"
                              )
                            }
                            disabled={isFieldDisabled()}
                            className="accent-emerald-500 h-4 w-4"
                          />
                          <span>Syariah</span>
                        </label>

                        <label className="flex items-center gap-2 text-base font-semibold cursor-pointer select-none text-slate-200">
                          <input
                            type="checkbox"
                            checked={currentParameter.kategori.prinsip === "konvensional"}
                            onChange={() =>
                              handleChangeKategori(
                                "prinsip",
                                currentParameter.kategori.prinsip === "konvensional"
                                  ? ""
                                  : "konvensional"
                              )
                            }
                            disabled={isFieldDisabled()}
                            className="accent-slate-500 h-4 w-4"
                          />
                          <span>Konvensional</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentParameter.kategori.model === "tanpa_model" && (
                <div className="hidden md:block"></div>
              )}
            </div>

            <div className="w-full flex gap-2">
              <div className="w-[10%]">
                <label className="font-semibold text-md ml-1 text-slate-200">No</label>
                <Input
                  placeholder="3."
                  value={currentParameter.nomor}
                  onChange={(e) => handleChangeParameter("nomor", e.target.value)}
                  className="bg-white text-slate-950 border border-black"
                  disabled={isFieldDisabled()}
                />
              </div>

              <div className="w-[10%]">
                <label className="font-semibold text-md ml-1 text-slate-200">Bobot</label>
                <Input
                  placeholder="max 100%"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={currentParameter.bobot}
                  onChange={(e) => handleChangeParameter("bobot", e.target.value)}
                  className="bg-white text-slate-950 border border-black"
                  disabled={isFieldDisabled()}
                />
              </div>

              <div className="w-[80%]">
                <label className="font-semibold text-md ml-1 text-slate-200">Parameter</label>
                <Input
                  placeholder="Reksa Dana"
                  value={currentParameter.judul}
                  disabled={
                    (currentParameter.kategori.model !== "tanpa_model" && isKategoriIncomplete(currentParameter)) || 
                    isFieldDisabled()
                  }
                  onChange={(e) => handleChangeParameter("judul", e.target.value)}
                  className={`bg-white text-slate-950 border border-black ${
                    (currentParameter.kategori.model !== "tanpa_model" && isKategoriIncomplete(currentParameter)) || 
                    isFieldDisabled() ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>

            <div className="mt-2">
              <label className="font-semibold text-normal tracking-wide ml-1 mb-1 text-slate-200">
                Pilih Parameter
              </label>

            <button
              ref={dropdownBtnRef}
              onClick={() => setOpenParamList((v) => !v)}
              className="w-full bg-white text-md text-slate-800 px-3 py-2 rounded-md flex justify-between border border-black hover:bg-slate-50"
              disabled={loading}
            >
              <span className="truncate">
                {safeActiveParam ? formatLabel(safeActiveParam) : "Pilih atau Tambah Parameter Baru"}
              </span>
              <span>▾</span>
            </button>

            {openParamList &&
              dropdownRect &&
              createPortal(
                <div
                  ref={dropdownListRef}
                  className="fixed bg-white text-slate-800 rounded-md shadow-lg max-h-[220px] overflow-auto z-[9999] border border-black"
                  style={{
                    top: dropdownRect.top,
                    left: dropdownRect.left,
                    width: dropdownRect.width,
                  }}
                >
                  <button
                    onClick={() => {
                      handleClearSelection();
                      setOpenParamList(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 border border-b-black border-x-white"
                  >
                    Buat Parameter Baru
                  </button>
                  
                  {rows.map((row, idx) => (
                    <button
                      key={row.id ?? idx}
                      onClick={() => {
                        setActiveParamIndex(idx);
                        setOpenParamList(false);
                        setEditMode(false);
                        setDraftParameter(null);
                        setOriginalParameter(null);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 ${
                        idx === safeActiveParamIndex ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700"
                      }`}
                    >
                      {formatLabel(row)}
                    </button>
                  ))}
                </div>,
                document.body
              )}
            </div>
          </>
        )}
      </div>

      {!showParameterForm && (
        <div className="w-full"/>
      )}

      {safeActiveParam && (
        <NilaiPanel
          param={safeActiveParam}
          nilaiList={safeActiveParam.nilaiList}
          activeNilaiIndex={activeNilaiIndex}
          setActiveNilaiIndex={setActiveNilaiIndex}
          loading={loading}
          paramIndex={safeActiveParamIndex}
          setRows={setRows}
          rows={rows}
          onSaveData={onSaveData}
          onOpenDeleteDialog={handleOpenNilaiDeleteDialog}
        />
      )}

      <PopUpDelete
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Hapus ${deleteContext.type === 'parameter' ? 'Parameter' : 'Nilai'}`}
        description={`Apakah Anda yakin ingin menghapus ${deleteContext.type === 'parameter' ? 'parameter' : 'nilai'} ini? Tindakan ini tidak dapat dibatalkan.`}
        itemName={itemToDelete?.name || ''}
        itemNomor={itemToDelete?.nomor || ''}
        itemJudul={itemToDelete?.judul || ''}
        itemType={deleteContext.type === 'parameter' ? 'parameter' : 'nilai'}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setItemToDelete(null);
          setDeleteContext({ type: '', paramIndex: null, nilaiIndex: null });
        }}
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={loading}
      />
    </div>
  );
}


//komponent nilai panel
function NilaiPanel({
  param,
  nilaiList = [],
  activeNilaiIndex,
  setActiveNilaiIndex,
  loading = false,
  paramIndex,
  setRows,
  rows,
  onSaveData,
  onOpenDeleteDialog,
}) {
  const hasNilai = Array.isArray(nilaiList) && nilaiList.length > 0;
  const [showForm, setShowForm] = useState(true); 
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [tempFormula, setTempFormula] = useState("");
  const [tempPercent, setTempPercent] = useState(false);
  
  const [editModeNilai, setEditModeNilai] = useState(false);
  const [originalNilai, setOriginalNilai] = useState(null);
  const [draftNilai, setDraftNilai] = useState(null);
  
  const [openNilaiList, setOpenNilaiList] = useState(false);
  const dropdownNilaiBtnRef = useRef(null);
  const [dropdownNilaiRect, setDropdownNilaiRect] = useState(null);
  const dropdownNilaiListRef = useRef(null);

  useEffect(() => {
    if (!openNilaiList || !dropdownNilaiBtnRef.current) return;

    const updatePosition = () => {
      const rect = dropdownNilaiBtnRef.current.getBoundingClientRect();
      setDropdownNilaiRect({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [openNilaiList]);

  useDropdownPortal({
    open: openNilaiList,
    setOpen: setOpenNilaiList,
    triggerRef: dropdownNilaiBtnRef,
    containerRef: dropdownNilaiListRef,
  });

  // PERUBAHAN PENTING: Otomatis masuk ke mode buat baru ketika pertama kali atau tidak ada nilai dipilih
  useEffect(() => {
    // Jika tidak ada nilai sama sekali di daftar, atau activeNilaiIndex = -1
    if (!hasNilai || activeNilaiIndex === -1) {
      setEditModeNilai(true); // Otomatis masuk edit mode
      if (!draftNilai) {
        setDraftNilai(createEmptyDraftNilai()); // Buat draft kosong
      }
    }
  }, [hasNilai, activeNilaiIndex]);

  const safeActiveIndex =
    hasNilai &&
    activeNilaiIndex >= 0 &&
    activeNilaiIndex < nilaiList.length
      ? activeNilaiIndex
      : -1;

  function createEmptyDraftNilai() {
    return {
      id: crypto.randomUUID(),
      nomor: "",
      judul: {
        text: "",
        type: "Tanpa Faktor",
        value: null,
        pembilang: "",
        valuePembilang: null,
        penyebut: "",
        valuePenyebut: null,
        formula: "",
        percent: false,
      },
      bobot: "",
      keterangan: "",
      riskindikator: {
        low: "",
        lowToModerate: "",
        moderate: "",
        moderateToHigh: "",
        high: "",
      },
    };
  }

  const currentNilai = editModeNilai 
    ? draftNilai 
    : (hasNilai && safeActiveIndex >= 0 
        ? nilaiList[safeActiveIndex] 
        : (draftNilai || createEmptyDraftNilai()));

  useEffect(() => {
    if (!hasNilai && activeNilaiIndex !== -1) {
      setActiveNilaiIndex(-1);
    }
  }, [hasNilai, activeNilaiIndex, setActiveNilaiIndex]);

  const formatNilaiLabel = useCallback((nilai, index) => {
    if (!nilai) return "Buat Nilai Baru ";
    
    const nomor = nilai.nomor || (index + 1);
    const judul = nilai.judul?.text || "Tanpa Judul";
    const bobot = nilai.bobot ? ` (Bobot: ${nilai.bobot}%)` : "";
    const copyText = nilai.judul?.text?.includes("(Copy)") ? "" : "";
    
    return `${nomor} – ${judul}${copyText}${bobot}`;
  }, []);

  // Buka modal untuk mengatur formula - HANYA dalam edit mode
  const openFormula = () => {
    // HANYA izinkan jika dalam edit mode
    if (!editModeNilai) {
      alert("Harap masuk ke mode edit terlebih dahulu untuk mengatur rumus.");
      return;
    }
    
    if (currentNilai?.judul) {
      setTempFormula(currentNilai.judul.formula || "");
      setTempPercent(currentNilai.judul.percent || false);
    }
    setFormulaOpen(true);
  };

  const saveFormula = () => {
    if (!currentNilai) return;
    
    const confirmed = window.confirm("Simpan perubahan formula?");
    if (!confirmed) return;
    
    const updatedNilai = {
      ...currentNilai,
      judul: {
        ...currentNilai.judul,
        formula: tempFormula,
        percent: tempPercent,
      },
    };
    
    if (editModeNilai) {
      setDraftNilai(updatedNilai);
    } else if (safeActiveIndex === -1) {
      setDraftNilai(updatedNilai);
    } else {
      setRows((prev) =>
        prev.map((row, ri) => {
          if (ri !== paramIndex) return row;
          
          return {
            ...row,
            nilaiList: (row.nilaiList || []).map((n, ni) =>
              ni === safeActiveIndex ? updatedNilai : n
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
    
    setFormulaOpen(false);
  };

  // Update nilai field secara langsung (non-edit mode)
  const handleChangeNilaiField = useCallback((path, value) => {
    if (paramIndex === null || safeActiveIndex === -1) return;

    setRows((prev) =>
      prev.map((row, ri) => {
        if (ri !== paramIndex) return row;

        return {
          ...row,
          nilaiList: (row.nilaiList || []).map((n, ni) => {
            if (ni !== safeActiveIndex) return n;

            const updatedNilai = { ...n };
            const keys = path.split('.');
            let current = updatedNilai;
            
            for (let i = 0; i < keys.length - 1; i++) {
              const key = keys[i];
              if (!current[key]) current[key] = {};
              current = current[key];
            }
            
            const lastKey = keys[keys.length - 1];
            current[lastKey] = value;
            
            return updatedNilai;
          }),
        };
      })
    );
  }, [paramIndex, safeActiveIndex, setRows]);

  // Update judul nilai secara langsung (non-edit mode)
  const handleChangeJudul = useCallback((judulPatch) => {
    if (paramIndex === null || safeActiveIndex === -1) return;

    setRows((prev) =>
      prev.map((row, ri) => {
        if (ri !== paramIndex) return row;

        return {
          ...row,
          nilaiList: (row.nilaiList || []).map((n, ni) =>
            ni === safeActiveIndex
              ? {
                  ...n,
                  judul: {
                    ...n.judul,
                    ...judulPatch,
                  },
                }
              : n
          ),
        };
      })
    );
  }, [paramIndex, safeActiveIndex, setRows]);

  // Update draft nilai saat dalam edit mode
  const handleChangeDraftNilai = useCallback((path, value) => {
    if (!draftNilai || !editModeNilai) return;
    
    const updatedDraft = { ...draftNilai };
    const keys = path.split('.');
    let current = updatedDraft;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) current[key] = {};
      current = current[key];
    }
    
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
    
    setDraftNilai(updatedDraft);
  }, [draftNilai, editModeNilai]);

  // Update judul draft saat dalam edit mode
  const handleChangeDraftJudul = useCallback((judulPatch) => {
    if (!draftNilai || !editModeNilai) return;
    
    setDraftNilai(prev => ({
      ...prev,
      judul: {
        ...prev.judul,
        ...judulPatch,
      },
    }));
  }, [draftNilai, editModeNilai]);

  // Tambah nilai baru
const handleAddNilai = useCallback(() => {
  if (paramIndex === null) return;

  const nilaiToAdd = draftNilai || createEmptyDraftNilai();
  
  if (!nilaiToAdd.judul?.text?.trim()) {
    alert("Judul nilai tidak boleh kosong!");
    return;
  }
  
  const bobotNum = Number(nilaiToAdd.bobot);
  if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
    alert("Bobot nilai harus antara 0 dan 100!");
    return;
  }
  
  const newNilai = {
    ...nilaiToAdd,
    id: crypto.randomUUID(),
  };
  
  // Buat rows yang sudah diupdate
  const updatedRows = rows.map((row, ri) =>
    ri === paramIndex
      ? {
          ...row,
          nilaiList: [...(row.nilaiList || []), newNilai],
        }
      : row
  );
  
  // Update state dengan rows baru
  setRows(updatedRows);
  
  // Langsung panggil onSaveData dengan rows yang baru
  if (typeof onSaveData === 'function') {
    const saveSuccess = onSaveData(updatedRows);
    
    if (!saveSuccess) {
      alert("❌ Nilai berhasil ditambahkan tapi gagal disimpan!");
    }
  }

  const currentRow = rows[paramIndex];
  const currentLength = (currentRow?.nilaiList || []).length;
  setActiveNilaiIndex(currentLength);
  
  // Reset state
  setEditModeNilai(true);
  setOriginalNilai(null);
  setDraftNilai(createEmptyDraftNilai());
  
}, [paramIndex, draftNilai, rows, setRows, setActiveNilaiIndex, onSaveData]);

  // Aktifkan edit mode untuk nilai yang dipilih
  const handleEditNilai = useCallback(() => {
    if (safeActiveIndex >= 0 && currentNilai && !editModeNilai) {
      setOriginalNilai(structuredClone(currentNilai));
      setDraftNilai(structuredClone(currentNilai));
      setEditModeNilai(true);
    }
  }, [safeActiveIndex, currentNilai, editModeNilai]);

  // Simpan perubahan dari edit mode ke state utama
 const handleUpdateNilai = useCallback(() => {
  if (!draftNilai || paramIndex === null || !editModeNilai) return;
  
  if (!draftNilai.judul?.text?.trim()) {
    alert("Judul nilai tidak boleh kosong!");
    return;
  }
  
  const bobotNum = Number(draftNilai.bobot);
  if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
    alert("Bobot nilai harus antara 0 dan 100!");
    return;
  }
  
  setRows((prev) =>
    prev.map((row, ri) => {
      if (ri !== paramIndex) return row;
      
      return {
        ...row,
        nilaiList: (row.nilaiList || []).map((n, ni) =>
          ni === safeActiveIndex ? draftNilai : n
        ),
      };
    })
  );
  
  setEditModeNilai(false);
  setOriginalNilai(null);
  setDraftNilai(null);

  setTimeout(() => {
    if (typeof onSaveData === 'function') {
      const updatedRows = rows.map((row, ri) => {
        if (ri !== paramIndex) return row;
        
        return {
          ...row,
          nilaiList: (row.nilaiList || []).map((n, ni) =>
            ni === safeActiveIndex ? draftNilai : n
          ),
        };
      });
      
      // Panggil onSaveData dengan rows yang sudah diupdate
      const saveSuccess = onSaveData(updatedRows);
      
      if (!saveSuccess) {
        alert("❌ Nilai berhasil diupdate tapi gagal disimpan ke storage!");
      }
    }
  }, 100);
  
}, [draftNilai, paramIndex, safeActiveIndex, setRows, onSaveData, editModeNilai, rows]);

  // Batalkan edit dan kembalikan ke nilai asli
  const handleCancelEditNilai = useCallback(() => {
    const confirmed = window.confirm(
      "Batalkan perubahan? Semua perubahan yang belum disimpan akan hilang."
    );
    
    if (!confirmed) return;
    
    if (originalNilai && paramIndex !== null && safeActiveIndex >= 0) {
      setRows((prev) =>
        prev.map((row, ri) => {
          if (ri !== paramIndex) return row;
          
          return {
            ...row,
            nilaiList: (row.nilaiList || []).map((n, ni) =>
              ni === safeActiveIndex ? originalNilai : n
            ),
          };
        })
      );
    }
    
    setEditModeNilai(false);
    setOriginalNilai(null);
    setDraftNilai(null);
  }, [originalNilai, paramIndex, safeActiveIndex, setRows]);

  // Salin nilai yang sedang aktif
  const handleCopyNilai = useCallback(() => {
    if (paramIndex === null || !currentNilai || safeActiveIndex === -1 || editModeNilai) return;

    const copiedNilai = {
      ...structuredClone(currentNilai),
      id: crypto.randomUUID(),
      judul: { 
        ...currentNilai.judul,
        text: `${currentNilai.judul?.text || 'Nilai'} (Copy)`
      },
    };

    setRows((prev) =>
      prev.map((row, ri) =>
        ri === paramIndex
          ? {
              ...row,
              nilaiList: [...(row.nilaiList || []), copiedNilai],
            }
          : row
      )
    );

    const newIndex = (rows[paramIndex]?.nilaiList || []).length;
    setActiveNilaiIndex(newIndex);
    
    setTimeout(() => {
      if (typeof onSaveData === 'function') {
        onSaveData();
      }
    }, 100);
  }, [paramIndex, currentNilai, safeActiveIndex, editModeNilai, setRows, rows, setActiveNilaiIndex, onSaveData]);

  // Tampilkan dialog konfirmasi hapus nilai
  const handleDeleteNilai = useCallback(() => {
    if (paramIndex === null || !currentNilai || safeActiveIndex === -1 || editModeNilai) return;

    if (onOpenDeleteDialog) {
      onOpenDeleteDialog(currentNilai, safeActiveIndex);
    }
  }, [paramIndex, currentNilai, safeActiveIndex, editModeNilai, onOpenDeleteDialog]);

const handleSelectNilai = (index) => {
  const selected = nilaiList[index];

  if (!selected) return;

  setActiveNilaiIndex(index);
  setOpenNilaiList(false);

  setOriginalNilai(structuredClone(selected));
  setDraftNilai(structuredClone(selected));

  setEditModeNilai(true);
};

  const handleClearNilaiSelection = useCallback(() => {
    setActiveNilaiIndex(-1);
    setEditModeNilai(true); // Otomatis masuk edit mode
    setOriginalNilai(null);
    setDraftNilai(createEmptyDraftNilai()); // Buat draft kosong
    setOpenNilaiList(false);
  }, []);

  // Update draft ketika tipe judul berubah
  const updateDraftJudulType = useCallback((type) => {
    if (!editModeNilai && safeActiveIndex !== -1) return;
    
    setDraftNilai(prev => {
      const current = prev || createEmptyDraftNilai();
      return {
        ...current,
        judul: {
          ...current.judul,
          type: type,
          ...(type === "Tanpa Faktor" ? {
            pembilang: "",
            valuePembilang: null,
            penyebut: "",
            valuePenyebut: null,
          } : type === "Satu Faktor" ? {
            penyebut: "",
            valuePenyebut: null,
          } : {})
        }
      };
    });
  }, [editModeNilai, safeActiveIndex]);

  // Tentukan apakah field input harus disabled
  const isFieldDisabled = () => {
    if (loading) return true;
    
    // Jika tidak ada nilai yang dipilih (membuat nilai baru), field harus ENABLED
    if (safeActiveIndex === -1) return false;
    
    // Jika dalam mode edit, field harus ENABLED
    if (editModeNilai) return false;
    
    // Default: disabled
    return true;
  };

  // Tentukan editMode untuk komponen child
  const isEditModeForComponents = editModeNilai || safeActiveIndex === -1;

  // Tentukan config tombol utama
  const getMainButtonConfig = () => {
    // Jika edit mode DAN safeActiveIndex = -1 (mode buat baru)
    if (editModeNilai && safeActiveIndex === -1) {
      return {
        onClick: handleAddNilai,
        title: "Tambah Nilai Baru",
        icon: <Plus className="w-4 h-4" />,
        className: "bg-emerald-600 hover:bg-emerald-700"
      };
    }
    // Jika edit mode untuk nilai yang sudah ada
    else if (editModeNilai) {
      return {
        onClick: handleUpdateNilai,
        title: "Simpan Perubahan",
        icon: <Save className="w-4 h-4" />,
        className: "bg-green-600 hover:bg-green-700"
      };
    }
    // Default: tambah nilai baru
    else {
      return {
        onClick: handleAddNilai,
        title: "Tambah Nilai Baru",
        icon: <Plus className="w-4 h-4" />,
        className: "bg-emerald-600 hover:bg-emerald-700"
      };
    }
  };

  const mainButtonConfig = getMainButtonConfig();

  return (
    <div className="w-full relative">
      {formulaOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[420px] p-4 space-y-3 text-slate-800 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="font-bold text-lg">Atur Rumus</div>
              <Button 
                onClick={() => setFormulaOpen(false)} 
                disabled={loading}
                variant="ghost"
                size="icon"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex flex-col flex-1">
                <label className="text-md font-semibold mb-1">Formula</label>
                <Input
                  value={tempFormula}
                  onChange={(e) => setTempFormula(e.target.value)}
                  placeholder="contoh: pem / pen"
                  className="bg-slate-50 hover:bg-slate-100 text-slate-950 border border-black"
                  disabled={loading}
                />
              </div>

              <button
                type="button"
                onClick={() => setTempPercent(!tempPercent)}
                disabled={loading}
                className={
                  "flex h-9 w-9 items-center justify-center rounded-md border border-black text-lg font-semibold transition-colors duration-150 " +
                  (tempPercent
                    ? "bg-blue-900 text-white" 
                    : "bg-white text-slate-800") 
                }
              >
                %
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="bg-white text-slate-800 border border-black hover:bg-slate-50"
                onClick={() => setFormulaOpen(false)}
                disabled={loading}
              >
                Batal
              </Button>
              <Button 
                className="bg-blue-900 text-white hover:bg-blue-900" 
                onClick={saveFormula}
                disabled={loading}
              >
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full bg-blue-700 text-white px-4 pt-4 pb-3 border border-x-black border-t-black border-b-blue-700 flex items-center justify-between gap-4 rounded-t-lg">
        <div className="text-2xl tracking-wider font-bold">Nilai Form</div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowForm(!showForm)}
            className="bg-slate-900 text-white hover:bg-slate-800 text-md px-3 border border-black"
            disabled={loading}
          >
            {showForm ? (
              <>    
                <ChevronUp className="w-4 h-4" />
                Sembunyikan
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Tampilkan
              </>
            )}
          </Button>

          {safeActiveIndex >= 0 && hasNilai && !editModeNilai && (
            <Button
              size="icon"
              onClick={handleEditNilai}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
              title="Edit Nilai"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}

          {editModeNilai && (
            <Button
              size="icon"
              onClick={handleCancelEditNilai}
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

            {!editModeNilai && safeActiveIndex >= 0 && hasNilai && (
              <Button
                size="icon"
                className="h-9 w-9 rounded-full bg-amber-600 hover:bg-amber-700"
                onClick={handleCopyNilai}
                disabled={loading}
                title="Salin Nilai"
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}

            {!editModeNilai && safeActiveIndex >= 0 && hasNilai && (
              <Button
                size="icon"
                className="h-9 w-9 rounded-full bg-rose-600 hover:bg-rose-700"
                onClick={handleDeleteNilai}
                disabled={loading}
                title="Hapus Nilai"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="w-full bg-blue-700 text-white px-4 pb-4 border border-x-black border-t-blue-700 space-y-4 rounded-b-lg">
          <div className="w-full bg-slate-200 rounded-lg p-0.5 mt-2"/>              
          <div className="space-y-2">
            <div className="flex flex-col">
              <label className="font-semibold text-normal tracking-wide ml-1 mb-1 text-slate-200">
                Pilih Nilai
              </label>
              <button
                ref={dropdownNilaiBtnRef}
                onClick={() => setOpenNilaiList((v) => !v)}
                className="w-full bg-white text-md text-slate-800 px-3 py-2 rounded-md flex justify-between items-center border border-black hover:bg-slate-50"
                disabled={loading}
              >
                <span className="truncate">
                  {safeActiveIndex >= 0 && hasNilai 
                    ? formatNilaiLabel(currentNilai, safeActiveIndex) 
                    : "Buat Nilai Baru"}
                </span>
                <span>▾</span>
              </button>
            </div>

            {openNilaiList && dropdownNilaiRect && createPortal(
              <div
                ref={dropdownNilaiListRef}
                className="fixed bg-white text-slate-800 rounded-md shadow-lg max-h-[220px] overflow-auto z-[9999] border border-black"
                style={{
                  top: dropdownNilaiRect.top,
                  left: dropdownNilaiRect.left,
                  width: dropdownNilaiRect.width,
                }}
              >
                <button
                  onClick={() => {
                    handleClearNilaiSelection();
                    setOpenNilaiList(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 border border-b-black border-x-white"
                >
                   Buat Nilai Baru 
                </button>
                
                {hasNilai && nilaiList.map((nilai, idx) => (
                  <button
                    key={nilai.id ?? idx}
                    onClick={() => handleSelectNilai(idx)}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 ${
                      idx === safeActiveIndex ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700"
                    }`}
                  >
                    {formatNilaiLabel(nilai, idx)}
                  </button>
                ))}
              </div>,
              document.body
            )}
          </div>

          {/* Tampilkan form ketika dalam mode buat baru atau ada nilai yang dipilih */}
          {(editModeNilai || safeActiveIndex >= 0) && (
            <>
              <div className="flex justify-end">
                <Button
                  size="normal"
                  className="bg-slate-100 p-1 text-slate-800 font-semibold hover:bg-slate-200 border border-black"
                  onClick={openFormula}
                  disabled={loading || !editModeNilai} // PERUBAHAN: Disable jika bukan edit mode
                >
                  Atur Rumus
                </Button>
              </div>

              <NilaiJudulInput
                judul={currentNilai.judul}
                onChange={(newJudul) => {
                  if (isEditModeForComponents) {
                    handleChangeDraftJudul(newJudul);
                  } else {
                    handleChangeJudul(newJudul);
                  }
                }}
                onTypeChange={isEditModeForComponents ? updateDraftJudulType : undefined}
                loading={loading}
                editMode={isEditModeForComponents}
                nomor={currentNilai.nomor}
                bobot={currentNilai.bobot}
                onNomorChange={(value) => 
                  isEditModeForComponents
                    ? handleChangeDraftNilai("nomor", value)
                    : handleChangeNilaiField("nomor", value)
                }
                onBobotChange={(value) => 
                  isEditModeForComponents
                    ? handleChangeDraftNilai("bobot", value)
                    : handleChangeNilaiField("bobot", value)
                }
                // Tambahkan param hanya jika ada
                param={param || undefined}
              />

              <div className="mt-3">
                <div className="text-lg ml-1 font-semibold py-2 text-slate-200">
                  Risk Indicator
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[
                    ["Low", "low", "#4F6228"],
                    ["Low To Moderate", "lowToModerate", "#92D050"],
                    ["Moderate", "moderate", "#FFFF00"],
                    ["Moderate To High", "moderateToHigh", "#FFC000"],
                    ["High", "high", "#FF0000"],
                  ].map(([label, key, color]) => (
                    <RiskItem
                      key={key}
                      label={label}
                      color={color}
                      value={currentNilai.riskindikator?.[key] ?? ""}
                      onChange={(v) => 
                        isEditModeForComponents
                          ? handleChangeDraftNilai(`riskindikator.${key}`, v)
                          : handleChangeNilaiField(`riskindikator.${key}`, v)
                      }
                      loading={loading}
                      editMode={isEditModeForComponents}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mt-2 text-slate-800">
                <label className="text-slate-200 ml-1 tracking-wide font-semibold text-md">
                  Keterangan
                </label>
                <Textarea
                  className="min-h-[40px] text-md bg-white border border-black"
                  value={currentNilai.keterangan ?? ""}
                  onChange={(e) => 
                    isEditModeForComponents
                      ? handleChangeDraftNilai("keterangan", e.target.value)
                      : handleChangeNilaiField("keterangan", e.target.value)
                  }
                  disabled={isFieldDisabled()}
                  placeholder="masukan keterangan"
                />
              </div>
            </>
          )}
        </div>
      )}

      {!showForm && hasNilai && (
        <div className="w-full"/>
      )}
    </div>
  );
}

// Risk Item
function RiskItem({ label, value, onChange, color, loading = false, editMode = false }) {
  return (
    <div
      className="rounded-lg px-3 py-3 flex flex-col gap-2 border border-black shadow-sm"
      style={{ backgroundColor: color }}
    >
      <div className="text-md font-bold tracking-wide uppercase text-black text-center">
        {label}
      </div>
      <div className="bg-white/90 rounded border border-black">
        <Textarea
          className="min-h-[60px] text-md bg-transparent text-slate-800 resize-none text-center p-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading || !editMode}
          placeholder="masukan angka atau huruf"
        />
      </div>
    </div>
  );
}

//Nilai Judul
function NilaiJudulInput({ 
  judul, 
  onChange, 
  onTypeChange, 
  loading = false, 
  editMode = false, 
  nomor, 
  bobot, 
  onNomorChange, 
  onBobotChange,
  param 
}) {
  // Handler untuk mengubah tipe nilai (Tanpa Faktor/Satu Faktor/Dua Faktor)
  const updateType = (newType) => {
    if (loading || !editMode) return;
    
    let updated = {
      ...judul,
      type: newType,
    };

    if (newType === "Tanpa Faktor") {
      updated = {
        ...updated,
        value: updated.value ?? null,
        pembilang: "",
        valuePembilang: null,
        penyebut: "",
        valuePenyebut: null,
      };
    }

    if (newType === "Satu Faktor") {
      updated = {
        ...updated,
        pembilang: updated.pembilang ?? "",
        valuePembilang: updated.valuePembilang ?? null,
        penyebut: "",
        valuePenyebut: null,
      };
    }

    if (newType === "Dua Faktor") {
      updated = {
        ...updated,
        pembilang: updated.pembilang ?? "",
        valuePembilang: updated.valuePembilang ?? null,
        penyebut: updated.penyebut ?? "",
        valuePenyebut: updated.valuePenyebut ?? null,
      };
    }

    onChange(updated);
    
    if (onTypeChange) {
      onTypeChange(newType);
    }
  };

  // Update field judul berdasarkan key
  const updateField = (key, value) => {
    if (loading || !editMode) return;
    
    const updated = {
      ...judul,
      [key]: value,
    };

    onChange(updated);
  };

  // Hitung hasil menggunakan computeDerived 
  const calculateHasilDisplay = (judulObj) => {
    if (!judulObj || !param) return "";
    
    try {
      // Buat objek nilai sementara untuk computeDerived
      const tempNilai = {
        id: "temp",
        nomor: nomor || "",
        judul: judulObj,
        bobot: Number(bobot) || 0,
        keterangan: "",
        riskindikator: {
          low: "",
          lowToModerate: "",
          moderate: "",
          moderateToHigh: "",
          high: "",
        }
      };

      const derived = computeDerived(tempNilai, param);
      
      // Ambil langsung hasilDisplay dari computeDerived yang sudah diperbaiki
      return derived.hasilDisplay || "";
      
    } catch (error) {
      console.error("Error calculating hasil:", error);
      return "";
    }
  };

  if (!judul) return null;

  const hasilDisplay = calculateHasilDisplay(judul);

  return (
    <div className="space-y-4">
      <div className="flex">
        {["Tanpa Faktor", "Satu Faktor", "Dua Faktor"].map((m) => (
          <button
            key={m}
            onClick={() => updateType(m)}
            disabled={loading || !editMode}
            className={`
              px-3 py-1 border border-black text-md transition 
              ${
                judul.type === m
                  ? "bg-blue-900 text-white"
                  : "bg-slate-100 text-slate-800"
              }
              hover:bg-blue-900 hover:text-white
              first:rounded-l last:rounded-r
              ${(loading || !editMode) ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {m === "Tanpa Faktor" && "Tanpa Faktor"}
            {m === "Satu Faktor" && "Satu Faktor"}
            {m === "Dua Faktor" && "Dua Faktor"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-16 gap-2">
        <div className="col-span-1 space-y-1">
          <label className="font-semibold text-md ml-1 tracking-wide text-slate-200">No</label>
          <Input
            className="text-slate-800 border border-black bg-white w-full"
            value={nomor || ""}
            onChange={(e) => onNomorChange && onNomorChange(e.target.value)}
            disabled={loading || !editMode}
            placeholder="3."
          />
        </div>

        <div className="col-span-1 space-y-1">
          <label className="font-semibold text-md ml-1 tracking-wide text-slate-200">Bobot</label>
          <Input
            className="text-slate-800 border border-black bg-white w-full"
            value={bobot || ""}
            onChange={(e) => onBobotChange && onBobotChange(e.target.value)}
            type="number"
            min="0"
            max="100"
            step="0.01"
            disabled={loading || !editMode}
            placeholder="max 100%"
          />
        </div>

        <div className="col-span-14 space-y-1">
          <label className="font-semibold text-md ml-1 tracking-wide text-slate-200">Judul Nilai</label>
          <Input
            className="text-slate-800 border border-black bg-white w-full"
            value={judul.text || ""}
            onChange={(e) => updateField("text", e.target.value)}
            disabled={loading || !editMode}
            placeholder="masukan judul"
          />
        </div>
      </div>

      {judul.type === "Tanpa Faktor" && (
        <div className="grid grid-cols-4 gap-2">
          <div className="space-y-1 col-span-3">
            <label className="font-semibold text-md ml-1 tracking-wide text-slate-200">Value</label>
            <Input
              className="text-slate-800 border border-black bg-white w-full"
              value={judul.value ?? ""}
              onChange={(e) =>
                updateField("value", e.target.value === "" ? null : e.target.value)
              }
              disabled={loading || !editMode}
              placeholder="masukan value"
            />
          </div>
          <div className="space-y-1 col-span-1">
            <label className="font-semibold text-md ml-1 tracking-wide text-slate-200">Hasil (Read-Only)</label>
            <Input
              className="text-slate-800 border border-black bg-gray-100 w-full cursor-default"
              value={hasilDisplay || ""}
              readOnly
              placeholder="hasil"
            />
          </div>
        </div>
      )}

      {judul.type === "Satu Faktor" && (
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-2">
            <div className="space-y-1 col-span-3">
              <label className="font-semibold text-md ml-1 tracking-wide text-slate-200">Pembilang</label>
              <Input
                className="text-slate-800 border border-black bg-white w-full"
                value={judul.pembilang || ""}
                onChange={(e) => updateField("pembilang", e.target.value)}
                disabled={loading || !editMode}
                placeholder="masukan pembilang"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="font-semibold  text-md ml-1 tracking-wide text-slate-200">Value Pembilang</label>
              <Input
                className="text-slate-800 border border-black bg-white w-full"
                value={judul.valuePembilang ?? ""}
                onChange={(e) =>
                  updateField(
                    "valuePembilang",
                    e.target.value === "" ? null : e.target.value
                  )
                }
                disabled={loading || !editMode}
                placeholder="masukan value pembilang"
              />
            </div>
            
            <div className="space-y-1 col-span-1">
              <label className="font-semibold text-md ml-1 tracking-wide text-slate-200">Hasil (Read-Only)</label>
              <Input
                className="text-slate-800 border border-black bg-gray-100 w-full cursor-default"
                value={hasilDisplay || ""}
                readOnly
                placeholder="hasil"
              />
            </div>
          </div>
        </div>
      )}

      {judul.type === "Dua Faktor" && (
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-2">
            <div className="space-y-1 col-span-3">
              <label className="font-semibold text-md ml-1 tracking-wide text-slate-200">Pembilang</label>
              <Input
                className="text-slate-800 border border-black bg-white w-full"
                value={judul.pembilang || ""}
                onChange={(e) => updateField("pembilang", e.target.value)}
                disabled={loading || !editMode}
                placeholder="masukan pembilang"
              />
            </div>

            <div className="space-y-1 col-span-3">
              <label className="font-semibold text-md ml-1 tracking-wide text-slate-200">Value Pembilang</label>
              <Input
                className="text-slate-800 border border-black bg-white w-full"
                value={judul.valuePembilang ?? ""}
                onChange={(e) =>
                  updateField(
                    "valuePembilang",
                    e.target.value === "" ? null : e.target.value
                  )
                }
                disabled={loading || !editMode}
                placeholder="masukan value pembilang"
              />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-4">
            <div className="space-y-1 col-span-3">
              <label className="font-semibold text-md ml-1 tracking-wide text-slate-200">Penyebut</label>
              <Input
                className="text-slate-800 border border-black bg-white w-full"
                value={judul.penyebut || ""}
                onChange={(e) => updateField("penyebut", e.target.value)}
                disabled={loading || !editMode}
                placeholder="masukan penyebut"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="font-semibold text-md ml-1 tracking-wide text-slate-200">Value Penyebut</label>
              <Input
                className="text-slate-800 border border-black bg-white w-full"
                value={judul.valuePenyebut ?? ""}
                onChange={(e) =>
                  updateField(
                    "valuePenyebut",
                    e.target.value === "" ? null : e.target.value
                  )
                }
                disabled={loading || !editMode}
                placeholder="masukan value penyebut"
              />
            </div>
            
            <div className="space-y-1 col-span-1">
              <label className="font-semibold text-md ml-1 tracking-wide text-slate-200">Hasil (Read-Only)</label>
              <Input
                className="text-slate-800 border border-black bg-gray-100 w-full cursor-default"
                value={hasilDisplay || ""}
                readOnly
                placeholder="hasil"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Table Untuk Tampilin data
function TableInherent({ rows = [], activeQuarter }) {
  const [zoom, setZoom] = useState(100); 
  const [currentPage, setCurrentPage] = useState(1);
  const paginationRef = useRef(null);
  
  const minZoom = 100;
  const maxZoom = 150;
  const stepZoom = 5;
  const pageSize = 7; 

  // Tentukan warna background berdasarkan nilai total
  const getSummaryBgByValue = (total) => {
    if (!Number.isFinite(total)) return "";

    if (total <= 1) return "bg-[#4F6228] text-white";
    if (total <= 2) return "bg-[#92D050] text-black";
    if (total <= 3) return "bg-[#FFFF00] text-black";
    if (total <= 4) return "bg-[#FFC000] text-black";
    return "bg-[#FF0000] text-white";
  };

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const scrollLeft = () => {
    paginationRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    paginationRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return rows.slice(start, end);
  }, [rows, currentPage]);

  // Hitung summary global dari semua data
  const globalSummary = useMemo(() => {
    const totalWeighted = rows.reduce((sumParam, param) => {
      const nilaiList = Array.isArray(param.nilaiList) ? param.nilaiList : [];
      const derived = nilaiList.map((nv) => computeDerived(nv, param));
      return (
        sumParam +
        derived.reduce(
          (s, d) => (Number.isFinite(d?.weighted) ? s + d.weighted : s),
          0
        )
      );
    }, 0);

    return {
      totalWeighted,
      summaryBg: getSummaryBgByValue(totalWeighted) 
    };
  }, [rows]); 

  const handleZoomIn = () => setZoom((z) => Math.min(maxZoom, z + stepZoom));
  const handleZoomOut = () => setZoom((z) => Math.max(minZoom, z - stepZoom));
  const handleSliderChange = (e) => setZoom(Number(e.target.value));
  const handlePageClick = (page) => setCurrentPage(page);

  if (!Array.isArray(rows) || rows.length === 0) {
    return (
      <div className="flex items-center border border-black rounded-xl justify-center gap-2 p-6 text-md text-gray-500">
        <FileWarning />
        <span>Belum ada data untuk ditampilkan</span>
      </div>
    );
  }

  const rankBgMap = {
    1: "bg-[#4F6228] text-white",
    2: "bg-[#92D050] text-black",
    3: "bg-[#FFFF00] text-black",
    4: "bg-[#FFC000] text-black",
    5: "bg-[#FF0000] text-white",
  };

  const formatPercent = (val) => {
    if (val === null || val === undefined || val === "") return "-";
    const n = Number(val);
    if (Number.isNaN(n)) return String(val);

    const percent = Math.abs(n) <= 1 ? n * 100 : n;

    const rounded =
      Math.abs(percent - Math.round(percent)) < 1e-9
        ? Math.round(percent)
        : percent.toFixed(2);

    return `${rounded}%`;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 pr-2">
        <div>
          <h1 className="text-2xl font-semibold">Data Kredit Produk - Inherent</h1>
          <div className="text-md text-gray-600">
            Quarter Aktif: <span className="font-bold bg-blue-100 px-2 py-1 rounded">{activeQuarter?.toUpperCase()}</span>
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
            <span className="text-md font-medium mb-1">{zoom}%</span>
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

      <div className="w-full overflow-auto border border-black shadow">
        <div 
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top left',
            width: `${100 * (100/zoom)}%`, // Perbaikan: sesuaikan width
          }}
        >
          <table className="text-md table-fixed w-full">
            <colgroup>
              <col style={{ width: "3%" }} />
              <col style={{ width: "4%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "3%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "4%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
            </colgroup>
            
            <thead>
              <tr>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white text-center">No</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white text-center">Bobot</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white text-center">Parameter</th>

                <th className="border border-black px-2 py-2 bg-blue-900 text-white text-center">No</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white text-center">Nilai</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white text-center">Bobot</th>

                <th className="border border-black px-2 py-2 bg-[#4F6228] text-white text-center">Low</th>
                <th className="border border-black px-2 py-2 bg-[#92D050] text-black text-center">Low To Moderate</th>
                <th className="border border-black px-2 py-2 bg-[#FFFF00] text-black text-center">Moderate</th>
                <th className="border border-black px-2 py-2 bg-[#F97316] text-black text-center">Moderate To High</th>
                <th className="border border-black px-2 py-2 bg-[#FF0000] text-white text-center">High</th>

                <th className="border border-black px-2 py-2 bg-blue-950 text-white text-center">Hasil</th>
                <th className="border border-black px-2 py-2 bg-blue-950 text-white text-center">Peringkat</th>
                <th className="border border-black px-2 py-2 bg-blue-950 text-white text-center">Weighted</th>
                <th className="border border-black px-2 py-2 bg-blue-950 text-white text-center">Keterangan</th>
              </tr>
            </thead>

            <tbody>
              {pagedRows.map((param, pi) => {
                const nilaiList = Array.isArray(param.nilaiList) ? param.nilaiList : [];

                if (nilaiList.length === 0) {
                  return (
                    <tr key={`empty-${pi}`}>
                      <td className="border border-black px-2 py-2 align-top bg-[#E8F5FA] text-center">
                        {param.nomor || "-"}
                      </td>
                      <td className="border border-black px-2 py-2 align-top bg-[#E8F5FA] text-center">
                        {formatPercent(param.bobot)}
                      </td>
                      <td className="border border-black px-2 py-2 align-top bg-[#E8F5FA] break-words">
                        {param.judul || "-"}
                      </td>
                      <td
                        colSpan={12}
                        className="border border-black px-2 py-2 text-center text-gray-400 bg-white"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <TriangleAlert className="w-4 h-4" />
                          <span>Belum ada nilai untuk parameter ini</span>
                        </div>
                      </td>
                    </tr>
                  );
                }

                const derivedByIndex = nilaiList.map((nv) => computeDerived(nv, param));
                
                // Hitung total baris untuk parameter ini
                const totalRowsForParam = nilaiList.reduce((total, nilai) => {
                  const j = nilai.judul || { type: "Tanpa Faktor" };
                  if (j.type === "Satu Faktor") return total + 2;
                  if (j.type === "Dua Faktor") return total + 3;
                  return total + 1;
                }, 0);

                // Buat array untuk semua baris dalam parameter ini
                const allRowsInParam = [];
                
                nilaiList.forEach((nilai, ni) => {
                  const derived = derivedByIndex[ni] || {};
                  const { hasilDisplay, hasilRows, peringkat, weightedDisplay } = derived;
                  const j = nilai.judul || { type: "Tanpa Faktor" };
                  
                  let rowsForThisNilai = 1;
                  if (j.type === "Satu Faktor") rowsForThisNilai = 2;
                  if (j.type === "Dua Faktor") rowsForThisNilai = 3;

                  for (let subIndex = 0; subIndex < rowsForThisNilai; subIndex++) {
                    const isFirstRowOfParam = allRowsInParam.length === 0;
                    const isMainRow = subIndex === 0;
                    
                    let nilaiText = "-";
                    let hasilText = "-";
                    
                    if (j.type === "Tanpa Faktor" || subIndex === 0) {
                      nilaiText = j.text ?? "-";
                      hasilText = hasilDisplay || "-";
                    } else if (j.type === "Satu Faktor" && subIndex === 1) {
                      nilaiText = j.pembilang ?? "-";
                      hasilText = hasilRows?.[1] ?? "-";
                    } else if (j.type === "Dua Faktor") {
                      if (subIndex === 1) {
                        nilaiText = j.pembilang ?? "-";
                        hasilText = hasilRows?.[1] ?? "-";
                      } else if (subIndex === 2) {
                        nilaiText = j.penyebut ?? "-";
                        hasilText = hasilRows?.[2] ?? "-";
                      }
                    }

                    allRowsInParam.push({
                      key: `${param.id}-${nilai.id}-${subIndex}`,
                      isFirstRowOfParam,
                      isMainRow,
                      nilaiText,
                      hasilText,
                      nilai,
                      j,
                      subIndex,
                      rowsForThisNilai,
                      derived,
                      peringkat,
                      weightedDisplay,
                    });
                  }
                });

                // Render semua baris dalam parameter
                return allRowsInParam.map((rowData, rowIndex) => {
                  const {
                    key,
                    isFirstRowOfParam,
                    isMainRow,
                    nilaiText,
                    hasilText,
                    nilai,
                    j,
                    subIndex,
                    rowsForThisNilai,
                    derived,
                    peringkat,
                    weightedDisplay,
                  } = rowData;

                  return (
                    <tr key={key}>
                      {/* Kolom Parameter (rowspan) */}
                      {isFirstRowOfParam ? (
                        <>
                          <td
                            rowSpan={totalRowsForParam}
                            className="border border-black px-2 py-2 align-middle bg-[#E8F5FA] text-center"
                          >
                            {param.nomor || "-"}
                          </td>
                          <td
                            rowSpan={totalRowsForParam}
                            className="border border-black px-2 py-2 align-middle bg-[#E8F5FA] text-center"
                          >
                            {formatPercent(param.bobot)}
                          </td>
                          <td 
                            rowSpan={totalRowsForParam}
                            className="border border-black px-2 py-2 align-middle bg-[#E8F5FA] break-words"
                          >
                            {param.judul || "-"}
                          </td>
                        </>
                      ) : null}

                      {/* Kolom Nilai */}
                      {isMainRow ? (
                        <>
                          <td className="border border-black px-2 py-2 text-center bg-[#E8F5FA]">
                            {nilai.nomor ?? "-"}
                          </td>
                          <td className="border border-black px-2 py-2 bg-[#E8F5FA] break-words">
                            <div className="text-md font-semibold">
                              {nilaiText}
                            </div>
                          </td>
                          <td className="border border-black px-2 py-2 text-center bg-[#E8F5FA]">
                            {formatPercent(nilai.bobot)}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border border-black px-2 py-2 text-center bg-white"></td>
                          <td className="border border-black px-2 py-2 bg-white break-words">
                            <div className="text-md">
                              {nilaiText}
                            </div>
                          </td>
                          <td className="border border-black px-2 py-2 text-center bg-white"></td>
                        </>
                      )}

                      {/* Kolom Risk Indicator */}
                      {["low", "lowToModerate", "moderate", "moderateToHigh", "high"].map((rk) => (
                        <td
                          key={rk}
                          className={`border border-black px-2 py-2 text-center ${isMainRow ? 'bg-[#D9EAD3]' : 'bg-white'} break-words`}
                        >
                          {isMainRow ? (nilai.riskindikator?.[rk] ?? "-") : ""}
                        </td>
                      ))}

                      {/* Kolom Hasil */}
                      <td className={`border border-black px-2 py-2 text-center ${isMainRow ? 'bg-white' : 'bg-[#D9EAD3]'} break-words`}>
                        <div className={isMainRow ? "text-md font-semibold" : "text-md"}>
                          {hasilText}
                        </div>
                      </td>

                      {/* Kolom Peringkat, Weighted, Keterangan (rowspan) */}
                      {subIndex === 0 ? (
                        <>
                          <td
                            rowSpan={rowsForThisNilai}
                            className={`border border-black px-2 py-2 align-middle text-center font-semibold ${peringkat && rankBgMap[peringkat] ? rankBgMap[peringkat] : ""}`}
                          >
                            {Number.isFinite(peringkat) ? peringkat : "-"}
                          </td>
                          <td
                            rowSpan={rowsForThisNilai}
                            className="border border-black px-2 py-2 align-middle text-center bg-white"
                          >
                            {weightedDisplay || "-"}
                          </td>
                          <td
                            rowSpan={rowsForThisNilai}
                            className="border border-black px-2 py-2 align-middle bg-white break-words"
                          >
                            {nilai.keterangan ?? ""}
                          </td>
                        </>
                      ) : null}
                    </tr>
                  );
                });
              })}
              
              {/* Summary Row */}
              <tr>
                <td colSpan={11} className="border border-black bg-white"></td>
                <td colSpan={2} className="border border-black px-2 py-2 text-center font-semibold text-white bg-blue-900">
                  Summary
                </td>
                <td className={`border border-black px-2 py-2 text-center font-semibold ${globalSummary.summaryBg}`}>
                  {Number.isFinite(globalSummary.totalWeighted)
                    ? globalSummary.totalWeighted.toFixed(2)
                    : "-"}
                </td>
                <td className="border border-black bg-white"></td>
              </tr>
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
              className="h-8 w-8 flex items-center justify-center rounded-md border border-black bg-white text-blue-600 font-bold hover:bg-blue-500 hover:text-white"
            >
              <ArrowBigLeftDash className="w-4 h-4" />
            </button>
          )}

          <div 
            className="max-w-[420px] overflow-x-auto"
            ref={paginationRef}
            style={{ cursor: 'grab' }}
          >
            <div className="flex gap-2 px-2 py-1">
              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageClick(page)}
                    className={
                      "min-w-8 h-8 px-3 flex items-center justify-center rounded-md border border-black text-md font-semibold transition-colors duration-150 shrink-0 hover:bg-blue-600 hover:text-white " +
                      (isActive
                        ? "border border-black bg-blue-600 text-white"
                        : "bg-white border border-gray-600 text-black")
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
              className="h-8 w-8 flex items-center justify-center rounded-md border border-black bg-white text-blue-600 font-bold hover:bg-blue-500 hover:text-white"
            >
              <ArrowBigRightDash className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}