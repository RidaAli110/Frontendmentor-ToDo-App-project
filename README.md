# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 


### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Add new todos to the list
- Mark todos as complete
- Delete todos from the list
- Filter by all/active/complete todos
- Clear all completed todos
- Toggle light and dark mode
- **Bonus**: Drag and drop to reorder items on the list

- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- JavaScript


### What I learned

During this project I learned many things like local Storage, For a while this had made me uncomfortable and I never really understood it. But during this project I was able to see how it works and why we use it. Even though I'm still not 100% confident I think next time I'll be able to recognize when and where it needs to be used. Overall this project was a good challenge and I did really find it difficult at times but now that it's done I feel more confident in my abilities and i am excited to move on to the next project. 


### This is the code which I learnt the most from.

```html
<button data-filter="all" aria-pressed="true" class="filter-btns btns" type="button"> All </button>
<button data-filter="active" aria-pressed="false" class="filter-btns btns" type="button"> Active </button>
<button data-filter="completed" aria-pressed="false" class="filter-btns btns" type="button"> Completed </button>
```
```css
.filter-btns[aria-pressed='true'] {
  color: var(--filter-active);
}
```
```js
// Add to localStorage
function addToStorage(listText) {
  todos.push({
    text: listText,
    completed: false,
  });

  localStorage.setItem('savedTodos', JSON.stringify(todos));
}
```


