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
    <div className="w-[1600px] space-y-6">
      <ParameterPanel rows={rows} setRows={setRows} active={active} onSaveData={onSaveData}/>
      <TableInherent rows={filteredRows} activeQuarter={activeQuarter} />
    </div>
  );
}

function ParameterPanel({ rows, setRows, active, onSaveData }) {
  const [activeParamIndex, setActiveParamIndex] = useState(null);
  const [activeNilaiIndex, setActiveNilaiIndex] = useState(0);
  const [showParameterForm, setShowParameterForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [originalParameter, setOriginalParameter] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteContext, setDeleteContext] = useState({
    type: '', // 'parameter' atau 'nilai'
    paramIndex: null,
    nilaiIndex: null
  });

  const [draftParameter, setDraftParameter] = useState({
    nomor: "",
    judul: "",
    bobot: "",
    kategori: {
      model: "",
      prinsip: "",
      jenis: "",
      underlying: [],
    },
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

  useEffect(() => {
    if (safeActiveParamIndex !== null) {
      setEditMode(false);
      setOriginalParameter(null);
    }
  }, [safeActiveParamIndex]);

  const parameter = editMode ? draftParameter : (safeActiveParam ?? draftParameter);

  useEffect(() => {
    setActiveNilaiIndex(0);
  }, [safeActiveParamIndex]);

  useEffect(() => {
    if (safeActiveParam && !editMode) {
      const newDraft = {
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
      };

      setDraftParameter((prev) =>
        JSON.stringify(prev) === JSON.stringify(newDraft) ? prev : newDraft
      );
    } else if (!safeActiveParam && !editMode) {
      setDraftParameter({
        nomor: "",
        judul: "",
        bobot: "",
        kategori: {
          model: "",
          prinsip: "",
          jenis: "",
          underlying: [],
        },
      });
      setEditMode(false);
      setOriginalParameter(null);
    }
  }, [safeActiveParam, editMode]);

  const handleChangeKategori = useCallback((key, value) => {
    setDraftParameter((prev) => {
      const next = {
        ...prev,
        kategori: {
          ...prev.kategori,
          [key]: value,
        },
      };

      if (key === "model") {
        if (value === "open_end") {
          next.kategori.underlying = [];
        }
        if (value === "terstruktur") {
          next.kategori.jenis = "";
        }
      }

      return next;
    });
  }, []);

  const handleChangeParameter = useCallback((key, value) => {
    setDraftParameter((p) => ({ ...p, [key]: value }));
  }, []);

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

  const handleUpdateParam = useCallback(() => {
    if (safeActiveParamIndex === null) {
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
      
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          const success = onSaveData();
          
          if (success) {
          } else {
            alert("❌ Parameter berhasil diupdate tapi gagal disimpan!");
          }
          
          setLoading(false);
        }
      }, 100);
      
    } catch (error) {
      alert("❌ Gagal mengupdate parameter.");
      setLoading(false);
    }
  }, [draftParameter, safeActiveParamIndex, rows, setRows, isKategoriIncomplete, onSaveData]);

  const handleAddNewParameter = useCallback(() => {
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
        nilaiList: [
          createNilai("Tanpa Faktor")
        ],
      };
      
      setRows((prev) => {
        const next = [...prev, newParam];
        setActiveParamIndex(next.length - 1);
        setActiveNilaiIndex(0);
        return next;
      });
      
      setDraftParameter({
        nomor: "",
        judul: "",
        bobot: "",
        kategori: {
          model: "",
          prinsip: "",
          jenis: "",
          underlying: [],
        },
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
      alert("Gagal menambah parameter.");
      setLoading(false);
    }
  }, [draftParameter, isKategoriIncomplete, setRows, onSaveData]);

  const handleCancelEdit = useCallback(() => {
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
    setDraftParameter({
      nomor: "",
      judul: "",
      bobot: "",
      kategori: {
        model: "",
        prinsip: "",
        jenis: "",
        underlying: [],
      },
    });
  }, [originalParameter, safeActiveParamIndex, setRows, onSaveData]);

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
        nilaiList: (source.nilaiList || []).map((n) => ({
          ...structuredClone(n),
          id: crypto.randomUUID(),
        })),
      };

      setRows((prev) => {
        const next = [...prev, copiedParam];
        setActiveParamIndex(next.length - 1);
        setActiveNilaiIndex(0);
        setEditMode(false);
        setOriginalParameter(null);
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

const handleDeleteParam = useCallback(() => {
  if (safeActiveParamIndex === null) return;

  const param = rows[safeActiveParamIndex];
  
  // Buka dialog konfirmasi dengan data lebih lengkap
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
    setActiveNilaiIndex(0);
    setEditMode(false);
    setOriginalParameter(null);
    
    // Tutup popup SEKARANG
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setDeleteContext({ type: '', paramIndex: null, nilaiIndex: null });
    
    // Simpan secara async
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
    
    const nextIndex = Math.max(0, nilaiIndex - 1);
    setActiveNilaiIndex(nextIndex);
    
    // HAPUS dua baris ini karena variabelnya tidak ada di ParameterPanel:
    // setEditModeNilai(false); // HAPUS
    // setOriginalNilai(null); // HAPUS
    
    // Tutup popup SEKARANG
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setDeleteContext({ type: '', paramIndex: null, nilaiIndex: null });
    
    // Simpan secara async tanpa mengganggu flow
   setTimeout(() => {
  if (typeof onSaveData === 'function') {
    const saveSuccess = onSaveData(updatedRows);
    
    if (saveSuccess) {
      // HAPUS alert ini atau ganti dengan notifikasi yang tidak blocking
      // alert("✅ Parameter berhasil dihapus!");
    } else {
      console.error("❌ Parameter berhasil dihapus tapi gagal menyimpan!");
    }
  }
  setLoading(false);
}, 100);
  }
  
  // Reset state untuk jaga-jaga
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
    setActiveNilaiIndex(0);
    setEditMode(false);
    setOriginalParameter(null);
    setDraftParameter({
      nomor: "",
      judul: "",
      bobot: "",
      kategori: {
        model: "",
        prinsip: "",
        jenis: "",
        underlying: [],
      },
    });
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

  return (
    <div className="w-full space-y-3">
      <div className="bg-gradient-to-r from-blue-700 to-sky-600 text-white px-4 py-3 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            <h2 className="">Parameter</h2>
          </div>

          <div className="flex items-center gap-2">
            {loading && (
              <div className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded">
                Memproses...
              </div>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowParameterForm(!showParameterForm)}
              className="bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm px-3 border-slate-600"
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

            <Button
              size="icon"
              onClick={handleCopyParam}
              disabled={safeActiveParamIndex === null || loading}
              className="bg-amber-600 hover:bg-amber-700"
              title="Salin Parameter"
            >
              <Copy className="w-4 h-4" />
            </Button>

            <Button 
              size="icon" 
              onClick={handleDeleteParam} 
              disabled={safeActiveParamIndex === null || loading} 
              className="bg-rose-600 hover:bg-rose-700"
              title="Hapus Parameter"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showParameterForm && (
          <>
            {isKategoriIncomplete(parameter) && parameter.kategori.model !== "tanpa_model" ? (
              <div className="w-full mt-2 p-1 flex items-center gap-2 justify-center bg-amber-50 text-amber-700 rounded border border-amber-200">
                <TriangleAlert className="w-4 h-4" />
                <span className="text-xs">Kategori belum diselesaikan</span>
              </div>
            ) : (
              <div className="w-full bg-slate-200 rounded p-0.5 mt-2" />
            )}

            <div className="w-full flex gap-4 my-3 items-start">
              <div className="w-[40%] flex flex-col">
                <label className="font-semibold text-sm ml-1 mb-1 text-slate-200">
                  Model Produk
                </label>
                <select
                  className="bg-white text-slate-800 text-sm rounded px-2 py-1 border border-slate-300"
                  value={parameter.kategori.model}
                  onChange={(e) =>
                    handleChangeKategori("model", e.target.value)
                  }
                  disabled={loading || (safeActiveParamIndex !== null && !editMode)}
                >
                  <option value="">Pilih Model</option>
                  <option value="tanpa_model">Tanpa Model</option>
                  <option value="open_end">Open-End</option>
                  <option value="terstruktur">Terstruktur</option>
                </select>
              </div>

              {parameter.kategori.model === "open_end" && (
                <div className="w-[50%] flex flex-col">
                  <label className="font-semibold text-sm ml-1 mb-1 text-slate-200">
                    Jenis Reksa Dana
                  </label>
                  <select
                    className="bg-white text-slate-800 text-sm rounded px-2 py-1 border border-slate-300"
                    value={parameter.kategori.jenis}
                    onChange={(e) =>
                      handleChangeKategori("jenis", e.target.value)
                    }
                    disabled={loading || (safeActiveParamIndex !== null && !editMode)}
                  >
                    <option value="">Pilih Jenis</option>
                    <option value="pasar_uang">Pasar Uang</option>
                    <option value="pendapatan_tetap">Pendapatan Tetap</option>
                    <option value="campuran">Campuran</option>
                    <option value="saham">Saham</option>
                    <option value="indeks">Indeks</option>
                     <option value="terproteksi">Terproteksi</option>
                  </select>
                </div>
              )}

              {parameter.kategori.model === "terstruktur" && (
                <div className="w-[50%] flex flex-col">
                  <label className="font-semibold text-sm ml-1 mb-1 text-slate-200">
                    Aset Dasar
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      className="w-full bg-white text-slate-800 text-sm rounded px-2 py-1 flex justify-between items-center border border-slate-300"
                      onClick={() => setOpenUnderlying((v) => !v)}
                      disabled={loading || (safeActiveParamIndex !== null && !editMode)}
                    >
                      <span className="truncate">
                        {parameter.kategori.underlying.length > 0
                          ? parameter.kategori.underlying.join(", ")
                          : "Pilih Aset Dasar"}
                      </span>
                      <span>▾</span>
                    </button>

                    {openUnderlying && (
                      <div className="absolute z-50 mt-1 w-full bg-white rounded shadow-lg text-sm text-slate-800 border border-slate-200">
                        {[
                          { key:"indeks", label: "Indeks"},
                          { key: "eba", label: "Efek Beragun Aset(EBA)" },
                          { key: "dinfra", label: "DinFra" },
                          { key: "obligasi", label: "Obligasi" },
                        ].map((u) => {
                          const checked = parameter.kategori.underlying.includes(u.key);

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
                                  const next = e.target.checked
                                    ? [...parameter.kategori.underlying, u.key]
                                    : parameter.kategori.underlying.filter(
                                        (x) => x !== u.key
                                      );

                                  handleChangeKategori("underlying", next);
                                }}
                                disabled={loading || (safeActiveParamIndex !== null && !editMode)}
                              />
                              <span>{u.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {parameter.kategori.model !== "tanpa_model" && (
                <div className="flex gap-4 mt-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-slate-200">
                    <input
                      type="checkbox"
                      checked={parameter.kategori.prinsip === "syariah"}
                      onChange={() =>
                        handleChangeKategori(
                          "prinsip",
                          parameter.kategori.prinsip === "syariah"
                            ? ""
                            : "syariah"
                        )
                      }
                      disabled={loading || (safeActiveParamIndex !== null && !editMode)}
                      className="accent-emerald-500"
                    />
                    <span>Syariah</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-slate-200">
                    <input
                      type="checkbox"
                      checked={parameter.kategori.prinsip === "konvensional"}
                      onChange={() =>
                        handleChangeKategori(
                          "prinsip",
                          parameter.kategori.prinsip === "konvensional"
                            ? ""
                            : "konvensional"
                        )
                      }
                      disabled={loading || (safeActiveParamIndex !== null && !editMode)}
                      className="accent-slate-500"
                    />
                    <span>Konvensional</span>
                  </label>
                </div>
              )}
            </div>

            <div className="w-full flex gap-2">
              <div className="w-[10%]">
                <label className="font-semibold text-sm ml-2 text-slate-200">No</label>
                <Input
                  placeholder="1."
                  value={parameter.nomor}
                  onChange={(e) => handleChangeParameter("nomor", e.target.value)}
                  className="bg-white text-slate-950 border-slate-300"
                  disabled={loading || (safeActiveParamIndex !== null && !editMode)}
                />
              </div>

              <div className="w-[10%]">
                <label className="font-semibold text-sm ml-2 text-slate-200">Bobot</label>
                <Input
                  placeholder="max 100%"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={parameter.bobot}
                  onChange={(e) => handleChangeParameter("bobot", e.target.value)}
                  className="bg-white text-slate-950 border-slate-300"
                  disabled={loading || (safeActiveParamIndex !== null && !editMode)}
                />
              </div>

              <div className="w-[80%]">
                <label className="font-semibold text-sm ml-2 text-slate-200">Parameter</label>
                <Input
                  placeholder="Reksa Dana"
                  value={parameter.judul}
                  disabled={
                    (parameter.kategori.model !== "tanpa_model" && isKategoriIncomplete(parameter)) || 
                    loading ||
                    (safeActiveParamIndex !== null && !editMode)
                  }
                  onChange={(e) => handleChangeParameter("judul", e.target.value)}
                  className={`bg-white text-slate-950 border-slate-300 ${
                    (parameter.kategori.model !== "tanpa_model" && isKategoriIncomplete(parameter)) || 
                    loading ||
                    (safeActiveParamIndex !== null && !editMode) ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>

            <button
              ref={dropdownBtnRef}
              onClick={() => setOpenParamList((v) => !v)}
              className="w-full mt-3 bg-white text-sm text-slate-800 px-3 py-2 rounded-md flex justify-between border border-slate-300 hover:bg-slate-50"
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
                  className="fixed bg-white text-slate-800 rounded-md shadow-lg max-h-[220px] overflow-auto z-[9999] border border-slate-200"
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
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 border-b border-slate-200"
                  >
                    ← Kosongkan Pilihan
                  </button>
                  
                  {rows.map((row, idx) => (
                    <button
                      key={row.id ?? idx}
                      onClick={() => {
                        setActiveParamIndex(idx);
                        setOpenParamList(false);
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

  useEffect(() => {
    setEditModeNilai(false);
    setOriginalNilai(null);
    setDraftNilai(null);
  }, [activeNilaiIndex]);

  const safeActiveIndex =
    hasNilai &&
    activeNilaiIndex >= 0 &&
    activeNilaiIndex < nilaiList.length
      ? activeNilaiIndex
      : -1; // -1 artinya mode draft/tidak ada yang dipilih

  // Fungsi untuk membuat draft nilai kosong
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
      portofolio: "",
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

  // Tentukan nilai yang sedang aktif atau draft
  const currentNilai = hasNilai && safeActiveIndex >= 0 
    ? nilaiList[safeActiveIndex] 
    : (draftNilai || createEmptyDraftNilai());

  useEffect(() => {
    if (!hasNilai && activeNilaiIndex !== -1) {
      setActiveNilaiIndex(-1);
    }
  }, [hasNilai, activeNilaiIndex, setActiveNilaiIndex]);

  const formatNilaiLabel = useCallback((nilai, index) => {
    if (!nilai) return "Pilih atau Tambah Nilai Baru";
    
    const nomor = nilai.nomor || (index + 1);
    const judul = nilai.judul?.text || "Tanpa Judul";
    const bobot = nilai.bobot ? ` (Bobot: ${nilai.bobot}%)` : "";
    const copyText = nilai.judul?.text?.includes("(Copy)") ? " (Copy)" : "";
    
    return `${nomor} – ${judul}${copyText}${bobot}`;
  }, []);

  const openFormula = () => {
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
    
    // Jika dalam mode draft, update draft
    if (safeActiveIndex === -1) {
      setDraftNilai(updatedNilai);
    } else {
      // Jika nilai yang dipilih, update di rows
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

  const handleChangeNilaiField = useCallback((path, value) => {
    if (paramIndex === null && safeActiveIndex !== -1) return;

    // Jika dalam mode draft (-1), update draftNilai
    if (safeActiveIndex === -1) {
      const updatedDraft = { ...draftNilai || createEmptyDraftNilai() };
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
      return;
    }

    // Jika nilai yang dipilih, update di rows
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
  }, [paramIndex, safeActiveIndex, setRows, draftNilai]);

  const handleChangeJudul = useCallback((judulPatch) => {
    if (paramIndex === null && safeActiveIndex !== -1) return;

    // Jika dalam mode draft (-1), update draftNilai
    if (safeActiveIndex === -1) {
      setDraftNilai(prev => ({
        ...prev || createEmptyDraftNilai(),
        judul: {
          ...(prev?.judul || createEmptyDraftNilai().judul),
          ...judulPatch,
        },
      }));
      return;
    }

    // Jika nilai yang dipilih, update di rows
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

  const handleAddNilai = useCallback(() => {
    if (paramIndex === null) return;

    const nilaiToAdd = draftNilai || createEmptyDraftNilai();
    
    // Validasi
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
    
    setRows((prev) =>
      prev.map((row, ri) =>
        ri === paramIndex
          ? {
              ...row,
              nilaiList: [...(row.nilaiList || []), newNilai],
            }
          : row
      )
    );

    setActiveNilaiIndex((row.nilaiList || []).length);
    setEditModeNilai(false);
    setOriginalNilai(null);
    setDraftNilai(null);
    
    setTimeout(() => {
      if (typeof onSaveData === 'function') {
        onSaveData();
      }
    }, 100);
  }, [paramIndex, draftNilai, setRows, setActiveNilaiIndex, onSaveData]);

  const handleEditNilai = useCallback(() => {
    if (safeActiveIndex >= 0 && currentNilai) {
      setOriginalNilai(structuredClone(currentNilai));
      setEditModeNilai(true);
      setDraftNilai(null);
    }
  }, [safeActiveIndex, currentNilai]);

  const handleUpdateNilai = useCallback(() => {
    if (safeActiveIndex === -1) {
      // Mode draft: tambah nilai baru
      handleAddNilai();
      return;
    }
    
    if (!currentNilai || paramIndex === null) return;
    
    if (!currentNilai.judul?.text?.trim()) {
      alert("Judul nilai tidak boleh kosong!");
      return;
    }
    
    const bobotNum = Number(currentNilai.bobot);
    if (isNaN(bobotNum) || bobotNum < 0 || bobotNum > 100) {
      alert("Bobot nilai harus antara 0 dan 100!");
      return;
    }
    
    setEditModeNilai(false);
    setOriginalNilai(null);
    setDraftNilai(null);
    
    setTimeout(() => {
      if (typeof onSaveData === 'function') {
        onSaveData();
      }
    }, 100);
  }, [currentNilai, paramIndex, safeActiveIndex, onSaveData, handleAddNilai]);

  const handleCancelEditNilai = useCallback(() => {
    if (originalNilai && paramIndex !== null && safeActiveIndex >= 0) {
      const confirmed = window.confirm(
        "Batalkan perubahan? Semua perubahan yang belum disimpan akan hilang."
      );
      
      if (!confirmed) return;
      
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
      
      setTimeout(() => {
        if (typeof onSaveData === 'function') {
          onSaveData();
        }
      }, 100);
    }
    
    setEditModeNilai(false);
    setOriginalNilai(null);
    setDraftNilai(null);
  }, [originalNilai, paramIndex, safeActiveIndex, setRows, onSaveData]);

  const handleCopyNilai = useCallback(() => {
    if (paramIndex === null || !currentNilai || safeActiveIndex === -1) return;

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

    setActiveNilaiIndex((row.nilaiList || []).length);
    setEditModeNilai(false);
    setOriginalNilai(null);
    setDraftNilai(null);
    
    setTimeout(() => {
      if (typeof onSaveData === 'function') {
        onSaveData();
      }
    }, 100);
  }, [paramIndex, currentNilai, safeActiveIndex, setRows, setActiveNilaiIndex, onSaveData]);

const handleDeleteNilai = useCallback(() => {
  if (paramIndex === null || !currentNilai || safeActiveIndex === -1) return;

  if (onOpenDeleteDialog) {
    onOpenDeleteDialog(currentNilai, safeActiveIndex);
  }
}, [paramIndex, currentNilai, safeActiveIndex, onOpenDeleteDialog]);

  const handleSelectNilai = (index) => {
    setActiveNilaiIndex(index);
    setOpenNilaiList(false);
    setEditModeNilai(false);
    setOriginalNilai(null);
    setDraftNilai(null);
  };

  const handleClearNilaiSelection = useCallback(() => {
    setActiveNilaiIndex(-1);
    setEditModeNilai(false);
    setOriginalNilai(null);
    setDraftNilai(createEmptyDraftNilai());
    setOpenNilaiList(false);
  }, []);

  const handleDraftNilaiChange = useCallback((updates) => {
    setDraftNilai(prev => ({
      ...prev || createEmptyDraftNilai(),
      ...updates,
    }));
  }, []);

  // Update judul draft ketika type berubah
  const updateDraftJudulType = useCallback((type) => {
    setDraftNilai(prev => {
      const current = prev || createEmptyDraftNilai();
      return {
        ...current,
        judul: {
          ...current.judul,
          type: type,
          // Reset fields berdasarkan type
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
  }, []);

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
                <label className="text-sm font-semibold mb-1">Formula</label>
                <Input
                  value={tempFormula}
                  onChange={(e) => setTempFormula(e.target.value)}
                  placeholder="contoh: pem / pen"
                  className="bg-slate-50 hover:bg-slate-100 text-slate-950 border-slate-300"
                  disabled={loading}
                />
              </div>

              <button
                type="button"
                onClick={() => setTempPercent(!tempPercent)}
                disabled={loading}
                className={
                  "flex h-9 w-9 items-center justify-center rounded-md border text-lg font-semibold transition-colors duration-150 border-slate-300 " +
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
                className="bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
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

      <div className="w-full bg-gradient-to-r from-blue-700 to-sky-600 text-white px-4 pt-4 pb-3 border-t border-slate-700 flex items-center justify-between gap-4 rounded-t-lg">
        <div className="text-lg font-bold">Nilai Form</div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowForm(!showForm)}
            className="bg-slate-700 text-slate-200 hover:bg-slate-600 text-sm px-3 border-slate-600"
            disabled={loading}
          >
            {showForm ? (
              <>    
                <ChevronUp className="w-4 h-4" />
                Sembunyikan
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 " />
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
              className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700"
              onClick={editModeNilai || safeActiveIndex === -1 ? handleUpdateNilai : handleAddNilai}
              title={editModeNilai ? "Update Nilai" : (safeActiveIndex === -1 ? "Tambah Nilai" : "Tambah Nilai Baru")}
              disabled={loading}
            >
              {editModeNilai ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>

            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-amber-600 hover:bg-amber-700"
              onClick={handleCopyNilai}
              disabled={safeActiveIndex === -1 || loading}
              title="Salin Nilai"
            >
              <Copy className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-rose-600 hover:bg-rose-700"
              onClick={handleDeleteNilai}
              disabled={safeActiveIndex === -1 || loading}
              title="Hapus Nilai"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="w-full bg-gradient-to-r from-blue-700 to-sky-600 text-white px-4 pb-4 border border-slate-700 space-y-4 rounded-b-lg">
          <div className="w-full bg-slate-200 rounded-lg p-0.5 mt-2"/>
          
          <div className="space-y-2">
            <div className="flex flex-col">
              <label className="font-semibold text-sm ml-1 mb-1 text-slate-200">
                Pilih Nilai
              </label>
              <button
                ref={dropdownNilaiBtnRef}
                onClick={() => setOpenNilaiList((v) => !v)}
                className="w-full bg-white text-slate-800 text-sm rounded px-3 py-2 flex justify-between items-center border border-slate-300 hover:bg-slate-50"
                disabled={loading}
              >
                <span className="truncate">
                  {safeActiveIndex >= 0 && hasNilai 
                    ? formatNilaiLabel(currentNilai, safeActiveIndex) 
                    : "Pilih atau Tambah Nilai Baru"}
                </span>
                <span>▾</span>
              </button>
            </div>

            {openNilaiList && dropdownNilaiRect && createPortal(
              <div
                ref={dropdownNilaiListRef}
                className="fixed bg-white text-slate-800 rounded-md shadow-lg max-h-[220px] overflow-auto z-[9999] border border-slate-200"
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
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 border-b border-slate-200"
                >
                  ← Kosongkan Pilihan (Buat Baru)
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

          {(currentNilai && (safeActiveIndex === -1 || safeActiveIndex >= 0)) && (
            <>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 border border-slate-300"
                  onClick={openFormula}
                  disabled={loading}
                >
                  Atur Rumus
                </Button>
              </div>

              <NilaiJudulInput
                judul={currentNilai.judul}
                onChange={safeActiveIndex === -1 ? 
                  (judulPatch) => handleDraftNilaiChange({ judul: { ...currentNilai.judul, ...judulPatch } }) : 
                  handleChangeJudul}
                onTypeChange={safeActiveIndex === -1 ? updateDraftJudulType : undefined}
                loading={loading}
                editMode={safeActiveIndex === -1 ? true : editModeNilai}
              />

              <div className="w-full flex gap-2 text-slate-800">
                <div className="w-[10%]">
                  <label className="font-semibold text-sm text-slate-200">
                    nomor
                  </label>
                  <Input
                    className="h-8 bg-white text-sm border-slate-300"
                    value={currentNilai.nomor ?? ""}
                    onChange={(e) => handleChangeNilaiField("nomor", e.target.value)}
                    disabled={loading || (safeActiveIndex >= 0 && !editModeNilai)}
                    placeholder="1.1."
                  />
                </div>

                <div className="w-[12%]">
                  <label className="font-semibold text-sm text-slate-200">
                    Bobot
                  </label>
                  <Input
                    className="h-8 bg-white text-sm border-slate-300"
                    value={currentNilai.bobot ?? ""}
                    onChange={(e) => handleChangeNilaiField("bobot", e.target.value)}
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={loading || (safeActiveIndex >= 0 && !editModeNilai)}
                    placeholder="max 100%"
                  />
                </div>

                <div className="w-[78%]">
                  <label className="font-semibold text-sm text-slate-200">
                   % dalam Portofolio
                  </label>
                  <Input
                    className="h-8 bg-white text-sm border-slate-300"
                    value={currentNilai.portofolio ?? ""}
                    onChange={(e) => handleChangeNilaiField("portofolio", e.target.value)}
                    disabled={loading || (safeActiveIndex >= 0 && !editModeNilai)}
                    placeholder="masukan % dalam portofolio"
                  />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm font-semibold py-2 text-slate-200">
                  Risk Indicator
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[
                    ["Low", "low", "#2ECC71"],
                    ["Low To Moderate", "lowToModerate", "#A3E635"],
                    ["Moderate", "moderate", "#FACC15"],
                    ["Moderate To High", "moderateToHigh", "#F97316"],
                    ["High", "high", "#EF4444"],
                  ].map(([label, key, color]) => (
                    <RiskItem
                      key={key}
                      label={label}
                      color={color}
                      value={currentNilai.riskindikator?.[key] ?? ""}
                      onChange={(v) => handleChangeNilaiField(`riskindikator.${key}`, v)}
                      loading={loading}
                      editMode={safeActiveIndex === -1 ? true : editModeNilai}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-2 text-slate-800">
                <label className="text-slate-200 font-semibold text-sm">
                  Keterangan
                </label>
                <Textarea
                  className="min-h-[40px] text-sm bg-white border-slate-300"
                  value={currentNilai.keterangan ?? ""}
                  onChange={(e) => handleChangeNilaiField("keterangan", e.target.value)}
                  disabled={loading || (safeActiveIndex >= 0 && !editModeNilai)}
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

// Komponen untuk input risk indicator
function RiskItem({ label, value, onChange, color, loading = false }) {
  return (
    <div
      className="rounded-lg px-3 py-3 flex flex-col gap-2 border border-slate-300 shadow-sm"
      style={{ backgroundColor: color }}
    >
      <div className="text-sm font-bold uppercase text-black text-center">
        {label}
      </div>
      <div className="bg-white/90 rounded border border-slate-300">
        <Textarea
         className="min-h-[60px] text-xs bg-transparent text-slate-800 resize-none text-center p-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          placeholder="masukan angka atau huruf"
          
        />
      </div>
    </div>
  );
}


function NilaiJudulInput({ judul, onChange, onTypeChange, loading = false, editMode = false }) {
  const [localJudul, setLocalJudul] = useState(judul);

  useEffect(() => {
    setLocalJudul(judul);
  }, [judul]);

  const updateType = (newType) => {
    if (loading || !editMode) return;
    
    let updated = {
      ...localJudul,
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

    setLocalJudul(updated);
    onChange(updated);
    
    // Panggil callback onTypeChange jika ada
    if (onTypeChange) {
      onTypeChange(newType);
    }
  };

  const updateField = (key, value) => {
    if (loading || !editMode) return;
    
    const updated = {
      ...localJudul,
      [key]: value,
    };

    setLocalJudul(updated);
    onChange(updated);
  };

  if (!localJudul) return null;

  return (
    <div className="space-y-4">
      <div className="flex">
        {["Tanpa Faktor", "Satu Faktor", "Dua Faktor"].map((m) => (
          <button
            key={m}
            onClick={() => updateType(m)}
            disabled={loading || !editMode}
            className={`
              px-3 py-1 border text-xs transition border-slate-300
              ${
                localJudul.type === m
                  ? "bg-blue-900 text-white"
                  : "bg-slate-100 text-slate-800"
              }
              hover:bg-slate-700 hover:text-white
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

      <div className="space-y-1">
        <label className="font-semibold text-sm text-slate-200">Judul Nilai</label>
        <Input
          className="text-slate-800 border-slate-300 bg-white"
          value={localJudul.text || ""}
          onChange={(e) => updateField("text", e.target.value)}
          disabled={loading || !editMode}
          placeholder="masukan judul"
        />
      </div>

      {localJudul.type === "Tanpa Faktor" && (
        <div className="space-y-1">
          <label className="font-semibold text-sm text-slate-200">Value</label>
          <Input
            className="text-slate-800 border-slate-300 bg-white"
            value={localJudul.value ?? ""}
            onChange={(e) =>
              updateField("value", e.target.value === "" ? null : e.target.value)
            }
            disabled={loading || !editMode}
            placeholder="masukan value"
          />
        </div>
      )}

      {localJudul.type === "Satu Faktor" && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="font-semibold text-sm text-slate-200">Pembilang</label>
              <Input
                className="text-slate-800 border-slate-300 bg-white"
                value={localJudul.pembilang || ""}
                onChange={(e) => updateField("pembilang", e.target.value)}
                disabled={loading || !editMode}
                placeholder="masukan pembilang"
              />
            </div>

            <div className="flex-1 space-y-1">
              <label className="font-semibold text-sm text-slate-200">Value Pembilang</label>
              <Input
                className="text-slate-800 border-slate-300 bg-white"
                value={localJudul.valuePembilang ?? ""}
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
        </div>
      )}

      {localJudul.type === "Dua Faktor" && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="font-semibold text-sm text-slate-200">Pembilang</label>
              <Input
                className="text-slate-800 border-slate-300 bg-white"
                value={localJudul.pembilang || ""}
                onChange={(e) => updateField("pembilang", e.target.value)}
                disabled={loading || !editMode}
                placeholder="masukan pembilang"
              />
            </div>

            <div className="flex-1 space-y-1">
              <label className="font-semibold text-sm text-slate-200">Value Pembilang</label>
              <Input
                className="text-slate-800 border-slate-300 bg-white"
                value={localJudul.valuePembilang ?? ""}
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

          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="font-semibold text-sm text-slate-200">Penyebut</label>
              <Input
                className="text-slate-800 border-slate-300 bg-white"
                value={localJudul.penyebut || ""}
                onChange={(e) => updateField("penyebut", e.target.value)}
                disabled={loading || !editMode}
                placeholder="masukan penyebut"
              />
            </div>

            <div className="flex-1 space-y-1">
              <label className="font-semibold text-sm text-slate-200">Value Penyebut</label>
              <Input
                className="text-slate-800 border-slate-300 bg-white"
                value={localJudul.valuePenyebut ?? ""}
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
          </div>
        </div>
      )}
    </div>
  );
}

function TableInherent({ rows = [], activeQuarter }) {
  const [zoom, setZoom] = useState(100); 
  const [currentPage, setCurrentPage] = useState(1);
  const paginationRef = useRef(null);
  
  const minZoom = 75;
  const maxZoom = 120;
  const stepZoom = 5;
  const pageSize = 7; 

  const getSummaryBgByValue = (total) => {
    if (!Number.isFinite(total)) return "";

    if (total <= 1) return "bg-green-400 text-black";
    if (total <= 2) return "bg-lime-300 text-black";
    if (total <= 3) return "bg-yellow-400 text-black";
    if (total <= 4) return "bg-orange-400 text-black";
    return "bg-red-500 text-white";
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
      <div className="flex items-center border rounded-xl justify-center gap-2 p-6 text-sm text-gray-500">
        <FileWarning />
        <span>Belum ada data untuk ditampilkan</span>
      </div>
    );
  }

  const rankBgMap = {
    1: "bg-green-400 text-black",
    2: "bg-lime-300 text-black",
    3: "bg-yellow-400 text-black",
    4: "bg-orange-400 text-black",
    5: "bg-red-500 text-white",
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
          <h1 className="text-2xl font-semibold">Data Pasar Produk - Inherent</h1>
          <div className="text-sm text-gray-600">
            Quarter Aktif: <span className="font-bold bg-blue-100 px-2 py-1 rounded">{activeQuarter?.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleZoomOut}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white text-xl font-bold shadow"
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
            className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white text-xl font-bold shadow"
          >
            +
          </button>
        </div>
      </div>

      <div className="w-full overflow-auto border shadow">
        <div style={{ zoom: `${zoom}%` }}>
          <table className="min-w-max text-sm table-fixed">
            <thead>
              <tr>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-10">No</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-16">Bobot</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-42">Parameter</th>

                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-10">No</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-64">Nilai</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-16">Bobot</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-64">% dalam Portofolio</th>

                <th className="border border-black py-2 bg-[#2ECC71] text-white w-32">Low</th>
                <th className="border border-black py-2 bg-[#A3E635] text-black w-32">Low To Moderate</th>
                <th className="border border-black py-2 bg-[#FACC15] text-black w-32">Moderate</th>
                <th className="border border-black px-2 py-2 bg-[#F97316] text-black w-32">Moderate To High</th>
                <th className="border border-black px-2 py-2 bg-[#FF0000] text-white w-32">High</th>

                <th className="border border-black px-2 py-2 bg-blue-950 text-white w-32">Hasil</th>
                <th className="border border-black px-2 py-2 bg-blue-950 text-white w-32">Peringkat</th>
                <th className="border border-black px-2 py-2 bg-blue-950 text-white w-32">Weighted</th>
                <th className="border border-black px-2 py-2 bg-blue-900 text-white w-64">Keterangan</th>
              </tr>
            </thead>

            <tbody>
              {pagedRows.map((param, pi) => {
                const nilaiList = Array.isArray(param.nilaiList) ? param.nilaiList : [];

                if (nilaiList.length === 0) {
                  return (
                    <tr key={`empty-${pi}`}>
                      <td className="border px-2 py-2 align-top bg-[#E8F5FA]">
                        {param.nomor || "-"}
                      </td>
                      <td className="border px-2 py-2 align-top bg-[#E8F5FA]">
                        {formatPercent(param.bobot)}
                      </td>
                      <td className="border px-2 py-2 align-top bg-[#E8F5FA] break-words max-w-[200px]">
                        {param.judul || "-"}
                      </td>
                      <td
                        colSpan={13}
                        className="border px-2 py-2 text-center text-gray-400 bg-white"
                      >
                        Belum ada nilai
                      </td>
                    </tr>
                  );
                }

                const derivedByIndex = nilaiList.map((nv) => computeDerived(nv, param));
                
                const totalRowsForParam = nilaiList.reduce((total, nilai) => {
                  const j = nilai.judul || { type: "Tanpa Faktor" };
                  if (j.type === "Satu Faktor") return total + 2;
                  if (j.type === "Dua Faktor") return total + 3;
                  return total + 1;
                }, 0);

                return nilaiList.map((nilai, ni) => {
                  const derived = derivedByIndex[ni] || {};
                  const { hasilDisplay, hasilRows, peringkat, weightedDisplay } = derived;
                  const j = nilai.judul || { type: "Tanpa Faktor" };
                  
                  let rowsForThisNilai = 1;
                  if (j.type === "Satu Faktor") rowsForThisNilai = 2;
                  if (j.type === "Dua Faktor") rowsForThisNilai = 3;

                  const rows = [];
                  
                  for (let subIndex = 0; subIndex < rowsForThisNilai; subIndex++) {
                    const isFirstRowOfParam = ni === 0 && subIndex === 0;
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

                    rows.push(
                      <tr key={`${param.id}-${nilai.id}-${subIndex}`}>
                        {isFirstRowOfParam && (
                          <>
                            <td
                              rowSpan={totalRowsForParam}
                              className="border px-2 py-2 align-middle bg-[#E8F5FA] text-center"
                            >
                              {param.nomor || "-"}
                            </td>
                            <td
                              rowSpan={totalRowsForParam}
                              className="border px-2 py-2 align-middle bg-[#E8F5FA] text-center"
                            >
                              {formatPercent(param.bobot)}
                            </td>
                            <td
                              rowSpan={totalRowsForParam}
                              className="border px-2 py-2 align-middle bg-[#E8F5FA] break-words max-w-[200px]"
                            >
                              {param.judul || "-"}
                            </td>
                          </>
                        )}

                        <td className={`border px-2 py-2 text-center ${isMainRow ? 'bg-[#E8F5FA]' : 'bg-white'}`}>
                          {isMainRow ? nilai.nomor ?? "-" : ""}
                        </td>

                        <td className={`border px-2 py-2 ${isMainRow ? 'bg-[#E8F5FA]' : 'bg-white'} break-words max-w-[180px]`}>
                          <div className={isMainRow ? "text-sm font-semibold" : "text-xs"}>
                            {nilaiText}
                          </div>
                        </td>

                        <td className={`border px-2 py-2 text-center ${isMainRow ? 'bg-[#E8F5FA]' : 'bg-white'}`}>
                          {isMainRow ? formatPercent(nilai.bobot) : ""}
                        </td>

                        <td className={`border px-2 py-2 text-center ${isMainRow ? 'bg-[#E8F5FA]' : 'bg-white'} break-words max-w-[180px]`}>
                          {isMainRow ? nilai.portofolio ?? "-" : ""}
                        </td>

                        {["low", "lowToModerate", "moderate", "moderateToHigh", "high"].map((rk) => (
                          <td
                            key={rk}
                            className={`border px-2 py-2 text-center ${isMainRow ? 'bg-[#D9EAD3]' : 'bg-white'} break-words max-w-[130px]`}
                          >
                            {isMainRow ? nilai.riskindikator?.[rk] ?? "-" : ""}
                          </td>
                        ))}

                        <td className={`border px-2 py-2 text-center ${isMainRow ? 'bg-white' : 'bg-[#D9EAD3]'} break-words max-w-[130px]`}>
                          <div className={isMainRow ? "text-sm font-semibold" : "text-xs"}>
                            {hasilText}
                          </div>
                        </td>

                        {subIndex === 0 ? (
                          <>
                            <td
                              rowSpan={rowsForThisNilai}
                              className={`border px-2 py-2 align-middle text-center font-semibold ${
                                peringkat ? rankBgMap[peringkat] : ""
                              }`}
                            >
                              {Number.isFinite(peringkat) ? peringkat : "-"}
                            </td>
                            <td
                              rowSpan={rowsForThisNilai}
                              className="border px-2 py-2 align-middle text-center bg-white"
                            >
                              {weightedDisplay || ""}
                            </td>
                            <td
                              rowSpan={rowsForThisNilai}
                              className="border px-2 py-2 text-center align-middle bg-white break-words max-w-[200px]"
                            >
                              {nilai.keterangan ?? ""}
                            </td>
                          </>
                        ) : null}
                      </tr>
                    );
                  }
                  
                  return rows;
                }).flat();
              })}
              
              <tr>
                <td colSpan={12} className="border-0 bg-white"></td>
                <td colSpan={2} className="border border-black px-2 py-2 text-center font-semibold text-white bg-blue-900">
                  Summary
                </td>
                <td className={`border px-2 py-2 text-center font-semibold ${globalSummary.summaryBg}`}>
                  {Number.isFinite(globalSummary.totalWeighted)
                    ? globalSummary.totalWeighted.toFixed(2)
                    : "-"}
                </td>
                <td className="border-0 bg-white"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 flex justify-center items-center gap-2">
        {totalPages > 7 && (
          <button
            type="button"
            onClick={scrollLeft}
            className="h-8 w-8 flex items-center justify-center rounded-md border bg-white text-blue-600 font-bold hover:bg-blue-500 hover:text-white"
          >
            <ArrowBigLeftDash />
          </button>
        )}

        <div 
          className="max-w-[420px] overflow-x-hidden"
          onWheel={(e) => {
            e.preventDefault();
            
            const container = paginationRef.current;
            if (container) {
              container.scrollLeft += e.deltaY * 2;
            }
          }}
          style={{ cursor: 'grab' }}
          onMouseEnter={() => {
            document.body.style.overflowY = 'hidden';
          }}
          onMouseLeave={() => {
            document.body.style.overflowY = 'auto';
          }}
        >
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
                    "min-w-8 h-8 px-3 flex items-center justify-center rounded-md border text-sm font-semibold transition-colors duration-150 shrink-0 hover:bg-blue-600 hover:text-white " +
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
            <ArrowBigRightDash />
          </button>
        )}
      </div>
    </div>
  );
}