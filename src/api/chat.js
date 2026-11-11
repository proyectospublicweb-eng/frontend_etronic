import instanceAxios from "./axios.js";

export const getVisitorChatSessionRequest = (sessionKey) =>
  instanceAxios.get(`/chat/session/${encodeURIComponent(sessionKey)}`);

export const sendVisitorChatMessageRequest = (payload) =>
  instanceAxios.post("/chat/messages", payload);
