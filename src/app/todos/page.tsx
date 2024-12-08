'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Todo } from '@/types/todo';

type FormInputs = {
  todoTitle: string;
  userName: string;
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    if (!data.todoTitle.trim() || !data.userName.trim()) return;

    console.log('フォームデータ:', data);

    const todo: Todo = {
      id: Date.now(),
      title: data.todoTitle,
      completed: false,
      userName: data.userName,
    };

    setTodos([...todos, todo]);
    reset();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">TODOリスト</h1>

      {/* 新規追加フォーム */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              {...register('userName', {
                required: 'ユーザー名は必須です',
                minLength: {
                  value: 1,
                  message: '1文字以上入力してください'
                }
              })}
              type="text"
              placeholder="ユーザー名を入力"
              className="flex-1 p-2 border rounded"
            />
          </div>
          {errors.userName && (
            <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>
          )}

          <div className="flex gap-2">
            <input
              {...register('todoTitle', {
                required: 'TODOの内容は必須です',
                minLength: {
                  value: 1,
                  message: '1文字以上入力してください'
                }
              })}
              type="text"
              placeholder="新しいTODOを入力"
              className="flex-1 p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              追加
            </button>
          </div>
          {errors.todoTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.todoTitle.message}</p>
          )}
        </div>
      </form>

      {/* TODOリスト */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-gray-500">TODOがありません</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-2 p-3 border rounded"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => {
                  setTodos(
                    todos.map((t) =>
                      t.id === todo.id ? { ...t, completed: !t.completed } : t
                    )
                  );
                }}
                className="h-5 w-5"
              />
              <div className="flex-1">
                <span className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.title}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  (作成者: {todo.userName})
                </span>
              </div>
              <button
                onClick={() => {
                  setTodos(todos.filter((t) => t.id !== todo.id));
                }}
                className="text-red-500 hover:text-red-700"
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>

      {/* 完了済みの数を表示 */}
      <div className="mt-4 text-sm text-gray-600">
        完了済み: {todos.filter((todo) => todo.completed).length} /
        全タスク: {todos.length}
      </div>
    </div>
  );
}
