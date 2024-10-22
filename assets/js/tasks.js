
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
  const dailyTaskSelect = document.getElementById("daily-task-select")
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
            "repeat_type": dailyTaskSelect.value,
            "difficulty": {
              "id": difficultySelect.value,
              "score": Cache.get("difficulties")[difficultySelect.value].score
            },
            "ignore_for_ai": false
          })

        taskForm.parentNode.classList.add("hide")
        console.log(taskTitleInput.value);
       if (res.data)
        insertTask(res.data)
       else console.log(res);
      }

    },
    setUpdateTaskForm: function (id) {
      taskForm.parentNode.classList.remove("hide")
      formTitle.textContent = `Edit Task`
      const taskCard = tasksWrapper.querySelector(`.task-card[data-id='${id}']`)
      taskTitleInput.value = taskCard.getAttribute("data-title")
      dailyTaskSelect.value = taskCard.getAttribute("data-repeat_type")
      difficultySelect.value = taskCard.getAttribute("data-difficulty-id")
      submitBtn.textContent = "Save"
      discardBtn.textContent = "Cancel"
      submitBtn.onclick = async () => {
        const res = await apiFetch(`challenges/${id}`)
          .as(username)
          .method("PATCH")
          .body({
            "title": taskTitleInput.value,
            "repeat_type": dailyTaskSelect.value,
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
  <span class="daily-icon" title="Daily Task">
  <svg width="24px" height="24px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" 
  preserveAspectRatio="xMidYMid meet" fill="#000000">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path
      d="M65.71 15.31h-43.6c-1.25 0-2.24 1-2.24 2.24v100.96c0 1.24 1 2.24 2.24 2.24H65.7c30.15 0 50.43-21.19 50.43-52.73c0-31.53-20.27-52.71-50.42-52.71zm-1.29 80.8c-.28 0-.54-.07-.79-.16c-.06.01-.11.03-.17.03c-.08.01-.14.04-.22.04h-14.7c-1.2 0-2.16-.97-2.16-2.16V42.19c0-1.19.96-2.16 2.16-2.16h14.7c.08 0 .14.03.22.04c.05 0 .11.02.17.03c.25-.09.51-.16.79-.16c.43 0 .86.04 1.29.06c.75.03 1.5.09 2.24.18c13.11 1.63 21.69 12.39 21.69 27.84s-8.59 26.21-21.69 27.84c-.74.09-1.49.15-2.24.18c-.43.03-.86.07-1.29.07z"
      fill="#b30000"></path>
  </g>
</svg>
  </span>
  <span class="weekly-icon" title="Weekly Task">
  <svg width="24px" height="24px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"  preserveAspectRatio="xMidYMid meet" fill="#000000">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path
      d="M127.29 16.43a2.42 2.42 0 0 0-1.87-.91h-24.79c-1.14 0-2.12.8-2.33 1.92l-9.58 48.68l-13.47-48.86c-.08-.29-.22-.54-.39-.77c-.01-.01-.01-.04-.03-.05c-.03-.04-.08-.05-.11-.09c-.17-.2-.37-.36-.6-.49c-.08-.04-.15-.09-.23-.12c-.29-.13-.6-.22-.94-.22H55.04c-.33 0-.65.09-.94.22c-.08.04-.15.08-.23.12c-.23.13-.43.29-.6.49c-.04.04-.08.05-.11.09c-.01.02-.01.04-.03.05c-.17.23-.31.49-.39.77L39.29 66.12L29.7 17.44a2.386 2.386 0 0 0-2.33-1.92H2.59c-.73 0-1.43.34-1.87.91c-.46.57-.62 1.33-.45 2.03l24.79 100.45c.01.03.04.06.04.1c.06.19.13.36.23.53c.03.05.05.1.09.15c.02.03.03.06.06.09c.12.16.25.29.41.42c.02.02.05.03.08.05c.16.12.34.22.53.29c.05.02.11.04.17.06c.22.07.46.12.7.12h19.78c.33 0 .63-.08.92-.21c.08-.04.15-.08.23-.12c.2-.12.39-.26.55-.44c.04-.04.1-.06.14-.1c.02-.03.02-.06.04-.09c.19-.25.34-.52.42-.83L64 62.33l14.55 56.61c.08.31.23.58.42.83c.02.03.02.06.05.09c.03.04.09.06.13.1c.16.18.34.32.55.44c.08.04.15.09.23.12c.29.12.59.21.92.21h19.78c.24 0 .47-.05.7-.12c.06-.02.11-.04.18-.06c.18-.07.36-.17.53-.29c.03-.02.05-.03.08-.05c.15-.12.29-.26.41-.42c.02-.03.03-.06.06-.09c.03-.05.05-.1.09-.15c.09-.17.17-.34.23-.53c.01-.03.04-.06.04-.1l24.79-100.45c.16-.71 0-1.47-.45-2.04z"
      fill="#b30000"></path>
  </g>
</svg>
  </span>

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
