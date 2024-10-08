// vari from global ↓
// username ,
// func from global ↓
// switchUsername ,apiFetch
var profileData = null
var levelTitles = null

async function setTaskActivity() {
  const taskActivityData = await apiFetch("challenges/activities").as(username)
  const {
    total,
    failed,
    completed
  } = taskActivityData.data
  const authorTaskTotal = document.getElementById("author-task-total")
  const authorTaskPassed = document.getElementById("author-task-passed")
  const authorTaskFailed = document.getElementById("author-task-failed")
  const taskCompleteDetails = document.getElementById("task-complete-details")
  authorTaskTotal.textContent = total
  authorTaskPassed.textContent = completed.total
  authorTaskFailed.textContent = failed
  taskCompleteDetails.innerHTML = ""
  for (const {
    name, slug, challenge_count, light_color
  } of completed.difficulties) {
    const html = `<span class="data"><span class="name ${slug}" style="background-color:${light_color}">${name}</span> <span class="value"> x${challenge_count}</span></span> `
    taskCompleteDetails.innerHTML += html
  }


}
async function setActiveTasksData() {
  const tasksData = await apiFetch("challenges").as(username)
  const activeTaskCount = document.getElementById('active-task-count')
  activeTaskCount.textContent = tasksData.meta.count

}

function setProfileData() {
  const authorName = document.getElementById("author-name")
  const authorTitle = document.getElementById("author-title")
  const authorLevel = document.getElementById("author-level")
  const xpProgressbar = document.getElementById('xp-progressbar')
 
  const nextTitleRequiredLevel = levelTitles.find(lT => lT.id === profileData.level_title.id + 1).required_level
  let currentXp =  profileData.total_xp - (1000 * (profileData.level - 1))
  authorName.textContent = profileData.name
  authorTitle.textContent = profileData.level_title.title
  authorTitle.style.color = profileData.level_title.light_color
  authorLevel.textContent = `${profileData.level} / ${nextTitleRequiredLevel}`
  xpProgressbar.querySelector(".xp-count").textContent = currentXp
  xpProgressbar.querySelector(".complete-bg").style.width = `${(currentXp / 1000) * 100}%`
  setActiveTasksData()
  setTaskActivity()
}
async function fetchProfileData() {
  profileData = await apiFetch(`users/${username}`).as(username)
  profileData = profileData.data

}
async function fetchLevelTitles() {
  levelTitles = await apiFetch("level-titles").as(username)
  levelTitles = levelTitles.data
}



async function setAllData(params) {
  await fetchLevelTitles()
  await fetchProfileData()
  setProfileData()
}

function switchAccount() {
  if (username === "hasan")
    username = "hossain"
  else username = " hasan"
  localStorage.setItem("username",username)
  setAllData()
}

window.onload = ()=> {
  const userSelectFeild = document.getElementById("user-select-feild")
  userSelectFeild.onchange = switchAccount
  userSelectFeild.selectedIndex = username === "hasan" ? 0 : 1
  setAllData()
}
