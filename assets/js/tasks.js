
async function setDifficultySelect(element) {
  let difficulties = Cache.get('difficulties')
  if (!difficulties) {
    response = await apiFetch("difficulties").as(username)
    difficulties = response.data
    Cache.set("difficulties", difficulties)
  }
  for (const difficulty of difficulties) {
      const html = `<option  value="${difficulty.id}" data-xp="${difficulty.xp_value}">${difficulty.name}</option>`
      element.innerHTML += html
  }
}
async function updateTaskStatus(id, status) {
  const res = await apiFetch(`challenges/${id}`)
    .as(username)
    .method("PATCH")
    .body({
      "status": status
    })
  if (res.success) {
    tasksWrapper.removeChild(tasksWrapper.querySelector(`.task-card[data-id="${id}"]`))
    setBlankMessage()
  }
}
function initTaskForm() {
  const taskForm = document.querySelector('.task-form')
  const formTitle = taskForm.querySelector(".form-title")
  const taskTitleInput = document.getElementById("task-title-input")
  const difficultySelect = document.getElementById("difficulty-select")
  const aiDiffSuggestBtn = document.getElementById("ai-diff-suggest-btn")
  const dailyTaskCheckbox = document.getElementById("daily-task-checkbox")
  const submitBtn = taskForm.querySelector(".submit-btn")
  const discardBtn = taskForm.querySelector(".discard-btn")
  setDifficultySelect(difficultySelect)

  aiDiffSuggestBtn.onclick = async () => {
    if (taskTitleInput.value) {
      aiDiffSuggestBtn.disabled = true
      difficultySelect.classList.add("loading")
      const suggestedDiff = await apiFetch('difficulties/suggestions')
        .as(username)
        .method("POST")
        .body({
          title: taskTitleInput.value
        })
      difficultySelect.value = suggestedDiff.data.id
      if (suggestedDiff.data){
        aiDiffSuggestBtn.disabled = false
        difficultySelect.classList.remove("loading")
  
      }
    }
  }
  discardBtn.onclick = () => {
    formTitle.textContent = "Create New Task"
    taskTitleInput.value = ""
    dailyTaskCheckbox.checked = false
    taskForm.parentNode.classList.add("hide")
  }

  return {
    setCreateTaskForm: function () {
      taskForm.parentNode.classList.remove("hide")
      submitBtn.textContent = "Create"
      discardBtn.textContent = "Discard"
      submitBtn.onclick = async () => {
        const res = await apiFetch("challenges")
          .as(username)
          .method("POST")
          .body({
            "title": taskTitleInput.value,
            "repeat_type": dailyTaskCheckbox.checked ? "daily" : "once",
            "difficulty": {
              "id": difficultySelect.value
            }
          })

        taskForm.parentNode.classList.add("hide")
       if (res.data)
        insertTask(res.data)

      }

    },
    setUpdateTaskForm: function (id) {
      taskForm.parentNode.classList.remove("hide")
      formTitle.textContent = `Edit Task`
      const taskCard = tasksWrapper.querySelector(`.task-card[data-id='${id}']`)
      taskTitleInput.value = taskCard.getAttribute("data-title")
      dailyTaskCheckbox.checked = taskCard.getAttribute("data-repeat_type") === "once" ? false : true
      difficultySelect.value = taskCard.getAttribute("data-difficulty-id")
      submitBtn.textContent = "Save"
      discardBtn.textContent = "Cancel"
      submitBtn.onclick = async () => {
        const res = await apiFetch(`challenges/${id}`)
          .as(username)
          .method("PATCH")
          .body({
            "title": taskTitleInput.value,
            "repeat_type": dailyTaskCheckbox.checked ? "daily" : "once",
            "difficulty": {
              "id": difficultySelect.value
            }
          })
        taskForm.parentNode.classList.add("hide")
        updateTask(taskCard, res.data)
      }
    },
    deleteTask: async function (id) {
      const taskCard = tasksWrapper.querySelector(`.task-card[data-id='${id}']`)
      if (taskCard) {
        tasksWrapper.removeChild(taskCard)
        const res = await apiFetch(`challenges/${id}`)
          .as(username)
          .method("DELETE")
      setBlankMessage()

      }
    }
  }
}
const tasksWrapper = document.querySelector(".tasks-wrapper")
const {
  setCreateTaskForm,
  setUpdateTaskForm,
  deleteTask
} = initTaskForm()

