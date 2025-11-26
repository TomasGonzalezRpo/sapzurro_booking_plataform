import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, X, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/actividades";

const ActividadManagement = () => {
  const [actividades, setActividades] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [alojamientos, setAlojamientos] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id_persona: "",
    id_tipo_actividad: "",
    id_alojamiento: "",
    id_ruta: "",
    fecha: "",
    hora: "",
    observaciones: "",
    total_pagar: "",
    estado: "Pendiente",
  });

  const token = localStorage.getItem("sapzurro_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [actRes, persRes, tipRes, aloRes, rutRes] = await Promise.all([
        axios.get(API_URL, { headers }),
        axios.get("http://localhost:5000/api/personas", { headers }),
        axios.get("http://localhost:5000/api/tipos-actividad", { headers }),
        axios.get("http://localhost:5000/api/alojamientos", { headers }),
        axios.get("http://localhost:5000/api/rutas", { headers }),
      ]);

      setActividades(actRes.data.data || []);
      setPersonas(persRes.data || []);
      setTipos(tipRes.data.data || []);
      setAlojamientos(aloRes.data.data || []);
      setRutas(rutRes.data.data || []);
      setError("");
    } catch (err) {
      setError("Error al cargar datos: " + err.message);
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

    if (
      !formData.id_persona ||
      !formData.id_tipo_actividad ||
      !formData.id_ruta ||
      !formData.fecha ||
      !formData.hora ||
      !formData.total_pagar
    ) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, { headers });
        setSuccess("Actividad actualizada exitosamente");
      } else {
        await axios.post(API_URL, formData, { headers });
        setSuccess("Actividad creada exitosamente");
      }

      resetForm();
      fetchAllData();
    } catch (err) {
      setError("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (actividad) => {
    setEditingId(actividad.id_actividad);
    setFormData({
      ...actividad,
      id_persona: actividad.id_persona || "",
      id_tipo_actividad: actividad.id_tipo_actividad || "",
      id_alojamiento: actividad.id_alojamiento || "",
      id_ruta: actividad.id_ruta || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta actividad?")
    ) {
      try {
        await axios.delete(`${API_URL}/${id}`, { headers });
        setSuccess("Actividad eliminada exitosamente");
        fetchAllData();
      } catch (err) {
        setError("Error: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_persona: "",
      id_tipo_actividad: "",
      id_alojamiento: "",
      id_ruta: "",
      fecha: "",
      hora: "",
      observaciones: "",
      total_pagar: "",
      estado: "Pendiente",
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">
          Gestión de Actividades
        </h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Actividad</span>
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
          <p className="text-gray-500">Cargando actividades...</p>
        </div>
      ) : actividades.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No hay actividades registradas</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Persona
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Ruta
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {actividades.map((act) => (
                <tr
                  key={act.id_actividad}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {act.visitante?.nombres || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {act.tipoActividad?.nombre || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {act.ruta?.nombre || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(act.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    ${act.total_pagar.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        act.estado === "Pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : act.estado === "Confirmada"
                          ? "bg-blue-100 text-blue-800"
                          : act.estado === "Completada"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {act.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2 flex">
                    <button
                      onClick={() => handleEdit(act)}
                      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(act.id_actividad)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingId ? "Editar" : "Nueva"} Actividad
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="id_persona"
                  value={formData.id_persona}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Seleccionar Persona</option>
                  {personas.map((p) => (
                    <option key={p.id_persona} value={p.id_persona}>
                      {p.nombres} {p.apellidos}
                    </option>
                  ))}
                </select>

                <select
                  name="id_tipo_actividad"
                  value={formData.id_tipo_actividad}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Seleccionar Tipo</option>
                  {tipos.map((t) => (
                    <option
                      key={t.id_tipo_actividad}
                      value={t.id_tipo_actividad}
                    >
                      {t.nombre}
                    </option>
                  ))}
                </select>

                <select
                  name="id_ruta"
                  value={formData.id_ruta}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Seleccionar Ruta</option>
                  {rutas.map((r) => (
                    <option key={r.id_ruta} value={r.id_ruta}>
                      {r.nombre}
                    </option>
                  ))}
                </select>

                <select
                  name="id_alojamiento"
                  value={formData.id_alojamiento}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Seleccionar Alojamiento (Opcional)</option>
                  {alojamientos.map((a) => (
                    <option key={a.id_alojamiento} value={a.id_alojamiento}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="total_pagar"
                  placeholder="Total a pagar"
                  value={formData.total_pagar}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <textarea
                name="observaciones"
                placeholder="Observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                rows="3"
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

export default ActividadManagement;
