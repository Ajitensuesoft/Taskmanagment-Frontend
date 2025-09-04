



// import { useForm } from 'react-hook-form';
// import { createTodo } from '../services/Apl'; // adjust path as needed
// import './Create.css';
// import { CsvDataForm } from './Csvdata';
// type TaskData = {
//   title: string;
//   status: string;
//   description?: string;
//   priority?: string;
// };

// type Props = {
//   defaultValues?: TaskData;
//   onSubmit?: (data: TaskData) => void; // optional callback
// };

// const Create = ({ defaultValues, onSubmit }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors }
//   } = useForm<TaskData>({
//     defaultValues: defaultValues || {
//       title: '',
//       description: '',
//       status: 'pending',      // default status
//       priority: 'medium',     // default priority
//     }
//   });

//   const handleFormSubmit = async (data: TaskData) => {
//     try {
//       await createTodo(data); // send to backend
//       if (onSubmit) onSubmit(data); // optional callback
//       reset(); // clear form after success
//     } catch (err) {
//       console.error('Error creating task:', err);
//     }
//   };

//   return (
//     <div>
        
// <CsvDataForm/>
//     <form onSubmit={handleSubmit(handleFormSubmit)} className="task-form">
//       <div>
//         <label>Title:</label>
//         <input
//           {...register('title', { required: 'Title is required' })}
//           placeholder="Enter task title"
//         />
//         {errors.title && <p className="error">{errors.title.message}</p>}
//       </div>

//       <div>
//         <label>Description:</label>
//         <textarea
//           {...register('description', { required: 'Description is required' })}
//           placeholder="Enter task description"
//         />
//         {errors.description && <p className="error">{errors.description.message}</p>}
//       </div>

//       <div>
//         <label>Status:</label>
//         <select
//           {...register('status', { required: 'Status is required' })}
//           defaultValue={defaultValues?.status || 'pending'} // default pending
//         >
//           <option value="Pending">Pending</option>
//           <option value="InProgress">In Progress</option>
//           <option value="Completed">Complete</option>
//         </select>
//         {errors.status && <p className="error">{errors.status.message}</p>}
//       </div>

//       <div>
//         <label>Priority:</label>
//         <select
//           {...register('priority', { required: 'Priority is required' })}
//           defaultValue={defaultValues?.priority || 'medium'} // default medium
//         >
//           <option value="Low">Low</option>
//           <option value="Medium">Medium</option>
//           <option value="Hard">Hard</option>
//         </select>
//         {errors.priority && <p className="error">{errors.priority.message}</p>}
//       </div>

//       <button type="submit">{defaultValues ? 'Update Task' : 'Create Task'}</button>
//     </form>
//     </div>
//   );
// };

// export default Create;




// import { useForm } from 'react-hook-form';
// import { createTodo } from '../services/Apl'; // adjust path as needed
// import './Create.css';
// import { CsvDataForm } from './Csvdata';
// import { useNavigate } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
// import { useState } from 'react';
// import { CustomFieldModal } from './CustomField';

// type TaskData = {
//   title: string;
//   status: string;
//   description?: string;
//   priority?: string;
//   duedate: string; // ISO string (date input will give this)
// };

// type Props = {
//   defaultValues?: TaskData;
//   onSubmit?: (data: TaskData) => void; // optional callback
// };

// const Create = ({ defaultValues, onSubmit }: Props) => {
//   const [showModal, setShowModal] = useState(false);

//   const navigate=useNavigate();
//   let workspaceId=useParams().workspaceId;
//   console.log("this is form workspaceId",workspaceId)
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors }
//   } = useForm<TaskData>({
//     defaultValues: defaultValues || {
//       title: '',
//       description: '',
//       status: 'Pending',      // default status
//       priority: 'Medium',     // default priority
//       duedate: '',            // empty initially
//     }
//   });

//   const handleFormSubmit = async (data: TaskData,) => {
//     console.log("data created with workspaceId or data",data,workspaceId);
//     try {
// if(workspaceId){
//   await createTodo(data,workspaceId); // send to backend
//   if (onSubmit) onSubmit(data); // optional callback
//   reset(); // clear form after success
// }
//     } catch (err) {
//       console.error('Error creating task:', err);
//     }
//   };

//   function setCustomFields(arg0: (prev: any) => any[]): void {
//     throw new Error('Function not implemented.');
//   }

