import { db } from "../db/db.js";

export function findAllCourses() {
  return db.prepare("SELECT * FROM courses").all();
}

export function findCourseById(id) {
  return db.prepare("SELECT * FROM courses WHERE id = ?").get(id);
}

export function insertCourse({ title, description }) {
  return db.prepare("INSERT INTO courses (title, description) VALUES (?, ?)").run(title, description);
}

export function updateCourseById(id, { title, description }) {
  return db.prepare("UPDATE courses SET title = ?, description = ? WHERE id = ?").run(title, description, id);
}

export function deleteCourseById(id) {
  return db.prepare("DELETE FROM courses WHERE id = ?").run(id);
}
