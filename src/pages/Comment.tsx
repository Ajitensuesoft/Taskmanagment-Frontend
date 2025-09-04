import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import {
  tagemail,
  createComment,
  updateComment,
  deleteComment,
  showallcomment
} from '../services/Apl';
import "./Comment.css";

interface ICommentForm {
  content: string;
}

interface ICommentItem {
  _id: string;
  taskId: string;
  userId: string;
  content: string;
}

const Comment: React.FC = () => {
  const { id: taskId } = useParams<{ id: string }>();
  const [comments, setComments] = useState<ICommentItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form for creating a new comment
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<ICommentForm>({ defaultValues: { content: '' } });

  // Form for editing an existing comment
  const {
    control: controlEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setEditValue,
    reset: resetEdit,
  } = useForm<ICommentForm>();

  // Fetch all comments for the task
  const fetchComments = async () => {
    if (!taskId) return;
    try {
      const res = await showallcomment(taskId);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  useEffect(() => {
    if (editingId) {
      const commentToEdit = comments.find(c => c._id === editingId);
      if (commentToEdit) {
        setEditValue('content', commentToEdit.content);
      }
    }
  }, [editingId, comments, setEditValue]);

  const onCreateSubmit = async (data: ICommentForm) => {
    if (!taskId) return;
    try {
      await createComment(taskId, data);
      reset();
      fetchComments();
    } catch (err) {
      console.error('Error creating comment:', err);
    }
  };

  const onUpdateSubmit = async (data: ICommentForm) => {
    if (!editingId) return;
    try {
      await updateComment(data, editingId);
      setEditingId(null);
      resetEdit();
      fetchComments();
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

 
  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  
  const editorInit = {
    height: 200,
    menubar: false,
    plugins: 'advlist autolink lists link image charmap preview anchor mentions',
    toolbar:
      'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',

   mentions_selector: 'span.mention',
    mentions_trigger: '@',
    mentions_min_chars: 0,

   mentions_fetch: async (query: any, success: (items: any[]) => void) => {
  try {
    const q = typeof query === "string" ? query : "";
    const searchValue = q.trim() !== "" ? q : "@";

    const res = await tagemail(searchValue);

    const users = Array.isArray(res?.data) ? res.data : [];
    console.log("users", users);

  const items = users.map((user: any) => ({
  id: user._id,
  name: user.firstName || user.lastName
    ? `${user.firstName} ${user.lastName}`.trim()
    : user.email || 'Unnamed',
}));




    success(items);
  } catch (error) {
    console.error("Error fetching mentions:", error);
    success([]);
  }
},
mentions_menu_hover: (userInfo: any, success: (content: string) => void) => {
  success(`<strong>${userInfo.name}</strong><br>${userInfo.email}`);
},

mentions_menu_complete: ( userInfo: any) => {
  const rawName = userInfo.name || userInfo.email || 'Unknown';
  const cleanName = rawName.replace(/^@/, ''); // remove leading @ if present

  const id = userInfo.id || userInfo.email || 'unknown';

  const span = document.createElement('span');
  span.className = 'mention';
  span.setAttribute('contenteditable', 'false');
  span.setAttribute('data-mention-id', id);
  span.textContent = `@${cleanName}`; 

  return span;
}






  };

  return (
    <div className="comment-container">
      <h2>Add a Comment</h2>
      <form onSubmit={handleSubmit(onCreateSubmit)} className="comment-form">
        <Controller
          name="content"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Editor
              apiKey="8veze8u6wqlrunj1i2grouccz8bszcadtak66utgoxb9srgx"
              onEditorChange={field.onChange}
              value={field.value}
              init={editorInit}
            />
          )}
        />
        <button type="submit">Add</button>
      </form>

      <h3>All Comments</h3>
      <div className="comment-list">
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              {editingId === comment._id ? (
                <form onSubmit={handleSubmitEdit(onUpdateSubmit)} className="edit-form">
                  <Controller
                    name="content"
                    control={controlEdit}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Editor
                        apiKey="8veze8u6wqlrunj1i2grouccz8bszcadtak66utgoxb9srgx"
                        onEditorChange={field.onChange}
                        value={field.value}
                        init={editorInit}
                      />
                    )}
                  />
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      resetEdit();
                    }}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div dangerouslySetInnerHTML={{ __html: comment.content }} />
                  <button onClick={() => setEditingId(comment._id)}>Edit</button>
                  <button onClick={() => handleDelete(comment._id)}>Delete</button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comment;















//thunk 
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useForm, Controller } from "react-hook-form";
// import { Editor } from "@tinymce/tinymce-react";
// import { useAppDispatch, useAppSelector } from "../store/hook";
// import {
//   showAllCommentThunk,
//   createCommentThunk,
//   updateCommentThunk,
//   deleteCommentThunk,
// } from "../store/appslice"; // adjust path
// import { tagemail } from "../services/Apl"; 
// import "./Comment.css";

// interface ICommentForm {
//   content: string;
// }

// const Comment: React.FC = () => {
//   const { id: taskId } = useParams<{ id: string }>();
//   const dispatch = useAppDispatch();

//   const { comments, loading, error } = useAppSelector(
//     (state) => state.app.commentsByTaskId
//   );

//   const [editingId, setEditingId] = useState<string | null>(null);

//   // --- Create Form ---
//   const { control, handleSubmit, reset } = useForm<ICommentForm>({
//     defaultValues: { content: "" },
//   });

//   // --- Edit Form ---
//   const {
//     control: controlEdit,
//     handleSubmit: handleSubmitEdit,
//     setValue: setEditValue,
//     reset: resetEdit,
//   } = useForm<ICommentForm>();

//   // Fetch comments on mount
//   useEffect(() => {
//     if (taskId) {
//       dispatch(showAllCommentThunk(taskId));
//     }
//   }, [taskId, dispatch]);

//   // Populate edit form when switching to edit mode
//   useEffect(() => {
//     if (editingId) {
//       const commentToEdit = comments.find((c) => c._id === editingId);
//       if (commentToEdit) {
//         setEditValue("content", commentToEdit.content);
//       }
//     }
//   }, [editingId, comments, setEditValue]);

//   // --- Handlers ---
//   const onCreateSubmit = async (data: ICommentForm) => {
//     if (!taskId) return;
//     let id=taskId;
//     await dispatch(createCommentThunk({ id, data }));
//     reset();
//   };

//   const onUpdateSubmit = async (data: ICommentForm) => {
//     if (!editingId) return;
//     //  let id=taskId;
//     await dispatch(updateCommentThunk({ editingId, data }));
//     setEditingId(null);
//     resetEdit();
//   };

//   const handleDelete = async (commentId: string) => {
//     await dispatch(deleteCommentThunk(commentId));
//   };

//   // --- TinyMCE Editor Init ---
//   const editorInit = {
//     height: 200,
//     menubar: false,
//     plugins:
//       "advlist autolink lists link image charmap preview anchor mentions",
//     toolbar:
//       "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
//     mentions_selector: "span.mention",
//     mentions_trigger: "@",
//     mentions_min_chars: 0,
//     mentions_fetch: async (query: any, success: (items: any[]) => void) => {
//       try {
//         const q = typeof query === "string" ? query : "";
//         const searchValue = q.trim() !== "" ? q : "@";
//         const res = await tagemail(searchValue);

//         const users = Array.isArray(res?.data) ? res.data : [];
//         const items = users.map((user: any) => ({
//           id: user._id,
//           name:
//             user.firstName || user.lastName
//               ? `${user.firstName} ${user.lastName}`.trim()
//               : user.email || "Unnamed",
//         }));

//         success(items);
//       } catch (error) {
//         console.error("Error fetching mentions:", error);
//         success([]);
//       }
//     },
//     mentions_menu_hover: (userInfo: any, success: (content: string) => void) => {
//       success(`<strong>${userInfo.name}</strong><br>${userInfo.email}`);
//     },
//     mentions_menu_complete: (editor: any, userInfo: any) => {
//       const rawName = userInfo.name || userInfo.email || "Unknown";
//       const cleanName = rawName.replace(/^@/, "");
//       const id = userInfo.id || userInfo.email || "unknown";

//       const span = document.createElement("span");
//       span.className = "mention";
//       span.setAttribute("contenteditable", "false");
//       span.setAttribute("data-mention-id", id);
//       span.textContent = `@${cleanName}`;
//       return span;
//     },
//   };

//   return (
//     <div className="comment-container">
//       <h2>Add a Comment</h2>
//       <form onSubmit={handleSubmit(onCreateSubmit)} className="comment-form">
//         <Controller
//           name="content"
//           control={control}
//           rules={{ required: true }}
//           render={({ field }) => (
//             <Editor
//               apiKey="8veze8u6wqlrunj1i2grouccz8bszcadtak66utgoxb9srgx"
//               onEditorChange={field.onChange}
//               value={field.value}
//               init={editorInit}
//             />
//           )}
//         />
//         <button type="submit">Add</button>
//       </form>

//       <h3>All Comments</h3>
//       {loading && <p>Loading comments...</p>}
//       {error && <p className="error-message">{error}</p>}
//       <div className="comment-list">
//         {comments.length === 0 ? (
//           <p>No comments yet.</p>
//         ) : (
//           comments.map((comment) => (
//             <div key={comment._id} className="comment-item">
//               {editingId === comment._id ? (
//                 <form
//                   onSubmit={handleSubmitEdit(onUpdateSubmit)}
//                   className="edit-form"
//                 >
//                   <Controller
//                     name="content"
//                     control={controlEdit}
//                     rules={{ required: true }}
//                     render={({ field }) => (
//                       <Editor
//                         apiKey="8veze8u6wqlrunj1i2grouccz8bszcadtak66utgoxb9srgx"
//                         onEditorChange={field.onChange}
//                         value={field.value}
//                         init={editorInit}
//                       />
//                     )}
//                   />
//                   <button type="submit">Save</button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setEditingId(null);
//                       resetEdit();
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </form>
//               ) : (
//                 <>
//                   <div dangerouslySetInnerHTML={{ __html: comment.content }} />
//                   <button onClick={() => setEditingId(comment._id)}>Edit</button>
//                   <button onClick={() => handleDelete(comment._id)}>
//                     Delete
//                   </button>
//                 </>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Comment;
