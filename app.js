var cl = console.log;

const todoForm = document.getElementById('todoForm')
const todoList = document.getElementById('todoList')
const userId = document.getElementById('userId')
const addTodo = document.getElementById('addTodo')
const submitBtn = document.getElementById('submitBtn')
const updateBtn = document.getElementById('updateBtn')

const BASE_URL = `https://jsonplaceholder.typicode.com`
const TODO_URL = `${BASE_URL}/todos`

function showSnackbar(msg, icon, timer){
  Swal.fire({
    title: msg,
    icon: icon,
    timer: timer,
    showConfirmButton: false
  });
}

// read-todos 
function readTodos(){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", TODO_URL, true)
    xhr.send()
    xhr.onload = function () {
        let todosData = JSON.parse(xhr.response)
        let result = ``;
        todosData.slice(0, 20).forEach(todo => {
            result += `<div class="col-md-3 mt-5" id="${todo.id}">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5>TODO CARD - <span class="userIdText">${todo.userId}</span></h5>
                        </div>
                        <div class="card-body1 p-3">
                            <span class="todoText">${todo.title}</span>
                            <br>
                            <small>Status: <span class="completedText">${todo.completed ? 'Done' : 'Pending'}</span></small>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button onclick="editTodo(this)" class="btn btn-success text-white">Edit</button>
                            <button onclick="deleteTodo(this)" class="btn btn-danger text-white">Remove</button>
                        </div>
                    </div>
                </div>`;
        });
        todoList.innerHTML = result;
        showSnackbar("Todos Loaded successfully", "info", 1500);
    }
}
readTodos();

// create-todo 
function createTodo(createobj){
    let xhr = new XMLHttpRequest()
    xhr.open('POST', TODO_URL, true)
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
    xhr.send(JSON.stringify(createobj))
    xhr.onload = function () {
        if (xhr.status === 201) {
            let res = JSON.parse(xhr.response)
            let col = document.createElement('div')
            col.className = `col-md-3 mt-5`;
            col.id = res.id || Date.now();
            col.innerHTML = `<div class="card h-100">
                        <div class="card-header">
                            <h5>TODO CARD - <span class="userIdText">${createobj.userId}</span></h5>
                        </div>
                        <div class="card-body1 p-3">
                            <span class="todoText">${createobj.title}</span>
                            <br>
                            <small>Status: <span class="completedText">Pending</span></small>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button onclick="editTodo(this)" class="btn btn-success text-white">Edit</button>
                            <button onclick="deleteTodo(this)" class="btn btn-danger text-white">Remove</button>
                        </div>
                    </div>`;
            todoList.prepend(col)
            todoForm.reset()
            showSnackbar("Todo Created successfully", "success", 1500);
        }
    }
}

function oncreatetodo(ele) {
    ele.preventDefault();
    let createobj = {
        userId: userId.value,
        title: addTodo.value,
        completed: false
    }
    createTodo(createobj);
}

// edit
function editTodo(ele) {
    let edit_id = ele.closest('.col-md-3').id;
    localStorage.setItem('EDIT_ID', edit_id)
    let card = ele.closest('.col-md-3')
    userId.value = card.querySelector('.userIdText').innerText;
    addTodo.value = card.querySelector('.todoText').innerText;
    submitBtn.classList.add('d-none')
    updateBtn.classList.remove('d-none')
    showSnackbar("Edit Mode On", "info", 1500);
    window.scrollTo(0,0)
}

// update
function onupdatetodo(e) {
    if(e) e.preventDefault();
    let update_id = localStorage.getItem('EDIT_ID')
    let update_obj = {
        userId: userId.value,
        title: addTodo.value,
    }
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", `${BASE_URL}/todos/${update_id}`, true)
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
    xhr.send(JSON.stringify(update_obj));
    xhr.onload = function () {
        if (xhr.status == 200) {
            let col = document.getElementById(update_id);
            col.querySelector('.userIdText').innerHTML = update_obj.userId;
            col.querySelector('.todoText').innerHTML = update_obj.title;
            updateBtn.classList.add('d-none')
            submitBtn.classList.remove('d-none');
            todoForm.reset()
            localStorage.removeItem('EDIT_ID')
            showSnackbar("Todo Updated successfully", "success", 1500);
        }
    }
}

// delete
function deleteTodo(ele) {
    let delete_id = ele.closest('.col-md-3').id;
    Swal.fire({
        title: "Are You Sure, you want to delete it ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let xhr = new XMLHttpRequest()
            xhr.open('DELETE', `${BASE_URL}/todos/${delete_id}`, true)
            xhr.send(null)
            xhr.onload = function () {
                if (xhr.status == 200) {
                    document.getElementById(delete_id).remove()
                    showSnackbar("Todo Deleted successfully", "success", 1500);
                }
            }
        }
    });
}

todoForm.addEventListener('submit', oncreatetodo)
updateBtn.addEventListener('click', onupdatetodo);