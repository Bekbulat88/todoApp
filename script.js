'use strict'

let taskList = document.querySelector('.task_list');
let emptyDesk = document.querySelector('.list_empty')
let input = document.querySelector('#input');
let inputButton = document.querySelector('.input_button');
let removeAll = document.querySelector('.remove_all');
let tasks = [];

if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'))
}

checkDeskForEmptiness();
renderLocalStorage(tasks)
inputButton.addEventListener('click', addTaskToTheTable);
taskList.addEventListener('click', removeTask);
taskList.addEventListener('click', completeTask);
removeAll.addEventListener('click', removeAllTasks);

function removeAllTasks() {
    tasks.splice(0,tasks.length)
    removeAllTasksFromTheDesk();
    checkDeskForEmptiness();
    saveTaskInLoadStorage (tasks);
}

function completeTask (event) {
    if (event.target.dataset.action == 'done') {
        let parentNode = event.target.closest('li');
        parentNode.classList.toggle('done');
        let id = parentNode.dataset.id;
        let index = tasks.findIndex(function(elem) {
            if (elem.id == id) {
            return true
            }
        })
        if(taskList.children[index+1].classList.contains('done')){
            tasks[index].complete = true
        } else {
            tasks[index].complete = false
               }      
    }
    saveTaskInLoadStorage(tasks)
}

function removeTask (event) {
    if (event.target.dataset.action == 'remove') {
        let parentNode = event.target.closest('li');
        let id = parentNode.dataset.id;
        let index = tasks.findIndex(function(elem) {
            if (elem.id == id) {
            return true
            }
        })
        tasks.splice(index, 1)
        parentNode.remove();
    }
    checkDeskForEmptiness ()
    saveTaskInLoadStorage(tasks)
}

function addTaskToTheTable() {
    let task = {
        id : Date.now(),
        text : "taskText",
        complete : false,
    }

    task.text = input.value;
    putTaskInArray(task);
    createTaskOnDesk(task)
    checkDeskForEmptiness();
    saveTaskInLoadStorage(tasks)
    input.focus();
}

function checkDeskForEmptiness () {
    if (tasks.length > 0) {
        emptyDesk.classList.add('none')
    } else {
        emptyDesk.classList.remove('none')
    }
}

function createTaskOnDesk (task) {
   let newTask = `<li class="list_item item" data-id="${task.id}">
   <div class="item_text">${task.text}</div>
   <div class="item_buttons">
       <button class="ok_button button" data-action='done'>OK</button>
       <button class="remove_button button" data-action='remove'>Remove</button>
   </div>
</li>`;
taskList.insertAdjacentHTML("beforeend", newTask);
}

function putTaskInArray (task) {
    tasks.push(task)
}

function saveTaskInLoadStorage (tasks) {
localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderLocalStorage (tasks){
  tasks.forEach(function (task) {
    createTaskOnDesk(task)
  })
  for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].complete == true) {
      taskList.children[i+1].classList.toggle('done')
      }
  }
}

function removeAllTasksFromTheDesk () {
    if (tasks.length == 0) {
        for (let i = taskList.children.length-1; i > 0; i--) {
        taskList.children[i].remove()
        }
    }
}