// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { allWorkspaceStatus } from "../services/Apl";

// interface Workspace {
//   _id: string;
//   name: string;
//   userId: string;
//   createdAt: string;
//   members: { userId: string; role: string }[];
// }

// interface Todo {
//   _id: string;
//   title: string;
//   description?: string;
//   status?: string;
//   priority?: string;
//   duedate?: string;
// }

// export const Analytical: React.FC = () => {
//   const { workspaceId } = useParams<{ workspaceId: string }>();
//   const [workspace, setWorkspace] = useState<Workspace | null>(null);
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!workspaceId) return;
//         const res = await allWorkspaceStatus(workspaceId);

//         console.log("Analytical API response:", res);
//           console.log("resposne",res.todos);
//           console.log("resposne",res.workspace);
//         setWorkspace(res.workspace); // ✅ set workspace
//         setTodos(res.todos);         // ✅ set todos
//       } catch (err) {
//         console.error("Error fetching analytical data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [workspaceId]);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="p-4">
//       {/* Workspace Info */}
//       {workspace && (
//         <div className="mb-6 p-4 rounded-lg shadow bg-gray-100">
//           <h1 className="text-2xl font-bold">{workspace.name}</h1>
//           <p>
//             <strong>ID:</strong> {workspace._id}
//           </p>
//           <p>
//             <strong>Created At:</strong>{" "}
//             {new Date(workspace.createdAt).toLocaleDateString()}
//           </p>
//           <p>
//             <strong>Members:</strong> {workspace.members.length}
//           </p>
//         </div>
//       )}

//       {/* Todos List */}
//       <h2 className="text-xl font-semibold mb-3">Todos</h2>
//       {todos.length === 0 ? (
//         <p>No todos found for this workspace.</p>
//       ) : (
//         <ul className="space-y-3">
//           {todos.map((todo) => (
//             <li
//               key={todo._id}
//               className="p-4 rounded border shadow-sm bg-white"
//             >
//               <p>
//                 <strong>Title:</strong> {todo.title}
//               </p>
//               <p>
//                 <strong>Status:</strong> {todo.status}
//               </p>
//               <p>
//                 <strong>Priority:</strong> {todo.priority}
//               </p>
//               <p>
//                 <strong>Due Date:</strong>{" "}
//                 {todo.duedate
//                   ? new Date(todo.duedate).toLocaleDateString()
//                   : "-"}
//               </p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };



























































import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { allWorkspaceStatus } from "../services/Apl";
import "./Analytical.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Workspace {
  _id: string;
  name: string;
  userId: string;
  createdAt: string;
  members: { userId: string; role: string }[];
}

interface Todo {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  duedate?: string;
}

export const Analytical: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!workspaceId) return;
        const res = await allWorkspaceStatus(workspaceId);
        setWorkspace(res.workspace || null);
        setTodos(res.todos || []);
      } catch (err) {
        console.error("Error fetching analytical data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [workspaceId]);

  if (loading) return <div className="loading">Loading...</div>;

  // ✅ Chart Data Prep
  const statusCounts = ["Completed", "Pending", "In Progress"].map((status) => ({
    name: status,
    value: todos.filter((t) => t.status === status).length,
  }));

  const priorityCounts = ["High", "Medium", "Low"].map((priority) => ({
    name: priority,
    value: todos.filter((t) => t.priority === priority).length,
  }));

  const memberCount = workspace?.members?.length || 0;

  const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#F44336"];

  return (
    <div className="analytical-container">
      {/* Workspace Info */}
      {workspace ? (
        <div className="card workspace-card">
          <h1>{workspace.name}</h1>
          <p>
            <strong>ID:</strong> {workspace._id}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(workspace.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Members:</strong> {memberCount}
          </p>
        </div>
      ) : (
        <div className="empty-state">No workspace data available.</div>
      )}

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Status Distribution */}
        <div className="card">
          <h2 className="section-title">Tasks by Status</h2>
          {todos.length === 0 ? (
            <p className="empty-state">No tasks available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusCounts}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {statusCounts.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Priority Distribution */}
        <div className="card">
          <h2 className="section-title">Tasks by Priority</h2>
          {todos.length === 0 ? (
            <p className="empty-state">No tasks available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Members Info */}
      <div className="card">
        <h2 className="section-title">Members</h2>
        {memberCount === 0 ? (
          <p className="empty-state">No members found.</p>
        ) : (
          <ul className="members-list">
            {workspace?.members.map((m, idx) => (
              <li key={idx}>
                User: {m.userId}, Role: {m.role}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Todos List */}
      <div className="card">
        <h2 className="section-title">Todos</h2>
        {todos.length === 0 ? (
          <p className="empty-state">No todos found for this workspace.</p>
        ) : (
          <ul className="todos-list">
            {todos.map((todo) => (
              <li key={todo._id} className="todo-item">
                <p>
                  <strong>Title:</strong> {todo.title}
                </p>
                <p>
                  <strong>Status:</strong> {todo.status || "Not Set"}
                </p>
                <p>
                  <strong>Priority:</strong> {todo.priority || "Not Set"}
                </p>
                <p>
                  <strong>Due Date:</strong>{" "}
                  {todo.duedate
                    ? new Date(todo.duedate).toLocaleDateString()
                    : "-"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

