import React, { useMemo } from 'react';
import type { Todo } from '~/lib/types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter?: 'all' | 'active' | 'completed';
  onToggleTodo?: (id: number) => void;
}

export const TodoList = React.memo(function TodoList({ todos, filter = 'all', onToggleTodo }: TodoListProps) {
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const sortedTodos = useMemo(() => {
    return filteredTodos.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredTodos]);

  if (sortedTodos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {filter === 'all' 
            ? 'Todoはありません' 
            : filter === 'active' 
              ? '未完了のTodoはありません' 
              : '完了済みのTodoはありません'}
        </h3>
        <p className="text-gray-500">
          {filter === 'all' 
            ? '最初のTodoを追加してみましょう' 
            : filter === 'active' 
              ? 'すべてのタスクが完了しています！' 
              : '完了済みのタスクはまだありません'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="Todoリスト">
      {sortedTodos.map(todo => (
        <div key={todo.id} role="listitem">
          <TodoItem 
            todo={todo} 
            onToggle={onToggleTodo}
          />
        </div>
      ))}
    </div>
  );
});