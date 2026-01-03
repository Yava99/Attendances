import { db } from "../db/db.js";

export function findAllSessions() {
  return db.prepare("SELECT * FROM sessions").all();
}

export function findSessionById(id) {
  return db.prepare("SELECT * FROM sessions WHERE id = ?").get(id);
}

export function findSessionsByCourseId(courseId) {
  return db.prepare("SELECT * FROM sessions WHERE course_id = ? ORDER BY starts_at").all(courseId);
}

export function insertSession({ starts_at, course_id }) {
  return db.prepare("INSERT INTO sessions (starts_at, course_id) VALUES (?, ?)").run(starts_at, course_id);
}

export function updateSessionById(id, { starts_at, course_id }) {
  return db.prepare("UPDATE sessions SET starts_at = ?, course_id = ? WHERE id = ?").run(starts_at, course_id, id);
}

export function deleteSessionById(id) {
  return db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
}
