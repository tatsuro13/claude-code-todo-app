import React from 'react';

interface TodoHeaderProps {
  totalCount: number;
  completedCount: number;
}

export const TodoHeader = React.memo(function TodoHeader({ totalCount, completedCount }: TodoHeaderProps) {
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Todo リスト
        </h1>
        <div className="text-left sm:text-right">
          <div className="text-xl sm:text-2xl font-semibold text-blue-600">
            {completedCount} / {totalCount}
          </div>
          <div className="text-sm text-gray-500">
            完了済み
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            進捗状況
          </span>
          <span className="text-sm font-medium text-gray-900">
            {completionPercentage}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3" role="progressbar" aria-valuenow={completionPercentage} aria-valuemin={0} aria-valuemax={100} aria-label="Todoの進捗状況">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-3 text-sm text-gray-600">
          <span>残り: {totalCount - completedCount}件</span>
          <span>完了: {completedCount}件</span>
        </div>
      </div>
    </header>
  );
});