function insertTask({
  id, title, repeat_type, difficulty
}) {
  const html = `
  <div class="task-card" data-id="${id}" data-title="${title}" data-repeat_type="${repeat_type}" data-difficulty-id="${difficulty.id}">
  <div class="task-header">
  <div class="task-info">
  <span class="difficulty ${difficulty.slug}" style="background-color:${difficulty.light_color}">${difficulty.name}</span>
  <span class="daily-icon" title="Daily Task">&#128197;</span>
  </div>
  <div class="action-icons">
  <button class="edit-btn" title="Edit" onclick="setUpdateTaskForm(${id})">
  <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z" fill="#000000"></path></g></svg>
  </button>
  <button class="del-btn" title="Delete" onclick="deleteTask(${id})">
  <svg width="30px" height="30px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M352 192V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64H96a32 32 0 0 1 0-64h256zm64 0h192v-64H416v64zM192 960a32 32 0 0 1-32-32V256h704v672a32 32 0 0 1-32 32H192zm224-192a32 32 0 0 0 32-32V416a32 32 0 0 0-64 0v320a32 32 0 0 0 32 32zm192 0a32 32 0 0 0 32-32V416a32 32 0 0 0-64 0v320a32 32 0 0 0 32 32z"></path></g></svg>
  </button>
  </div>
  </div>

  <div class="task-content">
  <p><b class="index"></b><span class="title">${title}</span></p>
  </div>

  <div class="task-footer">
  <button class="tick-btn" title="Pass" onclick='updateTaskStatus(${id},"completed")'>&#10003;</button>
  <button class="cross-btn" title="Fail" onclick='updateTaskStatus(${id},"failed")'>&#10007;</button>
  </div>
  </div>

  `
  tasksWrapper.innerHTML += html
  setBlankMessage()
}
function updateTask(taskCard, {
  title, repeat_type, difficulty
}) {
  taskCard.setAttribute("data-title", title)
  taskCard.setAttribute("data-repeat_type", repeat_type)
  taskCard.setAttribute("data-difficulty-id", difficulty.id)
  const difficultyElm = taskCard.querySelector(".difficulty")
  difficultyElm.style.backgroundColor = difficulty.light_color
  difficultyElm.textContent = difficulty.name
  difficultyElm.classList[1] = difficulty.slug
  taskCard.querySelector(".title").textContent = title
}

async function setAllTask() {
  const taskCards = tasksWrapper.querySelectorAll(".task-card")
  const tasksData = await apiFetch('challenges').as(username)


  for (const taskCard of taskCards)
    tasksWrapper.removeChild(taskCard)

  for (data of tasksData.results) 
    insertTask(data)

    if (tasksData.results) 
    setBlankMessage()
  
}

function setBlankMessage() {
 const blankMessageElm = tasksWrapper.querySelector(".blank-message")
 const taskCards = tasksWrapper.querySelectorAll(".task-card")
 blankMessageElm.style.display = ""
 blankMessageElm.textContent = "loading..."
 if (Array.from(taskCards).length === 0 ) 
     blankMessageElm.textContent = "No active tasks"
    
  else blankMessageElm.style.display = "none"
}

function switchAccount() {
  if (username === "hasan")
    username = "hossain"
  else
    username = "hasan"
  localStorage.setItem("username", username)
  setAllTask()
}

window.onload = () => {
  const userSelectFeild = document.getElementById("user-select-feild")
  userSelectFeild.onchange = switchAccount
  userSelectFeild.selectedIndex = username === "hasan" ? 0 : 1
  const createNewTaskBtn = document.querySelector(".create-new-task-btn")
  createNewTaskBtn.addEventListener("click", setCreateTaskForm)
  setAllTask()
}
