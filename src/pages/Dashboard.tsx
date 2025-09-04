// "use client";
// import { useEffect, useState } from "react";
// import { unparse } from "papaparse";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { useNavigate } from "react-router-dom";
// import { compareAsc, format } from "date-fns";
// import { addDays } from 'date-fns';
// import { DateRangePicker } from 'react-date-range';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
// import { inviterRole } from "../services/Apl";
// // import { PomodoroTimer } from "../components/Pomo";
// import  PomodoroTimer  from "../components/Pomodoro";
// import {
//   getTodos,
//   deleteTodo,
//   updateTodo,
//   shareTask,
//   allmail,
//   postShared,
//   createNotification,
//   Bulkcomplete,
//   BulkDelete,
//   importantupdate,
//   archieved,
//   createdinvited,
// } from "../services/Apl";
// import { useUser } from "@clerk/clerk-react";
// import { useHotkeys } from "react-hotkeys-hook";
// import PushButton from "../components/PushButton";
// import Checklist from "./Checklist";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
// } from "@hello-pangea/dnd";
// import type { DropResult } from "@hello-pangea/dnd";
// import "./Dashboard.css";
// import { useParams } from "react-router-dom";

// type CustomField = {
//   label: string;
//   value: string;
// };

// type Todo = {
//   _id: string;
//   title: string;
//   from: string;
//   description?: string;
//   status?: string;
//   priority?: string;
//   duedate: string;
//   important: boolean;
//   archieved: boolean;
//   userId: string;
//   customFields?: CustomField[];
// };

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { workspaceId } = useParams();
//   const { user } = useUser();

//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     description: "",
//     status: "Pending",
//     priority: "Medium",
//   });
//   const [sharingTodo, setSharingTodo] = useState<Todo | null>(null);
//   const [recipientEmail, setRecipientEmail] = useState("");
//   const [emailOptions, setEmailOptions] = useState<string[]>([]);

//   const [invitingTodo, setInvitingTodo] = useState<Todo | null>(null);
//   const [invitedEmail, setInvitedEmail] = useState("");
//   const [existingUserEmails, setExistingUserEmails] = useState<string[]>([]);

//   const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
//   const [activeCard, setActiveCard] = useState<Todo | null>(null);

//   const [openCalendar, setOpenCalendar] = useState<string | null>(null);
//   const [allTaskRanges, setAllTaskRanges] = useState<any[]>([]);

//   const [isCalendarVisible, setIsCalendarVisible] = useState(false);

//   // New state to store the user's role
//   const [userRole, setUserRole] = useState<string | null>(null);

//   const statusColors: Record<string, string> = {
//     Pending: "#FFA500",
//     InProgress: "#1E90FF",
//     Completed: "#28A745",
//     Overdue: "#DC3545",
//   };

//   const priorityColors: Record<string, string> = {
//     Low: "#28A745",
//     Medium: "#FFC107",
//     Hard: "#DC3545",
//   };

//   const fetchTodos = async () => {
//     try {
//       if (!workspaceId) {
//         console.log("workspaceId not exist");
//         return;
//       }

//       const res = await getTodos(workspaceId);
//       console.log("res of workspace data i got it", res.data);

// let receiverId = localStorage.getItem("userId") ?? "";
// console.log("receiverId", receiverId);

// const somedata = await inviterRole(receiverId);
// console.log("somedata", somedata);
// if (somedata?.data && somedata.data.length > 0) {

//   const role = somedata.data[0].role;
//   console.log("realrole",role);
//   console.log("role", role);
//   if (role === "viewer") {
//     setUserRole("viewer");
//   } else if (role === "editor") {
//     setUserRole("editor");
//   } else {
//     setUserRole("admin");
//   }
// } else {
//   console.warn("No role found, defaulting to admin");
//   setUserRole("admin"); 
// }

// console.log("userrole",userRole);



    
//       setTodos(res.data);

//       const ranges = res.data.map((todo: Todo) => {
//         let color = statusColors[todo.status ?? "Pending"] || "#3d91ff";
//         const dueDate = new Date(todo.duedate);
//         const today = new Date();
//         if (todo.status !== "Completed" && dueDate < today) {
//           color = statusColors.Overdue;
//         }
//         return {
//           startDate: dueDate,
//           endDate: dueDate,
//           key: todo._id,
//           color: color,
//         };
//       });
//       setAllTaskRanges(ranges);

