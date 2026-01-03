import { RecordNotFoundError } from "../errors/RecordNotFoundError.js";
import * as repo from "../repositories/students.repo.js";

export function listStudents() {
  return repo.findAllStudents();
}

export function getStudent(id) {
  const student = repo.findStudentById(id);
  if (!student) throw new RecordNotFoundError(`Student ${id} not found`);
  return student;
}

export function createStudent({ name, email }) {
  if (!name || !email) {
    const err = new Error("name and email are required");
    err.code = "BAD_REQUEST";
    throw err;
  }

  try {
    const result = repo.insertStudent({ name, email });
    return repo.findStudentById(Number(result.lastInsertRowid));
  } catch (err) {
    if (err?.code === "SQLITE_CONSTRAINT_UNIQUE") {
      const e = new Error("email already exists");
      e.code = "EMAIL_ALREADY_EXISTS";
      throw e;
    }
    throw err;
  }
}

export function updateStudent(id, { name, email }) {
  if (!name || !email) {
    const err = new Error("name and email are required");
    err.code = "BAD_REQUEST";
    throw err;
  }

  try {
    const result = repo.updateStudentById(id, { name, email });
    if (result.changes === 0) throw new RecordNotFoundError(`Student ${id} not found`);
    return repo.findStudentById(id);
  } catch (err) {
    if (err?.code === "SQLITE_CONSTRAINT_UNIQUE") {
      const e = new Error("email already exists");
      e.code = "EMAIL_ALREADY_EXISTS";
      throw e;
    }
    throw err;
  }
}

export function removeStudent(id) {
  const result = repo.deleteStudentById(id);
  if (result.changes === 0) throw new RecordNotFoundError(`Student ${id} not found`);
}
