import React from 'react';
import type { Todo } from '~/lib/types';

interface TodoItemProps {
  todo: Todo;
  onToggle?: (id: number) => void;
}

const priorityColors = {
  high: 'border-l-red-500 bg-red-50',
  medium: 'border-l-yellow-500 bg-yellow-50',
  low: 'border-l-green-500 bg-green-50',
};

const priorityLabels = {
  high: '高',
  medium: '中',
  low: '低',
};

const priorityTextColors = {
  high: 'text-red-700',
  medium: 'text-yellow-700',
  low: 'text-green-700',
};

export const TodoItem = React.memo(function TodoItem({ todo, onToggle }: TodoItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1日前';
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}週間前`;
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm border-l-4 p-4 
        hover:shadow-md transition-all duration-200 
        ${priorityColors[todo.priority]}
        ${todo.completed ? 'opacity-75' : ''}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle?.(todo.id)}
            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
            aria-label={`${todo.title}を${todo.completed ? '未完了' : '完了'}としてマーク`}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 
              className={`
                text-lg font-medium text-gray-900 
                ${todo.completed ? 'line-through text-gray-500' : ''}
              `}
            >
              {todo.title}
            </h3>
            <span 
              className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${priorityTextColors[todo.priority]} bg-white border
              `}
            >
              優先度: {priorityLabels[todo.priority]}
            </span>
          </div>
          
          {todo.description && (
            <p 
              className={`
                text-sm text-gray-600 mb-3 
                ${todo.completed ? 'line-through text-gray-400' : ''}
              `}
            >
              {todo.description}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {todo.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <span className="text-xs text-gray-500 sm:text-right">
              {formatDate(todo.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});