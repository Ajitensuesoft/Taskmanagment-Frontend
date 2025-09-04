import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
    createComment,
    updateComment,
    deleteComment,
    showallcomment
} from '../services/Apl';
import {
    workdata,
    workdataupdate, // <-- Correct import for updating tasks
    workdelete,
    getworkChecklistdata,
    workChecklistDelete,
    workChecklistUpdate
} from '../services/Apl';
import './Work.css';

interface ITodo {
    _id: string;
    title: string;
    description: string;
    status: string;
    userId: string;
    priority: string;
    archieved: boolean;
}

interface IChecklist {
    _id: string;
    title: string;
    status: 'Pending' | 'Completed' | 'Low';
    todo: string;
}

interface IComment {
    _id: string;
    content: string;
    userId: string;
    todoId: string;
    createdAt: string;
}

type IEditChecklistFields = Pick<IChecklist, 'title' | 'status'>;

const Work: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    let finaldata: any = location.state;

    const [todo, setTodo] = useState<ITodo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editFields, setEditFields] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending'
    });

    const [showChecklistModal, setShowChecklistModal] = useState<boolean>(false);
    const [checklistData, setChecklistData] = useState<IChecklist[]>([]);
    const [checklistLoading, setChecklistLoading] = useState<boolean>(false);
    const [checklistError, setChecklistError] = useState<string | null>(null);
    const [editingChecklistId, setEditingChecklistId] = useState<string | null>(null);

    const [editChecklistFields, setEditChecklistFields] = useState<IEditChecklistFields>({
        title: '',
        status: 'Pending'
    });

    const [comments, setComments] = useState<IComment[]>([]);
    const [newCommentText, setNewCommentText] = useState<string>('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingCommentText, setEditingCommentText] = useState<string>('');
    const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
    const [commentsError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id || !finaldata?.userId) {
                setError("No task ID or user data provided.");
                setLoading(false);
                return;
            }
            const userId = finaldata.userId;

            try {
                // Fetch Todo data
                const res = await workdata(id, userId);
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    const taskData = res.data[0];
                    setTodo(taskData);
                    setEditFields({
                        title: taskData.title,
                        description: taskData.description,
                        priority: taskData.priority,
                        status: taskData.status,
                    });
                } else {
                    setError("Task not found.");
                }

                // Fetch Comments data
                setCommentsLoading(true);
                const commentsRes = await showallcomment(id);
                if (commentsRes?.data) {
                    setComments(commentsRes.data);
                } else {
                    setComments([]);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load task or comments. Please try again.");
            } finally {
                setLoading(false);
                setCommentsLoading(false);
            }
        };
        fetchData();
    }, [id, finaldata]);

    // --- Corrected Task Update Handler ---
    const handleUpdateTask = async () => {
        if (!todo || !finaldata?.userId) {
            setError("Cannot update task. User data is missing.");
            return;
        }

        try {
            // Use the correct API function: workdataupdate
            await workdataupdate(todo._id, { ...editFields, userId: finaldata.userId });
            setTodo(prevTodo => prevTodo ? { ...prevTodo, ...editFields } : null);
            setIsEditing(false);
            alert("Task updated successfully!");
        } catch (err) {
            console.error("Error updating todo:", err);
            setError("Failed to update task.");
        }
    };

    const handleDeleteTodo = async () => {
        if (!todo || !finaldata?.userId) {
            setError("Cannot delete task. User data is missing.");
            return;
        }
        if (window.confirm("Are you sure you want to permanently delete this task?")) {
            try {
                await workdelete(todo._id, finaldata.userId);
                alert("Task deleted successfully!");
                navigate('/dashboard');
            } catch (err) {
                console.error("Error deleting todo:", err);
                setError("Failed to delete task.");
            }
        }
    };

    // --- Comments CRUD Handlers ---

    const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // <-- Prevents page refresh on form submit
        if (!newCommentText.trim() || !id || !finaldata?.userId) {
            return;
        }
        
        const todoId = id;
        const data = { content: newCommentText };

        try {
            const res = await createComment(todoId, data);
            if (res.data) {
                setComments(prevComments => [...prevComments, res.data]);
                setNewCommentText('');
            }
        } catch (err) {
            console.error("Error creating comment:", err);
            alert("Failed to add comment.");
        }
    };

    const handleEditComment = (comment: IComment) => {
        setEditingCommentId(comment._id);
        setEditingCommentText(comment.content);
    };

    // --- Corrected Comment Update Handler ---
    const handleUpdateComment = async () => {
        if (!editingCommentId || !editingCommentText.trim()) {
            return;
        }
        try {
            const updatedComments = { content: editingCommentText };
            await updateComment(updatedComments, editingCommentId);
            setComments(prevComments =>
                prevComments.map(comment =>
                    // Fix: Use 'content' to update the comment text
                    comment._id === editingCommentId ? { ...comment, content: editingCommentText } : comment
                )
            );
            setEditingCommentId(null);
            setEditingCommentText('');
        } catch (err) {
            console.error("Error updating comment:", err);
            alert("Failed to update comment.");
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await deleteComment(commentId);
                setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
            } catch (err) {
                console.error("Error deleting comment:", err);
                alert("Failed to delete comment.");
            }
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFields(prevFields => ({ ...prevFields, [name]: value }));
    };

    const handleOpenChecklistModal = async () => {
        if (!id || !finaldata?.userId) {
            setChecklistError("Cannot load checklist. Task or user data is missing.");
            return;
        }

        setShowChecklistModal(true);
        setChecklistLoading(true);
        setChecklistError(null);

        try {
            const res = await getworkChecklistdata(id, finaldata.userId);
            if (res?.data) {
                setChecklistData(res.data);
            } else {
                setChecklistData([]);
                setChecklistError("No checklist items found for this task.");
            }
        } catch (err) {
            console.error("Error fetching checklist data:", err);
            setChecklistError("Failed to fetch checklist data.");
        } finally {
            setChecklistLoading(false);
        }
    };

    const handleCloseChecklistModal = () => {
        setShowChecklistModal(false);
        setEditingChecklistId(null);
        setChecklistData([]);
    };

    const handleEditChecklist = (item: IChecklist) => {
        setEditingChecklistId(item._id);
        setEditChecklistFields({
            title: item.title,
            status: item.status
        });
    };

    const handleChecklistChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditChecklistFields(prev => ({
            ...prev,
            [name]: value as 'Pending' | 'Completed' | 'Low'
        }));
    };

    const handleUpdateChecklist = async () => {
        if (!editingChecklistId) return;

        try {
            await workChecklistUpdate(editingChecklistId, editChecklistFields);
            const updatedData = checklistData.map(item =>
                item._id === editingChecklistId
                    ? { ...item, ...editChecklistFields }
                    : item
            );
            setChecklistData(updatedData);
            setEditingChecklistId(null);
            alert("Checklist item updated successfully!");
        } catch (err) {
            console.error("Error updating checklist item:", err);
            alert("Failed to update checklist item.");
        }
    };

    const handleDeleteChecklist = async (checklistItemId: string) => {
        if (window.confirm("Are you sure you want to delete this checklist item?")) {
            try {
                await workChecklistDelete(checklistItemId);
                const updatedData = checklistData.filter(item => item._id !== checklistItemId);
                setChecklistData(updatedData);
                alert("Checklist item deleted successfully!");
            } catch (err) {
                console.error("Error deleting checklist item:", err);
                alert("Failed to delete checklist item.");
            }
        }
    };


    if (loading) {
        return <div className="work-container">Loading task details...</div>;
    }
    if (error) {
        return <div className="work-container error-message">Error: {error}</div>;
    }
    if (!todo) {
        return <div className="work-container no-items">Task not found.</div>;
    }

    return (
        <div className="work-container">
            <h1 className="work-title">Task Details</h1>
            <div className="task-details-card">
                {isEditing ? (
                    <div className="edit-form">
                        <input
                            type="text"
                            name="title"
                            value={editFields.title}
                            onChange={handleEditChange}
                            className="edit-input"
                        />
                        <input
                            type="text"
                            name="description"
                            value={editFields.description}
                            onChange={handleEditChange}
                            className="edit-input"
                        />
                        <select
                            name="priority"
                            value={editFields.priority}
                            onChange={handleEditChange}
                            className="edit-input"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <select
                            name="status"
                            value={editFields.status}
                            onChange={handleEditChange}
                            className="edit-input"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <button onClick={handleUpdateTask} className="btn-save">Save</button>
                        <button onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
                    </div>
                ) : (
                    <>
                        <h2 className="task-title-display">{todo.title}</h2>
                        <p className="task-description-display">Description: {todo.description}</p>
                        <p className="task-priority-display">Priority: {todo.priority}</p>
                        <p className="task-status-display">Status: {todo.status}</p>
                    </>
                )}

                <div className="task-actions">
                    {!isEditing && (
                        <>
                            <button onClick={() => setIsEditing(true)} className="btn-edit">
                                Edit Task
                            </button>
                            <button onClick={handleOpenChecklistModal} className="btn-checklist">
                                View Checklists
                            </button>
                        </>
                    )}
                    <button onClick={handleDeleteTodo} className="btn-delete">
                        Delete
                    </button>
                </div>
            </div>

            <hr className="divider" />
            <div className="comments-section">
                <h2 className="comments-title">Comments</h2>
                <form onSubmit={handleAddComment} className="comment-form">
                    <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Write a new comment..."
                        className="comment-textarea"
                    ></textarea>
                    <button type="submit" className="btn-add-comment">Add Comment</button>
                </form>

                <div className="comments-list-container">
                    {commentsLoading ? (
                        <p>Loading comments...</p>
                    ) : commentsError ? (
                        <p className="error-message">{commentsError}</p>
                    ) : comments.length > 0 ? (
                        <ul className="comments-list">
                            {comments.map(comment => (
                                <li key={comment._id} className="comment-item">
                                    {editingCommentId === comment._id ? (
                                        <div className="comment-edit-form">
                                            <textarea
                                                value={editingCommentText}
                                                onChange={(e) => setEditingCommentText(e.target.value)}
                                                className="edit-comment-textarea"
                                            />
                                            <div className="comment-actions">
                                                <button onClick={handleUpdateComment} className="btn-save-comment">Save</button>
                                                <button onClick={() => setEditingCommentId(null)} className="btn-cancel-comment">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="comment-text">{comment.content}</p>
                                            <div className="comment-actions">
                                                <button onClick={() => handleEditComment(comment)} className="btn-edit-comment">Edit</button>
                                                <button onClick={() => handleDeleteComment(comment._id)} className="btn-delete-comment">Delete</button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-items">No comments yet. Be the first to add one!</p>
                    )}
                </div>
            </div>

            {showChecklistModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Checklist for: {todo.title}</h3>
                            <button onClick={handleCloseChecklistModal} className="modal-close-btn">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            {checklistLoading ? (
                                <p>Loading checklist data...</p>
                            ) : checklistError ? (
                                <p className="error-message">{checklistError}</p>
                            ) : (
                                <ul className="checklist-list">
                                    {checklistData.length > 0 ? (
                                        checklistData.map(item => (
                                            <li key={item._id} className="checklist-item">
                                                {editingChecklistId === item._id ? (
                                                    <div className="checklist-edit-form">
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            value={editChecklistFields.title}
                                                            onChange={handleChecklistChange}
                                                            className="edit-input-small"
                                                        />
                                                        <select
                                                            name="status"
                                                            value={editChecklistFields.status}
                                                            onChange={handleChecklistChange}
                                                            className="edit-input-small"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Completed">Completed</option>
                                                            <option value="Low">Low</option>
                                                        </select>
                                                        <div className="checklist-actions">
                                                            <button onClick={handleUpdateChecklist} className="btn-save-small">Save</button>
                                                            <button onClick={() => setEditingChecklistId(null)} className="btn-cancel-small">Cancel</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className={`checklist-title ${item.status === 'Completed' ? 'completed' : ''}`}>
                                                            {item.title}
                                                        </span>
                                                        <span className={`checklist-status ${item.status.toLowerCase().replace(' ', '-')}`}>
                                                            ({item.status})
                                                        </span>
                                                        <div className="checklist-actions">
                                                            <button onClick={() => handleEditChecklist(item)} className="btn-edit-small">Edit</button>
                                                            <button onClick={() => handleDeleteChecklist(item._id)} className="btn-delete-small">Delete</button>
                                                        </div>
                                                    </>
                                                )}
                                            </li>
                                        ))
                                    ) : (
                                        <p>No checklist items found.</p>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Work;










































//thunk


// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchWorkById,
//   updateWork,
//   deleteWork,
//   fetchChecklist,
//   updateChecklist,
//   deleteChecklist,
//   fetchComments,
//   addComment,
//   editComment,
//   removeComment,
// } from "../store/workSlice"; // ✅ thunks from slice
// import { RootState, AppDispatch } from "../store";
// import "./Work.css";

// const Work: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();

//   const finaldata: any = location.state;

//   // --- Redux state ---
//   const {
//     work,
//     loading,
//     error,
//     checklist,
//     checklistLoading,
//     checklistError,
//     comments,
//     commentsLoading,
//     commentsError,
//   } = useSelector((state: RootState) => state.work);

//   // --- Local UI state ---
//   const [isEditing, setIsEditing] = useState(false);
//   const [editFields, setEditFields] = useState({
//     title: "",
//     description: "",
//     priority: "Medium",
//     status: "Pending",
//   });

//   const [showChecklistModal, setShowChecklistModal] = useState(false);
//   const [editingChecklistId, setEditingChecklistId] = useState<string | null>(
//     null
//   );
//   const [editChecklistFields, setEditChecklistFields] = useState({
//     title: "",
//     status: "Pending",
//   });

//   const [newCommentText, setNewCommentText] = useState("");
//   const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
//   const [editingCommentText, setEditingCommentText] = useState("");

//   // --- Fetch Task + Comments ---
//   useEffect(() => {
//     if (id && finaldata?.userId) {
//       dispatch(fetchWorkById({ id, userId: finaldata.userId }));
//       dispatch(fetchComments(id));
//     }
//   }, [id, finaldata, dispatch]);

//   // --- Handlers ---
//   const handleUpdateTask = () => {
//     if (!work || !finaldata?.userId) return;
//     dispatch(updateWork({ id: work._id, data: { ...editFields, userId: finaldata.userId } }));
//     setIsEditing(false);
//   };

//   const handleDeleteTask = () => {
//     if (!work || !finaldata?.userId) return;
//     if (window.confirm("Are you sure to delete this task?")) {
//       dispatch(deleteWork({ id: work._id, userId: finaldata.userId }));
//       navigate("/dashboard");
//     }
//   };

//   const handleAddComment = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newCommentText.trim() || !id) return;
//     dispatch(addComment({ todoId: id, content: newCommentText }));
//     setNewCommentText("");
//   };

//   const handleUpdateComment = () => {
//     if (!editingCommentId || !editingCommentText.trim()) return;
//     dispatch(editComment({ id: editingCommentId, content: editingCommentText }));
//     setEditingCommentId(null);
//     setEditingCommentText("");
//   };

//   const handleDeleteComment = (commentId: string) => {
//     if (window.confirm("Delete this comment?")) {
//       dispatch(removeComment(commentId));
//     }
//   };

//   const handleOpenChecklistModal = () => {
//     if (id && finaldata?.userId) {
//       dispatch(fetchChecklist({ id, userId: finaldata.userId }));
//       setShowChecklistModal(true);
//     }
//   };

//   const handleUpdateChecklist = () => {
//     if (!editingChecklistId) return;
//     dispatch(updateChecklist({ id: editingChecklistId, data: editChecklistFields }));
//     setEditingChecklistId(null);
//   };

//   const handleDeleteChecklist = (id: string) => {
//     if (window.confirm("Delete checklist item?")) {
//       dispatch(deleteChecklist(id));
//     }
//   };

//   // --- UI ---
//   if (loading) return <p>Loading task...</p>;
//   if (error) return <p className="error-message">{error}</p>;
//   if (!work) return <p>No task found.</p>;

//   return (
//     <div className="work-container">
//       <h1>Task Details</h1>
//       <div className="task-details-card">
//         {isEditing ? (
//           <>
//             <input
//               type="text"
//               name="title"
//               value={editFields.title}
//               onChange={(e) =>
//                 setEditFields({ ...editFields, title: e.target.value })
//               }
//             />
//             <textarea
//               name="description"
//               value={editFields.description}
//               onChange={(e) =>
//                 setEditFields({ ...editFields, description: e.target.value })
//               }
//             />
//             <select
//               name="priority"
//               value={editFields.priority}
//               onChange={(e) =>
//                 setEditFields({ ...editFields, priority: e.target.value })
//               }
//             >
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="High">High</option>
//             </select>
//             <select
//               name="status"
//               value={editFields.status}
//               onChange={(e) =>
//                 setEditFields({ ...editFields, status: e.target.value })
//               }
//             >
//               <option value="Pending">Pending</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Completed">Completed</option>
//             </select>
//             <button onClick={handleUpdateTask}>Save</button>
//             <button onClick={() => setIsEditing(false)}>Cancel</button>
//           </>
//         ) : (
//           <>
//             <h2>{work.title}</h2>
//             <p>{work.description}</p>
//             <p>Priority: {work.priority}</p>
//             <p>Status: {work.status}</p>
//           </>
//         )}

//         <div>
//           {!isEditing && (
//             <>
//               <button onClick={() => setIsEditing(true)}>Edit</button>
//               <button onClick={handleOpenChecklistModal}>View Checklists</button>
//             </>
//           )}
//           <button onClick={handleDeleteTask}>Delete</button>
//         </div>
//       </div>

//       <hr />
//       {/* --- Comments Section --- */}
//       <h2>Comments</h2>
//       <form onSubmit={handleAddComment}>
//         <textarea
//           value={newCommentText}
//           onChange={(e) => setNewCommentText(e.target.value)}
//         />
//         <button type="submit">Add Comment</button>
//       </form>
//       {commentsLoading ? (
//         <p>Loading comments...</p>
//       ) : commentsError ? (
//         <p className="error-message">{commentsError}</p>
//       ) : (
//         <ul>
//           {comments.map((c) => (
//             <li key={c._id}>
//               {editingCommentId === c._id ? (
//                 <>
//                   <textarea
//                     value={editingCommentText}
//                     onChange={(e) => setEditingCommentText(e.target.value)}
//                   />
//                   <button onClick={handleUpdateComment}>Save</button>
//                   <button onClick={() => setEditingCommentId(null)}>
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <p>{c.content}</p>
//                   <button onClick={() => {
//                     setEditingCommentId(c._id);
//                     setEditingCommentText(c.content);
//                   }}>Edit</button>
//                   <button onClick={() => handleDeleteComment(c._id)}>Delete</button>
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* --- Checklist Modal --- */}
//       {showChecklistModal && (
//         <div className="modal">
//           {checklistLoading ? (
//             <p>Loading checklist...</p>
//           ) : checklistError ? (
//             <p className="error-message">{checklistError}</p>
//           ) : (
//             <ul>
//               {checklist.map((item) => (
//                 <li key={item._id}>
//                   {editingChecklistId === item._id ? (
//                     <>
//                       <input
//                         type="text"
//                         value={editChecklistFields.title}
//                         onChange={(e) =>
//                           setEditChecklistFields({
//                             ...editChecklistFields,
//                             title: e.target.value,
//                           })
//                         }
//                       />
//                       <select
//                         value={editChecklistFields.status}
//                         onChange={(e) =>
//                           setEditChecklistFields({
//                             ...editChecklistFields,
//                             status: e.target.value,
//                           })
//                         }
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Completed">Completed</option>
//                         <option value="Low">Low</option>
//                       </select>
//                       <button onClick={handleUpdateChecklist}>Save</button>
//                       <button onClick={() => setEditingChecklistId(null)}>
//                         Cancel
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <span>{item.title}</span> ({item.status})
//                       <button onClick={() => {
//                         setEditingChecklistId(item._id);
//                         setEditChecklistFields({
//                           title: item.title,
//                           status: item.status,
//                         });
//                       }}>Edit</button>
//                       <button onClick={() => handleDeleteChecklist(item._id)}>
//                         Delete
//                       </button>
//                     </>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           )}
//           <button onClick={() => setShowChecklistModal(false)}>Close</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Work;
