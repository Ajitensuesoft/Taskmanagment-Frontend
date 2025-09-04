import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as api from "../services/Apl"; 


export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await api.Signup(data);
      return res; 
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const signinThunk = createAsyncThunk(
  "auth/signin",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await api.Signin(data);
      return res; // { user, token, ... }
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.Logout();
      return res.data ?? res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// Todos (CRUD)
// ------------------------------
export const getTodosThunk = createAsyncThunk(
  "todos/getAll",
  async (workspaceId: string | undefined, { rejectWithValue }) => {
    try {
      const res = await api.getTodos(workspaceId);
      return res.data; // array
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const getTodoByIdThunk = createAsyncThunk(
  "todos/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.getTodoById(id); // returns axios Response
      return res.data; // single todo
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const createTodoThunk = createAsyncThunk(
  "todos/create",
  async (
    args: { data: { title: string; description?: string; status?: string; priority?: string }; workspaceId?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.createTodo(args.data, args.workspaceId);
      return res.data; // created todo
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const updateTodoThunk = createAsyncThunk(
  "todos/update",
  async (
    args: { id: string; data: { title?: string; description?: string; status?: string; priority?: string }; workspaceId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.updateTodo(args.id, args.data, args.workspaceId);
      return res.data; // updated todo
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const deleteTodoThunk = createAsyncThunk(
  "todos/delete",
  async (args: { id: string; workspaceId: string }, { rejectWithValue }) => {
    try {
      const res = await api.deleteTodo(args.id, args.workspaceId);
      return { id: args.id, data: res.data };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// Todo Sharing + Mail
// ------------------------------
export const shareTaskThunk = createAsyncThunk(
  "share/task",
  async (args: { taskId: string; email: string; workspaceId: string }, { rejectWithValue }) => {
    try {
      const res = await api.shareTask(args.taskId, args.email, args.workspaceId);
      return res; // message, etc.
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const allMailThunk = createAsyncThunk(
  "share/allMail",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.allmail();
      return res; // array of emails
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const getSharedThunk = createAsyncThunk(
  "share/get",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const res = await api.getShared(workspaceId);
      return res; // list
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const postSharedThunk = createAsyncThunk(
  "share/post",
  async (args: { data: { from: string; to: string; title: string; taskId: string; message?: string }; workspaceId: string }, { rejectWithValue }) => {
    try {
      const res = await api.postShared(args.data, args.workspaceId);
      return res; // created share
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const deleteSharedThunk = createAsyncThunk(
  "share/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.deleteShared(id);
      return { id, data: res }; // { id }
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// Notifications
// ------------------------------
export const getNotificationsThunk = createAsyncThunk(
  "notifications/get",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const res = await api.getNotifications(workspaceId);
      return res; // array
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const createNotificationThunk = createAsyncThunk(
  "notifications/create",
  async (args: { data: { from: string; message: string; to: string; taskId: string; userId: string; inviterId?: string; invitedId?: string }; workspaceId: string }, { rejectWithValue }) => {
    try {
      const res = await api.createNotification(args.data, args.workspaceId);
      return res; // created notification
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const deleteNotificationThunk = createAsyncThunk(
  "notifications/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.deleteNotification(id);
      return { id, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const viewNotificationThunk = createAsyncThunk(
  "notifications/view",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.viewNotification(id);
      return { id, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// Bulk actions
// ------------------------------
export const bulkCompleteThunk = createAsyncThunk(
  "todos/bulkComplete",
  async (ids: string[], { rejectWithValue }) => {
    try {
      const res = await api.Bulkcomplete(ids);
      return { ids, data: res }; // message etc.
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const bulkDeleteThunk = createAsyncThunk(
  "todos/bulkDelete",
  async (ids: string[], { rejectWithValue }) => {
    try {
      const res = await api.BulkDelete(ids);
      return { ids, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// History + CSV
// ------------------------------
export const historyDetailsThunk = createAsyncThunk(
  "history/get",
  async (workspaceId: string | undefined, { rejectWithValue }) => {
    try {
      const res = await api.HistoryDetails(workspaceId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const deleteHistoryThunk = createAsyncThunk(
  "history/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.DeleteHistory(id);
      return { id, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const createCsvThunk = createAsyncThunk(
  "history/createCsv",
  async (parsedData: any[], { rejectWithValue }) => {
    try {
      const res = await api.createCsv(parsedData);
      return res; // server response
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// Important + Archive
// ------------------------------
export const importantUpdateThunk = createAsyncThunk(
  "todos/important",
  async (args: { id: string; value: boolean }, { rejectWithValue }) => {
    try {
      const res = await api.importantupdate(args.id, args.value);
      const data = (res as any)?.data ?? res; // api returns axios response
      return { id: args.id, data };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const archiveTodoThunk = createAsyncThunk(
  "todos/archive",
  async (args: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await api.archieved(args.id, args.data);
      return { id: args.id, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// Checklist (Todo)
// ------------------------------
export const getChecklistItemsThunk = createAsyncThunk(
  "checklist/get",
  async (todoId: string, { rejectWithValue }) => {
    try {
      const res = await api.getChecklistItems(todoId);
      return { todoId, items: res.data };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const createChecklistItemThunk = createAsyncThunk(
  "checklist/create",
  async (args: { todoId: string; title: string }, { rejectWithValue }) => {
    try {
      const res = await api.createChecklistItem(args.todoId, args.title);
      return { todoId: args.todoId, item: res.data };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const updateChecklistItemThunk = createAsyncThunk(
  "checklist/update",
  async (args: { checklistItemId: string; data: { title?: string; status?: string }; todoId?: string }, { rejectWithValue }) => {
    try {
      const res = await api.updateChecklistItem(args.checklistItemId, args.data);
      return { checklistItemId: args.checklistItemId, item: res.data, todoId: args.todoId };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const deleteChecklistItemThunk = createAsyncThunk(
  "checklist/delete",
  async (args: { checklistItemId: string; todoId?: string }, { rejectWithValue }) => {
    try {
      const res = await api.deleteChecklistItem(args.checklistItemId);
      return { checklistItemId: args.checklistItemId, data: res.data, todoId: args.todoId };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// Workdata + Work Checklist
// ------------------------------
export const workDataThunk = createAsyncThunk(
  "workdata/get",
  async (args: { id: string; userId: string }, { rejectWithValue }) => {
    try {
      const res = await api.workdata(args.id, args.userId);
      return { id: args.id, userId: args.userId, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const workDataUpdateThunk = createAsyncThunk(
  "workdata/update",
  async (args: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await api.workdataupdate(args.id, args.data);
      return { id: args.id, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const workDeleteThunk = createAsyncThunk(
  "workdata/delete",
  async (args: { id: string; userId: string }, { rejectWithValue }) => {
    try {
      const res = await api.workdelete(args.id, args.userId);
      return { id: args.id, userId: args.userId, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const getWorkChecklistDataThunk = createAsyncThunk(
  "workChecklist/get",
  async (args: { id: string; userId: string }, { rejectWithValue }) => {
    try {
      const res = await api.getworkChecklistdata(args.id, args.userId);
      return { id: args.id, userId: args.userId, items: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const workChecklistUpdateThunk = createAsyncThunk(
  "workChecklist/update",
  async (args: { id: string; data: any; parentId?: string }, { rejectWithValue }) => {
    try {
      const res = await api.workChecklistUpdate(args.id, args.data);
      return { id: args.id, item: res, parentId: args.parentId };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const workChecklistDeleteThunk = createAsyncThunk(
  "workChecklist/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.workChecklistDelete(id);
      return { id, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// Invited people
// ------------------------------
export const createdInvitedThunk = createAsyncThunk(
  "invited/create",
  async (args: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await api.createdinvited(args.id, args.data);
      return { id: args.id, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const getInvitedThunk = createAsyncThunk(
  "invited/get",
  async (args: { id: string; userId: string }, { rejectWithValue }) => {
    try {
      const res = await api.getinvited(args.id, args.userId);
      return { id: args.id, userId: args.userId, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// Comments
// ------------------------------
export const showAllCommentThunk = createAsyncThunk(
  "comments/getAll",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const res = await api.showallcomment(taskId);
      return { taskId, items: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const createCommentThunk = createAsyncThunk(
  "comments/create",
  async (args: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await api.createComment(args.id, args.data);
      return { taskId: args.id, item: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const deleteCommentThunk = createAsyncThunk(
  "comments/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.deleteComment(id);
      return { id, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const updateCommentThunk = createAsyncThunk(
  "comments/update",
  async (args: { data: any; editingId: string; taskId?: string }, { rejectWithValue }) => {
    try {
      const res = await api.updateComment(args.data, args.editingId);
      return { id: args.editingId, item: res, taskId: args.taskId };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// Workspace (create/delete/get/invite/roles)
// ------------------------------
export const createWorkspaceThunk = createAsyncThunk(
  "workspace/create",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await api.createWorkspace(data);
      return res; // created workspace
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const getWorkspaceThunk = createAsyncThunk(
  "workspace/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getworkspace();
      return res; // array
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const deleteWorkspaceThunk = createAsyncThunk(
  "workspace/delete",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const res = await api.deleteWorkspace(workspaceId);
      return { id: workspaceId, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const inviteUserThunk = createAsyncThunk(
  "workspace/inviteUser",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await api.inviteuser(data);
      return res; // invitation created
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const acceptInviteThunk = createAsyncThunk(
  "workspace/acceptInvite",
  async (invitationToken: any, { rejectWithValue }) => {
    try {
      const res = await api.acceptinvite(invitationToken); // NOTE: points to localhost in api.ts
      return res; // acceptance response
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const inviterRoleThunk = createAsyncThunk(
  "workspace/inviterRole",
  async (receiverId: string, { rejectWithValue }) => {
    try {
      const res = await api.inviterRole(receiverId);
      return { receiverId, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const tagEmailThunk = createAsyncThunk(
  "workspace/tagEmail",
  async (value: any, { rejectWithValue }) => {
    try {
      const res = await api.tagemail(value);
      return res; // suggestions
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// Timer
// ------------------------------
export const startTimeThunk = createAsyncThunk(
  "timer/start",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.startTime(id);
      return { id, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const stopTimeThunk = createAsyncThunk(
  "timer/stop",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.stopTime(id);
      return { id, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const resetTimeThunk = createAsyncThunk(
  "timer/reset",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.resetTime(id);
      return { id, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const endTimeThunk = createAsyncThunk(
  "timer/end",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.endTime(id);
      return { id, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

export const getTimerByTodoThunk = createAsyncThunk(
  "timer/getByTodo",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.getTimerByTodo(id);
      return { id, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// Analytics
// ------------------------------
export const allWorkspaceStatusThunk = createAsyncThunk(
  "analytics/allWorkspaceStatus",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const res = await api.allWorkspaceStatus(workspaceId);
      return { workspaceId, data: res };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

// ------------------------------
// Global State
// ------------------------------
export interface AppState {
  // Auth
  user: any | null;
  token: string | null;

  // Todos
  todos: any[];
  todoById: Record<string, any>;
  checklistByTodoId: Record<string, any[]>; // todoId -> checklist items

  // Workdata & Work Checklist
  workDataById: Record<string, any>; // id -> data
  workChecklistById: Record<string, any[]>; // parent id -> items

  // Sharing & Mail
  sharedItems: any[];
  sharedMail: any[];

  // Notifications
  notifications: any[];
  viewedNotifications: Record<string, any>; // id -> data

  // History
  history: any[];

  // Comments
  commentsByTaskId: Record<string, any[]>;

  // Workspace
  workspaces: any[];
  inviterRolesByReceiver: Record<string, any>;
  tagEmailSuggestions: any[];

  // Timer
  timerByTodoId: Record<string, any>;

  // Analytics
  analyticsByWorkspace: Record<string, any>;

  // UI
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  user: null,
  token: null,

  todos: [],
  todoById: {},
  checklistByTodoId: {},

  workDataById: {},
  workChecklistById: {},

  sharedItems: [],
  sharedMail: [],

  notifications: [],
  viewedNotifications: {},

  history: [],

  commentsByTaskId: {},

  workspaces: [],
  inviterRolesByReceiver: {},
  tagEmailSuggestions: [],

  timerByTodoId: {},

  analyticsByWorkspace: {},

  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetAppState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ---------------- Auth ----------------
    builder
      .addCase(signupThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.user = action.payload?.user ?? action.payload;
        state.token = action.payload?.token ?? null;
      })
      .addCase(signinThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.user = action.payload?.user ?? action.payload;
        state.token = action.payload?.token ?? null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });

    // ---------------- Todos ----------------
    builder
      .addCase(getTodosThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.todos = action.payload || [];
      })
      .addCase(getTodoByIdThunk.fulfilled, (state, action: PayloadAction<any>) => {
        const todo = action.payload;
        if (todo && todo._id) state.todoById[todo._id] = todo;
      })
      .addCase(createTodoThunk.fulfilled, (state, action: PayloadAction<any>) => {
        const todo = action.payload;
        if (todo) state.todos.push(todo);
      })
      .addCase(updateTodoThunk.fulfilled, (state, action: PayloadAction<any>) => {
        const updated = action.payload;
        state.todos = state.todos.map((t) => (t._id === updated?._id ? updated : t));
        if (updated?._id) state.todoById[updated._id] = updated;
      })
      .addCase(deleteTodoThunk.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        const { id } = action.payload;
        state.todos = state.todos.filter((t) => t._id !== id);
        delete state.todoById[id];
      })
      .addCase(bulkCompleteThunk.fulfilled, (state, action: PayloadAction<{ ids: string } | any>) => {
        const ids: string[] = (action.payload?.ids as string[]) || [];
        state.todos = state.todos.map((t) => (ids.includes(t._id) ? { ...t, status: "completed" } : t));
      })
      .addCase(bulkDeleteThunk.fulfilled, (state, action: PayloadAction<{ ids: string[] } | any>) => {
        const ids: string[] = (action.payload?.ids as string[]) || [];
        state.todos = state.todos.filter((t) => !ids.includes(t._id));
        ids.forEach((id) => delete state.todoById[id]);
      })
      .addCase(importantUpdateThunk.fulfilled, (state, action: PayloadAction<{ id: string; data: any }>) => {
        const { id } = action.payload;
        state.todos = state.todos.map((t) => (t._id === id ? { ...t, isImportant: action.payload?.data?.isImprtant ?? action.payload?.data?.isImportant } : t));
      })
      .addCase(archiveTodoThunk.fulfilled, (state, action: PayloadAction<{ id: string; data: any }>) => {
        const { id } = action.payload;
        state.todos = state.todos.map((t) => (t._id === id ? { ...t, archived: true } : t));
      });

    // ------------- Checklist (Todo) -------------
    builder
      .addCase(getChecklistItemsThunk.fulfilled, (state, action: PayloadAction<{ todoId: string; items: any[] }>) => {
        const { todoId, items } = action.payload;
        state.checklistByTodoId[todoId] = items || [];
      })
      .addCase(createChecklistItemThunk.fulfilled, (state, action: PayloadAction<{ todoId: string; item: any }>) => {
        const { todoId, item } = action.payload;
        state.checklistByTodoId[todoId] = [...(state.checklistByTodoId[todoId] || []), item];
      })
      .addCase(updateChecklistItemThunk.fulfilled, (state, action: PayloadAction<{ checklistItemId: string; item: any; todoId?: string }>) => {
        const { todoId, item, checklistItemId } = action.payload;
        if (todoId && state.checklistByTodoId[todoId]) {
          state.checklistByTodoId[todoId] = state.checklistByTodoId[todoId].map((it: any) => (it._id === checklistItemId ? item : it));
        }
      })
      .addCase(deleteChecklistItemThunk.fulfilled, (state, action: PayloadAction<{ checklistItemId: string; todoId?: string }>) => {
        const { todoId, checklistItemId } = action.payload;
        if (todoId && state.checklistByTodoId[todoId]) {
          state.checklistByTodoId[todoId] = state.checklistByTodoId[todoId].filter((it: any) => it._id !== checklistItemId);
        }
      });

    // ------------- Workdata & Work Checklist -------------
    builder
      .addCase(workDataThunk.fulfilled, (state, action: PayloadAction<{ id: string; userId: string; data: any }>) => {
        state.workDataById[action.payload.id] = action.payload.data;
      })
      .addCase(workDataUpdateThunk.fulfilled, (state, action: PayloadAction<{ id: string; data: any }>) => {
        state.workDataById[action.payload.id] = action.payload.data;
      })
      .addCase(workDeleteThunk.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        delete state.workDataById[action.payload.id];
      })
      .addCase(getWorkChecklistDataThunk.fulfilled, (state, action: PayloadAction<{ id: string; userId: string; items: any[] }>) => {
        state.workChecklistById[action.payload.id] = action.payload.items || [];
      })
      .addCase(workChecklistUpdateThunk.fulfilled, (state, action: PayloadAction<{ id: string; item: any; parentId?: string }>) => {
        const parentId = action.payload.parentId ?? "default";
        const list = state.workChecklistById[parentId] || [];
        state.workChecklistById[parentId] = list.map((it: any) => (it._id === action.payload.id ? action.payload.item : it));
      })
      .addCase(workChecklistDeleteThunk.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        Object.keys(state.workChecklistById).forEach((key) => {
          state.workChecklistById[key] = (state.workChecklistById[key] || []).filter((it: any) => it._id !== action.payload.id);
        });
      });

    // ---------------- Sharing & Mail ----------------
    builder
      // .addCase(shareTaskThunk.fulfilled, (state, action: PayloadAction<any>) => {
      //   // no direct structure; you can push to a messages array if needed
      // })
      .addCase(allMailThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.sharedMail = action.payload || [];
      })
      .addCase(getSharedThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.sharedItems = action.payload || [];
      })
      .addCase(postSharedThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.sharedItems.push(action.payload);
      })
      .addCase(deleteSharedThunk.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.sharedItems = state.sharedItems.filter((x: any) => x._id !== action.payload.id);
      });

    // ---------------- Notifications ----------------
    builder
      .addCase(getNotificationsThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.notifications = action.payload || [];
      })
      .addCase(createNotificationThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.notifications.push(action.payload);
      })
      .addCase(deleteNotificationThunk.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.notifications = state.notifications.filter((n: any) => n._id !== action.payload.id);
      })
      .addCase(viewNotificationThunk.fulfilled, (state, action: PayloadAction<{ id: string; data: any }>) => {
        state.viewedNotifications[action.payload.id] = action.payload.data;
      });

    // ---------------- History + CSV ----------------
    builder
      .addCase(historyDetailsThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.history = action.payload || [];
      })
      .addCase(deleteHistoryThunk.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.history = state.history.filter((h: any) => h._id !== action.payload.id);
      })
      .addCase(createCsvThunk.fulfilled, (_state, _action) => {
        // No default state change
      });

    // ---------------- Comments ----------------
    builder
      .addCase(showAllCommentThunk.fulfilled, (state, action: PayloadAction<{ taskId: string; items: any[] }>) => {
        state.commentsByTaskId[action.payload.taskId] = action.payload.items || [];
      })
      .addCase(createCommentThunk.fulfilled, (state, action: PayloadAction<{ taskId: string; item: any }>) => {
        const list = state.commentsByTaskId[action.payload.taskId] || [];
        state.commentsByTaskId[action.payload.taskId] = [...list, action.payload.item];
      })
      .addCase(deleteCommentThunk.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        Object.keys(state.commentsByTaskId).forEach((taskId) => {
          state.commentsByTaskId[taskId] = (state.commentsByTaskId[taskId] || []).filter((c: any) => c._id !== action.payload.id);
        });
      })
      .addCase(updateCommentThunk.fulfilled, (state, action: PayloadAction<{ id: string; item: any; taskId?: string }>) => {
        const taskId = action.payload.taskId;
        if (taskId && state.commentsByTaskId[taskId]) {
          state.commentsByTaskId[taskId] = state.commentsByTaskId[taskId].map((c: any) => (c._id === action.payload.id ? action.payload.item : c));
        }
      });

    // ---------------- Workspace ----------------
    builder
      .addCase(createWorkspaceThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.workspaces.push(action.payload);
      })
      .addCase(getWorkspaceThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.workspaces = action.payload || [];
      })
      .addCase(deleteWorkspaceThunk.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.workspaces = state.workspaces.filter((ws: any) => ws._id !== action.payload.id);
      })
      .addCase(inviteUserThunk.fulfilled, (_state, _action) => {
        // could push to an invites list
      })
      .addCase(acceptInviteThunk.fulfilled, (_state, _action) => {
        // no default state change
      })
      .addCase(inviterRoleThunk.fulfilled, (state, action: PayloadAction<{ receiverId: string; data: any }>) => {
        state.inviterRolesByReceiver[action.payload.receiverId] = action.payload.data;
      })
      .addCase(tagEmailThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.tagEmailSuggestions = action.payload || [];
      });

    // ---------------- Timer ----------------
    builder
      .addCase(startTimeThunk.fulfilled, (state, action: PayloadAction<{ id: string; data: any }>) => {
        state.timerByTodoId[action.payload.id] = action.payload.data;
      })
      .addCase(stopTimeThunk.fulfilled, (state, action: PayloadAction<{ id: string; data: any }>) => {
        state.timerByTodoId[action.payload.id] = action.payload.data;
      })
      .addCase(resetTimeThunk.fulfilled, (state, action: PayloadAction<{ id: string; data: any }>) => {
        state.timerByTodoId[action.payload.id] = action.payload.data;
      })
      .addCase(endTimeThunk.fulfilled, (state, action: PayloadAction<{ id: string; data: any }>) => {
        state.timerByTodoId[action.payload.id] = action.payload.data;
      })
      .addCase(getTimerByTodoThunk.fulfilled, (state, action: PayloadAction<{ id: string; data: any }>) => {
        state.timerByTodoId[action.payload.id] = action.payload.data;
      });

    // --------------- Analytics ---------------
    builder.addCase(allWorkspaceStatusThunk.fulfilled, (state, action: PayloadAction<{ workspaceId: string; data: any }>) => {
      state.analyticsByWorkspace[action.payload.workspaceId] = action.payload.data;
    });

    // ---------------- Global loading/error ----------------
    builder.addMatcher(
      (action) => action.type.startsWith("app/") && action.type.endsWith("/skip"),
      (state) => state
    );

    builder.addMatcher((action) => action.type.endsWith("/pending"), (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addMatcher((action) => action.type.endsWith("/fulfilled"), (state) => {
      state.loading = false;
    });

    builder.addMatcher((action) => action.type.endsWith("/rejected"), (state, action: any) => {
      state.loading = false;
      state.error = action.payload || action.error?.message || "Something went wrong";
    });
  },
});

export const { clearError, resetAppState } = appSlice.actions;
export default appSlice.reducer;

// Re-export thunks for convenient imports
export const thunks = {
  // Auth
  signupThunk,
  signinThunk,
  logoutThunk,
  // Todos
  getTodosThunk,
  getTodoByIdThunk,
  createTodoThunk,
  updateTodoThunk,
  deleteTodoThunk,
  bulkCompleteThunk,
  bulkDeleteThunk,
  importantUpdateThunk,
  archiveTodoThunk,
  // Share / Mail
  shareTaskThunk,
  allMailThunk,
  getSharedThunk,
  postSharedThunk,
  deleteSharedThunk,
  // Notifications
  getNotificationsThunk,
  createNotificationThunk,
  deleteNotificationThunk,
  viewNotificationThunk,
  // History / CSV
  historyDetailsThunk,
  deleteHistoryThunk,
  createCsvThunk,
  // Checklist (Todo)
  getChecklistItemsThunk,
  createChecklistItemThunk,
  updateChecklistItemThunk,
  deleteChecklistItemThunk,
  // Workdata & Work Checklist
  workDataThunk,
  workDataUpdateThunk,
  workDeleteThunk,
  getWorkChecklistDataThunk,
  workChecklistUpdateThunk,
  workChecklistDeleteThunk,
  // Invited
  createdInvitedThunk,
  getInvitedThunk,
  // Comments
  showAllCommentThunk,
  createCommentThunk,
  deleteCommentThunk,
  updateCommentThunk,
  // Workspace
  createWorkspaceThunk,
  getWorkspaceThunk,
  deleteWorkspaceThunk,
  inviteUserThunk,
  acceptInviteThunk,
  inviterRoleThunk,
  tagEmailThunk,
  // Timer
  startTimeThunk,
  stopTimeThunk,
  resetTimeThunk,
  endTimeThunk,
  getTimerByTodoThunk,
  // Analytics
  allWorkspaceStatusThunk,
};
