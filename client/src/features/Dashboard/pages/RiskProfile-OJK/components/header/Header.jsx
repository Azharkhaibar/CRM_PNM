import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Search, Upload, ChevronDown, Check, Plus, Minus } from "lucide-react";
import { useHeaderStore } from "../../store/headerStore";


export default function Header({ title }) {

  const {
    year,
    activeQuarter,
    search,
    setYear,
    setActiveQuarter,
    setSearch,
    requestExport,
  } = useHeaderStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [availableYears, setAvailableYears] = useState([year]);

  const yearsListRef = useRef(null);

  useEffect(() => {
    setAvailableYears((prev) =>
      prev.includes(year) ? prev : [...prev, year]
    );
  }, [year]);

  const handleDropdownOpenChange = (open) => {
    setDropdownOpen(open);

    if (open) {
      requestAnimationFrame(() => {
        const el = yearsListRef.current?.querySelector(
          `[data-year="${year}"]`
        );
        el?.scrollIntoView({ block: "center" });
      });
    }
  };

  const handleYearSelect = (y) => {
    setYear(y);
    setDropdownOpen(false);
  };

  const addPreviousYear = () => {
    setAvailableYears((prev) => {
      const min = Math.min(...prev);
      return [...prev, min - 1];
    });
  };

  const addNextYear = () => {
    setAvailableYears((prev) => {
      const max = Math.max(...prev);
      return [...prev, max + 1];
    });
  };

  const quarterOptions = [
    { value: "q1", label: "Q1" },
    { value: "q2", label: "Q2" },
    { value: "q3", label: "Q3" },
    { value: "q4", label: "Q4" },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-blue-700 to-sky-600 text-white p-6 rounded-xl flex items-center justify-between">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold whitespace-nowrap">
          {title}
        </h1>
        <span className="text-xs">
          Silakan isi risk profile untuk OJK
        </span>
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
        <DropdownMenu
          open={dropdownOpen}
          onOpenChange={handleDropdownOpenChange}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white text-gray-950 w-[150px] justify-between"
            >
              <span>{year}</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[150px] bg-white p-0 overflow-hidden">
            <div
              ref={yearsListRef}
              className="overflow-y-auto max-h-[100px]"
            >
              {availableYears
                .slice()
                .sort((a, b) => a - b)
                .map((y) => (
                  <button
                    key={y}
                    data-year={y}
                    onClick={() => handleYearSelect(y)}
                    className={`w-full px-2 py-1.5 text-sm flex items-center justify-between
                      hover:bg-gray-100
                      ${
                        y === year
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700"
                      }`}
                  >
                    <span>{y}</span>
                    {y === year && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </button>
                ))}
            </div>

            <div className="border-t bg-gray-50 px-2 py-1.5 sticky bottom-0">
              <button
                onClick={addPreviousYear}
                className="w-full px-2 py-1.5 text-black text-xs flex items-center gap-2 hover:bg-gray-200 rounded"
              ><Plus/>
                tahun sebelumnya
              </button>
              <button
                onClick={addNextYear}
                className="w-full px-2 py-1.5 text-xs text-black flex items-center gap-2 hover:bg-gray-200 rounded"
              ><Minus/>
                tahun berikutnya
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* QUARTER SELECT  */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white text-gray-950 w-[150px] justify-between"
            >
              <span>{activeQuarter.toUpperCase()}</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[100px] bg-white p-0">
            {quarterOptions.map((q) => (
              <button
                key={q.value}
                onClick={() => setActiveQuarter(q.value)}
                className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-100 text-gray-900"
              >
                <span>{q.label}</span>
                {activeQuarter === q.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* EXPORT */}
        <Button
          className="bg-black transition-transform hover:scale-110 text-white flex gap-2"
          onClick={requestExport}
        >
          <Upload size={16} />
          Export Excel
        </Button>
      </div>
    </div>
  );
}
