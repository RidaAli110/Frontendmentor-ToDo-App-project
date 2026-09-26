'use strict';
const input = document.getElementById('add-item');
const filterContainer = document.querySelector(
  '.filterBtns-itemsLeft-clearBtn',
);
const listContainer = document.querySelector('.todo-list');


function addTodo() {
  if (input.value.trim() === '') {
    alert('Please add a Task');
    return;
  }

  const newItemText = input.value.trim();
  createTodo(newItemText);

  input.value = '';
}

// Create the todo
function createTodo(todo) {
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('list-item');
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
    item.remove();
  }
}

// adds the inputs text to the item
function addInputText(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTodo();
  }
}

//Event listeners
input.addEventListener('keydown', addInputText);
listContainer.addEventListener('click', deleteItem);