//   return (
//     <div>
//       <CsvDataForm />
    
//       <form onSubmit={handleSubmit(handleFormSubmit)} className="task-form">
//         <div>
//           <label>Title:</label>
//           <input
//             {...register('title', { required: 'Title is required' })}
//             placeholder="Enter task title"
//           />
//           {errors.title && <p className="error">{errors.title.message}</p>}
//         </div>

//         <div>
//           <label>Description:</label>
//           <textarea
//             {...register('description', { required: 'Description is required' })}
//             placeholder="Enter task description"
//           />
//           {errors.description && <p className="error">{errors.description.message}</p>}
//         </div>

//         <div>
//           <label>Status:</label>
//           <select
//             {...register('status', { required: 'Status is required' })}
//             defaultValue={defaultValues?.status || 'Pending'}
//           >
//             <option value="Pending">Pending</option>
//             <option value="InProgress">In Progress</option>
//             <option value="Completed">Complete</option>
//           </select>
//           {errors.status && <p className="error">{errors.status.message}</p>}
//         </div>

//         <div>
//           <label>Priority:</label>
//           <select
//             {...register('priority', { required: 'Priority is required' })}
//             defaultValue={defaultValues?.priority || 'Medium'}
//           >
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="Hard">Hard</option>
//           </select>
//           {errors.priority && <p className="error">{errors.priority.message}</p>}
//         </div>

//         {/* ✅ New Due Date Field */}
//         <div>
//           <label>Due Date:</label>
//           <input
//             type="datetime-local" // lets user select date & time
//             {...register('duedate', { required: 'Due date is required' })}
//           />
//           {errors.duedate && <p className="error">{errors.duedate.message}</p>}
//         </div>
//         <button type="button" onClick={() => setShowModal(true)}>+ Add Custom Field</button>
// {showModal && (
//   <CustomFieldModal
//     onAdd={(field) => setCustomFields(prev => [...prev, field])}
//     onClose={() => setShowModal(false)}
//   />
// )}


//         <button type="submit">{defaultValues ? 'Update Task' : 'Create Task'}</button>
//       </form>

//     </div>
//   );
// };

// export default Create;








import { useForm } from 'react-hook-form';
import { createTodo } from '../services/Apl'; // adjust path as needed
import './Create.css';
import { CsvDataForm } from './Csvdata';
// import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { CustomFieldModal } from './CustomField';

type CustomField = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'checkbox' | 'select';
  options?: string[];
  value?: any;
};

type TaskData = {
  title: string;
  status: string;
  description?: string;
  priority?: string;
  duedate?: string;
  customFields?: CustomField[];
};

type Props = {
  defaultValues?: TaskData;
  onSubmit?: (data: TaskData) => void;
};

