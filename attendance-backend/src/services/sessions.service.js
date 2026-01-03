import { RecordNotFoundError } from "../errors/RecordNotFoundError.js";
import * as repo from "../repositories/sessions.repo.js";

export function listSessions() {
  return repo.findAllSessions();
}

export function listSessionsByCourse(courseId) {
  const cid = Number(courseId);
  if (!Number.isInteger(cid) || cid <= 0) {
    const err = new Error("valid courseId is required");
    err.code = "BAD_REQUEST";
    throw err;
  }
  return repo.findSessionsByCourseId(cid);
}

export function getSession(id) {
  const session = repo.findSessionById(id);
  if (!session) throw new RecordNotFoundError(`Session ${id} not found`);
  return session;
}

export function createSessionForCourse(courseId, { starts_at }) {
  const cid = Number(courseId);
  if (!starts_at || !Number.isInteger(cid) || cid <= 0) {
    const err = new Error("starts_at and valid courseId are required");
    err.code = "BAD_REQUEST";
    throw err;
  }

  const result = repo.insertSession({ starts_at, course_id: cid });
  return repo.findSessionById(Number(result.lastInsertRowid));
}

export function updateSession(id, { starts_at, course_id }) {
  const cid = Number(course_id);
  if (!starts_at || !Number.isInteger(cid) || cid <= 0) {
    const err = new Error("starts_at and valid course_id are required");
    err.code = "BAD_REQUEST";
    throw err;
  }

  const result = repo.updateSessionById(id, { starts_at, course_id: cid });
  if (result.changes === 0) throw new RecordNotFoundError(`Session ${id} not found`);
  return repo.findSessionById(id);
}

export function removeSession(id) {
  const result = repo.deleteSessionById(id);
  if (result.changes === 0) throw new RecordNotFoundError(`Session ${id} not found`);
}
