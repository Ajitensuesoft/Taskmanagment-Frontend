import axios from "axios";

// const API_URL = "http://localhost:5000/api/auth"; // Auth
// const API_URLi = "http://localhost:5000/api/v1"; // Todos

const API_URL=import.meta.env.VITE_API_URL;
console.log("api url",API_URL);
const API_URLi=import.meta.env.VITE_API_URLi;
console.log("api url",API_URLi);
// axios.defaults.withCredentials = true;


export const Signup = async (data: any) => {
  console.log("data of signup",data);
  const res = await axios.post(`${API_URL}/signup`, data, { withCredentials: true });
  console.log("res of signup", res.data);
   localStorage.setItem('token', res.data.token);
   localStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data; 
};

export const Signin = async (data: any) => {
  const res = await axios.post(`${API_URL}/signin`, data, { withCredentials: true });
  console.log("res of signin", res.data);
          localStorage.setItem('token',res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data;
};

export const Logout = () => {
  return axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
};


export const createTodo = (data: { title: string; description?: string; status?: string;priority?:string },workspaceId?:string) => {
  console.log("data of create",data);
  return axios.post(`${API_URLi}/task/${workspaceId}`, data, { withCredentials: true });
};

export const updateTodo = (id: string, data: { title?: string; description?: string; status?: string;priority?:string,customFields?: Record<string, any>; },workspaceId:string) => {
  console.log("data of update",data,id,workspaceId);
  return axios.put(`${API_URLi}/task/${id}/${workspaceId}`, data, { withCredentials: true });
};

export const deleteTodo = (id: string,workspaceId:string) => {
  return axios.delete(`${API_URLi}/task/${id}/${workspaceId}`, { withCredentials: true });
};

export const getTodos = (workspaceId?:string) => {
  return axios.get(`${API_URLi}/task/${workspaceId}`, { withCredentials: true });
};



export const shareTask = async (taskId: string, email: string,workspaceId:string) => {
  console.log("shareTask",taskId,email);
  try {
    const res = await axios.post(
      `${API_URLi}/task/sharetodo/${workspaceId}`,
      { taskId, email },
      { withCredentials: true }
    );
    
    alert(res.data.message);
    return res.data
  } catch (err: any) {
    console.error("Share failed:", err.response?.data || err.message);
    alert("Failed to share task");
  }
};




export const allmail=async () => {
  const res = await axios.get(`${API_URLi}/task/allmail`, { withCredentials: true });
  return res.data;
};




// export const getShared = async () => {
//   const res = await axios.get(`${API_URLi}/task/share`, { withCredentials: true });
//   return res.data;
// };
export const getShared = async (workspaceId:string) => {
  // const email = localStorage.getItem("email"); // sender's email
  const res = await axios.get(`${API_URLi}/task/share/${workspaceId}`, { withCredentials: true });
  return res.data;
};
export const postShared = async (data: { from:string,to: string; title: string; taskId: string,message?:string },workspaceId:string) => {
  const res = await axios.post(`${API_URLi}/task/share/${workspaceId}`, data, { withCredentials: true });
  return res.data;
};

export const deleteShared = async (id: string) => {
  const res = await axios.delete(`${API_URLi}/task/share/${id}`, { withCredentials: true });
  return res.data;
};


// export const getNotifications = async () => {
//   const res = await axios.get(`${API_URLi}/task/notifications`, { withCredentials: true });
//   console.log("notification data",res);
//   return res.data;
// };
export const getNotifications = async (workspaceId:string) => {
  // const email = localStorage.getItem("email"); // receiver's email
  const res = await axios.get(`${API_URLi}/task/notifications/${workspaceId}`, { withCredentials: true });
  console.log('notifitcaitondata',res);
  return res.data;
};

export const deleteNotification = async (id: string) => {
  const res = await axios.delete(`${API_URLi}/task/notifications/${id}`, { withCredentials: true });
  return res.data;
};
export const createNotification = async (data: { from: string; message: string,to:string,taskId:string,userId:string,inviterId?:string,invitedId?:string },workspaceId:string) => {
     console.log("taskid",data.taskId);
     console.log("userid",data.userId);
     console.log("here we see userid while create notification",createNotification);
  const res = await axios.post(`${API_URLi}/task/notifications/${workspaceId}`, data, { withCredentials: true });
  return res.data;
};



export const Bulkcomplete=async(ids:string[])=>{
  
 
 const res = await axios.post(
      `${API_URLi}/task/bulkcomplete`,
      { ids },
      { withCredentials: true }
    );
    console.log("bulkcomplete",res.data)
    alert(res.data.message);
    return res.data
 

}


export const BulkDelete=async(ids:string[])=>{

  
 const res = await axios.post(
      `${API_URLi}/task/bulkdelete`,
      { ids },
      { withCredentials: true }
    );
    console.log("bulkdelete",res.data)
    alert(res.data.message);
    return res.data
 
}

export const viewNotification = async (id: string) => {
  try {
    const res = await axios.get(`${API_URLi}/task/viewnotification/${id}`, {
      withCredentials:true,
    });
    return res.data;
  } catch (error) {
    console.error("Error viewing notification:", error);
    throw error;
  }
};



export const HistoryDetails=async(workspaceId?:string)=>{
  try{
const res=await axios.get(`${API_URLi}/task/history/${workspaceId}`,{withCredentials:true});
console.log("history",res.data);
return res.data
  }
  catch(err){
console.log("history",err)
  }
}


export const DeleteHistory=async(id:string)=>{
  try{
const res=await axios.delete(`${API_URLi}/task/history/delete?id=${id}`,{withCredentials:true});
console.log("history",res.data);
return res.data
  }
  catch(err){
console.log("history",err)
  }
}



export const createCsv=async(parsedData:any[])=>{
  console.log("parsedData in api",parsedData);
  try{
const res=await axios.post(`${API_URLi}/task/csvdata`,parsedData,{withCredentials:true});
console.log("history",res.data);
return res.data
  }
  catch(err){
console.log("csvdata",err)
  }
}



//userid ,message,description


export const importantupdate=async(id:string,data:boolean)=>{
console.log('data of important',data,id);
  try{
 const res=await axios.post(`${API_URLi}/task/importantupdate/${id}`,{isImprtant:data},{withCredentials:true})
 console.log("important",res);
 return res
  }
  catch(err){
console.log("important",err)
  }
}




//checklist work functionality or apis



export const getTodoById = async (id: string) => {
    try {
        const res = await axios.get(`${API_URLi}/task/${id}`, { withCredentials: true });
        console.log("Single Todo fetched:", res.data);
        return res;
    } catch (err) {
        console.error("Error fetching single todo:", err);
        throw err;
    }
};

// --- All your existing checklist functions ---
export const getChecklistItems = async (todoId: string) => {
    try {
        const res = await axios.get(`${API_URLi}/todos/${todoId}/checklist`, { withCredentials: true });
        console.log("Checklist items fetched:", res.data);
        return res;
    } catch (err) {
        console.error("Error fetching checklist items:", err);
        throw err; 
    }
};

export const createChecklistItem = async (todoId: string, title: string) => {
    try {
        const res = await axios.post(
            `${API_URLi}/todos/${todoId}/checklist`,
            { title },
            { withCredentials: true }
        );
        console.log("Checklist item created:", res.data);
        return res;
    } catch (err) {
        console.error("Error creating checklist item:", err);
        throw err;
    }
};

export const updateChecklistItem = async (checklistItemId: string, data: { title?: string, status?: string }) => {
    try {
        const res = await axios.put(
            `${API_URLi}/checklist/${checklistItemId}`,
            data,
            { withCredentials: true }
        );
        console.log("Checklist item updated:", res.data);
        return res;
    } catch (err) {
        console.error("Error updating checklist item:", err);
        throw err;
    }
};

export const deleteChecklistItem = async (checklistItemId: string) => {
    try {
        const res = await axios.delete(
            `${API_URLi}/checklist/${checklistItemId}`,
            { withCredentials: true }
        );
        console.log("Checklist item deleted.");
        return res;
    } catch (err) {
        console.error("Error deleting checklist item:", err);
        throw err;
    }
};



//for archieved

export const archieved=async(id:string,data:any)=>{
  console.log("archieved data in fronted api",data,id);
  try{
const res=await axios.put(`${API_URLi}/task/archieved/${id}`,{data},{withCredentials:true});
console.log("archieved",res.data);
return res.data
  }
  catch(err){
console.log("archieved",err)
  }
}




export const workdata=async(id:string,userId:string)=>{
  console.log("id of workdata",id);
  try{

    const res=await axios.get(`${API_URLi}/task/workdata/${id}`,{params:{userId:userId},withCredentials:true});
    console.log("workdata",res.data);
    return res.data

  }
  catch(err){
console.log("err",err);
  }
}

export const workdataupdate=async(id:string,data:any)=>{
  console.log("workdataupdate data",data,id);
  try{
const res=await axios.put(`${API_URLi}/task/workupdate/${id}`,data,{withCredentials:true});
console.log("workdataupdate",res.data);
return res.data
  }
  catch(err){
console.log("workdataupdate",err)
  }
}



export const  workdelete=async(id:string,userId:string)=>{
  console.log("id of workdelete",id);
  try{
const res=await axios.delete(`${API_URLi}/task/workdelete/${id}`,{params:{userId:userId},withCredentials:true});
console.log("workdelete",res.data);
return res.data
  }
  catch(err){
console.log("workdelete",err)
  }
}


export const getworkChecklistdata=async(id:string,userId:string)=>{
  console.log("id of workChecklistdata",id);
  try{
const res=await axios.get(`${API_URLi}/task/getworkChecklistdata/${id}`,{params:{userId:userId},withCredentials:true});
console.log("workChecklistdata",res);
return res.data
  }
  catch(err){
console.log("workChecklistdata",err)
  }
}



export const workChecklistUpdate = async (id: string, data: any) => {
  // Use PUT to update a single checklist item
  const res = await axios.put(`${API_URLi}/task/workupdate/checklist/${id}`, data, { withCredentials: true });
  return res.data;
}

export const workChecklistDelete = async (id: string) => {
  // Use DELETE to remove a single checklist item
  const res = await axios.delete(`${API_URLi}/task/workupdate/checklist/${id}`, { withCredentials: true });
  return res.data;
}


//invtied people data

export const createdinvited=async(id:string,data:any)=>{
  console.log("data of created id",data);
  try{
const res=await axios.post(`${API_URLi}/task/createdinvited/${id}`,data,{withCredentials:true});
console.log("createdinvited",res.data);
return res.data
  }
  catch(err){
console.log("createdinvited",err)
  }
}

export const getinvited=async(id:string,userId:string)=>{
  console.log("id of getinvited",id);
  try{
const res=await axios.get(`${API_URLi}/task/getinvited/${id}`,{params:{userId:userId},withCredentials:true});
console.log("getinvited",res.data);
return res.data
  }
  catch(err){
console.log("getinvited",err)
  }
}



//comments

export const showallcomment=async(taskId:string)=>{
  console.log("id of showallcomment",taskId);
  try{
const res=await axios.get(`${API_URLi}/task/allcomment/${taskId}`,{withCredentials:true});
console.log("showallcomment",res.data);
return res.data
  }
  catch(err){
console.log("showallcomment",err)
  }
}


export const createComment=async(id:string,data:any)=>{
  console.log("data of createcomment",data,id);
  try{
const res=await axios.post(`${API_URLi}/task/comment/${id}`,data,{withCredentials:true});
console.log("createComment",res.data);
return res.data
  }
  catch(err){
console.log("createComment",err)
  }
}


export const deleteComment=async(id:string)=>{
  console.log("id of deletecomment",id);
  try{
const res=await axios.delete(`${API_URLi}/task/comment/${id}`,{withCredentials:true});
console.log("deleteComment",res.data);
return res.data
  }
  catch(err){
console.log("deleteComment",err)
  }
}




export const updateComment=async(data:any,editingId:string)=>{
  console.log("data of updatecomment",data,editingId);
  try{
const res=await axios.put(`${API_URLi}/task/comment/${editingId}`,data,{withCredentials:true});
console.log("updateComment",res.data);
return res.data
  }
  catch(err){
console.log("updateComment",err)
  }
}







//all worspace functionality

export const createWorkspace=async(data:any)=>{
  console.log("data of createWorkspace",data);
  try{
const res=await axios.post(`${API_URLi}/task/createworkspace`,data,{withCredentials:true});
console.log("createWorkspace",res.data);
return res.data
  }
  catch(err){
console.log("createWorkspace",err)
  }
}



export const  getworkspace=async()=>{
  console.log("id of getworkspace");
  try{
const res=await axios.get(`${API_URLi}/getworkspace`,{withCredentials:true});
console.log("getworkspace",res.data);
return res.data
  }
  catch(err){
console.log("getworkspace",err)
  }
}




export const deleteWorkspace=async(workspaceId:string)=>{
  console.log("id of deleteWorkspace",workspaceId);
  try{
const res=await axios.delete(`${API_URLi}/deleteworkspace/${workspaceId}`,{withCredentials:true});
console.log("deleteWorkspace",res.data);
return res.data
  }
  catch(err){
console.log("deleteWorkspace",err)
  }
}



export const inviteuser=async(data:any)=>{
  console.log("data of inviteuser",data);
  try{
const res=await axios.post(`${API_URLi}/inviteruser`,data,{withCredentials:true});
console.log("inviteuser",res.data);
return res.data
  }
  catch(err){
console.log("inviteuser",err)
  }
}





export const acceptinvite=async(invitationToken:any)=>{
  console.log("data of acceptinvite",invitationToken);
  try{
const res=await axios.post(  `${API_URL}/invite/accept/${invitationToken}`,{withCredentials:true});
console.log("acceptinvite",res.data);
return res.data
  }
  catch(err){
console.log("acceptinvite",err)
  }
}




export const inviterRole=async(receiverId:string)=>{
console.log("id of inviterole",receiverId);
  try{
const res=await axios.get(`${API_URLi}/invitesUserole/${receiverId}`,{withCredentials:true});
console.log("inviteuser",res.data);
return res.data
  }
  catch(err){
console.log("inviterole error",err)
  }

}




export const tagemail = async (value: any) => {
  console.log("value of tagemail", value);
  try {
    const res = await axios.get(`${API_URLi}/tagemail`, {
      params: { value: value },  
      withCredentials: true
    });
    console.log("tagemail", res.data);
    return res.data;
  } catch (err) {
    console.log("tagemail error", err);
  }
};




export const startTime=async(id:string)=>{
  console.log("id of startTime",id);
  try{
const res=await axios.post(`${API_URLi}/task/timer/start/${id}`,{withCredentials:true});
console.log("startTime",res.data);
return res.data
  }
  catch(err){
console.log("startTime",err)
  }
}


export const stopTime=async(id:string)=>{
  console.log("id of stopTime",id);
  try{
const res=await axios.post(`${API_URLi}/task/timer/stop/${id}`,{withCredentials:true});
console.log("stopTime",res.data);
return res.data
  }
  catch(err){
console.log("stopTime",err)
  }
}


export const resetTime=async(id:string)=>{
  console.log("id of resetTime",id);
  try{
const res=await axios.post(`${API_URLi}/task/timer/reset/${id}`,{withCredentials:true});
console.log("resetTime",res.data);
return res.data
  }
  catch(err){
console.log("resetTime",err)
  }
}



export const endTime=async(id:string)=>{
  console.log("id of endTime",id);
  try{
const res=await axios.post(`${API_URLi}/task/timer/end/${id}`,{withCredentials:true});
console.log("endTime",res.data);
return res.data
  }
  catch(err){
console.log("endTime",err)
  }
}



export const getTimerByTodo = async (id: string) => {
  try {
    const res = await axios.get(`${API_URLi}/task/timer/${id}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.log("getTimerByTodo", err);
  }
};




export const allWorkspaceStatus=async(workspaceId:string)=>{
  console.log("id of allWorkspaceStatus",workspaceId);
  try{
const res=await axios.get(`${API_URLi}/task/anylitical/${workspaceId}`,{withCredentials:true});
console.log("allWorkspaceStatus",res.data);
return res.data
  }
  catch(err){
console.log("allWorkspaceStatus",err)
  }
}
