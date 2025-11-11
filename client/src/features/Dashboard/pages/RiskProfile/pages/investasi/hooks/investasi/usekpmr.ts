import { useState, useMemo } from 'react';
import { getCurrentQuarter, getCurrentYear } from '../utils/time';

const KPMR_EMPTY_FORM = {
  year: getCurrentYear ? getCurrentYear() : new Date().getFullYear(),
  quarter: getCurrentQuarter ? getCurrentQuarter() : 'Q1',
  aspekNo: 'Aspek 1',
  aspekTitle: 'Tata Kelola Risiko',
  aspekBobot: 30,
  sectionNo: '1',
  sectionTitle: 'Bagaimana perumusan tingkat risiko yang akan diambil (risk appetite) dan toleransi risiko (risk tolerance) terkait risiko investasi?',
  sectionSkor: '',
  level1: '',
  level2: '',
  level3: '',
  level4: '',
  level5: '',
  evidence: '',
};

export function useKPMR() {
  const [viewYear, setViewYear] = useState(getCurrentYear ? getCurrentYear() : new Date().getFullYear());
  const [viewQuarter, setViewQuarter] = useState(getCurrentQuarter ? getCurrentQuarter() : 'Q1');
  const [query, setQuery] = useState('');

  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ ...KPMR_EMPTY_FORM, year: viewYear, quarter: viewQuarter });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const filtered = useMemo(() => {
    return rows
      .filter((r) => r.year === viewYear && r.quarter === viewQuarter)
      .filter((r) => `${r.aspekNo} ${r.aspekTitle} ${r.sectionNo} ${r.sectionTitle} ${r.evidence} ${r.level1} ${r.level2} ${r.level3} ${r.level4} ${r.level5}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        const aA = `${a.aspekNo}`.localeCompare(`${b.aspekNo}`, undefined, { numeric: true });
        if (aA !== 0) return aA;
        return `${a.sectionNo}`.localeCompare(`${b.sectionNo}`, undefined, { numeric: true });
      });
  }, [rows, viewYear, viewQuarter, query]);

  const groups = useMemo(() => {
    const g = new Map();
    for (const r of filtered) {
      const k = `${r.aspekNo}|${r.aspekTitle}|${r.aspekBobot}`;
      if (!g.has(k)) g.set(k, []);
      g.get(k).push(r);
    }
    return Array.from(g.entries()).map(([k, items]) => {
      const [aspekNo, aspekTitle, aspekBobot] = k.split('|');
      return { aspekNo, aspekTitle, aspekBobot: Number(aspekBobot), items };
    });
  }, [filtered]);

  const resetForm = () =>
    setForm((prev) => ({
      ...KPMR_EMPTY_FORM,
      year: viewYear,
      quarter: viewQuarter,
      aspekNo: prev.aspekNo,
      aspekTitle: prev.aspekTitle,
      aspekBobot: prev.aspekBobot,
    }));

  const addRow = () => {
    setRows((r) => [...r, { ...form }]);
    setEditingIndex(null);
    resetForm();
  };

  const startEdit = (idx) => {
    setEditingIndex(idx);
    setForm({ ...filtered[idx] });
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const target = filtered[editingIndex];
    const id = rows.findIndex((x) => x.year === target.year && x.quarter === target.quarter && x.aspekNo === target.aspekNo && x.sectionNo === target.sectionNo && x.sectionTitle === target.sectionTitle);
    if (id !== -1) {
      const updated = [...rows];
      updated[id] = { ...form };
      setRows(updated);
    }
    setEditingIndex(null);
    resetForm();
  };

  const removeRow = (idx) => {
    const target = filtered[idx];
    const id = rows.findIndex((x) => x.year === target.year && x.quarter === target.quarter && x.aspekNo === target.aspekNo && x.sectionNo === target.sectionNo && x.sectionTitle === target.sectionTitle);
    if (id !== -1) setRows((arr) => arr.filter((_, i) => i !== id));
    if (editingIndex === idx) {
      setEditingIndex(null);
      resetForm();
    }
  };

  return {
    // State
    viewYear,
    viewQuarter,
    query,
    form,
    editingIndex,
    filtered,
    groups,

    // Setters
    setViewYear,
    setViewQuarter,
    setQuery,

    // Actions
    handleChange,
    addRow,
    startEdit,
    saveEdit,
    removeRow,
    resetForm,
  };
}
