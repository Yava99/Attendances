import * as service from "../services/attendances.service.js";

export async function attendancesRoutes(app) {
  app.get("/sessions/:sessionId/attendances", async (req, reply) => {
    const sessionId = Number(req.params.sessionId);
    const items = service.listAttendancesBySession(sessionId);
    reply.send({ sessionId, items });
  });

  app.put("/sessions/:sessionId/attendances/:studentId", async (req, reply) => {
    const sessionId = Number(req.params.sessionId);
    const studentId = Number(req.params.studentId);

    const attendance = service.markAttendance(sessionId, studentId, req.body ?? {});
    reply.send(attendance);
  });

  app.get("/sessions/:sessionId/attendances/stats", async (req, reply) => {
    const sessionId = Number(req.params.sessionId);
    const stats = service.getAttendanceStats(sessionId);
    reply.send({ sessionId, ...stats });
  });
}
