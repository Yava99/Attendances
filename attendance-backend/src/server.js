import fastify from "fastify";
import cors from "@fastify/cors";
import { studentsRoutes } from "./routes/students.routes.js";
import { coursesRoutes } from "./routes/courses.routes.js";
import { sessionsRoutes } from "./routes/sessions.routes.js";
import { attendancesRoutes } from "./routes/attendances.routes.js";
import { RecordNotFoundError } from "./errors/RecordNotFoundError.js";

const app = fastify({ logger: true });

// Routes
await app.register(studentsRoutes);
await app.register(coursesRoutes);
await app.register(sessionsRoutes);
await app.register(attendancesRoutes);
await app.register(cors, {
  origin: ["http://localhost:5173"], // en dev
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});


// Error handling
app.setErrorHandler((error, req, reply) => {
  // Domain errors
  if (error instanceof RecordNotFoundError) {
    reply.code(404).send({ error: error.message });
    return;
  }

  // Service-level “typed” errors
  if (error?.code === "BAD_REQUEST") {
    reply.code(400).send({ error: error.message });
    return;
  }

  if (error?.code === "EMAIL_ALREADY_EXISTS") {
    reply.code(409).send({ error: error.message });
    return;
  }

  if (error?.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
    reply.code(400).send({ error: "Invalid reference (foreign key)" });
    return;
  }


  // Unexpected
  req.log.error(error);
  reply.code(500).send({ error: "INTERNAL_SERVER_ERROR" });
});

app.listen({ port: 3000 });
