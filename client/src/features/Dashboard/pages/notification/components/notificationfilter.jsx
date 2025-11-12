import { motion } from 'framer-motion';
import { Search, Filter, X, CheckSquare, Square } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearchChange(localSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, searchTerm, onSearchChange]);

  const cardClass = `rounded-2xl border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;

  const inputClass = `w-full px-4 py-2 rounded-lg border transition-colors duration-300 text-sm ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
  }`;

  const hasActiveFilters = searchTerm || filter !== 'all' || categoryFilter !== 'all';
  const allSelected = selectedNotifications.length > 0 && selectedNotifications.length === filteredNotifications.length;
  const someSelected = selectedNotifications.length > 0 && selectedNotifications.length < filteredNotifications.length;

  const handleSelectAll = () => {
    console.log('🔘 Toggling select all:', allSelected ? 'deselect' : 'select');
    onSelectAll();
  };

  const handleCategoryClick = (category) => {
    console.log('📂 Filtering by category:', category);
    onCategoryClick(category);
  };

  const handleClearFilters = () => {
    console.log('🧹 Clearing all filters');
    setLocalSearchTerm('');
    onClearFilters();
  };

  const handleSearchChange = (value) => {
    setLocalSearchTerm(value);
  };

  const handleFilterChange = (value) => {
    console.log('🔍 Changing filter to:', value);
    onFilterChange(value);
  };

  const handleCategoryFilterChange = (value) => {
    console.log('📁 Changing category filter to:', value);
    onCategoryFilterChange(value);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`${cardClass} p-6 mb-6`}>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500">Filters & Search</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="ml-auto flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            title="Clear all filters and search"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search in title or message..." value={localSearchTerm} onChange={(e) => handleSearchChange(e.target.value)} className={`${inputClass} pl-10`} />
          {localSearchTerm && (
            <button onClick={() => handleSearchChange('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select value={filter} onChange={(e) => handleFilterChange(e.target.value)} className={inputClass}>
          <option value="all">All Notifications</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>

        <select value={categoryFilter} onChange={(e) => handleCategoryFilterChange(e.target.value)} className={inputClass}>
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSelectAll}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            allSelected ? (darkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-500 text-white shadow-lg') : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          title={allSelected ? 'Deselect all notifications' : 'Select all notifications'}
        >
          {allSelected ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
          {allSelected ? 'Deselect All' : 'Select All'}
          {someSelected && ' (Partial)'}
        </button>

        <span className="text-xs text-gray-500 mx-1">•</span>

        <span className="text-xs text-gray-500 mr-2">Quick Categories:</span>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
              categoryFilter === category ? (darkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-500 text-white shadow-lg') : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title={`Filter by ${category} category`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {hasActiveFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 text-xs text-gray-500 space-y-1">
          <div>
            Showing <strong>{filteredNotifications.length}</strong> notification{filteredNotifications.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
            {filter !== 'all' && ` (${filter} only)`}
            {categoryFilter !== 'all' && ` in ${categoryFilter} category`}
          </div>
          {selectedNotifications.length > 0 && (
            <div className={darkMode ? 'text-blue-300' : 'text-blue-600'}>
              <strong>{selectedNotifications.length}</strong> notification{selectedNotifications.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </motion.div>
      )}

      {filteredNotifications.length === 0 && hasActiveFilters && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="text-xs text-yellow-800 dark:text-yellow-300">
            <strong>No notifications found</strong> with the current filters. Try adjusting your search or filters.
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
