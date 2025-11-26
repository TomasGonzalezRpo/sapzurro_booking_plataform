import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, X, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/rutas";

const RutaManagement = () => {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    duracion: "",
    observaciones: "",
    valor: "",
  });

  useEffect(() => {
    fetchRutas();
  }, []);

  const fetchRutas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("sapzurro_token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRutas(response.data.data || []);
      setError("");
    } catch (err) {
      setError("Error al cargar rutas: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nombre || !formData.duracion || !formData.valor) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      const token = localStorage.getItem("sapzurro_token");
      const headers = { Authorization: `Bearer ${token}` };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, { headers });
        setSuccess("Ruta actualizada exitosamente");
      } else {
        await axios.post(API_URL, formData, { headers });
        setSuccess("Ruta creada exitosamente");
      }

      resetForm();
      fetchRutas();
    } catch (err) {
      setError("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (ruta) => {
    setEditingId(ruta.id_ruta);
    setFormData(ruta);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
      try {
        const token = localStorage.getItem("sapzurro_token");
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Ruta eliminada exitosamente");
        fetchRutas();
      } catch (err) {
        setError("Error: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      duracion: "",
      observaciones: "",
      valor: "",
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Rutas</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Ruta</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando rutas...</p>
        </div>
      ) : rutas.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No hay rutas registradas</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Observaciones
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {rutas.map((ruta) => (
                <tr key={ruta.id_ruta} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {ruta.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {ruta.duracion}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {ruta.observaciones || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    ${ruta.valor.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2 flex">
                    <button
                      onClick={() => handleEdit(ruta)}
                      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ruta.id_ruta)}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingId ? "Editar" : "Nueva"} Ruta
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre de la ruta"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                name="duracion"
                placeholder="Duración (ej: 2 horas, 3 días)"
                value={formData.duracion}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
              <textarea
                name="observaciones"
                placeholder="Observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                rows="3"
              />
              <input
                type="number"
                name="valor"
                placeholder="Valor"
                value={formData.valor}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all font-semibold"
                >
                  {editingId ? "Actualizar" : "Crear"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-all font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RutaManagement;
