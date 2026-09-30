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

  createTodo(newItemText);

  // save the todo to the localStorage todos array
  addToStorage(newItemText);

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
function createTodo(todoText, completed) {
  const itemLi = document.createElement('li');
  itemLi.classList.add('list-item');

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

    // Find the index number of the todo
    const items = document.querySelectorAll('.list-item');
    const itemsArray = Array.from(items);
    const completedIndex = itemsArray.indexOf(item);
    // Flip true/false
    todos[completedIndex].completed = !todos[completedIndex].completed;
    // Save updated todos array to localStorage
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

    // This gets all the list items and converts them into a NodeList
    const items = document.querySelectorAll('.list-item');
    // This turns the node list into an array
    const itemsArray = Array.from(items);
    // This gets the index number of the item that was selected
    const deletedIndex = itemsArray.indexOf(item);

    // Remove todo from page
    item.remove();
    // Remove todo from localStorage
    removeFromStorage(deletedIndex);
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
        const listItems = listItemsNodeList;
        const all = Array.from(listItems);
        all.forEach((item) => {
          item.style.display = '';
        });
        break;

      case 'active':
        const activeListItems = listItemsNodeList;
        const active = Array.from(activeListItems);

        active.forEach((todo, index) => {
          if (!todos[index].completed) {
            todo.style.display = '';
          } else {
            todo.style.display = 'none';
          }
        });
        break;

      case 'completed':
        const completedItems = listItemsNodeList;
        const completed = Array.from(completedItems);
        completed.forEach((todo, index) => {
          if (todos[index].completed) {
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
  // Get all todo <li> elements currently displayed on the page
  const listItems = document.querySelectorAll('.list-item');

  // Check each DOM item against the corresponding todo in the todos array
  listItems.forEach((item, index) => {
    // If the corresponding todo is completed, remove it from the page
    if (todos[index].completed) {
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
function addToStorage(listText) {
  todos.push({
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
    createTodo(todo.text, todo.completed);
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
function removeFromStorage(deletedIndex) {
  // filter will create a new array so we will use it to update the old todos array
  todos = todos.filter((todo, index) => {
    // returns a new todos array without the deleted one
    return index !== deletedIndex;
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
