import { useState, useEffect } from "react"
import { axiosClient } from "../../api/axios"
import { FaCheck, FaTimes, FaCheckDouble, FaExternalLinkAlt, FaFilter, FaSearch } from "react-icons/fa"

export default function SessionManage() {
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get("/sessions")
      setSessions(response.data.filter(s => s.student_id !== null))
    } catch (err) {
      console.error("Fetch sessions error:", err.response?.data)
      setError(err.response?.data?.message || "Error loading sessions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleAction = async (id, action) => {
    try {
      if (action === "accept") {
        const { data: session } = await axiosClient.get(`/sessions/${id}`)
        const jitsiLink = `https://meet.jit.si/youway-session-${id}-${Date.now()}`

        await axiosClient.put(`/sessions/${id}/accept`, { call_link: jitsiLink })

        await axiosClient.post("/notifications", {
          recipient_id: session.student_id,
          title: "Session Acceptée",
          message: `Votre session a été acceptée. Cliquez ici pour rejoindre l'appel: ${jitsiLink}`,
          link: jitsiLink,
          type: "session_accepted"
        })

      } else {
        await axiosClient.put(`/sessions/${id}/${action}`)
      }
      fetchSessions()
    } catch (err) {
      console.error("Action or notification error:", err.response?.data)
      setError(err.response?.data?.message || `Failed to ${action} session`)
    }
  }

  const filteredSessions = sessions.filter(s => {
    const matchesFilter = filterStatus === "all" || s.status === filterStatus
    const matchesSearch =
      searchTerm === "" ||
      s.student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toString().includes(searchTerm)
    return matchesFilter && matchesSearch
  })

  const formatDateTime = str => {
    const d = new Date(str)
    return isNaN(d)
      ? "Invalid date"
      : d.toLocaleString(undefined, {
          year: "numeric", month: "short", day: "numeric",
          hour: "2-digit", minute: "2-digit"
        })
  }

  const badgeClass = {
    pending:   "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    accepted:  "bg-blue-100 text-blue-800",
    rejected:  "bg-red-100 text-red-800",
    default:   "bg-gray-100 text-gray-800"
  }

  const getStatusBadge = status => {
    const cls = badgeClass[status] || badgeClass.default
    const labels = { pending: "En attente", completed: "Complété", accepted: "Accepté", rejected: "Rejeté" }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium ${cls}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Sessions</h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute inset-y-0 left-3 my-auto text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par étudiant ou numéro de session..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 bg-white focus:outline-none focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="md:w-64 relative">
          <FaFilter className="absolute inset-y-0 left-3 my-auto text-gray-400" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 bg-white focus:outline-none focus:border-blue-500 sm:text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="completed">Complété</option>
            <option value="accepted">Accepté</option>
            <option value="rejected">Rejeté</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {["ID","Étudiant","Horaire","Statut","Demande","Actions"].map(h => (
                <th key={h} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                  </div>
                  <p className="mt-2">Chargement des sessions...</p>
                </td>
              </tr>
            ) : filteredSessions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">Aucune session trouvée</td>
              </tr>
            ) : filteredSessions.map(session => (
              <tr key={session.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{session.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.student?.user?.name || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{formatDateTime(session.start_time)}</div>
                  <div className="text-xs text-gray-400">jusqu'à</div>
                  <div>{formatDateTime(session.end_time)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(session.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {session.request_status}
                  {session.request_status === "accepted" && session.call_link && (
                    <a href={session.call_link} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center text-blue-600 hover:text-blue-800">
                      <FaExternalLinkAlt className="h-3 w-3 mr-1" /><span>Rejoindre</span>
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button onClick={() => handleAction(session.id, "accept")}   className="px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200"><FaCheck /></button>
                    <button onClick={() => handleAction(session.id, "reject")}   className="px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200"><FaTimes /></button>
                    <button onClick={() => handleAction(session.id, "complete")} className="px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200"><FaCheckDouble /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