const Create = ({ defaultValues, onSubmit }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  // const navigate = useNavigate();
  const workspaceId = useParams().workspaceId;
  console.log("this is form workspaceId", workspaceId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskData>({
    defaultValues: defaultValues || {
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      duedate: '',
    }
  });

  const handleFormSubmit = async (data: TaskData) => {
    const enrichedData = {
      ...data,
      customFields: customFields.map(({ id, label, type, value, options }) => ({
        id,
        label,
        type,
        value,
        options,
      })),
    };

    console.log("data created with workspaceId or data", enrichedData, workspaceId);

    try {
      if (workspaceId) {
        await createTodo(enrichedData, workspaceId);
        if (onSubmit) onSubmit(enrichedData);
        reset();
        setCustomFields([]);
      }
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  return (
    <div>
      <CsvDataForm />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="task-form">
        <div>
          <label>Title:</label>
          <input
            {...register('title', { required: 'Title is required' })}
            placeholder="Enter task title"
          />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>

        <div>
          <label>Description:</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            placeholder="Enter task description"
          />
          {errors.description && <p className="error">{errors.description.message}</p>}
        </div>

        <div>
          <label>Status:</label>
          <select
            {...register('status', { required: 'Status is required' })}
            defaultValue={defaultValues?.status || 'Pending'}
          >
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Complete</option>
          </select>
          {errors.status && <p className="error">{errors.status.message}</p>}
        </div>

        <div>
          <label>Priority:</label>
          <select
            {...register('priority', { required: 'Priority is required' })}
            defaultValue={defaultValues?.priority || 'Medium'}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          {errors.priority && <p className="error">{errors.priority.message}</p>}
        </div>

        <div>
          <label>Due Date:</label>
          <input
            type="datetime-local"
            {...register('duedate', { required: 'Due date is required' })}
          />
          {errors.duedate && <p className="error">{errors.duedate.message}</p>}
        </div>

        {/* ✅ Add Custom Field Button */}
        <button type="button" onClick={() => setShowModal(true)}>+ Add Custom Field</button>

        {/* ✅ Modal for Custom Field Creation */}
        {showModal && (
          <CustomFieldModal
            onAdd={(field) => setCustomFields(prev => [...prev, field])}
            onClose={() => setShowModal(false)}
          />
        )}

        {/* ✅ Render Custom Fields */}
        {customFields.length > 0 && (
          <div className="custom-fields-section">
            <h4>Custom Fields</h4>
            {customFields.map((field, index) => (
              <div key={field.id} className="custom-field">
                <label>{field.label}</label>

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={field.value || ''}
                    onChange={(e) => {
                      const updated = [...customFields];
                      updated[index].value = e.target.value;
                      setCustomFields(updated);
                    }}
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    value={field.value || ''}
                    onChange={(e) => {
                      const updated = [...customFields];
                      updated[index].value = e.target.value;
                      setCustomFields(updated);
                    }}
                  />
                )}

                {field.type === 'checkbox' && (
                  <>
                    {field.options?.map((opt, optIndex) => (
                      <label key={optIndex}>
                        <input
                          type="checkbox"
                          checked={Array.isArray(field.value) ? field.value.includes(opt) : false}
                          onChange={(e) => {
                            const updated = [...customFields];
                            const current = Array.isArray(updated[index].value) ? updated[index].value : [];
                            updated[index].value = e.target.checked
                              ? [...current, opt]
                              : current.filter((v: string) => v !== opt);
                            setCustomFields(updated);
                          }}
                        />
                        {opt}
                      </label>
                    ))}
                  </>
                )}

                {field.type === 'select' && (
                  <select
                    value={field.value || ''}
                    onChange={(e) => {
                      const updated = [...customFields];
                      updated[index].value = e.target.value;
                      setCustomFields(updated);
                    }}
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((opt, optIndex) => (
                      <option key={optIndex} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}

        <button type="submit">{defaultValues ? 'Update Task' : 'Create Task'}</button>
      </form>
    </div>
  );
};

export default Create;









//thunk



// import { useForm } from "react-hook-form";
// import "./Create.css";
// import { CsvDataForm } from "./Csvdata";
// import { useNavigate, useParams } from "react-router-dom";
// import { useState } from "react";
// import { CustomFieldModal } from "./CustomField";
// import { useAppDispatch } from "../store/hook";
// import { createTodoThunk } from "../store/appslice"; // ✅ thunk

// type CustomField = {
//   id: string;
//   label: string;
//   type: "text" | "textarea" | "checkbox" | "select";
//   options?: string[];
//   value?: any;
// };

// type TaskData = {
//   title: string;
//   status: string;
//   description?: string;
//   priority?: string;
//   duedate: string;
//   customFields?: CustomField[];
// };

// type Props = {
//   defaultValues?: TaskData;
//   onSubmit?: (data: TaskData) => void;
// };

// const Create = ({ defaultValues, onSubmit }: Props) => {
//   const [showModal, setShowModal] = useState(false);
//   const [customFields, setCustomFields] = useState<CustomField[]>([]);

//   const navigate = useNavigate();
//   const workspaceId = useParams().workspaceId;
//   const dispatch = useAppDispatch();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<TaskData>({
//     defaultValues: defaultValues || {
//       title: "",
//       description: "",
//       status: "Pending",
//       priority: "Medium",
//       duedate: "",
//     },
//   });

//   const handleFormSubmit = async (data: TaskData) => {
//     const enrichedData = {
//       ...data,
//       customFields: customFields.map(({ id, label, type, value, options }) => ({
//         id,
//         label,
//         type,
//         value,
//         options,
//       })),
//     };

//     if (!workspaceId) return;

//     try {
//       await dispatch(createTodoThunk({ workspaceId, data: enrichedData }));
//       if (onSubmit) onSubmit(enrichedData);
//       reset();
//       setCustomFields([]);
//       navigate(`/workspace/${workspaceId}/tasks`); // ✅ optional redirect
//     } catch (err) {
//       console.error("Error creating task:", err);
//     }
//   };

//   return (
//     <div>
//       <CsvDataForm />

//       <form onSubmit={handleSubmit(handleFormSubmit)} className="task-form">
//         <div>
//           <label>Title:</label>
//           <input
//             {...register("title", { required: "Title is required" })}
//             placeholder="Enter task title"
//           />
//           {errors.title && <p className="error">{errors.title.message}</p>}
//         </div>

//         <div>
//           <label>Description:</label>
//           <textarea
//             {...register("description", { required: "Description is required" })}
//             placeholder="Enter task description"
//           />
//           {errors.description && (
//             <p className="error">{errors.description.message}</p>
//           )}
//         </div>

//         <div>
//           <label>Status:</label>
//           <select
//             {...register("status", { required: "Status is required" })}
//             defaultValue={defaultValues?.status || "Pending"}
//           >
//             <option value="Pending">Pending</option>
//             <option value="InProgress">In Progress</option>
//             <option value="Completed">Complete</option>
//           </select>
//           {errors.status && <p className="error">{errors.status.message}</p>}
//         </div>

//         <div>
//           <label>Priority:</label>
//           <select
//             {...register("priority", { required: "Priority is required" })}
//             defaultValue={defaultValues?.priority || "Medium"}
//           >
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="Hard">Hard</option>
//           </select>
//           {errors.priority && (
//             <p className="error">{errors.priority.message}</p>
//           )}
//         </div>

//         <div>
//           <label>Due Date:</label>
//           <input
//             type="datetime-local"
//             {...register("duedate", { required: "Due date is required" })}
//           />
//           {errors.duedate && (
//             <p className="error">{errors.duedate.message}</p>
//           )}
//         </div>

//         {/* ✅ Add Custom Field Button */}
//         <button type="button" onClick={() => setShowModal(true)}>
//           + Add Custom Field
//         </button>

//         {/* ✅ Modal for Custom Field Creation */}
//         {showModal && (
//           <CustomFieldModal
//             onAdd={(field) => setCustomFields((prev) => [...prev, field])}
//             onClose={() => setShowModal(false)}
//           />
//         )}

//         {/* ✅ Render Custom Fields */}
//         {customFields.length > 0 && (
//           <div className="custom-fields-section">
//             <h4>Custom Fields</h4>
//             {customFields.map((field, index) => (
//               <div key={field.id} className="custom-field">
//                 <label>{field.label}</label>

//                 {field.type === "text" && (
//                   <input
//                     type="text"
//                     value={field.value || ""}
//                     onChange={(e) => {
//                       const updated = [...customFields];
//                       updated[index].value = e.target.value;
//                       setCustomFields(updated);
//                     }}
//                   />
//                 )}

//                 {field.type === "textarea" && (
//                   <textarea
//                     value={field.value || ""}
//                     onChange={(e) => {
//                       const updated = [...customFields];
//                       updated[index].value = e.target.value;
//                       setCustomFields(updated);
//                     }}
//                   />
//                 )}

//                 {field.type === "checkbox" && (
//                   <>
//                     {field.options?.map((opt, optIndex) => (
//                       <label key={optIndex}>
//                         <input
//                           type="checkbox"
//                           checked={
//                             Array.isArray(field.value)
//                               ? field.value.includes(opt)
//                               : false
//                           }
//                           onChange={(e) => {
//                             const updated = [...customFields];
//                             const current = Array.isArray(
//                               updated[index].value
//                             )
//                               ? updated[index].value
//                               : [];
//                             updated[index].value = e.target.checked
//                               ? [...current, opt]
//                               : current.filter((v: string) => v !== opt);
//                             setCustomFields(updated);
//                           }}
//                         />
//                         {opt}
//                       </label>
//                     ))}
//                   </>
//                 )}

//                 {field.type === "select" && (
//                   <select
//                     value={field.value || ""}
//                     onChange={(e) => {
//                       const updated = [...customFields];
//                       updated[index].value = e.target.value;
//                       setCustomFields(updated);
//                     }}
//                   >
//                     <option value="">Select an option</option>
//                     {field.options?.map((opt, optIndex) => (
//                       <option key={optIndex} value={opt}>
//                         {opt}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         <button type="submit">
//           {defaultValues ? "Update Task" : "Create Task"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Create;
