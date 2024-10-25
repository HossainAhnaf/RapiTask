
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
   setAiTaskSuggestion()
}
function removeOldAiTaskSuggestionData() {
    localStorage.removeItem(`${username}'s-ai-task-suggestion`)
}
async function aiTaskSuggestionAddToTaskBtnClickHandler(title, difficultyId) {
   
    const res = await apiFetch("challenges")
    .as(username)
    .method("POST")
    .body({
      "title":title,
      "repeat_type": "once",
      "difficulty": {
        "id": difficultyId,
        "score": Cache.get("difficulties")[difficultyId].score
      },
      "ignore_for_ai": false
    })

    if (res.data) {
      insertTask(res.data)
      removeOldAiTaskSuggestionData()
      setAiTaskSuggestion()
    }
 }  
 function insertAiTaskSuggestion (data) { 
    const aiSuggestElm = tasksWrapper.querySelector(".ai-suggest")
    if (aiSuggestElm) {
      aiSuggestElm.querySelector(".task-content").textContent = data.title
      const difficultyElm = aiSuggestElm.querySelector(".difficulty")
      difficultyElm.textContent = data.difficulty.name
      difficultyElm.classList[1] = data.difficulty.slug
      difficultyElm.style.backgroundColor = data.difficulty.light_color
      aiSuggestElm.querySelector(".add-to-task-btn").setAttribute("onclick", `aiTaskSuggestionAddToTaskBtnClickHandler("${data.title}, ${data.difficulty.id}")`)
    }else {
    tasksWrapper.innerHTML += `
    <div class="task-card ai-suggest">
    <div class="task-header">
      <div class="task-info">
        <span class="difficulty ${data.difficulty.slug}" style="background-color:${data.difficulty.light_color}">${data.difficulty.name}</span>
        <img width="30px" height="30px" src="./assets/img/robot.png" alt="">
      </div>
      <div class="action-icons">
        <button class="reload-btn" title="Reload">
     <svg width="35px" height="35px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="1"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.39502 12.0014C4.39544 12.4156 4.73156 12.751 5.14577 12.7506C5.55998 12.7502 5.89544 12.4141 5.89502 11.9999L4.39502 12.0014ZM6.28902 8.1116L6.91916 8.51834L6.91952 8.51777L6.28902 8.1116ZM9.33502 5.5336L9.0396 4.84424L9.03866 4.84464L9.33502 5.5336ZM13.256 5.1336L13.4085 4.39927L13.4062 4.39878L13.256 5.1336ZM16.73 7.0506L16.1901 7.57114L16.1907 7.57175L16.73 7.0506ZM17.7142 10.2078C17.8286 10.6059 18.2441 10.8358 18.6422 10.7214C19.0403 10.607 19.2703 10.1915 19.1558 9.79342L17.7142 10.2078ZM17.7091 9.81196C17.6049 10.2129 17.8455 10.6223 18.2464 10.7265C18.6473 10.8307 19.0567 10.5901 19.1609 10.1892L17.7091 9.81196ZM19.8709 7.45725C19.9751 7.05635 19.7346 6.6469 19.3337 6.54272C18.9328 6.43853 18.5233 6.67906 18.4191 7.07996L19.8709 7.45725ZM18.2353 10.7235C18.6345 10.8338 19.0476 10.5996 19.1579 10.2004C19.2683 9.80111 19.034 9.38802 18.6348 9.2777L18.2353 10.7235ZM15.9858 8.5457C15.5865 8.43537 15.1734 8.66959 15.0631 9.06884C14.9528 9.46809 15.187 9.88119 15.5863 9.99151L15.9858 8.5457ZM19.895 11.9999C19.8946 11.5856 19.5585 11.2502 19.1443 11.2506C18.7301 11.251 18.3946 11.5871 18.395 12.0014L19.895 11.9999ZM18.001 15.8896L17.3709 15.4829L17.3705 15.4834L18.001 15.8896ZM14.955 18.4676L15.2505 19.157L15.2514 19.1566L14.955 18.4676ZM11.034 18.8676L10.8815 19.6019L10.8839 19.6024L11.034 18.8676ZM7.56002 16.9506L8.09997 16.4301L8.09938 16.4295L7.56002 16.9506ZM6.57584 13.7934C6.46141 13.3953 6.04593 13.1654 5.64784 13.2798C5.24974 13.3942 5.01978 13.8097 5.13421 14.2078L6.57584 13.7934ZM6.58091 14.1892C6.6851 13.7884 6.44457 13.3789 6.04367 13.2747C5.64277 13.1705 5.23332 13.4111 5.12914 13.812L6.58091 14.1892ZM4.41914 16.544C4.31495 16.9449 4.55548 17.3543 4.95638 17.4585C5.35727 17.5627 5.76672 17.3221 5.87091 16.9212L4.41914 16.544ZM6.05478 13.2777C5.65553 13.1674 5.24244 13.4016 5.13212 13.8008C5.02179 14.2001 5.25601 14.6132 5.65526 14.7235L6.05478 13.2777ZM8.30426 15.4555C8.70351 15.5658 9.11661 15.3316 9.22693 14.9324C9.33726 14.5331 9.10304 14.12 8.70378 14.0097L8.30426 15.4555ZM5.89502 11.9999C5.89379 10.7649 6.24943 9.55591 6.91916 8.51834L5.65889 7.70487C4.83239 8.98532 4.3935 10.4773 4.39502 12.0014L5.89502 11.9999ZM6.91952 8.51777C7.57513 7.50005 8.51931 6.70094 9.63139 6.22256L9.03866 4.84464C7.65253 5.4409 6.47568 6.43693 5.65852 7.70544L6.91952 8.51777ZM9.63045 6.22297C10.7258 5.75356 11.9383 5.62986 13.1059 5.86842L13.4062 4.39878C11.9392 4.09906 10.4158 4.25448 9.0396 4.84424L9.63045 6.22297ZM13.1035 5.86793C14.2803 6.11232 15.3559 6.7059 16.1901 7.57114L17.27 6.53006C16.2264 5.44761 14.8807 4.70502 13.4085 4.39927L13.1035 5.86793ZM16.1907 7.57175C16.9065 8.31258 17.4296 9.21772 17.7142 10.2078L19.1558 9.79342C18.8035 8.5675 18.1557 7.44675 17.2694 6.52945L16.1907 7.57175ZM19.1609 10.1892L19.8709 7.45725L18.4191 7.07996L17.7091 9.81196L19.1609 10.1892ZM18.6348 9.2777L15.9858 8.5457L15.5863 9.99151L18.2353 10.7235L18.6348 9.2777ZM18.395 12.0014C18.3963 13.2363 18.0406 14.4453 17.3709 15.4829L18.6312 16.2963C19.4577 15.0159 19.8965 13.5239 19.895 11.9999L18.395 12.0014ZM17.3705 15.4834C16.7149 16.5012 15.7707 17.3003 14.6587 17.7786L15.2514 19.1566C16.6375 18.5603 17.8144 17.5643 18.6315 16.2958L17.3705 15.4834ZM14.6596 17.7782C13.5643 18.2476 12.3517 18.3713 11.1842 18.1328L10.8839 19.6024C12.3508 19.9021 13.8743 19.7467 15.2505 19.157L14.6596 17.7782ZM11.1865 18.1333C10.0098 17.8889 8.93411 17.2953 8.09997 16.4301L7.02008 17.4711C8.06363 18.5536 9.40936 19.2962 10.8815 19.6019L11.1865 18.1333ZM8.09938 16.4295C7.38355 15.6886 6.86042 14.7835 6.57584 13.7934L5.13421 14.2078C5.48658 15.4337 6.13433 16.5545 7.02067 17.4718L8.09938 16.4295ZM5.12914 13.812L4.41914 16.544L5.87091 16.9212L6.58091 14.1892L5.12914 13.812ZM5.65526 14.7235L8.30426 15.4555L8.70378 14.0097L6.05478 13.2777L5.65526 14.7235Z" fill="#000000"></path> </g></svg>              </button>
      </div>
    </div>
    
    <div class="task-content">
      <p>${data.title}</p>
    </div>
    
    <div class="task-footer">
      <button class="add-to-task-btn" title="" onclick='aiTaskSuggestionAddToTaskBtnClickHandler("${data.title}", ${data.difficulty.id})'>Add To Task</button>
    </div>
  </div>
    `
    }
 }
async function setAiTaskSuggestion(){
  const dataStr = localStorage.getItem(`${username}'s-ai-task-suggestion`) 
  if (dataStr) {
    insertAiTaskSuggestion(JSON.parse(dataStr))
  }else {
    const res = await apiFetch(`challenges/suggestions`)
    .as(username)
    .method("POST")
   if(res.success){
    localStorage.setItem(`${username}'s-ai-task-suggestion`, JSON.stringify(res.data))
    insertAiTaskSuggestion(res.data)
   } 
 }
 

 
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
    Cache.set("username", username)

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
