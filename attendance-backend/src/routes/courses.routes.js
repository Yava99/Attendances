import * as service from "../services/courses.service.js";

export async function coursesRoutes(app) {
  app.get("/courses", async (req, reply) => {
    const courses = service.listCourses();
    reply.send(courses);
  });

  app.get("/courses/:id", async (req, reply) => {
    const id = Number(req.params.id);
    const course = service.getCourse(id);
    reply.send(course);
  });

  app.post("/courses", async (req, reply) => {
    const course = service.createCourse(req.body ?? {});
    reply.code(201).send(course);
  });

  app.put("/courses/:id", async (req, reply) => {
    const id = Number(req.params.id);
    const course = service.updateCourse(id, req.body ?? {});
    reply.send(course);
  });

  app.delete("/courses/:id", async (req, reply) => {
    const id = Number(req.params.id);
    service.removeCourse(id);
    reply.code(204).send();
  });
}
