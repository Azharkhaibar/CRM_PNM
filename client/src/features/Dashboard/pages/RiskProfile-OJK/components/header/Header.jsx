import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Upload,
  ChevronDown,
  Check,
  Copy,
  RefreshCw,
  Loader2,
  FileUp,
  Import,
} from 'lucide-react';
import { useHeaderStore } from '../../store/headerStore';

export default function Header({
  title,
  onExportClick,
  onImportClick,
  categoryId,   // wajib: ID kategori (misal "pasar-produk")
  activeTab,    // wajib: "inherent" atau "kpmr"
}) {
  const [isCopying, setIsCopying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [copyingQuarter, setCopyingQuarter] = useState(null);
  const [resettingQuarter, setResettingQuarter] = useState(null);

  const {
    year,
    activeQuarter,
    search,
    setYear,
    setActiveQuarter,
    setSearch,
    requestExport,
    confirmAndCopyFromPreviousQuarter,
    confirmAndResetQuarter,
  } = useHeaderStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const yearsListRef = useRef(null);

  // Handle hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDropdownOpenChange = (open) => {
    if (!isHydrated) return;
    setDropdownOpen(open);
    if (open) {
      requestAnimationFrame(() => {
        const el = yearsListRef.current?.querySelector(`[data-year="${year}"]`);
        el?.scrollIntoView({ block: 'center' });
      });
    }
  };

  const handleCopyQuarter = async (selectedYear, selectedQuarter) => {
    setIsCopying(true);
    setCopyingQuarter(selectedQuarter);
    try {
      await confirmAndCopyFromPreviousQuarter(
        selectedYear,
        selectedQuarter,
        categoryId,    // filter kategori
        activeTab      // filter tipe data (inherent/kpmr)
      );
    } finally {
      setIsCopying(false);
      setCopyingQuarter(null);
    }
  };

  const handleResetQuarter = async (selectedYear, selectedQuarter) => {
    setIsResetting(true);
    setResettingQuarter(selectedQuarter);
    try {
      await confirmAndResetQuarter(
        selectedYear,
        selectedQuarter,
        categoryId,    // filter kategori
        activeTab      // filter tipe data
      );
    } finally {
      setIsResetting(false);
      setResettingQuarter(null);
    }
  };

  const handleYearSelect = (y) => {
    setYear(y);
    setDropdownOpen(false);
  };

  const quarterOptions = [
    { value: 'q1', label: 'Q1' },
    { value: 'q2', label: 'Q2' },
    { value: 'q3', label: 'Q3' },
    { value: 'q4', label: 'Q4' },
  ];

  const handleExport = () => {
    if (onExportClick) {
      onExportClick();
    } else {
      requestExport();
    }
  };

  const handleImport = () => {
    if (onImportClick) {
      onImportClick();
    } else {
      console.log('Import clicked');
      alert('Fitur import akan segera tersedia!');
    }
  };

  const allYears = Array.from({ length: 151 }, (_, i) => 2000 + i);
  const sortedYears = [...allYears].sort((a, b) => b - a);

  if (!isHydrated) {
    return (
      <div className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl flex items-center justify-between">
        <div className="flex items-center justify-center w-full">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl flex items-center justify-between">
      {/* TITLE */}
      <div>
        <h1 className="text-3xl font-semibold whitespace-nowrap">{title}</h1>
        <span className="text-sm">Silakan isi risk profile untuk OJK</span>
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-4">
        {/* SEARCH */}
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute left-2 top-1/2 -translate-y-1/2 text-black/70"
            size={18}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-8 bg-white hover:bg-gray-200 text-black"
          />
        </div>

        {/* YEAR SELECT */}
        <DropdownMenu open={dropdownOpen} onOpenChange={handleDropdownOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white text-gray-950 w-[150px] justify-between"
              disabled={!isHydrated}
            >
              <span>{year}</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[150px] bg-white p-0 overflow-hidden">
            <div className="max-h-[200px] overflow-y-auto" ref={yearsListRef}>
              {sortedYears.map((y) => (
                <div
                  key={y}
                  data-year={y}
                  className={`flex items-center justify-between px-3 py-2 hover:bg-gray-50 ${
                    y === year ? 'bg-blue-50' : ''
                  }`}
                >
                  <button
                    onClick={() => handleYearSelect(y)}
                    className={`flex-1 text-left py-1 ${
                      y === year ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    }`}
                  >
                    {y}
                  </button>
                  {y === year && <Check className="h-4 w-4 text-blue-600 ml-2" />}
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* QUARTER SELECT */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white text-gray-950 w-[180px] justify-between"
              disabled={!isHydrated}
            >
              <span>{activeQuarter.toUpperCase()}</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[180px] bg-white p-0">
            {quarterOptions.map((q) => (
              <div
                key={q.value}
                className={`flex items-center justify-between px-3 py-2 hover:bg-gray-100 ${
                  activeQuarter === q.value ? 'bg-blue-50' : ''
                }`}
              >
                <button
                  onClick={() => setActiveQuarter(q.value)}
                  className={`flex-1 text-left py-1 ${
                    activeQuarter === q.value ? 'text-blue-600 font-semibold' : 'text-gray-800'
                  }`}
                >
                  {q.label}
                </button>

                <div className="flex gap-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyQuarter(year, q.value);
                    }}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                    title={`Copy data dari quarter sebelumnya ke ${q.label} ${year}`}
                    disabled={isCopying}
                  >
                    {isCopying && copyingQuarter === q.value ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetQuarter(year, q.value);
                    }}
                    className="p-1.5 rounded hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                    title={`Reset data untuk ${q.label} ${year}`}
                    disabled={isResetting}
                  >
                    {isResetting && resettingQuarter === q.value ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {activeQuarter === q.value && (
                  <Check className="h-4 w-4 text-blue-600 ml-2" />
                )}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* IMPORT BUTTON */}
        {onImportClick && (
          <Button
            className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex gap-2"
            onClick={handleImport}
            disabled={!isHydrated}
          >
            <Import size={16} />
            Import
          </Button>
        )}

        {/* EXPORT BUTTON */}
        <Button
          className="bg-black hover:bg-gray-800 transition-transform hover:scale-110 text-white flex gap-2"
          onClick={handleExport}
          disabled={!isHydrated}
        >
          <Upload size={16} />
          Export Excel
        </Button>
      </div>
    </div>
  );
}