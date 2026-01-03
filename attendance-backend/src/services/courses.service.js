import { RecordNotFoundError } from "../errors/RecordNotFoundError.js";
import * as repo from "../repositories/courses.repo.js";

export function listCourses() {
  return repo.findAllCourses();
}

export function getCourse(id) {
  const course = repo.findCourseById(id);
  if (!course) throw new RecordNotFoundError(`Course ${id} not found`);
  return course;
}

export function createCourse({ title, description }) {
  if (!title || !description) {
    const err = new Error("title and description are required");
    err.code = "BAD_REQUEST";
    throw err;
  }

  const result = repo.insertCourse({ title, description });
  return repo.findCourseById(Number(result.lastInsertRowid));
}

export function updateCourse(id, { title, description }) {
  if (!title || !description) {
    const err = new Error("title and description are required");
    err.code = "BAD_REQUEST";
    throw err;
  }

  try {
    const result = repo.updateCourseById(id, { title, description });
    if (result.changes === 0) throw new RecordNotFoundError(`Course ${id} not found`);
    return repo.findCourseById(id);
  } catch (err) {
    throw err;
  }
}

export function removeCourse(id) {
  const result = repo.deleteCourseById(id);
  if (result.changes === 0) throw new RecordNotFoundError(`Course ${id} not found`);
}
