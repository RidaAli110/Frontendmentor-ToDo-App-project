/*Note to self:
If later I add a Drag and reorder feature, i need to add an unique id to each todos Object.
The index method will not work 
*/

'use strict';
const input = document.getElementById('add-item');
const todoItemsList = document.querySelector('.todo-items-list');
const listContainer = document.querySelector('.todo-list');
const itemsLeftCounter = document.querySelector('.items-left');
const filterContainer = document.getElementById('filter-container');
const clearBtn = document.querySelector('.clear-completed');
const themeBtn = document.querySelector('.theme-btn');
const headerImg = document.querySelector('.head-image');
const themeIcon = document.querySelector('.theme-btn img');
const mobileHeaderImg = document.querySelector('picture source');

// The localStorage array that has the text and completed state in an object
let todos = [];

loadThemeFromStorage();
loadTodosFromStorage();

function addTodo() {
  if (input.value.trim() === '') {
    alert('Please add a Task');
    return;
  }

  const newItemText = input.value.trim();

  const id = crypto.randomUUID();

  createTodo(newItemText, id);

  // save the todo to the localStorage todos array
  addToStorage(newItemText, id);

  updateItemsLeft();

  input.value = '';
}

// adds the input's text when Enter is pressed
function addInputText(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTodo();
  }
}

// Create the todo
function createTodo(todoText, id, completed) {
  const itemLi = document.createElement('li');
  itemLi.classList.add('list-item');
  itemLi.dataset.uniqueId = id;

  if (completed) {
    itemLi.classList.add('is-completed');
  }
  const completedBtn = document.createElement('button');
  completedBtn.setAttribute('aria-label', 'Mark Todo as completed');
  completedBtn.innerHTML = `<img src="./images/icon-check.svg" alt="" />`;
  completedBtn.classList.add('completed');
  const noteText = document.createElement('p');
  noteText.classList.add('list-text');
  noteText.textContent = todoText;

  // Add the complete button and the note Text to the list item
  itemLi.append(completedBtn, noteText);

  // Add the new todo item to the list container
  todoItemsList.appendChild(itemLi);

  createDeleteButton(itemLi);
}

// Mark as Completed
function completed(e) {
  const completedBtn = e.target.closest('.completed');
  if (completedBtn) {
    const item = completedBtn.closest('.list-item');

    // Get the ID of the selected todo
    const itemId = item.dataset.uniqueId;
    // Find the todo with the same ID
    const completedItem = todos.find((todo) => {
      return todo.id === itemId;
    });
    // Stop if the todo could not be found
    if (!completedItem) {
      return;
    }

    // Flip the completed boolean
    completedItem.completed = !completedItem.completed;
    localStorage.setItem('savedTodos', JSON.stringify(todos));
    updateItemsLeft();

    item.classList.toggle('is-completed');
  }
}

// Creating delete button
function createDeleteButton(itemLi) {
  const delBtn = document.createElement('button');
  delBtn.setAttribute('aria-label', 'Delete task');
  delBtn.classList.add('delete-btn');
  delBtn.innerHTML = `<img src="./images/icon-cross.svg"  alt='' />`;
  itemLi.appendChild(delBtn);
}

// Delete Item from list
function deleteItem(e) {
  const deleteBtn = e.target.closest('.delete-btn');
  if (deleteBtn) {
    const item = deleteBtn.closest('.list-item');
    const itemId = item.dataset.uniqueId;
    const deletedItem = todos.find((todo) => {
      return todo.id === itemId;
    });
    if (!deletedItem) {
      return;
    }
    // Remove todo from page
    item.remove();
    // Remove todo from todos array and update localStorage
    removeFromStorage(deletedItem);
    updateItemsLeft();
  }
}

// Items left counter
function itemsLeft() {
  const activeTodos = todos.filter((todo) => {
    return !todo.completed;
  });
  return activeTodos.length;
}

function updateItemsLeft() {
  itemsLeftCounter.textContent = `${itemsLeft()} items left`;
}

