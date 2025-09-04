import React, { useEffect, useState } from 'react';
import { getTodos, deleteTodo, archieved } from '../services/Apl';
import './Archieve.css';
import { useParams } from 'react-router-dom';
 
// Define the interface for your Todo item
interface ITodo {
    _id: string;
    title: string;
    archieved: boolean;
}

const Archieve: React.FC = () => {
    let workspaceId=useParams().workspaceId;
    const [archivedTodos, setArchivedTodos] = useState<ITodo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch the archived tasks from the API
    const fetchArchivedTodos = async () => {
        setLoading(true);
        setError(null);
        try {
 // Step 1: Call the API to get ALL todos
 const res = await getTodos(workspaceId); 
            const allTodos = res.data;
            console.log("alltodoss",allTodos);

            // Step 2: Filter the data on the frontend
            const filteredTodos = allTodos.filter((todo: ITodo) => todo.archieved===true);
                console.log("filtertodos",filteredTodos);
            setArchivedTodos(filteredTodos);
        } catch (err) {
            console.error("Error fetching archived todos:", err);
            setError("Failed to load archived tasks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArchivedTodos();
    }, []);

console.log("archieved data",archivedTodos);

    const handleDeleteTodo = async (id: string) => {
        if (!window.confirm("Are you sure you want to permanently delete this task?")) {
            return;
        }
        try {
    if(workspaceId){

                    await deleteTodo(id,workspaceId);
                    fetchArchivedTodos();
    }
        } catch (err) {
            console.error("Error deleting todo:", err);
            setError("Failed to delete task.");
        }
    };

    const handleUnarchiveTodo = async (id: string,archiedvalue:boolean) => {
        try {
            await archieved(id,!archiedvalue);
            fetchArchivedTodos();
        } catch (err) {
            console.error("Error unarchiving todo:", err);
            setError("Failed to unarchive task.");
        }
    };

 if (loading) {
 return <div className="archieve-container">Loading archived tasks...</div>;
 }

 if (error) {
 return <div className="archieve-container error-message">Error: {error}</div>;
}

 if (archivedTodos.length === 0) {
 return <div className="archieve-container no-items">No archived tasks to show.</div>;
 }

 return (
 <div className="archieve-container">
 <h1 className="archieve-title">Archived Tasks</h1>
 <div className="archived-list">
{archivedTodos.map((todo) => (
 <div key={todo._id} className="archived-item">
 <span className="archived-title">{todo.title}</span>
 <div className="archived-actions">
 <button 
 onClick={() => handleUnarchiveTodo(todo._id,todo.archieved)}
 className="btn-unarchive"
 >
 Unarchive
 </button>
 <button 
 onClick={() => handleDeleteTodo(todo._id)} 
className="btn-delete"
 >
 Delete
 </button>
</div>
</div>
))}
 </div>
 </div>
 );
};

export default Archieve;















//archieve thunk

// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../store/hook";
// import {
//   getTodosThunk,
//   deleteTodoThunk,
//   archiveTodoThunk,
// } from "../store/appslice"; // ✅ Import thunks
// import "./Archieve.css";

// const Archieve: React.FC = () => {
//   const { workspaceId } = useParams<{ workspaceId: string }>();
//   const dispatch = useAppDispatch();

//   // ✅ Get todos, loading, error from Redux state
//   const { todos, loading, error } = useAppSelector((state) => state.app);

//   // ✅ Filter archived todos
//   const archivedTodos = todos.filter((todo) => todo.archieved);

//   // ✅ Fetch todos on mount
//   useEffect(() => {
//     if (workspaceId) {
//       dispatch(getTodosThunk(workspaceId));
//     }
//   }, [dispatch, workspaceId]);

//   // ✅ Delete Todo
//   const handleDeleteTodo = (id: string) => {
//     if (
//       window.confirm("Are you sure you want to permanently delete this task?")
//     ) {
//       dispatch(deleteTodoThunk({ id, workspaceId: workspaceId || "" }));
//     }
//   };

//   // ✅ Unarchive Todo
//   const handleUnarchiveTodo = (id: string, archivedValue: boolean) => {
//     dispatch(archiveTodoThunk({ id, archieved: !archivedValue }));
//   };

//   // ✅ Render states
//   if (loading) {
//     return <div className="archieve-container">Loading archived tasks...</div>;
//   }

//   if (error) {
//     return (
//       <div className="archieve-container error-message">Error: {error}</div>
//     );
//   }

//   if (archivedTodos.length === 0) {
//     return (
//       <div className="archieve-container no-items">
//         No archived tasks to show.
//       </div>
//     );
//   }

//   // ✅ Render archived list
//   return (
//     <div className="archieve-container">
//       <h1 className="archieve-title">Archived Tasks</h1>
//       <div className="archived-list">
//         {archivedTodos.map((todo) => (
//           <div key={todo._id} className="archived-item">
//             <span className="archived-title">{todo.title}</span>
//             <div className="archived-actions">
//               <button
//                 onClick={() => handleUnarchiveTodo(todo._id, todo.archieved)}
//                 className="btn-unarchive"
//               >
//                 Unarchive
//               </button>
//               <button
//                 onClick={() => handleDeleteTodo(todo._id)}
//                 className="btn-delete"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Archieve;
