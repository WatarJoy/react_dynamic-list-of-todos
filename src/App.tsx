/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos, getUser } from './api';
import { Todo } from './types/Todo';
import { User } from './types/User';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    setIsLoadingTodos(true);
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
        setFilteredTodos(todosFromServer);
      })
      .finally(() => setIsLoadingTodos(false));
  }, []);

  useEffect(() => {
    let filtered = todos;

    if (filterStatus !== 'all') {
      filtered = todos.filter(todo =>
        filterStatus === 'completed' ? todo.completed : !todo.completed,
      );
    }

    if (query) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(query.toLowerCase()),
      );
    }

    setFilteredTodos(filtered);
  }, [todos, filterStatus, query]);

  const handleSelectTodo = (todo: Todo) => {
    if (selectedTodo?.id === todo.id) {
      setSelectedTodo(null);
    } else {
      setSelectedTodo(todo);
    }

    setIsLoadingUser(true);
    getUser(todo.userId)
      .then(user => setUserDetails(user))
      .finally(() => setIsLoadingUser(false));
  };

  const closeModal = () => {
    setSelectedTodo(null);
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                query={query}
                setQuery={setQuery}
              />
            </div>

            <div className="block">
              {isLoadingTodos && <Loader />}{' '}
              <TodoList
                todos={filteredTodos}
                onSelectTodo={handleSelectTodo}
                selectedTodoId={selectedTodo?.id || null}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          user={userDetails}
          isLoadingUser={isLoadingUser}
          closeModal={closeModal}
        />
      )}
    </>
  );
};
