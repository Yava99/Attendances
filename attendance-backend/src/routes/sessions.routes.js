import * as service from "../services/sessions.service.js";

export async function sessionsRoutes(app) {
  app.get("/sessions", async (req, reply) => {
    const sessions = service.listSessions();
    reply.send(sessions);
  });

  app.get("/courses/:courseId/sessions", async (req, reply) => {
    const { courseId } = req.params;
    const sessions = service.listSessionsByCourse(courseId);
    reply.send(sessions);
  });

  app.post("/courses/:courseId/sessions", async (req, reply) => {
    const { courseId } = req.params;
    const session = service.createSessionForCourse(courseId, req.body ?? {});
    reply.code(201).send(session);
  });

  app.get("/sessions/:id", async (req, reply) => {
    const id = Number(req.params.id);
    const session = service.getSession(id);
    reply.send(session);
  });

  app.put("/sessions/:id", async (req, reply) => {
    const id = Number(req.params.id);
    const session = service.updateSession(id, req.body ?? {});
    reply.send(session);
  });

  app.delete("/sessions/:id", async (req, reply) => {
    const id = Number(req.params.id);
    service.removeSession(id);
    reply.code(204).send();
  });
}
