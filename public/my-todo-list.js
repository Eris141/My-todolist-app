

//get references to the input field and rask list
const newTodoInput = document.getElementById('input-todo');
const taskList = document.getElementById('task-list');
// add the event listtner for the button action
const addTodoButton = document.getElementById('add-todo-button');
//delete all button
const deleteAll = document.getElementById('delete-all-button');
const taskCount = document.getElementById('todo-count'); 

//handleAddTodo is the fucntion that makes the process when the butt is clickd


addTodoButton.addEventListener('click', handleAddTodo);

newTodoInput.addEventListener('keyup', function (event) {
  if(event.key === "Enter") {
    handleAddTodo();
  }
});

deleteAll.addEventListener('click', deleteAllTasks);

loadTasks();



//here is the fucntion that adds the new task when button is cliked
function handleAddTodo() {
  //get the value that is entered by user
  const getNewTaskText = newTodoInput.value.trim();

  if (getNewTaskText) {
    const newTask = {title: getNewTaskText, description: ""};

    //send post request to backend to add the new task
    fetch('/tasks', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({title: getNewTaskText, description: "a task descritpitonm"})
    })
    .then(response => response.json())
    .then(task => {
      displayTodoItem(task.title, task.id);
    })
    .catch(error => console.error("Error adding tasks", error));

    newTodoInput.value = '';
    newTodoInput.focus();

  } else {
    alert("Please enter a task!");
  }

}

function displayTodoItem(getNewTaskText, taskId, isChecked = false) {

  const newTodoItem = document.createElement('li');
  newTodoItem.className = "task-item";
  newTodoItem.dataset.id = taskId; //set the task ID as a data atribute

  const divInsideLi = document.createElement('div');
  divInsideLi.classList.add('todotask-div');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = isChecked;

  checkbox.addEventListener('click', completedTodo);

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = getNewTaskText;

  divInsideLi.appendChild(checkbox);
  divInsideLi.appendChild(span);

  newTodoItem.appendChild(divInsideLi);
  //add all to task list
  taskList.appendChild(newTodoItem);
  
  updateTaskCount();
  deleteTodoButon(newTodoItem);
}

//add delete button
function deleteTodoButon(newTodoItem) {

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  //add the event listner when clicket so i can delete the task
  deleteButton.addEventListener('click', handleDeleteTask);

  newTodoItem.appendChild(deleteButton);
}

//removes todo list  when click button 
function handleDeleteTask(event) {
  //removes the task from the list
  const taskItem = event.target.parentNode;
  const taskId = taskItem.dataset.id;

  fetch(`/tasks/${taskId}`, {
    method: 'DELETE'
  })
  .then(() => {
    taskList.removeChild(taskItem);
    updateTaskCount();
    saveTasks();
  })
}


//fucntion for delete all tasks
function deleteAllTasks(event) {
  fetch('/tasks', {
    method: 'DELETE'
  })
  .then(() => {
    taskList.innerHTML = '';
    updateTaskCount();
  })
  .catch(error => console.error("Error deleting all tasks", error));

}

function completedTodo(event) {
  const item = event.target.parentElement.parentElement;
  const taskId = item.dataset.id;

  item.classList.toggle('completed');

  const isChecked = event.target.checked;

  fetch(`/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checked: isChecked })
  });
}

function updateTaskCount() {
  taskCount.textContent = taskList.children.length;
}

function saveTasks() {
  //using map to get and save the data, simpler
const tasks = Array.from(taskList.children).map(item => ({
  text: item.querySelector('.task-text').textContent,
  checked: item.querySelector('.task-checkbox').checked
}));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasks() {
  fetch('/tasks')
    .then(response => response.json())
    .then(tasks => {
      tasks.forEach(task => {
        displayTodoItem(task.title, task.id, task.checked);
      });
    })
    .catch(error => console.error("Error  fetching taskas", error));
}