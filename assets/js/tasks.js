 
async function setDifficultySelect(element){
  const difficultiesData = await rapitFetchHelper("difficulties")
 if(difficultiesData){
  for (const {id,name,slug,xp_value,light_color} of difficultiesData.data){
    const html = `<option  value="${id}" data-xp="${xp_value}">${name}</option>`
    element.innerHTML += html
  }
 }
}

function initTaskForm(){
   const taskForm = document.querySelector('.task-form')
   const formTitle = taskForm.querySelector(".form-title")
   const taskTitleInput = document.getElementById("task-title-input")
   const difficultySelect = document.getElementById("difficulty-select")
   const dailyTaskCheckbox = document.getElementById("daily-task-checkbox")
   const submitBtn = taskForm.querySelector(".submit-btn")
   const discardBtn = taskForm.querySelector(".discard-btn")
    setDifficultySelect(difficultySelect)
   
   discardBtn.onclick = ()=>{
      formTitle.textContent = "Create New Task"
      taskTitleInput.value = ""
      dailyTaskCheckbox.checked = false
      taskForm.parentNode.classList.add("hide")
   }
   
   return {
     setCreateTaskForm: function(){
       taskForm.parentNode.classList.remove("hide")
       submitBtn.onclick = async ()=>{
   const res = await rapitFetchHelper("challenges",{
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },"POST",{
  "title": taskTitleInput.value,
  "repeat_type": dailyTaskCheckbox.checked ? "D" : "O",
  "difficulty": {
    "id": difficultySelect.value
  }
  })
      taskForm.parentNode.classList.add("hide")
   console.log(res)

       }
       
     },
     setUpdateTaskForm: function(){
    taskForm.parentNode.classList.remove("hide")

       formTitle.textContent = 'Edit Task'
        submitBtn.onclick = ()=>{
        
       }
     },
     deleteTask: function(){
       
     }
   }
}


const {setCreateTaskForm,setUpdateTaskForm,deleteTask } = initTaskForm()

async function setAllTask(){
  const tasksData = await rapitFetchHelper('challenges')
  const tasksWrapper = document.querySelector(".tasks-wrapper")
  for ({id,title,repeat_type,difficulty} of  tasksData.results){
    const html = `
            <div class="task-card">
          <div class="task-header">
            <div class="task-info">
              <span class="difficulty ${difficulty.slug}">${difficulty.name}</span>
            ${ repeat_type === "D" ? '<span class="daily-icon" title="Daily Task">&#128197;</span>' : "" }
            </div>
            <div class="action-icons">
              <button class="edit-btn" title="Edit">
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z" fill="#000000"></path></g></svg>
              </button>
              <button class="del-btn" title="Delete">
                <svg width="30px" height="30px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M352 192V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64H96a32 32 0 0 1 0-64h256zm64 0h192v-64H416v64zM192 960a32 32 0 0 1-32-32V256h704v672a32 32 0 0 1-32 32H192zm224-192a32 32 0 0 0 32-32V416a32 32 0 0 0-64 0v320a32 32 0 0 0 32 32zm192 0a32 32 0 0 0 32-32V416a32 32 0 0 0-64 0v320a32 32 0 0 0 32 32z"></path></g></svg>
              </button>
            </div>
          </div>
          
          <div class="task-content">
            <p><b class="index">${id}. </b>${title}</p>
          </div>
        
          <div class="task-footer">
            <button class="tick-btn" title="Pass">&#10003;</button>
            <button class="cross-btn" title="Fail">&#10007;</button>
          </div>
        </div>

    `
    tasksWrapper.innerHTML += html
 }
  
}

window.onload = ()=>{
 const createNewTaskBtn = document.querySelector(".create-new-task-btn")
 createNewTaskBtn.addEventListener("click",setCreateTaskForm)
 setAllTask()
}