import { useEffect, useMemo, useState } from "react";
import { api } from "./api";

function classNames(...x) {
  return x.filter(Boolean).join(" ");
}

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const [attendanceItems, setAttendanceItems] = useState([]); // [{id,status,student_id,session_id}]
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, rate: 0 });

  const [loading, setLoading] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [error, setError] = useState("");

  const studentsById = useMemo(() => {
    const map = new Map();
    for (const s of students) map.set(s.id, s);
    return map;
  }, [students]);

  async function loadBase() {
    setLoading(true);
    setError("");
    try {
      const [sess, studs] = await Promise.all([api.listSessions(), api.listStudents()]);
      setSessions(sess);
      setStudents(studs);

      // auto-select first session
      if (sess?.length) setSelectedSessionId(sess[0].id);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadAttendance(sessionId) {
    if (!sessionId) return;
    setLoadingAttendance(true);
    setError("");
    try {
      const [att, st] = await Promise.all([
        api.getAttendances(sessionId),
        api.getAttendanceStats(sessionId),
      ]);
      setAttendanceItems(att.items ?? []);
      setStats({ total: st.total, present: st.present, absent: st.absent, rate: st.rate });
    } catch (e) {
      setAttendanceItems([]);
      setStats({ total: 0, present: 0, absent: 0, rate: 0 });
      setError(e.message);
    } finally {
      setLoadingAttendance(false);
    }
  }

  useEffect(() => {
    loadBase();
  }, []);

  useEffect(() => {
    loadAttendance(selectedSessionId);
  }, [selectedSessionId]);

  // Merge students with attendance (si un student n’a pas encore de ligne attendance, on le met à absent par défaut)
  const rows = useMemo(() => {
    const attMap = new Map();
    for (const a of attendanceItems) attMap.set(a.student_id, a);

    return students.map((s) => {
      const a = attMap.get(s.id);
      return {
        student: s,
        attendanceId: a?.id ?? null,
        status: a ? Boolean(a.status) : false,
      };
    });
  }, [students, attendanceItems]);

  async function toggleStudent(studentId, nextStatus) {
    if (!selectedSessionId) return;
    setError("");

    // Optimistic UI
    setAttendanceItems((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((x) => x.student_id === studentId && x.session_id === selectedSessionId);
      if (idx >= 0) copy[idx] = { ...copy[idx], status: nextStatus ? 1 : 0 };
      return copy;
    });

    try {
      await api.setAttendance(selectedSessionId, studentId, nextStatus);
      // Refresh stats (cheap)
      const st = await api.getAttendanceStats(selectedSessionId);
      setStats({ total: st.total, present: st.present, absent: st.absent, rate: st.rate });
    } catch (e) {
      setError(e.message);
      // Recharger la vérité
      await loadAttendance(selectedSessionId);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Attendance</h1>
            <p className="text-sm text-slate-400">Sessions • Students • Attendance tracking</p>
          </div>
          <button
            onClick={loadBase}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-sm"
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sessions */}
        <section className="md:col-span-1 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="font-semibold mb-3">Sessions</h2>

          {loading ? (
            <p className="text-slate-400 text-sm">Loading…</p>
          ) : sessions.length === 0 ? (
            <p className="text-slate-400 text-sm">No sessions.</p>
          ) : (
            <ul className="space-y-2">
              {sessions.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => setSelectedSessionId(s.id)}
                    className={classNames(
                      "w-full text-left rounded-lg px-3 py-2 border",
                      selectedSessionId === s.id
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-800 hover:bg-slate-800/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Session #{s.id}</span>
                      <span className="text-xs text-slate-400">course_id: {s.course_id}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      starts_at: {s.starts_at}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Attendance */}
        <section className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold">Attendance</h2>
              <p className="text-sm text-slate-400">
                Session {selectedSessionId ? `#${selectedSessionId}` : ""}
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm">
                <div className="text-slate-400 text-xs">Total</div>
                <div className="font-semibold">{stats.total}</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm">
                <div className="text-slate-400 text-xs">Present</div>
                <div className="font-semibold">{stats.present}</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm">
                <div className="text-slate-400 text-xs">Absent</div>
                <div className="font-semibold">{stats.absent}</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm">
                <div className="text-slate-400 text-xs">Rate</div>
                <div className="font-semibold">{Math.round((stats.rate ?? 0) * 100)}%</div>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-800 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-950/40 text-slate-300">
                <tr>
                  <th className="text-left px-3 py-2">Student</th>
                  <th className="text-left px-3 py-2">Email</th>
                  <th className="text-right px-3 py-2">Present</th>
                </tr>
              </thead>
              <tbody>
                {loadingAttendance ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-400" colSpan={3}>
                      Loading attendance…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-slate-400" colSpan={3}>
                      No students.
                    </td>
                  </tr>
                ) : (
                  rows.map(({ student, status }) => (
                    <tr key={student.id} className="border-t border-slate-800">
                      <td className="px-3 py-2">
                        <div className="font-medium">{student.name}</div>
                        <div className="text-xs text-slate-500">id: {student.id}</div>
                      </td>
                      <td className="px-3 py-2 text-slate-300">{student.email}</td>
                      <td className="px-3 py-2 text-right">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-indigo-500"
                            checked={status}
                            onChange={(e) => toggleStudent(student.id, e.target.checked)}
                          />
                        </label>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Toggle = PUT /sessions/{selectedSessionId ?? ":id"}/attendances/:studentId
          </p>
        </section>
      </main>
    </div>
  );
}
