import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';

export default function NotificationFilters({
  darkMode,
  searchTerm,
  filter,
  categoryFilter,
  categories,
  selectedNotifications,
  filteredNotifications,
  onSearchChange,
  onFilterChange,
  onCategoryFilterChange,
  onSelectAll,
  onCategoryClick,
  onClearFilters,
}) {
  const cardClass = `rounded-2xl border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;

  const inputClass = `w-full px-4 py-2 rounded-lg border transition-colors duration-300 text-sm ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
  }`;

  const hasActiveFilters = searchTerm || filter !== 'all' || categoryFilter !== 'all';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`${cardClass} p-6 mb-6`}>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500">Filters</h3>
        {hasActiveFilters && (
          <button onClick={onClearFilters} className="ml-auto flex items-center gap-1 text-xs px-2 py-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search in title or message..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className={`${inputClass} pl-10`} />
        </div>

        <select value={filter} onChange={(e) => onFilterChange(e.target.value)} className={inputClass}>
          <option value="all">All Notifications</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>

        <select value={categoryFilter} onChange={(e) => onCategoryFilterChange(e.target.value)} className={inputClass}>
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button onClick={onSelectAll} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
          {selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
        </button>

        <span className="text-xs text-gray-500 mx-1">•</span>

        <span className="text-xs text-gray-500 mr-2">Categories:</span>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryClick(category)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
              categoryFilter === category ? (darkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-500 text-white shadow-lg') : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {hasActiveFilters && (
        <div className="mt-3 text-xs text-gray-500">
          Showing {filteredNotifications.length} of {filteredNotifications.length} notifications
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}
    </motion.div>
  );
}
