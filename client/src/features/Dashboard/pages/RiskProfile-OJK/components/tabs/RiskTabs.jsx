export default function RiskTabs({ value, onChange }) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-8">
        <button
          onClick={() => onChange("inherent")}
          className={`
            py-3 px-1 border-b-2 font-medium text-sm transition-colors
            ${
              value === "inherent"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
            }
          `}
        >
          INHERENT
        </button>

        <button
          onClick={() => onChange("kpmr")}
          className={`
            py-3 px-1 border-b-2 font-medium text-sm transition-colors
            ${
              value === "kpmr"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
            }
          `}
        >
          Kualitas Penerapan Manajemen Risiko
        </button>
      </nav>
    </div>
  );
}
