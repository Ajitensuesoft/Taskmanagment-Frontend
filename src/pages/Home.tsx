// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import PushButton from '../components/PushButton';
// import {allWorkspaceStatus} from '../services/Apl';
// import WorkspaceThemeSwitcher from "../components/WorkspaceThemeSwitcher";
// import "./Home.css";
// import {
//   inviteuser,
//   createWorkspace,
//   getworkspace,
//   deleteWorkspace
// } from '../services/Apl';
// import './Home.css';
// import ThemeSwitcher from '../components/ThemeSwitcher';

// interface Iworkspace {
//   name: string;
// }

// interface IMember {
//   userId: string;
//   role: 'admin' | 'editor' | 'viewer';
// }

// interface IworkspaceItem {
//   _id: string;
//   name: string;
//   userId: string;
//   members: IMember[];
// }

// const Home: React.FC = () => {
//   const navigate = useNavigate();
//   const [workspaces, setWorkspaces] = useState<IworkspaceItem[]>([]);
//   const [showInviteFormId, setShowInviteFormId] = useState<string | null>(null);
//   const [inviteEmail, setInviteEmail] = useState('');
//   const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');

//   const userId = localStorage.getItem('userId'); // ✅ Get current user ID

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset
//   } = useForm<Iworkspace>({
//     defaultValues: {
//       name: ''
//     }
//   });

//   const fetchWorkspaces = async () => {
//     try {
//       const res = await getworkspace();
//       setWorkspaces(res.data);
//     } catch (err) {
//       console.error('Error fetching workspaces:', err);
//     }
//   };

//   const submit = async (data: Iworkspace) => {
//     try {
//       await createWorkspace(data);
//       reset();
//       fetchWorkspaces();
//     } catch (err) {
//       console.error('Error creating workspace:', err);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this workspace?')) return;
//     try {
//       await deleteWorkspace(id);
//       fetchWorkspaces();
//     } catch (err) {
//       console.error('Error deleting workspace:', err);
//     }
//   };

//   const handleInvite = (id: string) => {
//     setInviteEmail('');
//     setInviteRole('viewer');
//     setShowInviteFormId(id);
//   };

//   const sendInvite = async (workspaceId: string, email: string, role: string) => {
//     try {
//       await inviteuser({ workspaceId, email, role });
//       alert(`Invite sent to ${email} as ${role}`);
//       setShowInviteFormId(null);
//     } catch (err) {
//       console.error('Error sending invite:', err);
//       alert('Failed to send invite');
//     }
//   };



//   const analytical=async(id:string)=>{

//     const workspaceId=id;

//     navigate(`/analytical/${workspaceId}`);
//         //  try{
//         //   let workspaceId=id;
//         //   const res=await allWorkspaceStatus(workspaceId);
//         //   console.log("analytical",res);
//         //  }
//         //  catch(err){
//         //   console.log("analytical",err)
//         //  }

//   }

//   const handleViewTasks = (id: string) => navigate(`/dashboard/${id}`);
//   const handleCreateTask = (id: string) => navigate(`/create/${id}`);
//   const historyTask = (id: string) => navigate(`/history/${id}`);
//   const ArchievTask = (id: string) => navigate(`/archiev/${id}`);
//   const sharedTask = (id: string) => navigate(`/shared/${id}`);
//   const NotificationTask = (id: string) => navigate(`/notification/${id}`);

//   useEffect(() => {
//     fetchWorkspaces();
//   }, []);

//   return (
//     <div className="page-container">
//       {/* <PushButton/> */}
//       <div className="form-section">
//         <h2>Create Workspace</h2>
//         <form onSubmit={handleSubmit(submit)} className="workspace-form">
//           <label htmlFor="name">Workspace Name</label>
//           <input
//             type="text"
//             id="name"
//             {...register('name', { required: 'Workspace name is required' })}
//             className={`input-field ${errors.name ? 'input-error' : ''}`}
//             placeholder="Enter workspace name"
//           />
//           {errors.name && <p className="error-text">{errors.name.message}</p>}
//           <button type="submit" className="submit-btn">Create</button>
//         </form>
//       </div>

