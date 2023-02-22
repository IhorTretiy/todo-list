const todoForm = document.querySelector('#todo-form');
const formInput = document.querySelector('#todo-form input');
const remainimgTasks = document.querySelector('#remainimg-tasks');
const completadTasks = document.querySelector('#completad-tasks');
const totalTasks = document.querySelector('#total-tasks');
const todoList = document.querySelector('.todos');

let tasks = JSON.parse(localStorage.getItem('tasks')) || []

if (localStorage.getItem('tasks')) {
  tasks.map((task) => {
    createTask(task)
  })
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const inputValue = formInput.value

  if (inputValue == '' ){
    return
  }

  const task = {
    id: new Date().getTime(),
    name: inputValue,
    isCompleted: false
  }
  tasks.push(task)
  localStorage.setItem('tasks', JSON.stringify(tasks))
  createTask(task);
  todoForm.reset()
  formInput.focus()
})

todoList.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-task') || e.target.parentElement.classList.contains('remove-task') || e.target.parentElement.parentElement.classList.contains('remove-task') ) {
    const taskId = e.target.closest('li').id

    removeTask(taskId)
  }
})

todoList.addEventListener('keydown', (e) => {
  console.log(e.keyCode)
  if (e.keyCode == 13) {
    e.preventDefault()

    e.target.blur()
  }
})

todoList.addEventListener('input', (e) => {
  const taskId = e.target.closest('li').id
  updateTask(taskId, e.target)
})

function createTask(task){
  const taskEl = document.createElement('li');

  taskEl.setAttribute('id', task.id)
  if (task.isCompleted) {
    taskEl.classList.add('complete')
  }
  const taskElMarkup = `
    <div>
      <input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
      <span ${task.isCompleted ? '' : 'contenteditable'}>${task.name}</span>
    </div>
    <button title="Remove the ${task.name} task" class="remove-task">
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" /> </svg>
    </button>
  `
  taskEl.innerHTML = taskElMarkup
  todoList.appendChild(taskEl)
  countTasks()
}

function countTasks() {
  const completadTasksArray = tasks.filter((task) => task.isCompleted === true)

  totalTasks.textContent = tasks.length
  completadTasks.textContent = completadTasksArray.length
  remainimgTasks.textContent = tasks.length - completadTasksArray.length
}

function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId))

  localStorage.setItem('tasks', JSON.stringify(tasks))
  document.getElementById(taskId).remove()
  countTasks()
}

function updateTask(taskId, el) {
  const task = tasks.find((task) => task.id === parseInt(taskId))

  if (el.hasAttribute('contenteditable')) {
    task.name = el.textContent
  } else {
    const span = el.nextElementSibling
    const parent = el.closest('li')

    task.isCompleted = !task.isCompleted
    if (task.isCompleted) {
      span.removeAttribute('contenteditable')
      parent.classList.add('complete')
    } else {
      span.setAttribute('contenteditable', 'true')
      parent.classList.remove('complete')
    }
  }
  localStorage.setItem('tasks', JSON.stringify(tasks))
  countTasks()
}