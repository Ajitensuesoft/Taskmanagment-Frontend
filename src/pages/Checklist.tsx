import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    getTodoById, 
    getChecklistItems,
    createChecklistItem,
    updateChecklistItem,
    deleteChecklistItem
} from '../services/Apl'; 
import './Checklist.css';

// --- Type Definitions ---
interface ITodoParent {
    _id: string;
    title: string;
}

interface IChecklistItem {
    _id: string;
    todo: string;
    title: string;
    status: string;
}

interface IFormInput {
    title: string;
}

// --- Component Start ---
const Checklist: React.FC = () => {
    const { id: todoId } = useParams<{ id: string }>();

    // State for data fetching and display
    const [parentTodo, setParentTodo] = useState<ITodoParent | null>(null);
    const [checklistItems, setChecklistItems] = useState<IChecklistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for managing UI interactions
    const [showNewItemInput, setShowNewItemInput] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    // --- react-hook-form setups ---
    const { register: registerNew, handleSubmit: handleSubmitNew, reset: resetNewItemForm } = useForm<IFormInput>();
    const { register: registerEdit, handleSubmit: handleSubmitEdit,  setValue: setEditValue } = useForm<IFormInput>();

    // --- Fetching Data ---
    const fetchChecklistData = async () => {
        if (!todoId) {
            setError("No Todo ID provided.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const todoRes = await getTodoById(todoId);
            setParentTodo(todoRes.data);

            const checklistRes = await getChecklistItems(todoId);
            setChecklistItems(checklistRes.data); 
        } catch (err) {
            console.error("Error fetching checklist data:", err);
            setError("Failed to load checklist items.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChecklistData();
    }, [todoId]);

    // --- CRUD Operations ---
    const onCreateSubmit = async (data:any) => {
        if (!todoId) {
            alert('Parent Todo ID is missing.');
            return;
        }
        try {
            await createChecklistItem(todoId, data.title);
            resetNewItemForm();
            setShowNewItemInput(false);
            fetchChecklistData();
        } catch (err) {
            console.error('Error creating checklist item:', err);
            setError('Failed to create item.');
        }
    };

    const onUpdateSubmit = async (data:any) => {
        if (!editingItemId) return;
        try {
            await updateChecklistItem(editingItemId, { title: data.title });
            setEditingItemId(null);
            fetchChecklistData();
        } catch (err) {
            console.error('Error updating checklist item:', err);
            setError('Failed to update item.');
        }
    };
    
    const handleToggleItemStatus = async (item: IChecklistItem) => {
        const newStatus = item.status === "Completed" ? "Pending" : "Completed";
        try {
            await updateChecklistItem(item._id, { status: newStatus });
            fetchChecklistData();
        } catch (err) {
            console.error('Error toggling status:', err);
            setError('Failed to update item status.');
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!window.confirm('Are you sure you want to delete this checklist item?')) {
            return;
        }
        try {
            await deleteChecklistItem(itemId);
            fetchChecklistData();
        } catch (err) {
            console.error('Error deleting checklist item:', err);
            setError('Failed to delete item.');
        }
    };
    
    // --- Render Logic ---
    if (loading) {
        return <div className="checklist-container">Loading checklist...</div>;
    }

    if (error) {
        return <div className="checklist-container error-message">Error: {error}</div>;
    }

    if (!parentTodo) {
        return <div className="checklist-container">Todo not found or unauthorized access.</div>;
    }

    return (
        <div className="checklist-container">
            <h1 className="checklist-title">Checklist for: "{parentTodo.title}"</h1>

            {/* Section for creating new checklist items */}
            <div className="new-item-section">
                {!showNewItemInput ? (
                    <button onClick={() => setShowNewItemInput(true)} className="btn create-btn">
                        Add New Checklist Item
                    </button>
                ) : (
                    <form onSubmit={handleSubmitNew(onCreateSubmit)} className="new-item-input-group">
                        <input
                            {...registerNew("title", { required: true })}
                            placeholder="New item title"
                            className="text-input"
                        />
                        <button type="submit" className="btn save-btn">Save</button>
                        <button type="button" onClick={() => setShowNewItemInput(false)} className="btn cancel-btn">Cancel</button>
                    </form>
                )}
            </div>

            {/* Display existing checklist items */}
            <div className="checklist-items-list">
                {/* Updated line with the defensive check */}
                {(checklistItems ?? []).length === 0 ? (
                    <p className="no-items">No checklist items yet. Add one!</p>
                ) : (
                    (checklistItems ?? []).map(item => (
                        <div key={item._id} className="checklist-item">
                            {editingItemId === item._id ? (
                                // Edit mode
                                <form onSubmit={handleSubmitEdit(onUpdateSubmit)} className="edit-item-input-group">
                                    <input
                                        {...registerEdit("title", { required: true })}
                                        className="text-input"
                                    />
                                    <button type="submit" className="btn save-btn">Save</button>
                                    <button type="button" onClick={() => setEditingItemId(null)} className="btn cancel-btn">Cancel</button>
                                </form>
                            ) : (
                                // Display mode
                                <div className="item-display">
                                    <input
                                        type="checkbox"
                                        checked={item.status === "Completed"}
                                        onChange={() => handleToggleItemStatus(item)}
                                    />
                                    <span className={`item-title ${item.status === "Completed" ? 'completed' : ''}`}>
                                        {item.title}
                                    </span>
                                    <div className="item-actions">
                                        <button 
                                            onClick={() => {
                                                setEditingItemId(item._id);
                                                setEditValue("title", item.title);
                                            }} 
                                            className="btn edit-btn"
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteItem(item._id)} className="btn delete-btn">Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Checklist;











//thunk used here
//here some error related to title fix it

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { useAppDispatch, useAppSelector } from "../store/hook";
// import {
//  getChecklistItemsThunk,
//   createChecklistItemThunk,
//   updateChecklistItemThunk,
//   deleteChecklistItemThunk,
// } from "../store/appslice";
// import "./Checklist.css";

// // --- Type Definitions ---
// interface IFormInput {
//   title: string;
// }

// const Checklist: React.FC = () => {
//   const { id: todoId } = useParams<{ id: string }>();
//   const dispatch = useAppDispatch();

//   // ✅ State from Redux
//   const { parentTodo, checklistItems, loading, error } = useAppSelector(
//     (state) => state.app.checklistByTodoId
//   );

//   // --- UI State ---
//   const [showNewItemInput, setShowNewItemInput] = useState(false);
//   const [editingItemId, setEditingItemId] = useState<string | null>(null);

//   // --- react-hook-form setups ---
//   const {
//     register: registerNew,
//     handleSubmit: handleSubmitNew,
//     reset: resetNewItemForm,
//   } = useForm<IFormInput>();
//   const {
//     register: registerEdit,
//     handleSubmit: handleSubmitEdit,
//     reset: resetEditItemForm,
//     setValue: setEditValue,
//   } = useForm<IFormInput>();

//   // --- Fetch data ---
//   useEffect(() => {
//     if (todoId) {
//       dispatch(getChecklistItemsThunk(todoId));
//     }
//   }, [dispatch, todoId]);

//   // --- CRUD ---
//   const onCreateSubmit = (data: IFormInput) => {
//     if (!todoId) return;
//     dispatch(createChecklistItemThunk({ todoId, title: data.title }))
//       .unwrap()
//       .then(() => {
//         resetNewItemForm();
//         setShowNewItemInput(false);
//       });
//   };

//   const onUpdateSubmit = (data: IFormInput) => {
//     if (!editingItemId) return;
//     dispatch(updateChecklistItemThunk({ checklistItemId: editingItemId, data }))
//       .unwrap()
//       .then(() => {
//         setEditingItemId(null);
//         resetEditItemForm();
//       });
//   };

//   const handleToggleItemStatus = (itemId: string, currentStatus: string) => {
//     const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";
//     dispatch(updateChecklistItemThunk({ checklistItemId: itemId, data: { status: newStatus } }));
//   };

//   const handleDeleteItem = (id: string) => {
//     if (window.confirm("Are you sure you want to delete this checklist item?")) {
//       dispatch(deleteChecklistItemThunk({checklistItemId:id}));
//     }
//   };

//   // --- Render states ---
//   if (loading) return <div className="checklist-container">Loading checklist...</div>;
//   if (error) return <div className="checklist-container error-message">Error: {error}</div>;
//   if (!parentTodo) return <div className="checklist-container">Todo not found.</div>;

//   return (
//     <div className="checklist-container">
//       <h1 className="checklist-title">Checklist for: "{parentTodo.title}"</h1>

//       {/* New item section */}
//       <div className="new-item-section">
//         {!showNewItemInput ? (
//           <button onClick={() => setShowNewItemInput(true)} className="btn create-btn">
//             Add New Checklist Item
//           </button>
//         ) : (
//           <form onSubmit={handleSubmitNew(onCreateSubmit)} className="new-item-input-group">
//             <input
//               {...registerNew("title", { required: true })}
//               placeholder="New item title"
//               className="text-input"
//             />
//             <button type="submit" className="btn save-btn">Save</button>
//             <button
//               type="button"
//               onClick={() => setShowNewItemInput(false)}
//               className="btn cancel-btn"
//             >
//               Cancel
//             </button>
//           </form>
//         )}
//       </div>

//       {/* Checklist Items */}
//       <div className="checklist-items-list">
//         {(checklistItems ?? []).length === 0 ? (
//           <p className="no-items">No checklist items yet. Add one!</p>
//         ) : (
//           (checklistItems ?? []).map((item) => (
//             <div key={item._id} className="checklist-item">
//               {editingItemId === item._id ? (
//                 <form
//                   onSubmit={handleSubmitEdit(onUpdateSubmit)}
//                   className="edit-item-input-group"
//                 >
//                   <input {...registerEdit("title", { required: true })} className="text-input" />
//                   <button type="submit" className="btn save-btn">Save</button>
//                   <button
//                     type="button"
//                     onClick={() => setEditingItemId(null)}
//                     className="btn cancel-btn"
//                   >
//                     Cancel
//                   </button>
//                 </form>
//               ) : (
//                 <div className="item-display">
//                   <input
//                     type="checkbox"
//                     checked={item.status === "Completed"}
//                     onChange={() => handleToggleItemStatus(item._id, item.status)}
//                   />
//                   <span className={`item-title ${item.status === "Completed" ? "completed" : ""}`}>
//                     {item.title}
//                   </span>
//                   <div className="item-actions">
//                     <button
//                       onClick={() => {
//                         setEditingItemId(item._id);
//                         setEditValue("title", item.title);
//                       }}
//                       className="btn edit-btn"
//                     >
//                       Edit
//                     </button>
//                     <button onClick={() => handleDeleteItem(item._id)} className="btn delete-btn">
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Checklist;