//       <div className="workspace-section">
//         <h3>Your Workspaces</h3>
//         <div className="workspace-list">
//           {workspaces.length === 0 ? (
//             <p>No workspaces found.</p>
//           ) : (
//             workspaces.map((ws) => {
//               const memberInfo = ws.members?.find((m) => m.userId === userId);
//               const role = memberInfo?.role || (ws.userId === userId ? 'owner' : null);

//               return (
//                 <div key={ws._id} className="workspace-card">
//                   <div className="workspace-header">
//                     <h4>{ws.name}</h4>
//                     <span className="role-badge">Your Role: {role}</span>
                    
//                   </div>
//                    <WorkspaceThemeSwitcher
//     workspaceId={ws._id}
//     onThemeChange={(id, newTheme) => {
//       setWorkspaces((prev) =>
//         prev.map((item) =>
//           item._id === id ? { ...item, theme: newTheme } : item
//         )
//       );
//     }}
//   />

//                   <div className="workspace-actions">
//                     <button className="action-btn view-btn" onClick={() => handleViewTasks(ws._id)}>View Tasks</button>
//                     <button className="action-btn delete-btn" onClick={() => historyTask(ws._id)}>History</button>
//                     <button className="action-btn delete-btn" onClick={() => ArchievTask(ws._id)}>Archiev</button>
//  <button className="action-btn delete-btn" onClick={() => NotificationTask(ws._id)}>Notification</button>
//  <button className="action-btn delete-btn" onClick={() => analytical(ws._id)}>Anylitical</button>
//                     {role && ['editor', 'admin', 'viewer'].includes(role) && (
//                       <button className="action-btn create-btn" onClick={() => handleCreateTask(ws._id)}>Create Task</button>
//                     )}

//                     {typeof role === 'string' && ['admin'].includes(role) && (
//                       <button className="action-btn invite-btn" onClick={() => handleInvite(ws._id)}>Invite</button>
//                     )}

//                     {(role === 'editor' || role === 'admin') && (
//                       <button className="action-btn delete-btn" onClick={() => handleDelete(ws._id)}>Delete</button>
//                     )}
//                   </div>

//                   {showInviteFormId === ws._id && (
//                     <form
//                       onSubmit={(e) => {
//                         e.preventDefault();
//                         sendInvite(ws._id, inviteEmail, inviteRole);
//                       }}
//                       className="invite-inline-form"
//                     >
//                       <label>Workspace ID</label>
//                       <input type="text" value={ws._id} readOnly className="readonly-input" />

//                       <label>Email</label>
//                       <input
//                         type="email"
//                         value={inviteEmail}
//                         onChange={(e) => setInviteEmail(e.target.value)}
//                         placeholder="Enter email to invite"
//                         required
//                       />

//                       <label>Role</label>
//                       <select
//                         value={inviteRole}
//                         onChange={(e) => setInviteRole(e.target.value as 'admin' | 'editor' | 'viewer')}
//                         required
//                       >
//                         <option value="admin">Admin</option>
//                         <option value="editor">Editor</option>
//                         <option value="viewer">Viewer</option>
//                       </select>

//                       <div style={{ marginTop: '0.5rem' }}>
//                         <button type="submit">Send Invite</button>
//                         <button type="button" onClick={() => setShowInviteFormId(null)}>Cancel</button>
//                       </div>
//                     </form>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;








import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import WorkspaceThemeSwitcher from "../components/WorkspaceThemeSwitcher";
import "./Home.css";
import {
  inviteuser,
  createWorkspace,
  getworkspace,
  deleteWorkspace
} from '../services/Apl';

interface Iworkspace {
  name: string;
}

interface IMember {
  userId: string;
  role: 'admin' | 'editor' | 'viewer';
}

