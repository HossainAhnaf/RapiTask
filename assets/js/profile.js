 // vari from global ↓
// username ,
// func from global ↓
// switchUsername ,rapitFetchHelper
var profileData = null
var levelTitles = null

async function setTaskActivity(){
 const taskActivityData = await rapitFetchHelper("challenges/activities")
 const {total,failed,completed} = taskActivityData.data
  const authorTaskTotal = document.getElementById("author-task-total")
  const authorTaskPassed = document.getElementById("author-task-passed")
 const authorTaskFailed = document.getElementById("author-task-failed")
 const taskCompleteDetails = document.getElementById("task-complete-details")
  authorTaskTotal.textContent = total
  authorTaskPassed.textContent = completed.total
  authorTaskFailed.textContent = failed

 for (const {name,challenge_count,light_color} of completed.difficulty){
  const html = `<span class="data"><span class="name ${name} bg-color">${name}</span> <span class="value"> x${challenge_count}</span></span> `
   taskCompleteDetails.innerHTML += html
}
 
  
}
async function setActiveTasksData(){
 const tasksData = await rapitFetchHelper("challenges")
 const activeTaskCount = document.getElementById('active-task-count')
 activeTaskCount.textContent = tasksData.meta.count
 
}

function setProfileData(){
 const authorName = document.getElementById("author-name")
 const authorTitle = document.getElementById("author-title")
 const authorLevel = document.getElementById("author-level")
 const xpProgressbar = document.getElementById('xp-progressbar')

 const nextTitleRequiredLevel = levelTitles.find(lT=>lT.id ===  profileData.level_title.id + 1).required_level

 authorName.textContent = profileData.name
 authorTitle.textContent = profileData.level_title.title
 authorTitle.style.color = profileData.level_title.light_color
 authorLevel.textContent = `${profileData.level} / ${nextTitleRequiredLevel}` 
 xpProgressbar.querySelector(".xp-count").textContent = profileData.total_xp
 xpProgressbar.querySelector(".complete-bg").style.width = `${( profileData.total_xp / 1000) * 100}%`
 setActiveTasksData()
 setTaskActivity()
}
async function fetchProfileData(){
 profileData = await rapitFetchHelper(`users/${username}`)
 profileData = profileData.data

}
 async function fetchLevelTitles(){
 levelTitles  = await rapitFetchHelper("level-titles")
 levelTitles = levelTitles.data
 }


 window.onload = async ()=>{
   await fetchLevelTitles()
   await fetchProfileData()
   setProfileData()
 }


