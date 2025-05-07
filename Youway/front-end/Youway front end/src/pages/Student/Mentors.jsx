import { axiosClient } from "../../api/axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function Mentor() {
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    axiosClient
      .get("/mentors")
      .then((res) => setMentors(res.data))
      .catch((err) => console.error("error fetching mentors:", err));
  }, []);

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

  const resetFilters = () => {
    setSearchQuery("");
    setSpecialty("all");
    setCurrentPage(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom ou spécialité"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full border rounded px-3 py-2"
        />

        <select
          value={specialty}
          onChange={(e) => {
            setSpecialty(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-60 border rounded px-3 py-2"
        >
          <option value="all">Toutes les spécialités</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <button
          onClick={resetFilters}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white border-r-8 border-amber-500 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={`http://localhost:80/storage/${mentor.image_path}`}
                alt={mentor.user.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="p-5">
              <div className="flex items-center gap-1 text-yellow-500 mb-2">
                <FaStar className="h-5 w-5" />
                <span className="font-medium">
                  {(mentor.rating || 4.5).toFixed(1)}
                </span>
              </div>

              <h3 className="font-semibold text-lg">{mentor.user.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{mentor.domaine}</p>
              <p className="text-gray-500 text-xs">{mentor.university}</p>

              <div className="mt-3">
                <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded font-medium">
                  {mentor.competences}
                </span>
              </div>
            </div>

            <div className="px-5 pb-5 pt-0 space-y-2">
              <Link
                to={`/mentor-detail/${mentor.id}`}
                className="block w-full text-center bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition"
              >
                Voir le profil
              </Link>
              <Link
                to={`/book-session/${mentor.id}`}
                className="block w-full text-center bg-green-500 text-white font-medium py-2 rounded hover:bg-green-600 transition"
              >
                Planifier une session
              </Link>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Précédent
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page ? "bg-amber-500 text-white" : "hover:bg-gray-200"
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
            Suivant
          </button>
        </div>
      )}

      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Aucun mentor ne correspond à votre recherche.
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 text-blue-600 hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
