

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
  //check if the user has entered text or not 
  if (getNewTaskText) {
    displayTodoItem(getNewTaskText);
    saveTasks();
     //clear the input field for the next task
    newTodoInput.value = '';
    newTodoInput.focus();
  } else {
    alert("Please enter a task!");
  }

}

function displayTodoItem(getNewTaskText, isChecked = false) {
  //create a new list item for the task
  const newTodoItem = document.createElement('li');
  newTodoItem.className = "task-item";
  //div inside the li
  const divInsideLi = document.createElement('div');
  divInsideLi.classList.add('todotask-div');
  //creates a new variable to store the input with the
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = isChecked;

  checkbox.addEventListener('click', completedTodo);

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = getNewTaskText;
  //add checbox and test to div
  divInsideLi.appendChild(checkbox);
  divInsideLi.appendChild(span);
  //add div to li
  newTodoItem.appendChild(divInsideLi);
  //add all to task list
  taskList.appendChild(newTodoItem);
  
  //update taskCount
  updateTaskCount();

  deleteTodoButon(newTodoItem);
}

//add delete button
function deleteTodoButon(newTodoItem) {
  // creates the delete button on the task
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
  taskList.removeChild(taskItem);
  updateTaskCount();
  saveTasks();
}


//fucntion for delete all tasks
function deleteAllTasks(event) {
  taskList.innerHTML = '';
  updateTaskCount();
  saveTasks();

}

function completedTodo(event) {
  const item = event.target.parentElement;
  item.classList.toggle('completed');
  saveTasks();
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
  //get the tasks from local storage
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  //loop through each task and displt it
  tasks.forEach(task => {
    displayTodoItem(task.text, task.checked);
  });
}