//     } catch (err) {
//       console.error("Error fetching todos:", err);
//       // Set a default role on error
//       setUserRole('admin');
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       if (workspaceId) {
//         await deleteTodo(id, workspaceId);
//         fetchTodos();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEditClick = (todo: Todo) => {
//     console.log("edit button clicked");
//     setEditingTodo(todo);
//     setEditForm({
//       title: todo.title,
//       description: todo.description || "",
//       status: todo.status || "Pending",
//       priority: todo.priority || "Medium",
//     });
//   };

//   const handleUpdate = async () => {
//     if (!editingTodo) return;
//     try {
//       if (workspaceId) {
//         await updateTodo(editingTodo._id, editForm, workspaceId);
//         setEditingTodo(null);
//         fetchTodos();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleShare = async (todo: Todo) => {
//     setSharingTodo(todo);
//     setRecipientEmail("");
//     try {
//       let mails = await allmail();
//       if (user?.primaryEmailAddress?.emailAddress) {
//         mails = mails.filter(
//           (m: string) => m !== user.primaryEmailAddress?.emailAddress
//         );
//       }
//       setEmailOptions(mails);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useHotkeys("alt+n", (event) => {
//     event.preventDefault();
//     navigate("/create");
//   });

//   useHotkeys("alt+s", (event) => {
//     event.preventDefault();
//     navigate("/shared");
//   });

//   useHotkeys("alt+m", (event) => {
//     event.preventDefault();
//     navigate("/notification");
//   });

//   useHotkeys("alt+b", () => {
//     if (activeCard) handleEditClick(activeCard);
//   });

//   useHotkeys("alt+d", () => {
//     if (activeCard) handleDelete(activeCard._id);
//   });

//   useHotkeys("alt+t", () => {
//     if (activeCard) handleShare(activeCard);
//   });

//   const submitShare = async () => {
//     console.log("sharingTodo", sharingTodo);
//     if (!sharingTodo || !recipientEmail) return;
//     const senderEmail = localStorage.getItem("email");
//     if (!senderEmail) return alert("Unable to determine sender's email.");
//     try {
      
//       if(workspaceId){
//         await shareTask(sharingTodo._id, recipientEmail,workspaceId);

//         await postShared({
//           from: senderEmail,
//           to: recipientEmail,
//           title: sharingTodo.title,
//           taskId: sharingTodo._id,
//         },workspaceId);

//         await createNotification({
//           from: senderEmail,
//           to: recipientEmail,
//           message: `You have received a shared task: ${sharingTodo.title}`,
//           taskId: sharingTodo._id,
//           userId: sharingTodo.userId,
//         },workspaceId);
//         setSharingTodo(null);
//         alert("Task shared and notification sent!");
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchTodos();
//   }, [workspaceId]);

//   const toggleSelect = (id: string) => {
//     setSelectedTodos((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   const handleBulkComplete = async () => {
//     if (selectedTodos.length === 0) return alert("Select at least one task!");
//     try {
//       await Bulkcomplete(selectedTodos);
//       setSelectedTodos([]);
//       fetchTodos();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const Imptodo = async (id: string, currentImportantStatus: boolean) => {
//     try {
//       const newTodos = todos.map(todo =>
//         todo._id === id ? { ...todo, important: !currentImportantStatus } : todo
//       );
//       setTodos(newTodos);
//       await importantupdate(id, !currentImportantStatus);
//       console.log("Task importance updated successfully!");
//     } catch (error) {
//       console.error("Failed to update task importance:", error);
//       fetchTodos();
//     }
//   };

//   const handlearchieved = async (id: string, currentImportantStatus: boolean) => {
//     try {
//       const newTodos = todos.map(todo =>
//         todo._id === id ? { ...todo, archieved: !currentImportantStatus } : todo
//       );
//       setTodos(newTodos);
//       await archieved(id, !currentImportantStatus);
//       console.log("Task archieved status updated successfully!");
//     } catch (error) {
//       console.error("Failed to update task archieved status:", error);
//       fetchTodos();
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (selectedTodos.length === 0) return alert("Select at least one task!");
//     try {
//       await BulkDelete(selectedTodos);
//       setSelectedTodos([]);
//       fetchTodos();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleExportToCSV = (todos: any[]) => {
//     if (!todos || todos.length === 0) {
//       alert("No data to export");
//       return;
//     }
//     const csv = unparse(todos);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "tasks.csv";
//     link.click();
//   };

//   const handleExportToPDF = (todos: any[]) => {
//     if (!todos || todos.length === 0) {
//       alert("No data to export");
//       return;
//     }
//     const doc = new jsPDF();
//     doc.text("Tasks List", 14, 20);
//     const tableColumn = ["Title", "Description", "Status", "Priority", "Due Date"];
//     const tableRows = todos.map(todo => [
//       todo.title,
//       todo.description || "-",
//       todo.status || "-",
//       todo.priority || "-",
//       todo.duedate
//         ? format(new Date(todo.duedate), "MM/dd/yyyy hh:mm a")
//         : "No due date",
//     ]);
//     (doc as any).autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 30,
//     });
//     doc.save("tasks.pdf");
//   };

//   const handleDragEnd = async (result: DropResult) => {
//     const { source, destination } = result;
//     if (!destination) return;
//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     ) {
//       return;
//     }
//     const draggedTodo =
//       groupedTodos[source.droppableId as keyof typeof groupedTodos][
//         source.index
//       ];
//     if (!draggedTodo) return;
//     let newStatus = draggedTodo.status;
//     if (destination.droppableId === "pending") newStatus = "Pending";
//     if (destination.droppableId === "progress") newStatus = "InProgress";
//     if (destination.droppableId === "complete") newStatus = "Completed";
//     try {
//       if (workspaceId) {
//         await updateTodo(draggedTodo._id, { ...draggedTodo, status: newStatus }, workspaceId);
//         fetchTodos();
//       }
//     } catch (err) {
//       console.error("Error updating todo after drag:", err);
//     }
//   };

//   {}
//   const checklistwork = (id: string) => {
//     console.log("todo", id);
//     navigate(`/checklist/${id}`);
//   };

//   const commentwork = (id: string) => {
//     console.log("todo", id);
//     navigate(`/comments/${id}`);
//   };

//   const sortedTodos = [...todos].sort((a, b) => {
//     return (b.important ? 1 : 0) - (a.important ? 1 : 0);
//   });

//   const groupedTodos = {
//     pending: sortedTodos.filter((todo) => todo.status === "Pending"),
//     progress: sortedTodos.filter((todo) => todo.status === "InProgress"),
//     complete: sortedTodos.filter((todo) => todo.status === "Completed"),
//   };

//   const handleInviteTodo = async (todo: Todo) => {
//     setInvitingTodo(todo);
//     setInvitedEmail("");
//     try {
//       const existingMails = await allmail();
//       if (user?.primaryEmailAddress?.emailAddress) {
//         setExistingUserEmails(
//           existingMails.filter(
//             (m: string) => m !== user.primaryEmailAddress?.emailAddress
//           )
//         );
//       } else {
//         setExistingUserEmails(existingMails);
//       }
//     } catch (err) {
//       console.error("Failed to fetch user emails:", err);
//     }
//   };

//   const submitInvite = async () => {
//     if (!invitingTodo || !invitedEmail) {
//       return alert("Please select or enter an email to invite.");
//     }
//     const senderEmail = localStorage.getItem("email");
//     if (!senderEmail) {
//       return alert("Unable to determine sender's email.");
//     }
//     try {
//       if(workspaceId){
//         await shareTask(invitingTodo._id, invitedEmail,workspaceId);

//         await postShared({
//           from: senderEmail,
//           to: invitedEmail,
//           title: invitingTodo.title,
//           taskId: invitingTodo._id,
//         },workspaceId);
//         await createNotification({
//           from: senderEmail,
//           to: invitedEmail,
//           message: `You have been invited to a workshop for task: ${invitingTodo.title}`,
//           taskId: invitingTodo._id,
//           userId: invitingTodo.userId,
//           inviterId: user?.id,
//           invitedId: invitedEmail,
//         },workspaceId);
//       }
//       await createdinvited(invitingTodo._id, {
//         inviterId: user?.id,
//         invitedId: invitedEmail,
//         UserId: invitingTodo.userId,
//         taskId: invitingTodo._id,
//       });
//       setInvitingTodo(null);
//       alert("Invitation sent successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send invitation.");
//     }
//   };

//   // Role-based access control flags based on the userRole state
//   const isViewer = userRole === 'viewer';
//   const isEditor = userRole === 'editor';
//   const isAdmin = userRole === 'admin';
//   const canEdit = !isViewer;
//   const canDelete = isAdmin||isEditor;
//   const canShare = isAdmin;
//   const canInvite = isAdmin;
// console.log("canEdit",canEdit);
//   return (
//     <div className="dashboard-container">
//       <h2 className="dashboard-title">
//         Welcome, {user?.firstName || "User"} 👋
//       </h2>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//         {todos.length > 0 && canEdit && (
//           <div style={{ marginBottom: "1rem" }}>
//             <button onClick={handleBulkComplete} className="btn save-btn" style={{ marginRight: "0.5rem" }}>
//               Bulk Complete
//             </button>
//             <button onClick={handleBulkDelete} className="btn delete-btn">
//               Bulk Delete
//             </button>
//             <button onClick={() => handleExportToCSV(todos)} className="btn save-btn" style={{ marginRight: "0.5rem" }}>
//               Export CSV
//             </button>
//             <button onClick={() => handleExportToPDF(todos)} className="btn save-btn">
//               Export PDF
//             </button>
//           </div>
//         )}
//         &nbsp; &nbsp; &nbsp;
//         <div
//           className="calendar-container"
//           onMouseEnter={() => setIsCalendarVisible(true)}
//           onMouseLeave={() => setIsCalendarVisible(false)}
//         >
//           <div className="calendar-toggle-area">
//             <span className="calendar-icon">📅</span>
//             {isCalendarVisible && (
//               <div className="calendar-dropdown">
//                 <DateRangePicker
//                   onChange={item => {}}
//                   months={3}
//                   ranges={allTaskRanges}
//                   direction="horizontal"
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <hr />
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <div style={{ display: "flex", gap: "20px" }}>
//           {["pending", "progress", "complete"].map((statusKey) => (
//             <Droppable key={statusKey} droppableId={statusKey}>
//               {(provided) => (
//                 <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1 }}>
//                   <h3 style={{ textAlign: "center" }}>
//                     {statusKey === "pending"
//                       ? "Pending"
//                       : statusKey === "progress"
//                       ? "In Progress"
//                       : "Completed"}
//                   </h3>
//                   {(groupedTodos as any)[statusKey].length === 0 ? (
//                     <p className="no-tasks">No tasks.</p>
//                   ) : (
//                     (groupedTodos as any)[statusKey].map((todo: Todo, index: number) => (
//                       <Draggable key={todo._id} draggableId={todo._id} index={index} isDragDisabled={!canEdit}>
//                         {(provided) => (
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             onMouseEnter={() => setActiveCard(todo)}
//                             onMouseLeave={() => setActiveCard(null)}
//                             className="todo-card"
//                           >
//                             <div style={{ display: "flex", alignItems: "center" }}>
//                               <input
//                                 type="checkbox"
//                                 checked={selectedTodos.includes(todo._id)}
//                                 onChange={() => toggleSelect(todo._id)}
//                               />
//                               <div className="todo-content">
//                                 <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
//                                   <div>
//                                     <p>
//                                       <strong>Due:</strong>{' '}
//                                       {todo.duedate
//                                         ? format(new Date(todo.duedate), 'MM/dd/yyyy hh:mm a')
//                                         : 'No due date'}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <h3 className="todo-title" onClick={() => checklistwork(todo._id)}>{todo.title}</h3>
//                                 {
//                                   canEdit &&(
//                                     <><a style={{ color: "blue" }} onClick={() => checklistwork(todo._id)}>See CheckList</a><a style={{ color: "blue" }} onClick={() => commentwork(todo._id)}>See Comments</a></>

//                                   )
//                                 }
//                                 <PomodoroTimer todoId={todo._id} workspace={workspaceId ?? ""} refreshTodos={fetchTodos} status={""}/>

//                                 <p className="todo-description">
//                                   {todo.description || "No description"}
//                                 </p>

//                                 {todo.customFields && todo.customFields.length > 0 && (
//   <div className="custom-fields">
//     {todo.customFields.map((field, idx) => (
//       <div key={idx} className="custom-field-item">
//         <strong>{field.label}:</strong> {field.value}
//       </div>
//     ))}
//   </div>
// )}
//                                 <div className="todo-meta" style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
//                                   <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//                                     <span
//                                       style={{
//                                         display: "inline-block",
//                                         width: "12px",
//                                         height: "12px",
//                                         borderRadius: "50%",
//                                         backgroundColor: statusColors[todo.status || "Pending"],
//                                       }}
//                                       title={todo.status}
//                                     ></span>
//                                     {todo.status}
//                                   </span>
//                                   <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//                                     <span
//                                       style={{
//                                         display: "inline-block",
//                                         width: "12px",
//                                         height: "12px",
//                                         borderRadius: "50%",
//                                         backgroundColor: priorityColors[todo.priority || "Medium"],
//                                       }}
//                                       title={todo.priority}
//                                     ></span>
//                                     {todo.priority}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="todo-actions">
//                               {canEdit && (
//                                 <button onClick={() => handleEditClick(todo)} className="btn edit-btn">
//                                   Edit
//                                 </button>
//                               )}
//                               {canDelete && (
//                                 <button onClick={() => handleDelete(todo._id)} className="btn delete-btn" disabled={todo.archieved} style={{ backgroundColor: todo.archieved ? "gray" : "red" }}>
//                                   Delete
//                                 </button>
//                               )}
//                               {canShare && (
//                                 <button onClick={() => handleShare(todo)} className="btn share-btn">
//                                   Share
//                                 </button>
//                               )}
//                               {canEdit && (
//                                 <button onClick={() => Imptodo(todo._id, todo.important)} className="btn share-btn" style={{ backgroundColor: todo.important ? "red" : "green" }}>
//                                   Imp
//                                 </button>
//                               )}
//                               {canEdit && (
//                                 <button onClick={() => handlearchieved(todo._id, todo.archieved)} className="btn share-btn" style={{ backgroundColor: todo.archieved ? "gray" : "red" }}>
//                                   Archieve
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </Draggable>
//                     ))
//                   )}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           ))}
//         </div>
//       </DragDropContext>


      


      
//       {canEdit && editingTodo && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>Edit Task</h3>
//             <label>Title</label>
//             <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
//             <label>Description</label>
//             <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
//             <label>Status</label>
//             <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
//               <option value="Pending">Pending</option>
//               <option value="InProgress">In Progress</option>
//               <option value="Completed">Completed</option>
//             </select>
//             <label>Priority</label>
//             <select value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}>
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="Hard">Hard</option>
//             </select>
//             <div className="modal-actions">
//               <button onClick={() => setEditingTodo(null)} className="btn cancel-btn">Cancel</button>
//               <button onClick={handleUpdate} className="btn save-btn">Save</button>
//             </div>
//           </div>
//         </div>
//       )}
//       {canShare && sharingTodo && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>Share Task</h3>
//             <input type="text" value={sharingTodo._id} readOnly />
//             <select value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)}>
//               <option value="">-- Select an email --</option>
//               {emailOptions.map((email, idx) => (
//                 <option key={idx} value={email}>{email}</option>
//               ))}
//             </select>
//             <div className="modal-actions">
//               <button onClick={() => setSharingTodo(null)} className="btn cancel-btn">Cancel</button>
//               <button onClick={submitShare} className="btn save-btn">Share</button>
//             </div>
//           </div>
//         </div>
//       )}
//       {canInvite && invitingTodo && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>Invite to a Workshop</h3>
//             <p>Task: {invitingTodo.title}</p>
//             <label htmlFor="email-select">Choose an existing user:</label>
//             <select id="email-select" value={invitedEmail} onChange={(e) => setInvitedEmail(e.target.value)}>
//               <option value="">-- Select an email --</option>
//               {existingUserEmails.map((email, idx) => (
//                 <option key={idx} value={email}>{email}</option>
//               ))}
//             </select>
//             <p style={{ marginTop: '10px', marginBottom: '10px' }}>OR</p>
//             <label htmlFor="email-input">Enter a new email:</label>
//             <input id="email-input" type="email" placeholder="Enter email to invite" value={invitedEmail} onChange={(e) => setInvitedEmail(e.target.value)} />
//             <div className="modal-actions">
//               <button onClick={() => setInvitingTodo(null)} className="btn cancel-btn">Cancel</button>
//               <button onClick={submitInvite} className="btn save-btn">Invite</button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* <PushButton/> */}
//     </div>
//   );
// };

// export default Dashboard;







"use client";
import { useEffect, useState, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from "react";
import { unparse } from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import {  format } from "date-fns";
// import { addDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { inviterRole } from "../services/Apl";
import PomodoroTimer from "../components/Pomodoro";
import {
  getTodos,
  deleteTodo,
  updateTodo,
  shareTask,
  allmail,
  postShared,
  createNotification,
  Bulkcomplete,
  BulkDelete,
  importantupdate,
  archieved,
  createdinvited,
} from "../services/Apl";
import { useUser } from "@clerk/clerk-react";
import { useHotkeys } from "react-hotkeys-hook";
// import PushButton from "../components/PushButton";
// import Checklist from "./Checklist";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import "./Dashboard.css";
import { useParams } from "react-router-dom";

type CustomField = {
  label: string;
  value: string;
  type: string;
  options?: string[];
};

type Todo = {
  _id: string;
  title: string;
  from: string;
  description?: string;
  status?: string;
  priority?: string;
  duedate: string;
  important: boolean;
  archieved: boolean;
  userId: string;
  customFields?: CustomField[];
};
interface EditForm {
  title: string;
  description: string;
  status: string;
  priority: string;
  customFields: any[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const { user } = useUser();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [editForm, setEditForm] = useState<EditForm>({
  title: '',
  description: '',
  status: '',
  priority: '',
  customFields: [],
});

  const [sharingTodo, setSharingTodo] = useState<Todo | null>(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailOptions, setEmailOptions] = useState<string[]>([]);

  const [invitingTodo, setInvitingTodo] = useState<Todo | null>(null);
  const [invitedEmail, setInvitedEmail] = useState("");
  const [existingUserEmails] = useState<string[]>([]);

  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [activeCard, setActiveCard] = useState<Todo | null>(null);

  // const [openCalendar, setOpenCalendar] = useState<string | null>(null);
  const [allTaskRanges, setAllTaskRanges] = useState<any[]>([]);

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  
  // NOTE: The customFieldOptions state and logic have been removed, as the options
  // are now available directly on each custom field object.

  const [userRole, setUserRole] = useState<string | null>(null);

  const statusColors: Record<string, string> = {
    Pending: "#FFA500",
    InProgress: "#1E90FF",
    Completed: "#28A745",
    Overdue: "#DC3545",
  };

  const priorityColors: Record<string, string> = {
    Low: "#28A745",
    Medium: "#FFC107",
    Hard: "#DC3545",
  };

  const fetchTodos = async () => {
    try {
      if (!workspaceId) {
        console.log("workspaceId not exist");
        return;
      }
      const res = await getTodos(workspaceId);
      console.log("res of workspace data i got it", res.data);
      let receiverId = localStorage.getItem("userId") ?? "";
      console.log("receiverId", receiverId);
      const somedata = await inviterRole(receiverId);
      console.log("somedata", somedata);
      if (somedata?.data && somedata.data.length > 0) {
        const role = somedata.data[0].role;
        console.log("realrole", role);
        console.log("role", role);
        if (role === "viewer") {
          setUserRole("viewer");
        } else if (role === "editor") {
          setUserRole("editor");
        } else {
          setUserRole("admin");
        }
      } else {
        console.warn("No role found, defaulting to admin");
        setUserRole("admin");
      }
      console.log("userrole", userRole);
      setTodos(res.data);

      const ranges = res.data.map((todo: Todo) => {
        let color = statusColors[todo.status ?? "Pending"] || "#3d91ff";
        const dueDate = new Date(todo.duedate);
        const today = new Date();
        if (todo.status !== "Completed" && dueDate < today) {
          color = statusColors.Overdue;
        }
        return {
          startDate: dueDate,
          endDate: dueDate,
          key: todo._id,
          color: color,
        };
      });
      setAllTaskRanges(ranges);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setUserRole('admin');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (workspaceId) {
        await deleteTodo(id, workspaceId);
        fetchTodos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (todo: Todo) => {
    console.log("edit button clicked");
    setEditingTodo(todo);
    setEditForm({
      title: todo.title,
      description: todo.description || "",
      status: todo.status || "Pending",
      priority: todo.priority || "Medium",
      customFields: todo.customFields || [],
    });
  };

  const handleUpdate = async () => {
    if (!editingTodo) return;
    try {
      if (workspaceId) {
        await updateTodo(editingTodo._id, {
          ...editForm,
          customFields: editForm.customFields,
        }, workspaceId);
        setEditingTodo(null);
        fetchTodos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCustomFieldChange = (index: number, newValue: string) => {
    setEditForm((prevForm) => {
      const newCustomFields = [...prevForm.customFields];
      newCustomFields[index] = { ...newCustomFields[index], value: newValue };
      return { ...prevForm, customFields: newCustomFields };
    });
  };

  const handleShare = async (todo: Todo) => {
    setSharingTodo(todo);
    setRecipientEmail("");
    try {
      let mails = await allmail();
      if (user?.primaryEmailAddress?.emailAddress) {
        mails = mails.filter(
          (m: string) => m !== user.primaryEmailAddress?.emailAddress
        );
      }
      setEmailOptions(mails);
    } catch (err) {
      console.error(err);
    }
  };

  useHotkeys("alt+n", (event) => {
    event.preventDefault();
    navigate("/create");
  });

  useHotkeys("alt+s", (event) => {
    event.preventDefault();
    navigate("/shared");
  });

  useHotkeys("alt+m", (event) => {
    event.preventDefault();
    navigate("/notification");
  });

  useHotkeys("alt+b", () => {
    if (activeCard) handleEditClick(activeCard);
  });

  useHotkeys("alt+d", () => {
    if (activeCard) handleDelete(activeCard._id);
  });

  useHotkeys("alt+t", () => {
    if (activeCard) handleShare(activeCard);
  });

  const submitShare = async () => {
    console.log("sharingTodo", sharingTodo);
    if (!sharingTodo || !recipientEmail) return;
    const senderEmail = localStorage.getItem("email");
    if (!senderEmail) return alert("Unable to determine sender's email.");
    try {
      if (workspaceId) {
        await shareTask(sharingTodo._id, recipientEmail, workspaceId);
        await postShared({
          from: senderEmail,
          to: recipientEmail,
          title: sharingTodo.title,
          taskId: sharingTodo._id,
        }, workspaceId);
        await createNotification({
          from: senderEmail,
          to: recipientEmail,
          message: `You have received a shared task: ${sharingTodo.title}`,
          taskId: sharingTodo._id,
          userId: sharingTodo.userId,
        }, workspaceId);
        setSharingTodo(null);
        alert("Task shared and notification sent!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [workspaceId]);

  const toggleSelect = (id: string) => {
    setSelectedTodos((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkComplete = async () => {
    if (selectedTodos.length === 0) return alert("Select at least one task!");
    try {
      await Bulkcomplete(selectedTodos);
      setSelectedTodos([]);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const Imptodo = async (id: string, currentImportantStatus: boolean) => {
    try {
      const newTodos = todos.map(todo =>
        todo._id === id ? { ...todo, important: !currentImportantStatus } : todo
      );
      setTodos(newTodos);
      await importantupdate(id, !currentImportantStatus);
      console.log("Task importance updated successfully!");
    } catch (error) {
      console.error("Failed to update task importance:", error);
      fetchTodos();
    }
  };

  const handlearchieved = async (id: string, currentImportantStatus: boolean) => {
    try {
      const newTodos = todos.map(todo =>
        todo._id === id ? { ...todo, archieved: !currentImportantStatus } : todo
      );
      setTodos(newTodos);
      await archieved(id, !currentImportantStatus);
      console.log("Task archieved status updated successfully!");
    } catch (error) {
      console.error("Failed to update task archieved status:", error);
      fetchTodos();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTodos.length === 0) return alert("Select at least one task!");
    try {
      await BulkDelete(selectedTodos);
      setSelectedTodos([]);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportToCSV = (todos: any[]) => {
    if (!todos || todos.length === 0) {
      alert("No data to export");
      return;
    }
    const csv = unparse(todos);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tasks.csv";
    link.click();
  };

  const handleExportToPDF = (todos: any[]) => {
    if (!todos || todos.length === 0) {
      alert("No data to export");
      return;
    }
    const doc = new jsPDF();
    doc.text("Tasks List", 14, 20);
    const tableColumn = ["Title", "Description", "Status", "Priority", "Due Date"];
    const tableRows = todos.map(todo => [
      todo.title,
      todo.description || "-",
      todo.status || "-",
      todo.priority || "-",
      todo.duedate
        ? format(new Date(todo.duedate), "MM/dd/yyyy hh:mm a")
        : "No due date",
    ]);
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save("tasks.pdf");
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const draggedTodo =
      groupedTodos[source.droppableId as keyof typeof groupedTodos][
      source.index
      ];
    if (!draggedTodo) return;
    let newStatus = draggedTodo.status;
    if (destination.droppableId === "pending") newStatus = "Pending";
    if (destination.droppableId === "progress") newStatus = "InProgress";
    if (destination.droppableId === "complete") newStatus = "Completed";
    try {
      if (workspaceId) {
        await updateTodo(draggedTodo._id, { ...draggedTodo, status: newStatus }, workspaceId);
        fetchTodos();
      }
    } catch (err) {
      console.error("Error updating todo after drag:", err);
    }
  };

  const checklistwork = (id: string) => {
    console.log("todo", id);
    navigate(`/checklist/${id}`);
  };

  const commentwork = (id: string) => {
    console.log("todo", id);
    navigate(`/comments/${id}`);
  };

  const sortedTodos = [...todos].sort((a, b) => {
    return (b.important ? 1 : 0) - (a.important ? 1 : 0);
  });

  const groupedTodos = {
    pending: sortedTodos.filter((todo) => todo.status === "Pending"),
    progress: sortedTodos.filter((todo) => todo.status === "InProgress"),
    complete: sortedTodos.filter((todo) => todo.status === "Completed"),
  };

  // const handleInviteTodo = async (todo: Todo) => {
  //   setInvitingTodo(todo);
  //   setInvitedEmail("");
  //   try {
  //     const existingMails = await allmail();
  //     if (user?.primaryEmailAddress?.emailAddress) {
  //       setExistingUserEmails(
  //         existingMails.filter(
  //           (m: string) => m !== user.primaryEmailAddress?.emailAddress
  //         )
  //       );
  //     } else {
  //       setExistingUserEmails(existingMails);
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch user emails:", err);
  //   }
  // };

  const submitInvite = async () => {
    if (!invitingTodo || !invitedEmail) {
      return alert("Please select or enter an email to invite.");
    }
    const senderEmail = localStorage.getItem("email");
    if (!senderEmail) {
      return alert("Unable to determine sender's email.");
    }
    try {
      if (workspaceId) {
        await shareTask(invitingTodo._id, invitedEmail, workspaceId);
        await postShared({
          from: senderEmail,
          to: invitedEmail,
          title: invitingTodo.title,
          taskId: invitingTodo._id,
        }, workspaceId);
        await createNotification({
          from: senderEmail,
          to: invitedEmail,
          message: `You have been invited to a workshop for task: ${invitingTodo.title}`,
          taskId: invitingTodo._id,
          userId: invitingTodo.userId,
          inviterId: user?.id,
          invitedId: invitedEmail,
        }, workspaceId);
      }
      await createdinvited(invitingTodo._id, {
        inviterId: user?.id,
        invitedId: invitedEmail,
        UserId: invitingTodo.userId,
        taskId: invitingTodo._id,
      });
      setInvitingTodo(null);
      alert("Invitation sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send invitation.");
    }
  };

  const isViewer = userRole === 'viewer';
  const isEditor = userRole === 'editor';
  const isAdmin = userRole === 'admin';
  const canEdit = !isViewer;
  const canDelete = isAdmin || isEditor;
  const canShare = isAdmin;
  const canInvite = isAdmin;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">
        Welcome, {user?.firstName || "User"} 👋
      </h2>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        {todos.length > 0 && canEdit && (
          <div style={{ marginBottom: "1rem" }}>
            <button onClick={handleBulkComplete} className="btn save-btn" style={{ marginRight: "0.5rem" }}>
              Bulk Complete
            </button>
            <button onClick={handleBulkDelete} className="btn delete-btn">
              Bulk Delete
            </button>
            <button onClick={() => handleExportToCSV(todos)} className="btn save-btn" style={{ marginRight: "0.5rem" }}>
              Export CSV
            </button>
            <button onClick={() => handleExportToPDF(todos)} className="btn save-btn">
              Export PDF
            </button>
          </div>
        )}
        &nbsp; &nbsp; &nbsp;
        <div
          className="calendar-container"
          onMouseEnter={() => setIsCalendarVisible(true)}
          onMouseLeave={() => setIsCalendarVisible(false)}
        >
          <div className="calendar-toggle-area">
            <span className="calendar-icon">📅</span>
            {isCalendarVisible && (
              <div className="calendar-dropdown">
                <DateRangePicker
                  // onChange={item => { }}
                  months={3}
                  ranges={allTaskRanges}
                  direction="horizontal"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <hr />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "20px" }}>
          {["pending", "progress", "complete"].map((statusKey) => (
            <Droppable key={statusKey} droppableId={statusKey}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1 }}>
                  <h3 style={{ textAlign: "center" }}>
                    {statusKey === "pending"
                      ? "Pending"
                      : statusKey === "progress"
                        ? "In Progress"
                        : "Completed"}
                  </h3>
                  {(groupedTodos as any)[statusKey].length === 0 ? (
                    <p className="no-tasks">No tasks.</p>
                  ) : (
                    (groupedTodos as any)[statusKey].map((todo: Todo, index: number) => (
                      <Draggable key={todo._id} draggableId={todo._id} index={index} isDragDisabled={!canEdit}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onMouseEnter={() => setActiveCard(todo)}
                            onMouseLeave={() => setActiveCard(null)}
                            className="todo-card"
                          >
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <input
                                type="checkbox"
                                checked={selectedTodos.includes(todo._id)}
                                onChange={() => toggleSelect(todo._id)}
                              />
                              <div className="todo-content">
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                                  <div>
                                    <p>
                                      <strong>Due:</strong>{' '}
                                      {todo.duedate
                                        ? format(new Date(todo.duedate), 'MM/dd/yyyy hh:mm a')
                                        : 'No due date'}
                                    </p>
                                  </div>
                                </div>
                                <h3 className="todo-title" onClick={() => checklistwork(todo._id)}>{todo.title}</h3>
                                {
                                  canEdit && (
                                    <><a style={{ color: "blue" }} onClick={() => checklistwork(todo._id)}>See CheckList</a><a style={{ color: "blue" }} onClick={() => commentwork(todo._id)}>See Comments</a></>
                                  )
                                }
                                <PomodoroTimer todoId={todo._id} workspace={workspaceId ?? ""} refreshTodos={fetchTodos} status={""} />
                                <p className="todo-description">
                                  {todo.description || "No description"}
                                </p>
                                {todo.customFields && todo.customFields.length > 0 && (
                                  <div className="custom-fields">
                                    {todo.customFields.map((field, idx) => (
                                      <div key={idx} className="custom-field-item">
                                        <strong>{field.label}:</strong> {field.value}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="todo-meta" style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "50%",
                                        backgroundColor: statusColors[todo.status || "Pending"],
                                      }}
                                      title={todo.status}
                                    ></span>
                                    {todo.status}
                                  </span>
                                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "50%",
                                        backgroundColor: priorityColors[todo.priority || "Medium"],
                                      }}
                                      title={todo.priority}
                                    ></span>
                                    {todo.priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="todo-actions">
                              {canEdit && (
                                <button onClick={() => handleEditClick(todo)} className="btn edit-btn">
                                  Edit
                                </button>
                              )}
                              {canDelete && (
                                <button onClick={() => handleDelete(todo._id)} className="btn delete-btn" disabled={todo.archieved} style={{ backgroundColor: todo.archieved ? "gray" : "red" }}>
                                  Delete
                                </button>
                              )}
                              {canShare && (
                                <button onClick={() => handleShare(todo)} className="btn share-btn">
                                  Share
                                </button>
                              )}
                              {canEdit && (
                                <button onClick={() => Imptodo(todo._id, todo.important)} className="btn share-btn" style={{ backgroundColor: todo.important ? "red" : "green" }}>
                                  Imp
                                </button>
                              )}
                              {canEdit && (
                                <button onClick={() => handlearchieved(todo._id, todo.archieved)} className="btn share-btn" style={{ backgroundColor: todo.archieved ? "gray" : "red" }}>
                                  Archieve
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      {canEdit && editingTodo && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Task</h3>
            <div className="modal-content-scrollable">
              <label>Title</label>
              <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              <label>Description</label>
              <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
              <label>Status</label>
              <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <label>Priority</label>
              <select value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              {editForm.customFields && editForm.customFields.length > 0 && (
                <div className="edit-custom-fields-container">
                  <div className="custom-fields-header">
                    <h4>Custom Fields</h4>
                  </div>
                  <div className="custom-fields-list">
                    {editForm.customFields.map((field, index) => (
                      <div key={index} className="edit-custom-field-item">
                        <div className="field-label-display">
                          <p><strong>{field.label}:</strong></p>
                        </div>
                        {/* --- NEW CONDITIONAL RENDERING: Based on the field type --- */}
                        {(() => {
                          switch (field.type) {
                            case 'text':
                              return (
                                <input
                                  type="text"
                                  value={field.value}
                                  onChange={(e) => handleCustomFieldChange(index, e.target.value)}
                                />
                              );
                            case 'textarea':
                              return (
                                <textarea
                                  value={field.value}
                                  onChange={(e) => handleCustomFieldChange(index, e.target.value)}
                                />
                              );
                            case 'select':
                            case 'checkbox': // Treat checkbox as a single-select dropdown for now
                              return (
                                <select
                                  value={field.value}
                                  onChange={(e) => handleCustomFieldChange(index, e.target.value)}
                                >
                                  {field.options?.map((optionValue: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, idx: Key | null | undefined) => {
                                    // Only allow string or number values for <option>
                                    if (typeof optionValue === "string" || typeof optionValue === "number") {
                                      return (
                                        <option key={idx} value={optionValue}>{optionValue}</option>
                                      );
                                    }
                                    // Skip invalid types (null, undefined, objects, etc.)
                                    return null;
                                  })}
                                </select>
                              );
                            default:
                              return null; // Don't render anything if the type is unknown
                          }
                        })()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={() => setEditingTodo(null)} className="btn cancel-btn">Cancel</button>
              <button onClick={handleUpdate} className="btn save-btn">Save</button>
            </div>
          </div>
        </div>
      )}
      {canShare && sharingTodo && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Share Task</h3>
            <input type="text" value={sharingTodo._id} readOnly />
            <select value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)}>
              <option value="">-- Select an email --</option>
              {emailOptions.map((email, idx) => (
                <option key={idx} value={email}>{email}</option>
              ))}
            </select>
            <div className="modal-actions">
              <button onClick={() => setSharingTodo(null)} className="btn cancel-btn">Cancel</button>
              <button onClick={submitShare} className="btn save-btn">Share</button>
            </div>
          </div>
        </div>
      )}
      {canInvite && invitingTodo && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Invite to a Workshop</h3>
            <p>Task: {invitingTodo.title}</p>
            <label htmlFor="email-select">Choose an existing user:</label>
            <select id="email-select" value={invitedEmail} onChange={(e) => setInvitedEmail(e.target.value)}>
              <option value="">-- Select an email --</option>
              {existingUserEmails.map((email, idx) => (
                <option key={idx} value={email}>{email}</option>
              ))}
            </select>
            <p style={{ marginTop: '10px', marginBottom: '10px' }}>OR</p>
            <label htmlFor="email-input">Enter a new email:</label>
            <input id="email-input" type="email" placeholder="Enter email to invite" value={invitedEmail} onChange={(e) => setInvitedEmail(e.target.value)} />
            <div className="modal-actions">
              <button onClick={() => setInvitingTodo(null)} className="btn cancel-btn">Cancel</button>
              <button onClick={submitInvite} className="btn save-btn">Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;





























//its thunk code


// "use client";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useUser } from "@clerk/clerk-react";
// import { useHotkeys } from "react-hotkeys-hook";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
// } from "@hello-pangea/dnd";
// import type { DropResult } from "@hello-pangea/dnd";

// import { useAppDispatch, useAppSelector } from "../store/hooks";
// import {
//   fetchTodosThunk,
//   deleteTodoThunk,
//   updateTodoThunk,
//   bulkCompleteThunk,
//   bulkDeleteThunk,
//   toggleImportantThunk,
//   toggleArchivedThunk,
//   shareTodoThunk,
//   inviteTodoThunk,
// } from "../store/appSlice"; // adjust import if needed

// import PomodoroTimer from "../components/Pomodoro";
// import "./Dashboard.css";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { workspaceId } = useParams();
//   const { user } = useUser();
//   const dispatch = useAppDispatch();

//   // Redux state
//   const { todos, loading, error } = useAppSelector((state) => state.app);

//   // Local UI state
//   const [editingTodo, setEditingTodo] = useState<any | null>(null);
//   const [editForm, setEditForm] = useState<any>({
//     title: "",
//     description: "",
//     status: "Pending",
//     priority: "Medium",
//     customFields: [],
//   });
//   const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
//   const [activeCard, setActiveCard] = useState<any | null>(null);

//   // Fetch todos on load
//   useEffect(() => {
//     if (workspaceId) {
//       dispatch(fetchTodosThunk(workspaceId));
//     }
//   }, [workspaceId, dispatch]);

//   // Edit
//   const handleEditClick = (todo: any) => {
//     setEditingTodo(todo);
//     setEditForm({
//       title: todo.title,
//       description: todo.description || "",
//       status: todo.status || "Pending",
//       priority: todo.priority || "Medium",
//       customFields: todo.customFields || [],
//     });
//   };

//   const handleUpdate = () => {
//     if (!editingTodo || !workspaceId) return;
//     dispatch(
//       updateTodoThunk({
//         workspaceId,
//         todoId: editingTodo._id,
//         data: editForm,
//       })
//     );
//     setEditingTodo(null);
//   };

//   // Selection
//   const toggleSelect = (id: string) => {
//     setSelectedTodos((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   // Drag + Drop
//   const handleDragEnd = (result: DropResult) => {
//     const { source, destination } = result;
//     if (!destination) return;
//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     )
//       return;

//     const draggedTodo =
//       groupedTodos[source.droppableId as keyof typeof groupedTodos][
//         source.index
//       ];
//     if (!draggedTodo || !workspaceId) return;

//     let newStatus = draggedTodo.status;
//     if (destination.droppableId === "pending") newStatus = "Pending";
//     if (destination.droppableId === "progress") newStatus = "InProgress";
//     if (destination.droppableId === "complete") newStatus = "Completed";

//     dispatch(
//       updateTodoThunk({
//         workspaceId,
//         todoId: draggedTodo._id,
//         data: { ...draggedTodo, status: newStatus },
//       })
//     );
//   };

//   // Grouping
//   const sortedTodos = [...todos].sort(
//     (a, b) => (b.important ? 1 : 0) - (a.important ? 1 : 0)
//   );
//   const groupedTodos = {
//     pending: sortedTodos.filter((todo) => todo.status === "Pending"),
//     progress: sortedTodos.filter((todo) => todo.status === "InProgress"),
//     complete: sortedTodos.filter((todo) => todo.status === "Completed"),
//   };

//   // Bulk actions
//   const handleBulkComplete = () => {
//     if (workspaceId && selectedTodos.length > 0) {
//       dispatch(bulkCompleteThunk({ workspaceId, ids: selectedTodos }));
//       setSelectedTodos([]);
//     }
//   };

//   const handleBulkDelete = () => {
//     if (workspaceId && selectedTodos.length > 0) {
//       dispatch(bulkDeleteThunk({ workspaceId, ids: selectedTodos }));
//       setSelectedTodos([]);
//     }
//   };

//   // Share
//   const handleShare = (todoId: string, email: string) => {
//     if (workspaceId) {
//       dispatch(shareTodoThunk({ workspaceId, todoId, email }));
//     }
//   };

//   // Invite
//   const handleInvite = (todoId: string, userId: string) => {
//     if (workspaceId) {
//       dispatch(inviteTodoThunk({ workspaceId, todoId, userId }));
//     }
//   };

//   // Hotkeys
//   useHotkeys("alt+n", (e) => {
//     e.preventDefault();
//     navigate("/create");
//   });

//   return (
//     <div className="dashboard-container">
//       <h2 className="dashboard-title">
//         Welcome, {user?.firstName || "User"} 👋
//       </h2>

//       {loading && <p>Loading...</p>}
//       {error && <p className="error">{error}</p>}

//       <div className="bulk-actions">
//         <button onClick={handleBulkComplete} disabled={selectedTodos.length === 0}>
//           Bulk Complete
//         </button>
//         <button onClick={handleBulkDelete} disabled={selectedTodos.length === 0}>
//           Bulk Delete
//         </button>
//       </div>

//       <DragDropContext onDragEnd={handleDragEnd}>
//         <div style={{ display: "flex", gap: "20px" }}>
//           {["pending", "progress", "complete"].map((statusKey) => (
//             <Droppable key={statusKey} droppableId={statusKey}>
//               {(provided) => (
//                 <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1 }}>
//                   <h3 style={{ textAlign: "center" }}>
//                     {statusKey === "pending"
//                       ? "Pending"
//                       : statusKey === "progress"
//                       ? "In Progress"
//                       : "Completed"}
//                   </h3>
//                   {(groupedTodos as any)[statusKey].map(
//                     (todo: any, index: number) => (
//                       <Draggable
//                         key={todo._id}
//                         draggableId={todo._id}
//                         index={index}
//                       >
//                         {(provided) => (
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             className="todo-card"
//                             onMouseEnter={() => setActiveCard(todo)}
//                             onMouseLeave={() => setActiveCard(null)}
//                           >
//                             <input
//                               type="checkbox"
//                               checked={selectedTodos.includes(todo._id)}
//                               onChange={() => toggleSelect(todo._id)}
//                             />
//                             <div className="todo-content">
//                               <h3>{todo.title}</h3>
//                               <p>{todo.description || "No description"}</p>
//                               <PomodoroTimer
//                                 todoId={todo._id}
//                                 workspace={workspaceId ?? ""}
//                                 refreshTodos={() =>
//                                   dispatch(fetchTodosThunk(workspaceId!))
//                                 }
//                                 status={todo.status}
//                               />
//                             </div>
//                             <div className="todo-actions">
//                               <button
//                                 onClick={() => handleEditClick(todo)}
//                                 className="btn edit-btn"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   dispatch(
//                                     deleteTodoThunk({
//                                       todoId: todo._id,
//                                       workspaceId: workspaceId!,
//                                     })
//                                   )
//                                 }
//                                 className="btn delete-btn"
//                               >
//                                 Delete
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   dispatch(toggleImportantThunk(todo._id))
//                                 }
//                                 className="btn share-btn"
//                               >
//                                 {todo.important
//                                   ? "Unmark"
//                                   : "Mark Important"}
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   dispatch(toggleArchivedThunk(todo._id))
//                                 }
//                                 className="btn archive-btn"
//                               >
//                                 {todo.archived ? "Unarchive" : "Archive"}
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </Draggable>
//                     )
//                   )}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           ))}
//         </div>
//       </DragDropContext>

//       {/* Edit Modal */}
//       {editingTodo && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3>Edit Todo</h3>
//             <input
//               value={editForm.title}
//               onChange={(e) =>
//                 setEditForm({ ...editForm, title: e.target.value })
//               }
//             />
//             <textarea
//               value={editForm.description}
//               onChange={(e) =>
//                 setEditForm({ ...editForm, description: e.target.value })
//               }
//             />
//             <select
//               value={editForm.status}
//               onChange={(e) =>
//                 setEditForm({ ...editForm, status: e.target.value })
//               }
//             >
//               <option value="Pending">Pending</option>
//               <option value="InProgress">In Progress</option>
//               <option value="Completed">Completed</option>
//             </select>
//             <select
//               value={editForm.priority}
//               onChange={(e) =>
//                 setEditForm({ ...editForm, priority: e.target.value })
//               }
//             >
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="Hard">Hard</option>
//             </select>
//             <div className="modal-actions">
//               <button onClick={handleUpdate}>Save</button>
//               <button onClick={() => setEditingTodo(null)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
