import { useState, useEffect } from "react";
import { axiosClient } from "../../api/axios";

export default function SessionListWithActions() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");

  const fetchSessions = async () => {
    try {
      const response = await axiosClient.get("/sessions");
      setSessions(response.data);
    } catch (err) {
      console.error("eror fetching sessions:", err);
      setError("failed to load sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axiosClient.put(`/sessions/${id}/${action}`);
      fetchSessions();
    } catch (err) {
      console.error(`Error ${action} session:`, err);
      setError(`failed to ${action} session.`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Sessions</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Session #{session.id}
              </h3>
              <p className="text-gray-600">
  <strong>Student:</strong> {session.student?.user?.name || "N/A"}
</p>

              <p className="text-gray-600">
                <strong>Start:</strong>{" "}
                {new Date(session.start_time).toLocaleString()}
              </p>
              <p className="text-gray-600">
                <strong>End:</strong>{" "}
                {new Date(session.end_time).toLocaleString()}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded text-white text-xs ${
                    session.status === "pending"
                      ? "bg-yellow-500"
                      : session.status === "completed"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                >
                  {session.status}
                </span>
              </p>
              <p className="text-gray-600">
                <strong>Request Status:</strong> {session.request_status}
              </p>
              {session.request_status === "accepted" && (
  <a
    href={session.call_link}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-2 inline-block text-indigo-600 hover:underline text-sm"
  >
    Join Call
  </a>
)}

            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleAction(session.id, "accept")}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction(session.id, "reject")}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Reject
              </button>
              <button
                onClick={() => handleAction(session.id, "complete")}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              >
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>

      {sessions.length === 0 && !error && (
        <p className="text-gray-500 text-center mt-8">no sessions found</p>
      )}
    </div>
  );
}
