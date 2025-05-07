import { useState, useEffect } from "react";
import { axiosClient } from "../api/axios";

export default function Mentor() {
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    axiosClient
      .get("/mentors")
      .then((res) => setMentors(res.data))
      .catch((err) => console.error("error fetching mentors:", err));
  }, []);

  const handleBookSession = (mentorId) => {
    window.location.href = `/login?redirect=/book-session/${mentorId}`;
  };

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      searchQuery === "" ||
      mentor.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.domaine.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty =
      specialty === "all" || mentor.domaine === specialty;

    return matchesSearch && matchesSpecialty;
  });

  const specialties = Array.from(new Set(mentors.map((m) => m.domaine)));

  const totalPages = Math.ceil(filteredMentors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMentors = filteredMentors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          className="border border-gray-300 rounded px-4 py-2 flex items-center"
          onClick={() => {}}
        >
          <span className="mr-2">Filter</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
          </svg>
        </button>
      </div>

      {/* Filters - Left sidebar */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Category</h3>
            </div>
            <div className="space-y-2">
              <select
                value={specialty}
                onChange={(e) => {
                  setSpecialty(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border rounded px-3 py-2"
              >
                <option value="all">All Categories</option>
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Search</h3>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Search by name or specialty"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setSearchQuery("");
              setSpecialty("all");
              setCurrentPage(1);
            }}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Reset Filters
          </button>
        </div>

        {/* Mentors Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={`http://localhost:80/storage/${mentor.image_path}`}
                    alt={mentor.user.name}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/400/320";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{mentor.user.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{mentor.domaine}</p>
                  <p className="text-gray-500 text-xs">{mentor.university}</p>

                  {mentor.competences && (
                    <div className="mt-3">
                      <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded font-medium">
                        {mentor.competences}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => handleBookSession(mentor.id)}
                    className="mt-3 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page
                      ? "bg-green-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No mentors match your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSpecialty("all");
                  setCurrentPage(1);
                }}
                className="mt-2 text-blue-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
