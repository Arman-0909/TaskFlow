const API = "http://127.0.0.1:8000/api/v1"


function showToast(message){

    const toast =
        document.getElementById("toast")

    toast.innerText = message

    toast.classList.add("show")

    setTimeout(() => {
        toast.classList.remove("show")
    }, 2500)
}


// REGISTER

async function registerUser(){

    const username =
        document.getElementById("username").value

    const password =
        document.getElementById("password").value

    const response = await fetch(
        `${API}/auth/register`,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                username,
                password
            })
        }
    )

    const data = await response.json()

    showToast(data.message || data.detail)
}


// LOGIN

async function loginUser(){

    const username =
        document.getElementById("username").value

    const password =
        document.getElementById("password").value

    const response = await fetch(
        `${API}/auth/login`,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                username,
                password
            })
        }
    )

    const data = await response.json()

    if(data.access_token){

        localStorage.setItem(
            "token",
            data.access_token
        )

        localStorage.setItem(
            "role",
            data.role
        )

        showToast("Login successful")

        setTimeout(() => {

            window.location.href =
                "dashboard.html"

        }, 700)

    }else{
        showToast(data.detail)
    }
}


// CREATE TASK

async function createTask(){

    const title =
        document.getElementById("title").value

    const description =
        document.getElementById("description").value

    const token =
        localStorage.getItem("token")

    const response = await fetch(
        `${API}/tasks/`,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },

            body:JSON.stringify({
                title,
                description
            })
        }
    )

    const data = await response.json()

    showToast(data.message || data.detail)

    loadTasks()
}


// LOAD TASKS

async function loadTasks(){

    const token =
        localStorage.getItem("token")

    const response = await fetch(
        `${API}/tasks/`,
        {
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
    )

    const tasks = await response.json()

    const taskDiv =
        document.getElementById("tasks")

    taskDiv.innerHTML = ""

    if(tasks.length === 0){

        taskDiv.innerHTML = `
            <div class="card">
                <p>No tasks yet.</p>
            </div>
        `

        return
    }

    tasks.forEach(task => {

        taskDiv.innerHTML += `
            <div class="task">

                <div class="task-top">

                    <h3>${task.title}</h3>

                    <div class="task-actions">

                        <button onclick="editTask(
                            ${task.id},
                            '${task.title}',
                            '${task.description}'
                        )">
                            Edit
                        </button>

                        <button onclick="deleteTask(${task.id})">
                            Delete
                        </button>

                    </div>

                </div>

                <p>${task.description}</p>
                <p style="margin-top:10px; color:#8d8d8d;">
                    Owner: ${task.owner}
                </p>

            </div>
        `
    })
}


async function editTask(taskId, oldTitle, oldDescription){

    const title = prompt(
        "Edit title",
        oldTitle
    )

    if(title === null){
        return
    }

    const description = prompt(
        "Edit description",
        oldDescription
    )

    if(description === null){
        return
    }

    const token =
        localStorage.getItem("token")

    const response = await fetch(
        `${API}/tasks/${taskId}`,
        {
            method:"PUT",

            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },

            body:JSON.stringify({
                title:title,
                description:description,
                completed:false
            })
        }
    )

    const data = await response.json()

    console.log(data)

    showToast(data.message || data.detail)

    loadTasks()
}


// DELETE TASK

async function deleteTask(taskId){

    const confirmDelete = confirm(
        "Delete this task?"
    )

    if(!confirmDelete){
        return
    }

    const token =
        localStorage.getItem("token")

    const response = await fetch(
        `${API}/tasks/${taskId}`,
        {
            method:"DELETE",

            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
    )

    const data = await response.json()

    showToast(data.message || data.detail)

    loadTasks()
}


//LOAD USERS (ADMIN)
async function loadUsers(){

    const token =
        localStorage.getItem("token")

    const response = await fetch(
        `${API}/auth/admin/users`,
        {
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
    )

    const users = await response.json()

    const usersDiv =
        document.getElementById("users")

    usersDiv.innerHTML = ""

    users.forEach(user => {

        usersDiv.innerHTML += `
            <div class="task">

                <h3>${user.username}</h3>

                <p>
                    Role: ${user.role}
                </p>

            </div>
        `
    })
}


// LOGOUT

function logout(){

    localStorage.removeItem("token")

    localStorage.removeItem("role")

    showToast("Logged out")

    setTimeout(() => {

        window.location.href =
            "index.html"

    }, 600)
}