interface IworkspaceItem {
  _id: string;
  name: string;
  userId: string;
  members: IMember[];
  theme?: string; // workspace theme
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<IworkspaceItem[]>([]);
  const [showInviteFormId, setShowInviteFormId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');

  const userId = localStorage.getItem('userId');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Iworkspace>({
    defaultValues: { name: '' }
  });

  const fetchWorkspaces = async () => {
    try {
      const res = await getworkspace();
      const updated = res.data.map((ws: IworkspaceItem) => ({
        ...ws,
        theme: localStorage.getItem(`workspace-theme-${ws._id}`) || 'workspace-theme-light'
      }));
      setWorkspaces(updated);
    } catch (err) {
      console.error('Error fetching workspaces:', err);
    }
  };

  const submit = async (data: Iworkspace) => {
    try {
      await createWorkspace(data);
      reset();
      fetchWorkspaces();
    } catch (err) {
      console.error('Error creating workspace:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workspace?')) return;
    try {
      await deleteWorkspace(id);
      fetchWorkspaces();
    } catch (err) {
      console.error('Error deleting workspace:', err);
    }
  };

  const handleInvite = (id: string) => {
    setInviteEmail('');
    setInviteRole('viewer');
    setShowInviteFormId(id);
  };

  const sendInvite = async (workspaceId: string, email: string, role: string) => {
    try {
      await inviteuser({ workspaceId, email, role });
      alert(`Invite sent to ${email} as ${role}`);
      setShowInviteFormId(null);
    } catch (err) {
      console.error('Error sending invite:', err);
      alert('Failed to send invite');
    }
  };

  const analytical = (id: string) => navigate(`/analytical/${id}`);
  const handleViewTasks = (id: string) => navigate(`/dashboard/${id}`);
  const handleCreateTask = (id: string) => navigate(`/create/${id}`);
  const historyTask = (id: string) => navigate(`/history/${id}`);
  const ArchievTask = (id: string) => navigate(`/archiev/${id}`);
  const NotificationTask = (id: string) => navigate(`/notification/${id}`);

  useEffect(() => { fetchWorkspaces(); }, []);

  return (
    <div className="page-container">
      {/* Create Workspace Form */}
      <div className="form-section">
        <h2>Create Workspace</h2>
        <form onSubmit={handleSubmit(submit)} className="workspace-form">
          <label htmlFor="name">Workspace Name</label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Workspace name is required' })}
            className={`input-field ${errors.name ? 'input-error' : ''}`}
            placeholder="Enter workspace name"
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
          <button type="submit" className="submit-btn">Create</button>
        </form>
      </div>

      {/* Workspaces */}
      <div className="workspace-section">
        <h3>Your Workspaces</h3>
        <div className="workspace-list">
          {workspaces.length === 0 ? (
            <p>No workspaces found.</p>
          ) : (
            workspaces.map((ws) => {
              const memberInfo = ws.members?.find((m) => m.userId === userId);
              const role = memberInfo?.role || (ws.userId === userId ? 'owner' : null);

              return (
                <div key={ws._id} className={`workspace-card ${ws.theme || 'workspace-theme-light'}`}>
                  <div className="workspace-header">
                    <h4>{ws.name}</h4>
                    <span className="role-badge">Your Role: {role}</span>
                  </div>

                  {/* Admin-only Theme Switcher */}
                  {role === 'admin' && (
                    <WorkspaceThemeSwitcher
                      workspaceId={ws._id}
                      onThemeChange={(id, newTheme) => {
                        setWorkspaces((prev) =>
                          prev.map((item) =>
                            item._id === id ? { ...item, theme: newTheme } : item
                          )
                        );
                      }}
                    />
                  )}

                  {/* Actions */}
                  <div className="workspace-actions">
                    <button className="action-btn" onClick={() => handleViewTasks(ws._id)}>View Tasks</button>
                    <button className="action-btn" onClick={() => historyTask(ws._id)}>History</button>
                    <button className="action-btn" onClick={() => ArchievTask(ws._id)}>Archiev</button>
                    <button className="action-btn" onClick={() => NotificationTask(ws._id)}>Notification</button>
                    <button className="action-btn" onClick={() => analytical(ws._id)}>Analytical</button>

                    {role && ['editor', 'admin', ].includes(role) && (
                      <button className="action-btn" onClick={() => handleCreateTask(ws._id)}>Create Task</button>
                    )}

                    {role === 'admin' && (
                      <button className="action-btn" onClick={() => handleInvite(ws._id)}>Invite</button>
                    )}

                    {(role === 'editor' || role === 'admin') && (
                      <button className="action-btn" onClick={() => handleDelete(ws._id)}>Delete</button>
                    )}
                  </div>

                  {/* Invite Form */}
                  {showInviteFormId === ws._id && (
                    <form
                      onSubmit={(e) => { e.preventDefault(); sendInvite(ws._id, inviteEmail, inviteRole); }}
                      className="invite-inline-form"
                    >
                      <label>Workspace ID</label>
                      <input type="text" value={ws._id} readOnly className="readonly-input" />

                      <label>Email</label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="Enter email to invite"
                        required
                      />

                      <label>Role</label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as 'admin' | 'editor' | 'viewer')}
                        required
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>

                      <div style={{ marginTop: '0.5rem' }}>
                        <button type="submit">Send Invite</button>
                        <button type="button" onClick={() => setShowInviteFormId(null)}>Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

























//thunk






// "use client";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import WorkspaceThemeSwitcher from "../components/WorkspaceThemeSwitcher";
// import "./Home.css";

// // Redux hooks + thunks
// import { useAppDispatch, useAppSelector } from "../store/hook";
// import {
//   getWorkspaceThunk ,
//   createWorkspaceThunk,
//   deleteWorkspaceThunk,
//   inviteUserThunk,
// } from "../store/appslice";

// interface Iworkspace {
//   name: string;
// }

// interface IMember {
//   userId: string;
//   role: "admin" | "editor" | "viewer";
// }

// const Home: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   // ✅ Redux state
//   const { workspaces, loading, error } = useAppSelector(state => ({
//   workspaces: state.app.workspaces,
//   loading: state.app.loading,
//   error: state.app.error
// }));


//   const [showInviteFormId, setShowInviteFormId] = useState<string | null>(null);
//   const [inviteEmail, setInviteEmail] = useState("");
//   const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">(
//     "viewer"
//   );

//   const userId = localStorage.getItem("userId");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<Iworkspace>({
//     defaultValues: { name: "" },
//   });

//   // ✅ Fetch workspaces on mount
//   useEffect(() => {
//     dispatch(getWorkspaceThunk ());
//   }, [dispatch]);

//   // ✅ Submit new workspace
//   const submit = async (data: Iworkspace) => {
//     await dispatch(createWorkspaceThunk(data));
//     reset();
//   };

//   const handleDelete = (id: string) => {
//     if (window.confirm("Are you sure you want to delete this workspace?")) {
//       dispatch(deleteWorkspaceThunk(id));
//     }
//   };

//   const handleInvite = (id: string) => {
//     setInviteEmail("");
//     setInviteRole("viewer");
//     setShowInviteFormId(id);
//   };

//   const sendInvite = (workspaceId: string, email: string, role: string) => {
//     dispatch(inviteUserThunk({ workspaceId, email, role }));
//     alert(`Invite sent to ${email} as ${role}`);
//     setShowInviteFormId(null);
//   };

//   const analytical = (id: string) => navigate(`/analytical/${id}`);
//   const handleViewTasks = (id: string) => navigate(`/dashboard/${id}`);
//   const handleCreateTask = (id: string) => navigate(`/create/${id}`);
//   const historyTask = (id: string) => navigate(`/history/${id}`);
//   const ArchievTask = (id: string) => navigate(`/archiev/${id}`);
//   const NotificationTask = (id: string) => navigate(`/notification/${id}`);

//   return (
//     <div className="page-container">
//       {/* Create Workspace Form */}
//       <div className="form-section">
//         <h2>Create Workspace</h2>
//         <form onSubmit={handleSubmit(submit)} className="workspace-form">
//           <label htmlFor="name">Workspace Name</label>
//           <input
//             type="text"
//             id="name"
//             {...register("name", { required: "Workspace name is required" })}
//             className={`input-field ${errors.name ? "input-error" : ""}`}
//             placeholder="Enter workspace name"
//           />
//           {errors.name && <p className="error-text">{errors.name.message}</p>}
//           <button type="submit" className="submit-btn">
//             Create
//           </button>
//         </form>
//       </div>

//       {/* Workspaces */}
//       <div className="workspace-section">
//         <h3>Your Workspaces</h3>
//         {loading && <p>Loading workspaces...</p>}
//         {error && <p style={{ color: "red" }}>Error: {error}</p>}

//         <div className="workspace-list">
//           {workspaces.length === 0 ? (
//             <p>No workspaces found.</p>
//           ) : (
//             workspaces.map((ws) => {
//               const memberInfo = ws.members?.find((m: IMember) => m.userId === userId);
//               const role = memberInfo?.role || (ws.userId === userId ? "owner" : null);

//               return (
//                 <div
//                   key={ws._id}
//                   className={`workspace-card ${ws.theme || "workspace-theme-light"}`}
//                 >
//                   <div className="workspace-header">
//                     <h4>{ws.name}</h4>
//                     <span className="role-badge">Your Role: {role}</span>
//                   </div>

//                   {/* Admin-only Theme Switcher */}
//                   {role === "admin" && (
//                     <WorkspaceThemeSwitcher
//                       workspaceId={ws._id}
//                       onThemeChange={(id, newTheme) => {
//                         // update theme locally
//                         // theme persistence can also be handled in slice if needed
//                       }}
//                     />
//                   )}

//                   {/* Actions */}
//                   <div className="workspace-actions">
//                     <button
//                       className="action-btn"
//                       onClick={() => handleViewTasks(ws._id)}
//                     >
//                       View Tasks
//                     </button>
//                     <button
//                       className="action-btn"
//                       onClick={() => historyTask(ws._id)}
//                     >
//                       History
//                     </button>
//                     <button
//                       className="action-btn"
//                       onClick={() => ArchievTask(ws._id)}
//                     >
//                       Archiev
//                     </button>
//                     <button
//                       className="action-btn"
//                       onClick={() => NotificationTask(ws._id)}
//                     >
//                       Notification
//                     </button>
//                     <button
//                       className="action-btn"
//                       onClick={() => analytical(ws._id)}
//                     >
//                       Analytical
//                     </button>

//                     {role && ["editor", "admin"].includes(role) && (
//                       <button
//                         className="action-btn"
//                         onClick={() => handleCreateTask(ws._id)}
//                       >
//                         Create Task
//                       </button>
//                     )}

//                     {role === "admin" && (
//                       <button
//                         className="action-btn"
//                         onClick={() => handleInvite(ws._id)}
//                       >
//                         Invite
//                       </button>
//                     )}

//                     {(role === "editor" || role === "admin") && (
//                       <button
//                         className="action-btn"
//                         onClick={() => handleDelete(ws._id)}
//                       >
//                         Delete
//                       </button>
//                     )}
//                   </div>

//                   {/* Invite Form */}
//                   {showInviteFormId === ws._id && (
//                     <form
//                       onSubmit={(e) => {
//                         e.preventDefault();
//                         sendInvite(ws._id, inviteEmail, inviteRole);
//                       }}
//                       className="invite-inline-form"
//                     >
//                       <label>Workspace ID</label>
//                       <input
//                         type="text"
//                         value={ws._id}
//                         readOnly
//                         className="readonly-input"
//                       />

//                       <label>Email</label>
//                       <input
//                         type="email"
//                         value={inviteEmail}
//                         onChange={(e) => setInviteEmail(e.target.value)}
//                         placeholder="Enter email to invite"
//                         required
//                       />

//                       <label>Role</label>
//                       <select
//                         value={inviteRole}
//                         onChange={(e) =>
//                           setInviteRole(
//                             e.target.value as "admin" | "editor" | "viewer"
//                           )
//                         }
//                         required
//                       >
//                         <option value="admin">Admin</option>
//                         <option value="editor">Editor</option>
//                         <option value="viewer">Viewer</option>
//                       </select>

//                       <div style={{ marginTop: "0.5rem" }}>
//                         <button type="submit">Send Invite</button>
//                         <button
//                           type="button"
//                           onClick={() => setShowInviteFormId(null)}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </form>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
