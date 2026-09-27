'use strict';
const input = document.getElementById('add-item');
const filterContainer = document.querySelector(
  '.filterBtns-itemsLeft-clearBtn',
);
const listContainer = document.querySelector('.todo-list');

// The Local storage array
let todos = [];

loadTodosFromStorage();

function addTodo() {
  if (input.value.trim() === '') {
    alert('Please add a Task');
    return;
  }

  const newItemText = input.value.trim();
  createTodo(newItemText);

  addToStorage(newItemText);

  input.value = '';
}

// adds the inputs text to the item
function addInputText(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTodo();
  }
}

// Create the todo
function createTodo(todo, completed) {
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('list-item');

  if (completed) {
    itemDiv.classList.add('is-completed');
  }
  itemDiv.innerHTML = `  <button
   aria-label="Mark todo as completed"
   class="completed"
   type="button" >
   <img src="./images/icon-check.svg" alt="" />
   </button>
   <p class="list-text">${todo}</p>`;
  filterContainer.before(itemDiv);

  createDeleteButton(itemDiv);
}

// Mark as Completed
function completed(e) {
  const completedBtn = e.target.closest('.completed');
  if (completedBtn) {
    const item = completedBtn.closest('.list-item');

    const items = document.querySelectorAll('.list-item');
    const itemsArray = Array.from(items);
    const completedIndex = itemsArray.indexOf(item);
    todos[completedIndex].completed = !todos[completedIndex].completed;
    localStorage.setItem('savedTodos', JSON.stringify(todos));

    item.classList.toggle('is-completed');
  }
}

// Creating delete button
function createDeleteButton(itemDiv) {
  const delBtn = document.createElement('button');
  delBtn.setAttribute('aria-label', 'Delete task');
  delBtn.classList.add('delete-btn');
  delBtn.innerHTML = `<img src="./images/icon-cross.svg"  alt='' />`;
  itemDiv.appendChild(delBtn);
}

// Delete Item from list
function deleteItem(e) {
  const deleteBtn = e.target.closest('.delete-btn');
  if (deleteBtn) {
    const item = deleteBtn.closest('.list-item');

    const items = document.querySelectorAll('.list-item');
    const itemsArray = Array.from(items);
    const deletedIndex = itemsArray.indexOf(item);

    item.remove();
    removeFromStorage(deletedIndex);
  }
}

// Local storage

// Add to local storage
function addToStorage(listText) {
  todos.push({
    text: listText,
    completed: false,
  });

  localStorage.setItem('savedTodos', JSON.stringify(todos));
}

// Get from local storage
function loadTodosFromStorage() {
  const savedItems = JSON.parse(localStorage.getItem('savedTodos')) ?? [];
  todos = savedItems;
  savedItems.forEach((todo) => {
    createTodo(todo.text, todo.completed);
  });
}

// Remove from local storage
function removeFromStorage(deletedIndex) {
  todos = todos.filter((todo, index) => {
    return index !== deletedIndex;
  });
  localStorage.setItem('savedTodos', JSON.stringify(todos));
}

//Event listeners
input.addEventListener('keydown', addInputText);
listContainer.addEventListener('click', deleteItem);
listContainer.addEventListener('click', completed);
