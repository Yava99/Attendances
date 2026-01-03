import * as service from "../services/students.service.js";

export async function studentsRoutes(app) {
  app.get("/students", async (req, reply) => {
    const students = service.listStudents();
    reply.send(students);
  });

  app.get("/students/:id", async (req, reply) => {
    const id = Number(req.params.id);
    const student = service.getStudent(id);
    reply.send(student);
  });

  app.post("/students", async (req, reply) => {
    const student = service.createStudent(req.body ?? {});
    reply.code(201).send(student);
  });

  app.put("/students/:id", async (req, reply) => {
    const id = Number(req.params.id);
    const student = service.updateStudent(id, req.body ?? {});
    reply.send(student);
  });

  app.delete("/students/:id", async (req, reply) => {
    const id = Number(req.params.id);
    service.removeStudent(id);
    reply.code(204).send();
  });
}
