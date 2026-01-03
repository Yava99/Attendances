const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function http(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });

  // Ton backend renvoie sûrement { statusCode, error, message } en cas d’erreur
  if (!res.ok) {
    let payload = null;
    try { payload = await res.json(); } catch {}
    const msg = payload?.message ?? `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  // 204 no content
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  listSessions: () => http("/sessions"),
  listStudents: () => http("/students"),

  getAttendances: (sessionId) => http(`/sessions/${sessionId}/attendances`),
  getAttendanceStats: (sessionId) => http(`/sessions/${sessionId}/attendances/stats`),
  setAttendance: (sessionId, studentId, status) =>
    http(`/sessions/${sessionId}/attendances/${studentId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};
