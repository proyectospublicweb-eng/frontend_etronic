import instanceAxios from "./axios.js";

export const savePlannerSubmissionRequest = (payload) =>
  instanceAxios.post("/planner/submissions", payload);
