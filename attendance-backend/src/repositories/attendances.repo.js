import { db } from "../db/db.js";

export function findAttendancesBySessionId(sessionId) {
  return db
    .prepare(
      `
      SELECT id, status, student_id, session_id
      FROM attendances
      WHERE session_id = ?
      ORDER BY student_id ASC
      `
    )
    .all(sessionId);
}

export function findAttendanceBySessionAndStudent(sessionId, studentId) {
  return db
    .prepare(
      `
      SELECT id, status, student_id, session_id
      FROM attendances
      WHERE session_id = ? AND student_id = ?
      `
    )
    .get(sessionId, studentId);
}

export function insertAttendance({ status, studentId, sessionId }) {
  return db
    .prepare(
      `
      INSERT INTO attendances (status, student_id, session_id)
      VALUES (?, ?, ?)
      `
    )
    .run(status ? 1 : 0, studentId, sessionId);
}

export function updateAttendanceStatusById(id, status) {
  return db
    .prepare(
      `
      UPDATE attendances
      SET status = ?
      WHERE id = ?
      `
    )
    .run(status ? 1 : 0, id);
}

export function countAttendancesBySessionId(sessionId) {
  return db
    .prepare(
      `
      SELECT COUNT(*) as total
      FROM attendances
      WHERE session_id = ?
      `
    )
    .get(sessionId);
}

export function countPresentBySessionId(sessionId) {
  return db
    .prepare(
      `
      SELECT COUNT(*) as present
      FROM attendances
      WHERE session_id = ? AND status = 1
      `
    )
    .get(sessionId);
}
