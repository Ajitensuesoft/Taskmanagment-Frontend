import React, { useEffect, useState } from "react";
import { getNotifications, deleteNotification,viewNotification } from "../services/Apl";
import { useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom";
interface NotificationItem {
  _id: string;
  from: string;
  message: string;
  createdAt: string;
  taskId:string
}
interface TaskDetails {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  __v: number;
}
const Notifications: React.FC = () => {
  const workspaceId=useParams().workspaceId;
  const navigate=useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedNotification, setSelectedNotification] = useState<TaskDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      if(workspaceId){

        const res = await getNotifications(workspaceId);
        console.log("response of getnotifications",res);
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };
console.log("notification",notifications);
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleView = async (id: string) => {
    try {
      const res = await viewNotification(id);
      console.log("view res",res);
      setSelectedNotification(res); // assuming API returns the object
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error viewing notification:", err);
    }
  };
console.log("selecctednotification",selectedNotification);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <p>Loading notifications...</p>;
  if (notifications.length === 0) return <p>No notifications found.</p>;

  return (
    <div>
      <h2>Notifications</h2>
      <table style={{ borderWidth: 1, borderCollapse: "collapse", width: "100%" }} cellPadding="8">
        <thead>
          <tr>
            <th>From</th>
            <th>Message</th>
            <th>Received At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((n) => (
            <tr key={n._id}>
              <td>{n.from}</td>
              <td>{n.message}</td>
              <td>{new Date(n.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleView(n.taskId)} style={{ marginRight: "5px" }}>View</button>
                <button onClick={() => handleDelete(n._id)}>Delete</button>
                <button onClick={()=> navigate(`/work/${n.taskId}`, { state: n })}>Work</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && selectedNotification && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Notification Details</h3>
            <p><strong>Title:</strong> {selectedNotification.title}</p>
            <p><strong>Description:</strong> {selectedNotification.description}</p>
            <p><strong>Status:</strong> {selectedNotification.status}</p>
            <p><strong>Priority:</strong> {selectedNotification.priority}</p>
            <p><strong>Received At:</strong> {new Date(selectedNotification.createdAt).toLocaleString()}</p>
            <button onClick={closeModal} style={{ marginTop: "10px" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center"
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0px 2px 10px rgba(0,0,0,0.3)"
  }
};

export default Notifications;




























//thunk


// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../store/hook";
// import {
//   getNotificationsThunk,
//   deleteNotificationThunk,
//   viewNotificationThunk,
// } from "../store/appslice";

// const Notifications: React.FC = () => {
//   const { workspaceId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const { notifications, loading, error } = useAppSelector(state => ({
//     notifications: state.app.notifications,
//     loading: state.app.loading,
//     error: state.app.error,
//   }));

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedNotification, setSelectedNotification] = useState<any | null>(null);

//   useEffect(() => {
//     if (workspaceId) {
//       dispatch(getNotificationsThunk(workspaceId));
//     }
//   }, [dispatch, workspaceId]);

//   const handleDelete = (id: string) => {
//     if (window.confirm("Delete this notification?")) {
//       dispatch(deleteNotificationThunk(id));
//     }
//   };

//   const handleView = (taskId: string) => {
//     const notification = notifications.find(n => n.taskId === taskId);
//     if (notification) {
//       setSelectedNotification(notification);
//       setIsModalOpen(true);
//       dispatch(viewNotificationThunk(notification._id)); // mark as viewed
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedNotification(null);
//   };

//   if (loading) return <p>Loading notifications...</p>;
//   if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
//   if (!notifications || notifications.length === 0) return <p>No notifications found.</p>;

//   return (
//     <div>
//       <h2>Notifications</h2>
//       <table
//         style={{ borderWidth: 1, borderCollapse: "collapse", width: "100%" }}
//         cellPadding="8"
//       >
//         <thead>
//           <tr>
//             <th>From</th>
//             <th>Message</th>
//             <th>Received At</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {notifications.map((n) => (
//             <tr key={n._id}>
//               <td>{n.from}</td>
//               <td>{n.message}</td>
//               <td>{new Date(n.createdAt).toLocaleString()}</td>
//               <td>
//                 <button
//                   onClick={() => handleView(n.taskId)}
//                   style={{ marginRight: "5px" }}
//                 >
//                   View
//                 </button>
//                 <button onClick={() => handleDelete(n._id)}>Delete</button>
//                 <button
//                   onClick={() =>
//                     navigate(`/work/${n.taskId}`, { state: n })
//                   }
//                 >
//                   Work
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal */}
//       {isModalOpen && selectedNotification && (
//         <div style={styles.overlay}>
//           <div style={styles.modal}>
//             <h3>Notification Details</h3>
//             <p><strong>Title:</strong> {selectedNotification.title}</p>
//             <p><strong>Description:</strong> {selectedNotification.description}</p>
//             <p><strong>Status:</strong> {selectedNotification.status}</p>
//             <p><strong>Priority:</strong> {selectedNotification.priority}</p>
//             <p><strong>Received At:</strong> {new Date(selectedNotification.createdAt).toLocaleString()}</p>
//             <button onClick={closeModal} style={{ marginTop: "10px" }}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles: Record<string, React.CSSProperties> = {
//   overlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modal: {
//     backgroundColor: "#fff",
//     padding: "20px",
//     borderRadius: "8px",
//     width: "400px",
//     boxShadow: "0px 2px 10px rgba(0,0,0,0.3)",
//   },
// };

// export default Notifications;
