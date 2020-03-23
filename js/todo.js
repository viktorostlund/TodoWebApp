
const handleTodos = () => {
  const savedState = JSON.parse(localStorage.getItem('todosState'));
  const todos = savedState || [];

  const saveState = () => {
    window.localStorage.setItem('todosState', JSON.stringify(todos));
  };

  const todoHtmlTemplate = (todo) => `
            <article class="todo${todo.done ? ' todo--done' : ''}${!todo.done && todo.pinned ? ' todo--pinned' : ''}">
              <button class="todo__button${todo.done || todo.pinned ? ' button--hidden' : ''}">PIN</button>
              <button class="todo__button${todo.done || !todo.pinned ? ' button--hidden' : ''}">UNPIN</button>
              <button class="todo__button${todo.done ? '' : ' button--hidden'}">REMOVE</button>
              <h3 class="todo__title">${todo.title}</h3>
              ${todo.desc ? `<p class="todo__desc">${todo.desc}</p>` : ''}
            </article>
        `;

  const renderHtml = () => {
    let allTodosHtml = '';
    for (let i = 0; i < todos.length; i += 1) {
      allTodosHtml += todoHtmlTemplate(todos[i]);
    }
    document.querySelector('.todos').innerHTML = allTodosHtml;
  };

  const addTodo = (todoObject) => {
    const firstUnpinnedIndex = todos.indexOf(todos.find((todo) => !todo.pinned));
    const indexToInsert = firstUnpinnedIndex === -1 ? todos.length : firstUnpinnedIndex;
    todos.splice(indexToInsert, 0, {
      title: todoObject.title,
      desc: todoObject.desc,
      done: todoObject.done,
      pinned: todoObject.pinned,
    });
  };

  const createNewTodo = () => {
    const inputTitle = document.querySelector('.add_todo__title');
    const inputDesc = document.querySelector('.add_todo__desc');
    if (inputTitle.value) {
      addTodo({
        title: inputTitle.value,
        desc: inputDesc.value,
        done: false,
        pinned: false,
      });
      inputTitle.value = '';
      inputDesc.value = '';
    }
    window.dispatchEvent(new Event('statechange'));
  };

  const removeTodo = (index) => {
    todos.splice(index, 1);
  };

  const pinTodo = (i) => {
    todos[i].pinned = true;
    todos.unshift(todos.splice(i, 1)[0]);
  };

  const unpinTodo = (i) => {
    todos[i].pinned = false;
    const oldtodo = todos.splice(i, 1)[0];
    addTodo(oldtodo);
  };

  const markAsDoneOrUndone = (i) => {
    todos[i].done = !todos[i].done;
    if (todos[i].done === true) {
      todos.push(todos.splice(i, 1)[0]);
    } else {
      todos.unshift(todos.splice(i, 1)[0]);
    }
  }

  const handleTodoClicks = (event, i) => {
    event.preventDefault();
    if (event.target.innerText === 'REMOVE') {
      removeTodo(i);
    } else if (event.target.innerText === 'PIN') {
      pinTodo(i);
    } else if (event.target.innerText === 'UNPIN') {
      unpinTodo(i);
    } else {
      markAsDoneOrUndone(i);
    }
    window.dispatchEvent(new Event('statechange'));
  };

  const addClickListeners = () => {
    document.querySelector('.add_todo__button').addEventListener('click', (e) => {
      e.preventDefault();
      createNewTodo();
      document.querySelector('.add_todo__title').focus();
    });
    const todoElements = document.querySelectorAll('.todo');
    for (let i = 0; i < todoElements.length; i += 1) {
      todoElements[i].addEventListener('click', (event) => {
        handleTodoClicks(event, i);
      });
    }
  };

  window.addEventListener('statechange', () => {
    renderHtml();
    addClickListeners();
    saveState();
  });

  renderHtml();
  addClickListeners();
  document.querySelector('.add_todo__title').focus();
};

handleTodos();
