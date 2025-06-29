import React, { useState } from 'react';

interface TodoFiltersProps {
  currentFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
}

export const TodoFilters = React.memo(function TodoFilters({ 
  currentFilter, 
  onFilterChange, 
  searchTerm, 
  onSearchChange 
}: TodoFiltersProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filterOptions = [
    { value: 'all' as const, label: 'すべて', icon: '📋' },
    { value: 'active' as const, label: '未完了', icon: '⏳' },
    { value: 'completed' as const, label: '完了済み', icon: '✅' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`
                inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${currentFilter === option.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              aria-pressed={currentFilter === option.value}
              aria-label={`${option.label}Todoを表示`}
            >
              <span className="mr-2">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Todoを検索..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`
              block w-full pl-10 pr-3 py-2 border rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              ${isSearchFocused 
                ? 'border-blue-300 bg-blue-50' 
                : 'border-gray-300 bg-white hover:border-gray-400'
              }
            `}
            aria-label="Todoを検索"
            aria-describedby="search-help"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="検索キーワードをクリア"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div id="search-help" className="sr-only">
        Todoタイトルやタグで検索できます
      </div>
    </div>
  );
});