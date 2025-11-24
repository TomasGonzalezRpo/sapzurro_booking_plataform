import React, { useMemo, useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, X, AlertCircle } from "lucide-react"; // Iconos modernos
import axios from "axios"; // Cliente HTTP para interactuar con la API

// Objeto de estado inicial para un nuevo perfil
const emptyForm = { nombre: "", descripcion: "", estado: 1 };
// URL base de la API para la entidad Perfil
const API_BASE_URL = "http://localhost:5000/api/perfiles";

const PerfilManagement = () => {
  // ====================================================================
  // ESTADOS DE DATOS Y API
  // ====================================================================
  const [perfiles, setPerfiles] = useState([]); // Almacena la lista de perfiles
  const [isLoading, setIsLoading] = useState(true); // Indica si los datos están siendo cargados
  const [apiError, setApiError] = useState(null); // Almacena errores de conexión con el backend // ==================================================================== // ESTADOS DE UI Y FORMULARIO // ====================================================================

  const [searchTerm, setSearchTerm] = useState(""); // Valor del campo de búsqueda
  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal CRUD
  const [editingPerfil, setEditingPerfil] = useState(null); // Almacena el perfil que se está editando
  const [formData, setFormData] = useState(emptyForm); // Datos del formulario (Crear/Editar)
  const [formError, setFormError] = useState(""); // Error de validación o de API específico del formulario // ==================================================================== // OPERACIONES API (CRUD) // ==================================================================== // Función para OBTENER todos los perfiles (GET)

  const fetchPerfiles = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await axios.get(API_BASE_URL);
      setPerfiles(response.data);
    } catch (err) {
      console.error("Error al obtener perfiles:", err); // Mensaje de error amigable para el usuario
      setApiError(
        "No se pudo conectar con el servidor o cargar los perfiles. Asegúrese de que el backend esté corriendo."
      );
      setPerfiles([]); // Vaciar la lista si hay error
    } finally {
      setIsLoading(false);
    }
  }; // Cargar los datos al montar el componente

  useEffect(() => {
    fetchPerfiles();
  }, []); // ==================================================================== // LÓGICA DE UI Y FILTRADO // ==================================================================== // Filtra la lista de perfiles en tiempo real usando useMemo para optimización

  const filteredPerfiles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return perfiles; // Si no hay búsqueda, devuelve todos
    return perfiles.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
    );
  }, [perfiles, searchTerm]); // Se recalcula solo si perfiles o searchTerm cambian // Manejadores del Modal

  const openModal = (perfil = null) => {
    setEditingPerfil(perfil);
    setFormData(
      perfil
        ? {
            // Carga los datos del perfil si está en modo edición
            nombre: perfil.nombre,
            descripcion: perfil.descripcion,
            estado: perfil.estado,
          }
        : emptyForm // Usa el formulario vacío si es un nuevo perfil
    );
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false); // Limpiar estados después de la transición del modal
    setTimeout(() => {
      setEditingPerfil(null);
      setFormData(emptyForm);
      setFormError("");
    }, 200);
  }; // Manejador genérico para la entrada de datos del formulario

  const handleChange = (field, value) => {
    setFormData((s) => ({ ...s, [field]: value }));
  }; // Función para CREAR o ACTUALIZAR (POST / PUT)

  const handleGuardar = async () => {
    setFormError(""); // Validación básica
    if (!formData.nombre.trim()) {
      setFormError("El nombre es obligatorio");
      return;
    }

    try {
      if (editingPerfil) {
        // PUT: Actualiza un perfil existente
        await axios.put(`${API_BASE_URL}/${editingPerfil.id_perfil}`, formData); // NOTE: Se recomienda usar un componente de notificación en lugar de alert()
        alert("Perfil actualizado exitosamente");
      } else {
        // POST: Crea un nuevo perfil
        await axios.post(API_BASE_URL, formData); // NOTE: Se recomienda usar un componente de notificación en lugar de alert()
        alert("Perfil creado exitosamente");
      }

      closeModal();
      fetchPerfiles(); // Recarga la lista para mostrar los cambios
    } catch (error) {
      // Intenta extraer el mensaje de error del backend
      const msg =
        error.response?.data?.message ||
        `Error en el servidor al ${
          editingPerfil ? "actualizar" : "crear"
        } el perfil.`;
      setFormError(msg);
      console.error(error);
    }
  }; // Función para HABILITAR/INHABILITAR (PUT)

  const handleToggleEstado = async (perfil) => {
    const nuevoEstado = perfil.estado === 1 ? 0 : 1;
    const accion = perfil.estado === 1 ? "inhabilitar" : "habilitar"; // NOTE: Reemplazar 'confirm' por un modal de confirmación personalizado

    if (!confirm(`¿Está seguro de ${accion} el perfil ${perfil.nombre}?`))
      return;

    try {
      // Solo envía el campo 'estado' para actualizar
      await axios.put(`${API_BASE_URL}/${perfil.id_perfil}`, {
        estado: nuevoEstado,
      }); // NOTE: Reemplazar 'alert' por una notificación personalizada

      alert(`Perfil ${accion}do exitosamente`);
      fetchPerfiles(); // Recargar la lista para mostrar el cambio
    } catch (error) {
      const msg =
        error.response?.data?.message || `Error al ${accion} el perfil.`; // NOTE: Reemplazar 'alert' por una notificación personalizada
      alert(`Error: ${msg}`);
      console.error(error);
    }
  }; // Función para ELIMINAR (DELETE)

  const handleEliminar = async (perfil) => {
    // NOTE: Reemplazar 'confirm' por un modal de confirmación personalizado
    if (
      !confirm(
        `¿Está seguro de ELIMINAR PERMANENTEMENTE el perfil ${perfil.nombre}? Esta acción no se puede deshacer.`
      )
    )
      return;

    try {
      await axios.delete(`${API_BASE_URL}/${perfil.id_perfil}`); // Petición DELETE // NOTE: Reemplazar 'alert' por una notificación personalizada

      alert("Perfil eliminado exitosamente");
      fetchPerfiles(); // Recargar la lista
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Error al eliminar el perfil. Puede que tenga usuarios asociados."; // NOTE: Reemplazar 'alert' por una notificación personalizada
      alert(`Error: ${msg}`);
      console.error(error);
    }
  }; // ==================================================================== // RENDERIZADO CONDICIONAL DE ESTADOS // ==================================================================== // Mensaje de Carga

  if (isLoading) {
    return (
      <div className="text-center py-20">
               {" "}
        <p className="text-xl text-cyan-600 font-semibold">
                    Cargando perfiles desde el servidor...        {" "}
        </p>
             {" "}
      </div>
    );
  } // Mensaje de Error de Conexión

  if (apiError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error de Conexión: </strong>     
          <span className="block sm:inline">{apiError}</span>       {" "}
        <button
          onClick={fetchPerfiles}
          className="ml-4 underline font-semibold"
        >
                    Intentar Recargar        {" "}
        </button>
             {" "}
      </div>
    );
  } // ==================================================================== // RENDERIZADO PRINCIPAL // ====================================================================

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Header y Botón Crear */}     {" "}
      <div className="flex items-center justify-between">
               {" "}
        <div>
                   {" "}
          <h1 className="text-3xl font-bold text-gray-800">
                        Gestión de Perfiles          {" "}
          </h1>
                   {" "}
          <p className="text-gray-600 mt-2">Administra los roles del sistema</p>
                 {" "}
        </div>
               {" "}
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/50"
          title="Nuevo Perfil"
        >
                    <Plus className="w-5 h-5" />         {" "}
          <span>Nuevo Perfil</span>       {" "}
        </button>
             {" "}
      </div>
            {/* Buscador */}     {" "}
      <div className="bg-white rounded-xl shadow-md p-4">
               {" "}
        <div className="relative">
                   {" "}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                   {" "}
          <input
            type="text"
            placeholder="Buscar perfil por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
                 {" "}
        </div>
             {" "}
      </div>
            {/* Tabla de Perfiles */}     {" "}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
               {" "}
        <table className="min-w-full divide-y divide-gray-200">
                   {" "}
          <thead className="bg-gray-50 border-b border-gray-200">
                       {" "}
            <tr>
                           {" "}
              {["ID", "Nombre", "Descripción", "Estado", "Acciones"].map(
                (h) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap ${
                      h === "Acciones" ? "text-center" : ""
                    }`}
                  >
                                        {h}                 {" "}
                  </th>
                )
              )}
                         {" "}
            </tr>
                     {" "}
          </thead>
                   {" "}
          <tbody className="divide-y divide-gray-200">
                       {" "}
            {filteredPerfiles.map((perfil) => (
              <tr
                key={perfil.id_perfil}
                className="hover:bg-gray-50 transition-colors"
              >
                               {" "}
                <td className="px-6 py-4 text-sm text-gray-800">
                                    {perfil.id_perfil}               {" "}
                </td>
                               {" "}
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                    {perfil.nombre}               {" "}
                </td>
                               {" "}
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                    {perfil.descripcion}               {" "}
                </td>
                               {" "}
                <td className="px-6 py-4">
                                   {" "}
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      perfil.estado === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                                       {" "}
                    {perfil.estado === 1 ? "Activo" : "Inactivo"}               
                     {" "}
                  </span>
                                 {" "}
                </td>
                                {/* ACCIONES */}               {" "}
                <td className="px-6 py-4">
                                   {" "}
                  <div className="flex items-center justify-center space-x-2">
                                       {" "}
                    <button
                      onClick={() => openModal(perfil)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Editar"
                    >
                                            <Edit2 className="w-4 h-4" />       
                                 {" "}
                    </button>
                                        {/* Botón Inhabilitar/Habilitar */}     
                                 {" "}
                    <button
                      onClick={() => handleToggleEstado(perfil)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        perfil.estado === 1
                          ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                      title={perfil.estado === 1 ? "Inhabilitar" : "Habilitar"}
                    >
                                           {" "}
                      {perfil.estado === 1 ? "Inhabilitar" : "Habilitar"}       
                                 {" "}
                    </button>
                                        {/* Botón Eliminar */}                 
                     {" "}
                    <button
                      onClick={() => handleEliminar(perfil)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Eliminar permanentemente"
                    >
                                            <Trash2 className="w-4 h-4" />     
                                   {" "}
                    </button>
                                     {" "}
                  </div>
                                 {" "}
                </td>
                                {/* FIN ACCIONES */}             {" "}
              </tr>
            ))}
                     {" "}
          </tbody>
                 {" "}
        </table>
               {" "}
        {filteredPerfiles.length === 0 && (
          <div className="text-center py-12">
                       {" "}
            <p className="text-gray-500">No se encontraron perfiles</p>         {" "}
          </div>
        )}
             {" "}
      </div>
            {/* Modal de Creación/Edición */}     {" "}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity"
          onClick={closeModal}
        >
                   {" "}
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
                        {/* Header del Modal */}           {" "}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                           {" "}
              <h3 className="text-xl font-bold text-gray-800">
                               {" "}
                {editingPerfil ? "Editar Perfil" : "Nuevo Perfil"}             {" "}
              </h3>
                           {" "}
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar"
              >
                                <X className="w-6 h-6" />             {" "}
              </button>
                         {" "}
            </div>
                        {/* Cuerpo del Formulario */}           {" "}
            <div className="p-6 space-y-4">
                            {/* Muestra el error del formulario */}             {" "}
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                                   {" "}
                  <AlertCircle className="w-5 h-5 text-red-600" />             
                      <p className="text-sm text-red-600">{formError}</p>       
                         {" "}
                </div>
              )}
                            {/* Campo Nombre */}             {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del perfil{" "}
                  <span className="text-red-500">*</span>               {" "}
                </label>
                               {" "}
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  placeholder="Ej: Moderador"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                             {" "}
              </div>
                            {/* Campo Descripción */}             {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción                {" "}
                </label>
                               {" "}
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  placeholder="Descripción del perfil"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                             {" "}
              </div>
                            {/* Campo Estado */}             {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado                {" "}
                </label>
                               {" "}
                <select
                  value={String(formData.estado)} // Convertir a string para el select
                  onChange={
                    (e) => handleChange("estado", parseInt(e.target.value)) // Convertir de nuevo a número
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                                    <option value="1">Activo</option>           
                        <option value="0">Inactivo</option>               {" "}
                </select>
                             {" "}
              </div>
                         {" "}
            </div>
                        {/* Footer y Botones de Acción */}           {" "}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                           {" "}
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                                Cancelar              {" "}
              </button>
                           {" "}
              <button
                onClick={handleGuardar}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md"
              >
                                {editingPerfil ? "Actualizar" : "Crear"}       
                     {" "}
              </button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
};

export default PerfilManagement;
