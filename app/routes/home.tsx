import { useState, useMemo } from 'react';
import type { Route } from "./+types/home";
import { sampleTodos } from '~/data/sampleTodos';
import { TodoHeader } from '~/components/todo/TodoHeader';
import { TodoList } from '~/components/todo/TodoList';
import { TodoFilters } from '~/components/todo/TodoFilters';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Todo リスト - Modern Todo App" },
    { name: "description", content: "シンプルで美しいTodo管理アプリ" },
  ];
}

export default function Home() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTodos = useMemo(() => {
    let filtered = sampleTodos;

    if (searchTerm) {
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [searchTerm]);

  const completedCount = filteredTodos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <TodoHeader 
          totalCount={filteredTodos.length} 
          completedCount={completedCount} 
        />
        <TodoFilters
          currentFilter={filter}
          onFilterChange={setFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <TodoList 
          todos={filteredTodos} 
          filter={filter}
        />
      </div>
    </div>
  );
}
