import instanceAxios from "./axios.js";

export const getAdminStatsRequest = () => instanceAxios.get("/admin/stats");

export const getAdminUsersRequest = () => instanceAxios.get("/admin/users");

export const createAdminUserRequest = (payload) => instanceAxios.post("/admin/users", payload);

export const updateAdminUserRoleRequest = (id, rol) =>
  instanceAxios.patch(`/admin/users/${id}/role`, { rol });

export const deleteAdminUserRequest = (id) => instanceAxios.delete(`/admin/users/${id}`);

// Control & Soporte (Mensajes de Chat)
export const getAdminChatsRequest = () => instanceAxios.get("/admin/chats");

export const updateAdminChatRequest = (id, payload) =>
  instanceAxios.patch(`/admin/chats/${id}`, payload);

export const replyAdminChatRequest = (id, mensaje) =>
  instanceAxios.post(`/admin/chats/${id}/reply`, { mensaje });

export const deleteAdminChatRequest = (id) => instanceAxios.delete(`/admin/chats/${id}`);