// Filter Buttons
function filterTodos(e) {
  if (e.target.classList.contains('filter-btns')) {
    const listItemsNodeList = document.querySelectorAll('.list-item');

    const btns = document.querySelectorAll('.filter-btns');
    btns.forEach((btn) => {
      btn.setAttribute('aria-pressed', 'false');
    });
    e.target.setAttribute('aria-pressed', 'true');

    switch (e.target.dataset.filter) {
      case 'all':
        const all = listItemsNodeList;

        all.forEach((item) => {
          item.style.display = '';
        });
        break;

      case 'active':
        const active = listItemsNodeList;

        active.forEach((todo) => {
          const itemId = todo.dataset.uniqueId;
          const matchingTodo = todos.find((todo) => {
            return todo.id === itemId;
          });

          if (!matchingTodo) {
            return;
          }

          if (!matchingTodo.completed) {
            todo.style.display = '';
          } else {
            todo.style.display = 'none';
          }
        });
        break;

      case 'completed':
        const completed = listItemsNodeList;
        completed.forEach((todo) => {
          const itemId = todo.dataset.uniqueId;
          const matchingTodo = todos.find((todo) => {
            return todo.id === itemId;
          });

          if (!matchingTodo) {
            return;
          }

          if (matchingTodo.completed) {
            todo.style.display = '';
          } else {
            todo.style.display = 'none';
          }
        });
        break;
      default:
        break;
    }
  }
}

// Clear Completed button
function clearCompleted() {
  // Get all todo <li> elements on the page
  const listItems = document.querySelectorAll('.list-item');

  // Find the matching todo using its unique ID
  listItems.forEach((item) => {
    const itemId = item.dataset.uniqueId;
    const matchingTodo = todos.find((todo) => {
      return todo.id === itemId;
    });
    if (!matchingTodo) {
      return;
    }

    if (matchingTodo.completed) {
      item.remove();
    }
  });

  // Create a new array containing only the uncompleted todos
  const active = todos.filter((todo) => {
    return !todo.completed;
  });

  // Replace the old todos array with the filtered array
  todos = active;

  // Save the updated todos array to localStorage
  localStorage.setItem('savedTodos', JSON.stringify(todos));

  updateItemsLeft();
}

// Dark/ Light theme button
function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const light = document.body.classList.contains('light-theme');

  if (light) {
    themeIcon.src = './images/icon-moon.svg';
    headerImg.src = './images/bg-desktop-light.jpg';
    mobileHeaderImg.srcset = './images/bg-mobile-light.jpg';
    themeBtn.setAttribute('aria-label', 'Switch to dark mode');

    localStorage.setItem('theme', 'light');
  } else {
    themeIcon.src = './images/icon-sun.svg';
    headerImg.src = './images/bg-desktop-dark.jpg';
    mobileHeaderImg.srcset = './images/bg-mobile-dark.jpg';
    themeBtn.setAttribute('aria-label', 'Switch to light mode');

    // saves the current theme to local storage
    localStorage.setItem('theme', 'dark');
  }
}

// ---------- LOCAL STORAGE ----------

// Add to localStorage
function addToStorage(listText, id) {
  todos.push({
    // id key and property is shortened original (id: id,)
    id,
    text: listText,
    completed: false,
  });

  localStorage.setItem('savedTodos', JSON.stringify(todos));
}

// Get from localStorage
function loadTodosFromStorage() {
  const savedItems = JSON.parse(localStorage.getItem('savedTodos')) ?? [];
  //
  todos = savedItems;
  // When the page refreshes it will get each saved todo from localStorage and recreate it
  savedItems.forEach((todo) => {
    createTodo(todo.text, todo.id, todo.completed);
  });
  updateItemsLeft();
}

// Loads the theme from local storage when page refreshes
function loadThemeFromStorage() {
  const savedTheme = localStorage.getItem('theme') ?? 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.src = './images/icon-moon.svg';
    headerImg.src = './images/bg-desktop-light.jpg';
    mobileHeaderImg.srcset = './images/bg-mobile-light.jpg';
    themeBtn.setAttribute('aria-label', 'Switch to dark mode');
  }
}

// Remove from localStorage
function removeFromStorage(deletedItem) {
  // Filter out the deleted todo and keep all the remaining todos
  todos = todos.filter((todo) => {
    return todo.id !== deletedItem.id;
  });

  localStorage.setItem('savedTodos', JSON.stringify(todos));
}

//Event listeners
input.addEventListener('keydown', addInputText);
listContainer.addEventListener('click', deleteItem);
listContainer.addEventListener('click', completed);
filterContainer.addEventListener('click', filterTodos);
clearBtn.addEventListener('click', clearCompleted);
themeBtn.addEventListener('click', toggleTheme);
