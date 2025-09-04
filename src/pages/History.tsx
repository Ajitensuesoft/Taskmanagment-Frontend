"use client";
import React, { useEffect, useState } from "react";
import { HistoryDetails, DeleteHistory } from "../services/Apl";
import "./Home.css"
import { useParams } from "react-router-dom";
export interface HistoryDetail {
  _id: string;
  taskname: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "SHARE";
  details: Record<string, any>;
  createdAt: string;
}

export const History: React.FC = () => {
  const [historyData, setHistoryData] = useState<HistoryDetail[]>([]);
  const [loading, setLoading] = useState(true);

  let workspaceId=useParams().workspaceId;
  console.log("history of workspaceId",workspaceId);
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await HistoryDetails(workspaceId);
      setHistoryData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this history?")) return;
    try {
      await DeleteHistory(id);
      setHistoryData((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error("Failed to delete history:", err);
    }
  };

  const renderDetails = (h: HistoryDetail) => {
    switch (h.action) {
      case "UPDATE":
        return (
          <div>
          <>
           {Object.keys(h.details.after).map((key) => {
  const oldVal = h.details.old[key];
  const newVal = h.details.after[key];

  const displayOld = typeof oldVal === 'object' ? JSON.stringify(oldVal) : oldVal;
  const displayNew = typeof newVal === 'object' ? JSON.stringify(newVal) : newVal;

  return oldVal !== newVal ? (
    <div key={key}>
      {key}: {displayOld} → {displayNew}
    </div>
  ) : null;
})}

          </>
          </div>
        );
      case "CREATE":
        return (
          <div>
            <strong>Title:</strong> {h.details.after.title} <br />
            <strong>Description:</strong> {h.details.after.description} <br />
            <strong>Status:</strong> {h.details.after.status} <br />
            <strong>Priority:</strong> {h.details.after.priority}
          </div>
        );
      case "DELETE":
        return (
          <div>
            <strong>Title:</strong> {h.details.before.title} <br />
            <strong>Description:</strong> {h.details.before.description} <br />
            <strong>Status:</strong> {h.details.before.status} <br />
            <strong>Priority:</strong> {h.details.before.priority}
          </div>
        );
      case "SHARE":
        return (
          <div>
            <strong>SharedTo:</strong> {h.details.sharedwith} <br />
            {/* <strong>To:</strong> {h.details.notification.to} */}
          </div>
        );
      default:
        return "-";
    }
  };

  if (loading) return <div>Loading history...</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>History</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Task</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Action</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Details</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Time</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {historyData.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
                No history found
              </td>
            </tr>
          ) : (
            historyData.map((h) => (
              <tr key={h._id}>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{h.taskname}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{h.action}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {renderDetails(h)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  {new Date(h.createdAt).toLocaleString()}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  <button
                    onClick={() => handleDelete(h._id)}
                    style={{
                      padding: "0.25rem 0.5rem",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};











// //thunk

// "use client";
// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../store/hook";
// import {
//   historyDetailsThunk,
//   deleteHistoryThunk,
// } from "../store/appslice"; // <-- thunk imports
// import "./Home.css";

// export const History: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { workspaceId } = useParams();

//   // ✅ Pull from Redux state
//   const { historyData, loading, error } = useAppSelector(state => ({
//   historyData: state.app.history,
//   loading: state.app.loading,
//   error: state.app.error
// }));

//   // ✅ Fetch history on mount
//   useEffect(() => {
//     if (workspaceId) {
//       dispatch(historyDetailsThunk(workspaceId));
//     }
//   }, [dispatch, workspaceId]);

//   const handleDelete = (id: string) => {
//     if (confirm("Are you sure you want to delete this history?")) {
//       dispatch(deleteHistoryThunk(id));
//     }
//   };

//   const renderDetails = (h: any) => {
//     switch (h.action) {
//       case "UPDATE":
//         return (
//           <>
//             {Object.keys(h.details.after).map((key) =>
//               h.details.old[key] !== h.details.after[key] ? (
//                 <div key={key}>
//                   {key}: {h.details.old[key]} → {h.details.after[key]}
//                 </div>
//               ) : null
//             )}
//           </>
//         );
//       case "CREATE":
//         return (
//           <div>
//             <strong>Title:</strong> {h.details.after.title} <br />
//             <strong>Description:</strong> {h.details.after.description} <br />
//             <strong>Status:</strong> {h.details.after.status} <br />
//             <strong>Priority:</strong> {h.details.after.priority}
//           </div>
//         );
//       case "DELETE":
//         return (
//           <div>
//             <strong>Title:</strong> {h.details.before.title} <br />
//             <strong>Description:</strong> {h.details.before.description} <br />
//             <strong>Status:</strong> {h.details.before.status} <br />
//             <strong>Priority:</strong> {h.details.before.priority}
//           </div>
//         );
//       case "SHARE":
//         return (
//           <div>
//             <strong>SharedTo:</strong> {h.details.sharedwith}
//           </div>
//         );
//       default:
//         return "-";
//     }
//   };

//   if (loading) return <div>Loading history...</div>;
//   if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

//   return (
//     <div style={{ padding: "1rem" }}>
//       <h1>History</h1>
//       <table style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr>
//             <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Task</th>
//             <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Action</th>
//             <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Details</th>
//             <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Time</th>
//             <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Delete</th>
//           </tr>
//         </thead>
//         <tbody>
//           {historyData.length === 0 ? (
//             <tr>
//               <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
//                 No history found
//               </td>
//             </tr>
//           ) : (
//             historyData.map((h:any) => (
//               <tr key={h._id}>
//                 <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{h.taskname}</td>
//                 <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{h.action}</td>
//                 <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
//                   {renderDetails(h)}
//                 </td>
//                 <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
//                   {new Date(h.createdAt).toLocaleString()}
//                 </td>
//                 <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
//                   <button
//                     onClick={() => handleDelete(h._id)}
//                     style={{
//                       padding: "0.25rem 0.5rem",
//                       backgroundColor: "red",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };
