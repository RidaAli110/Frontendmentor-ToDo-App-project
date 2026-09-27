/*Note to self:
If later I add a Drag and reorder feature, i need to add an unique id to each todos Object.
The index method will not work 
*/

'use strict';
const input = document.getElementById('add-item');
const todoItems = document.querySelector('.todo-items');
const listContainer = document.querySelector('.todo-list');

// The localStorage array that has the text and completed state in an object
let todos = [];

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
function createTodo(todo, completed) {
  const itemLi = document.createElement('li');
  itemLi.classList.add('list-item');

  if (completed) {
    itemLi.classList.add('is-completed');
  }
  itemLi.innerHTML = `  <button
   aria-label="Mark todo as completed"
   class="completed"
   type="button" >
   <img src="./images/icon-check.svg" alt="" />
   </button>
   <p class="list-text">${todo}</p>`;

  // Add the new todo item before the filter section
  todoItems.appendChild(itemLi);

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
