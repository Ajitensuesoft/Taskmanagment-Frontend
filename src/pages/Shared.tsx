import React, { useEffect, useState } from "react";
import { getShared, deleteShared } from "../services/Apl"; // ✅ using API file functions
import { useParams } from "react-router-dom";
interface SharedItem {
  _id: string;
  from: string;
  to: string;
  title: string;
  taskId: string;
}

const Shared: React.FC = () => {
   let workspaceId=useParams().workspaceId;
  const [sharedData, setSharedData] = useState<SharedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShared = async () => {
    try {
      setLoading(true);
      if(workspaceId){
        const res = await getShared(workspaceId);
        setSharedData(res.data || []);

      }
    } catch (err) {
      console.error("Error fetching shared data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this shared item?")) return;
    try {
      await deleteShared(id); // ✅ calling API from service
      setSharedData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting shared item:", err);
    }
  };

  useEffect(() => {
    fetchShared();
  }, []);

  if (loading) return <p>Loading shared data...</p>;
  if (sharedData.length === 0) return <p>No shared tasks found.</p>;

  return (
    <div>
      <h2>Shared Tasks</h2>
      <table style={{ borderWidth: 1, borderCollapse: "collapse" }} cellPadding="8">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Title</th>
            <th>Task ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sharedData.map((item) => (
            <tr key={item._id}>
              <td>{item.from}</td>
              <td>{item.to}</td>
              <td>{item.title}</td>
              <td>{item.taskId}</td>
              <td>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Shared;






















//thunk


// "use client";
// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../store/hook";
// import {
//  getSharedThunk,
//   deleteSharedThunk,
// } from "../store/appslice"; // ✅ import thunks

// const Shared: React.FC = () => {
//   const { workspaceId } = useParams();
//   const dispatch = useAppDispatch();

//   // const { sharedData, loading, error } = useAppSelector(
//   //   (state) => state.app.sharedItems
//   // );


//   const { sharedData, loading, error } = useAppSelector(
//   (state) => ({
//     sharedData: state.app.sharedItems.sharedData,
//     loading: state.app.sharedItems.loading,
//     error: state.app.sharedItems.error,
//   })
// );


//   useEffect(() => {
//     if (workspaceId) {
//       dispatch(getSharedThunk(workspaceId));
//     }
//   }, [dispatch, workspaceId]);

//   const handleDelete = (id: string) => {
//     if (window.confirm("Are you sure you want to delete this shared item?")) {
//       dispatch(deleteSharedThunk(id));
//     }
//   };

//   if (loading) return <p>Loading shared data...</p>;
//   if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
//   if (!sharedData || sharedData.length === 0)
//     return <p>No shared tasks found.</p>;

//   return (
//     <div>
//       <h2>Shared Tasks</h2>
//       <table
//         style={{ borderWidth: 1, borderCollapse: "collapse", width: "100%" }}
//         cellPadding="8"
//       >
//         <thead>
//           <tr>
//             <th>From</th>
//             <th>To</th>
//             <th>Title</th>
//             <th>Task ID</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sharedData.map((item) => (
//             <tr key={item._id}>
//               <td>{item.from}</td>
//               <td>{item.to}</td>
//               <td>{item.title}</td>
//               <td>{item.taskId}</td>
//               <td>
//                 <button onClick={() => handleDelete(item._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Shared;
