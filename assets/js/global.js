var username = localStorage.getItem("username") || "hasan"

var API_BASE_URL = "https://rapidtask.pythonanywhere.com/api"
async function rapitFetchHelper(url,headers,method,bodyObj){
  try{
    let res = null
 if (!method){
  res = await fetch(`${API_BASE_URL}/${url}/?auth=${username}`)
 }else {
   res = await fetch(`${API_BASE_URL}/${url}/?auth=${username}`,{headers,method,body:JSON.stringify(bodyObj)})
 }
   return await res.json()
 }catch(e){
   console.log(e)
 }
}

function switchUsername(){
  
}