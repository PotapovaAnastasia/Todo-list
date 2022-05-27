const formAddElement = document.querySelector('.form')
const todoInputElement = document.querySelector('.header__input')
const buttonAddElement = document.querySelector('#add')
const buttonDeleteAllElement = document.querySelector('#delete-all')
const buttonDeleteLastElement = document.querySelector('#delete-last')
const todoContainerElement = document.querySelector('.tasks')
let counterAllElement = document.querySelector('.search__counterAll')
let counterCheckedElement = document.querySelector('.search__counterCompleted')
const buttonShowAllElement = document.querySelector('#show-all')
const buttonShowCompletedElement = document.querySelector('#show-comleted')
const searchFormElement = document.querySelector('.form2')
const searchInputElement = document.querySelector('.search__input')
let todoArray = []

formAddElement.addEventListener('submit', handleAddTodo)
buttonDeleteAllElement.addEventListener('click', handleDeleteAll)
buttonDeleteLastElement.addEventListener('click', handleDeleteLast)
todoContainerElement.addEventListener('click', handleDeleteTodo)
todoContainerElement.addEventListener('click', handleCheckboxChange)
buttonShowAllElement.addEventListener('click', () => render())
buttonShowCompletedElement.addEventListener('click', handleShowCompletedTodo)
searchFormElement.addEventListener('submit', handleSearchTodo)
window.addEventListener('beforeunload', handleSaveInLocalStorage)
window.addEventListener('DOMContentLoaded', handleDataFromLocalSrorage)

function handleAddTodo (event) {
   event.preventDefault()

   const content = todoInputElement.value
   todoArray.push(new Todo(content))

   formAddElement.reset()
   render()
}

function handleDeleteAll () {
   todoArray.length = 0
   render()
}

function handleDeleteLast() {
   let biggestId = -Infinity
   let indexOfLast

   todoArray.forEach((item, index) => {
      if (item.id > biggestId) {
         indexOfLast = index
      }
   })

   todoArray.splice(indexOfLast, 1)
   render()
}

function handleDeleteTodo(event) {
   let target = event.target

   if (target.tagName == 'BUTTON') {
      const todoElement = target.closest('.todo')
      const id = todoElement.id

      todoArray.forEach((item, index) => {
         if (item.id == id) {
            todoArray.splice(index, 1)
            render()
         }
      })
   }
}

function handleCheckboxChange(event) {
   const target = event.target

   if (target.tagName == 'INPUT') {
      const todoElement = target.closest('.todo')
      const id = todoElement.id

      todoArray.forEach((item) => {
         if (item.id == id) {
            item.isChecked = target.checked
            render()
         }
      })
   }
}

function handleShowCompletedTodo () {
   cleanContainerHTML()

   todoArray.forEach((item) => {
      if (item.isChecked) {
      todoContainerElement.innerHTML += createTemplateTodo(item)
      }
   })
}

function handleSearchTodo (event) {
   event.preventDefault()
   cleanContainerHTML()

   const value = searchInputElement.value

   todoArray.forEach((item) => {
      if (item.content.indexOf(value) !== -1) {
         todoContainerElement.innerHTML += createTemplateTodo(item)
      }
   })

   searchFormElement.reset()
}

function handleSaveInLocalStorage () {
   localStorage.setItem('todos', JSON.stringify(todoArray))
}

function handleDataFromLocalSrorage () {
   if (localStorage.getItem('todos') !== null) {
      const json = window.localStorage.getItem('todos')
      const parse = JSON.parse(json)

      todoArray = [...parse]
      render()
   }
}

function Todo(content = '') {
   this.content = content.trim() ? content : 'Nothing'
   this.createdAt = new Date()
   this.id = this.createdAt.getTime()
   this.isChecked = false
}

function createTemplateTodo (todo) {
   const checked = todo.isChecked ? 'checked' : ''
   const date = getDateInfo()

   return `
      <div class="todo border ${checked}" id="${todo.id}">
         <input type="checkbox" id="newcheckbox${todo.id}" name="newcheckbox" class="todo__checkbox border" ${checked}>
         <label for="newcheckbox${todo.id}"></label>
         <div class="todo__text">${todo.content}</div>
         <div class="todo__manage">
            <button class="todo__close border">X</button>
            <div class="todo__date">${date}</div>
         </div>
      </div>
      `
}

function getDateInfo () {
   const createdAt = new Date()
   const hours = createdAt.getHours()
   const minutes = getRightDateFormat(createdAt.getMinutes())
   const day = getRightDateFormat(createdAt.getDate())
   const month = getRightDateFormat(createdAt.getMonth() + 1)
   const year = createdAt.getFullYear()

   return `${hours}:${minutes}  ${day}.${month}.${year}`
}

function getRightDateFormat (number) {
   if (number > 10) {
      return number
   }
   return '0' + number
}

function render() {
   cleanContainerHTML()

   todoArray.forEach((item) => {
      todoContainerElement.innerHTML += createTemplateTodo(item)
   })

   counterAllElement.textContent = `All: ${todoArray.length}`
   
   let counter = 0
   todoArray.forEach((item) => {
      if (item.isChecked) {
         counter++
         counterCheckedElement.textContent = `Completed: ${counter}`
      } else if (counter == 0) {
         counterCheckedElement.textContent = `Completed: 0`
      }
   })
}

function cleanContainerHTML () {
   todoContainerElement.innerHTML = ''
}
