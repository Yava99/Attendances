import { RecordNotFoundError } from "../errors/RecordNotFoundError.js";
import * as repo from "../repositories/attendances.repo.js";

export function listAttendancesBySession(sessionId) {
  return repo.findAttendancesBySessionId(sessionId);
}

export function markAttendance(sessionId, studentId, { status }) {
  if (typeof status !== "boolean") {
    const err = new Error("status is required and must be boolean");
    err.code = "BAD_REQUEST";
    throw err;
  }

  const existing = repo.findAttendanceBySessionAndStudent(sessionId, studentId);

  if (existing) {
    const result = repo.updateAttendanceStatusById(existing.id, status);
    if (result.changes === 0) {
      throw new RecordNotFoundError(
        `Attendance not found for session ${sessionId} and student ${studentId}`
      );
    }
    return repo.findAttendanceBySessionAndStudent(sessionId, studentId);
  }

  const inserted = repo.insertAttendance({ status, studentId, sessionId });
  return repo.findAttendanceBySessionAndStudent(sessionId, studentId) ?? {
    id: Number(inserted.lastInsertRowid),
    status,
    student_id: studentId,
    session_id: sessionId,
  };
}

export function getAttendanceStats(sessionId) {
  const totalRow = repo.countAttendancesBySessionId(sessionId);
  const presentRow = repo.countPresentBySessionId(sessionId);

  const total = Number(totalRow?.total ?? 0);
  const present = Number(presentRow?.present ?? 0);
  const absent = total - present;
  const rate = total === 0 ? 0 : present / total;

  return { total, present, absent, rate };
}
