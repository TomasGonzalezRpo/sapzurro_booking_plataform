import React, { useMemo, useState, useEffect } from "react"; // ⬅️ IMPORTANTE: Añadir useEffect
import { Plus, Edit2, Trash2, Search, X, AlertCircle } from "lucide-react";
import axios from "axios"; // ⬅️ Importar Axios

const API_BASE_URL = "http://localhost:5000/api/personas"; // Endpoint del Backend

const emptyForm = {
  nombres: "",
  apellidos: "",
  tipo_documento: "CC",
  numero_documento: "",
  correo: "",
  telefono: "",
  direccion: "",
  estado: 1,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PersonaManagement = () => {
  const [personas, setPersonas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null); // Para errores de conexión

  // Estados de UI
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState(""); // Usamos formError para validación

  // Función para OBTENER todos los perfiles (GET)
  const fetchPersonas = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await axios.get(API_BASE_URL);
      setPersonas(response.data);
    } catch (err) {
      console.error("Error al obtener personas:", err);
      setApiError(
        "No se pudo conectar al servidor o cargar las personas. Asegúrese de que el backend esté corriendo."
      );
      setPersonas([]);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect para cargar los datos al montar
  useEffect(() => {
    fetchPersonas();
  }, []); // Cargar al montar

  const q = searchTerm.trim().toLowerCase();
  const filteredPersonas = useMemo(() => {
    if (!q) return personas;
    return personas.filter(
      (p) =>
        p.nombres.toLowerCase().includes(q) ||
        p.apellidos.toLowerCase().includes(q) ||
        p.correo.toLowerCase().includes(q) ||
        p.numero_documento.includes(searchTerm)
    );
  }, [personas, q, searchTerm]);

  const openModal = (persona = null) => {
    setEditingPersona(persona);
    setFormData(
      persona ? { ...persona, estado: Number(persona.estado) } : emptyForm
    );
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setEditingPersona(null);
      setFormData(emptyForm);
      setFormError("");
    }, 200);
  };

  const handleChange = (field, value) =>
    setFormData((s) => ({ ...s, [field]: value }));

  // Función para CREAR o ACTUALIZAR (POST / PUT)
  const handleGuardar = async () => {
    setFormError("");

    // Validaciones básicas de formulario
    if (!formData.nombres.trim() || !formData.apellidos.trim()) {
      setFormError("Nombres y apellidos son obligatorios");
      return;
    }
    if (!formData.numero_documento.trim()) {
      setFormError("El número de documento es obligatorio");
      return;
    }
    if (!formData.correo.trim()) {
      setFormError("El correo es obligatorio");
      return;
    }
    if (!emailRegex.test(formData.correo)) {
      setFormError("Por favor ingresa un correo válido");
      return;
    }

    try {
      if (editingPersona) {
        // Actualizar (PUT)
        await axios.put(
          `${API_BASE_URL}/${editingPersona.id_persona}`,
          formData
        );
        alert("Persona actualizada exitosamente");
      } else {
        // Crear (POST)
        await axios.post(API_BASE_URL, formData);
        alert("Persona creada exitosamente");
      }

      closeModal();
      fetchPersonas(); // Recargar la lista después de la operación
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        `Error en el servidor al ${
          editingPersona ? "actualizar" : "crear"
        } la persona.`;
      setFormError(msg);
      console.error(
        "Error al guardar persona:",
        error.response?.data || error.message
      );
    }
  };

  // Función para HABILITAR/INHABILITAR (PUT)
  const handleToggleEstado = async (persona) => {
    const nuevoEstado = persona.estado === 1 ? 0 : 1;
    const accion = persona.estado === 1 ? "inhabilitar" : "habilitar";

    if (!confirm(`¿Está seguro de ${accion} a ${persona.nombres}?`)) return;

    try {
      await axios.put(`${API_BASE_URL}/${persona.id_persona}`, {
        estado: nuevoEstado,
      });

      alert(`Persona ${accion}da exitosamente`);
      fetchPersonas(); // Recargar la lista
    } catch (error) {
      const msg =
        error.response?.data?.message || `Error al ${accion} la persona.`;
      alert(`Error: ${msg}`);
      console.error(
        "Error al cambiar estado:",
        error.response?.data || error.message
      );
    }
  };

  // Función para ELIMINAR (DELETE)
  const handleEliminar = async (persona) => {
    if (
      !confirm(
        `¿Está seguro de ELIMINAR PERMANENTEMENTE a ${persona.nombres} ${persona.apellidos}? Esta acción no se puede deshacer.`
      )
    )
      return;

    try {
      // Petición DELETE
      await axios.delete(`${API_BASE_URL}/${persona.id_persona}`);

      alert("Persona eliminada exitosamente");
      fetchPersonas(); // Recargar la lista
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Error al eliminar la persona. Puede tener registros asociados (clave foránea).";
      alert(`Error: ${msg}`);
      console.error(
        "Error al eliminar:",
        error.response?.data || error.message
      );
    }
  };

  // --- Renderizado y Lógica de UI ---

  // Mensajes de Carga y Error Global de la API
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-cyan-600 font-semibold">
          Cargando personas desde el servidor...
        </p>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error de Conexión: </strong>
        <span className="block sm:inline">{apiError}</span>
        <button
          onClick={fetchPersonas}
          className="ml-4 underline font-semibold"
        >
          Intentar Recargar
        </button>
      </div>
    );
  }

  // Si no hay error global ni está cargando, se renderiza el resto del componente
  return (
    <div className="space-y-6">
      {/* Header */}
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Personas
          </h1>
          <p className="text-gray-600 mt-2">
            Administra la información personal de los usuarios
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md"
          title="Nueva Persona"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Persona</span>
        </button>
      </div>

      {/* Buscador */}
      {}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, correo o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabla */}
      {}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "ID",
                  "Nombres",
                  "Apellidos",
                  "Documento",
                  "Correo",
                  "Teléfono",
                  "Estado",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-left text-sm font-semibold text-gray-700 ${
                      h === "Acciones" ? "text-center" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredPersonas.map((persona) => (
                <tr
                  key={persona.id_persona}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {persona.id_persona}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {persona.nombres}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {persona.apellidos}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {persona.tipo_documento} {persona.numero_documento}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {persona.correo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {persona.telefono}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        persona.estado === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {persona.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => openModal(persona)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleToggleEstado(persona)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          persona.estado === 1
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                        title={
                          persona.estado === 1 ? "Inhabilitar" : "Habilitar"
                        }
                      >
                        {persona.estado === 1 ? "Inhabilitar" : "Habilitar"}
                      </button>

                      <button
                        onClick={() => handleEliminar(persona)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar permanentemente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPersonas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron personas</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {editingPersona ? "Editar Persona" : "Nueva Persona"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {formError && ( // Usamos formError
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombres}
                    onChange={(e) => handleChange("nombres", e.target.value)}
                    placeholder="Juan Carlos"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => handleChange("apellidos", e.target.value)}
                    placeholder="Pérez García"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de documento
                  </label>
                  <select
                    value={formData.tipo_documento}
                    onChange={(e) =>
                      handleChange("tipo_documento", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de documento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.numero_documento}
                    onChange={(e) =>
                      handleChange("numero_documento", e.target.value)
                    }
                    placeholder="1234567890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => handleChange("correo", e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                  placeholder="3001234567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  placeholder="Calle 123 #45-67"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={String(formData.estado)}
                  onChange={(e) =>
                    handleChange("estado", parseInt(e.target.value, 10))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md"
              >
                {editingPersona ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonaManagement;
