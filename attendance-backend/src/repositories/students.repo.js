import { db } from "../db/db.js";

export function findAllStudents() {
  return db.prepare("SELECT id, name, email FROM students").all();
}

export function findStudentById(id) {
  return db.prepare("SELECT id, name, email FROM students WHERE id = ?").get(id);
}

export function findStudentByEmail(email) {
  return db.prepare("SELECT id, name, email FROM students WHERE email = ?").get(email);
}

export function insertStudent({ name, email }) {
  return db.prepare("INSERT INTO students (name, email) VALUES (?, ?)").run(name, email);
}

export function updateStudentById(id, { name, email }) {
  return db.prepare("UPDATE students SET name = ?, email = ? WHERE id = ?").run(name, email, id);
}

export function deleteStudentById(id) {
  return db.prepare("DELETE FROM students WHERE id = ?").run(id);
}
