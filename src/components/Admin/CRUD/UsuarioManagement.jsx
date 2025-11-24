import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  Loader,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/usuarios";

/* ----------------------------------------------------------------------
    ErrorBoundary: captura errores en render para evitar pantalla en blanco
    ---------------------------------------------------------------------- */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 rounded-lg">
                   {" "}
          <h2 className="text-xl font-bold text-red-700">Error en la vista</h2> 
                 {" "}
          <p className="mt-2 text-red-600">
                        Ocurrió un error al renderizar la página de Usuarios.
            Revisa la             consola para más detalles.          {" "}
          </p>
                 {" "}
        </div>
      );
    }
    return this.props.children;
  }
}

/* ----------------------------------------------------------------------
    ConfirmationModal: Modal genérico para confirmación o alerta de éxito
    ---------------------------------------------------------------------- */
const ConfirmationModal = ({
  title,
  message,
  onConfirm,
  onClose,
  isConfirmation,
}) => {
  const getIconAndColor = () => {
    if (isConfirmation)
      return { icon: Info, color: "text-blue-500", bg: "bg-blue-100" };
    return {
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-100",
    };
  };

  const { icon: Icon, color, bg } = getIconAndColor();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           {" "}
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden transform transition-all scale-100">
               {" "}
        <div className="p-6">
                   {" "}
          <div className="flex items-center space-x-4">
                       {" "}
            <div className={`p-3 rounded-full ${bg}`}>
                            <Icon className={`w-6 h-6 ${color}`} />           {" "}
            </div>
                       {" "}
            <div>
                           {" "}
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>     
                   {" "}
            </div>
                     {" "}
          </div>
                    <p className="mt-4 text-sm text-gray-600">{message}</p>     
           {" "}
        </div>
               {" "}
        <div className="flex justify-end space-x-3 p-4 bg-gray-50 border-t border-gray-200">
                   {" "}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
          >
                        {isConfirmation ? "Cancelar" : "Cerrar"}         {" "}
          </button>
                   {" "}
          {isConfirmation && (
            <button
              onClick={() => {
                onConfirm();
              }}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md"
            >
                            Confirmar            {" "}
            </button>
          )}
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};

/* ----------------------------------------------------------------------
    Componente principal (UsuarioManagementInner)
    ---------------------------------------------------------------------- */
const UsuarioManagementInner = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const perfilesDisponibles = [
    { id_perfil: 1, nombre: "Administrador" },
    { id_perfil: 2, nombre: "Usuario" },
    { id_perfil: 3, nombre: "Aliado" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    contrasena: "",
    confirmarContrasena: "",
    id_perfil: 2,
    nombres: "",
    apellidos: "",
    correo: "",
    provider: "local",
    estado: 1,
  });
  const [error, setError] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalContent, setModalContent] = useState(
    {}
  ); /* Función para abrir el modal de confirmación o alerta */

  const openConfirmModal = useCallback((title, message, onConfirm = null) => {
    setModalContent({
      title,
      message,
      onConfirm,
      isConfirmation: !!onConfirm, // Es confirmación si se provee la función onConfirm
    });
    setShowConfirmModal(true);
  }, []); /* Función para cerrar el modal de confirmación o alerta */

  const closeConfirmModal = useCallback(() => {
    setShowConfirmModal(false);
    setModalContent({});
  }, []); /* --------------------------------------------------------------------
    fetchUsuarios: Obtiene la lista de usuarios desde la API
    -------------------------------------------------------------------- */

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setErrorCarga(null);
    try {
      // Se añaden headers para prevenir caché y un parámetro de query aleatorio
      // para asegurar que se obtiene la data más reciente.
      const response = await axios.get(API_URL, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
        params: { _: new Date().getTime() },
        validateStatus: (s) => s < 500, // No tirar error para 4xx
      });

      console.log("fetchUsuarios - status:", response.status);
      console.log("fetchUsuarios - response.data:", response.data);

      if (response.status !== 200) {
        setErrorCarga(`Error HTTP ${response.status}`);
        setUsuarios([]);
        return;
      }

      let raw = response.data; // Manejo de respuesta que podría venir anidada (e.g., { data: [...] })
      if (!Array.isArray(raw)) {
        if (Array.isArray(raw?.data)) {
          raw = raw.data;
        } else {
          setErrorCarga("Respuesta inesperada del servidor: no es un array.");
          setUsuarios([]);
          return;
        }
      } // Adaptación de datos para la tabla

      const usuariosAdaptados = raw.map((u) => ({
        id_usuario: u?.id_usuario ?? null,
        username: u?.usuario ?? u?.username ?? "",
        nombres: u?.nombres ?? "",
        apellidos: u?.apellidos ?? "", // Crea fullName combinando nombres y apellidos si es necesario
        fullName:
          u?.fullName ??
          [u?.nombres, u?.apellidos].filter(Boolean).join(" ").trim() ??
          u?.usuario ??
          u?.username ??
          "",
        correo: u?.correo ?? u?.email ?? "",
        id_perfil: u?.id_perfil ?? null,
        rol: u?.rol ?? u?.perfil?.nombre ?? "Desconocido",
        provider: u?.provider ?? "local",
        estado: typeof u?.estado !== "undefined" ? u.estado : 1,
      }));

      setUsuarios(usuariosAdaptados);
    } catch (err) {
      console.error("fetchUsuarios error:", err);
      setErrorCarga(
        "No fue posible conectarse al servidor o la respuesta fue inválida."
      );
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, []); /* Efecto para cargar los usuarios al montar el componente */

  useEffect(() => {
    fetchUsuarios();
  }, [
    fetchUsuarios,
  ]); /* Filtrado de usuarios basado en el término de búsqueda */

  const filteredUsuarios = (usuarios || []).filter((usuario) => {
    try {
      const username = String(usuario?.username || "").toLowerCase();
      const nombres = String(usuario?.nombres || "").toLowerCase();
      const apellidos = String(usuario?.apellidos || "").toLowerCase();
      const correo = String(usuario?.correo || "").toLowerCase();
      const fullName = String(usuario?.fullName || "").toLowerCase();
      const term = String(searchTerm || "").toLowerCase();
      return (
        username.includes(term) ||
        nombres.includes(term) ||
        apellidos.includes(term) ||
        correo.includes(term) ||
        fullName.includes(term)
      );
    } catch (e) {
      console.error("Error filtrando usuarios:", e);
      return false;
    }
  }); /* Función auxiliar para determinar el estilo del rol */

  const getRolColor = (rol) => {
    switch (rol) {
      case "Administrador":
        return "bg-purple-100 text-purple-700";
      case "Aliado":
        return "bg-emerald-100 text-emerald-700";
      case "Usuario":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }; /* --------------------------------------------------------------------
    CRUD handlers
    -------------------------------------------------------------------- */

  const handleNuevo = () => {
    setEditingUsuario(null);
    setFormData({
      username: "",
      contrasena: "",
      confirmarContrasena: "",
      id_perfil: 2, // Default a 'Usuario'
      nombres: "",
      apellidos: "",
      correo: "",
      provider: "local",
      estado: 1,
    });
    setError("");
    setShowModal(true);
  };

  const handleEditar = (usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      username: usuario?.username ?? "", // Las contraseñas se dejan vacías para no forzar el cambio
      contrasena: "",
      confirmarContrasena: "",
      id_perfil: usuario?.id_perfil ?? 2,
      nombres: usuario?.nombres ?? "",
      apellidos: usuario?.apellidos ?? "",
      correo: usuario?.correo ?? "",
      provider: usuario?.provider ?? "local",
      estado: usuario?.estado ?? 1,
    });
    setError("");
    setShowModal(true);
  };

  const handleGuardar = async () => {
    setError(""); // Validación de campos obligatorios

    if (!String(formData.username || "").trim()) {
      setError("El username es obligatorio");
      return;
    }
    if (
      !String(formData.nombres || "").trim() ||
      !String(formData.apellidos || "").trim()
    ) {
      setError("Nombres y apellidos son obligatorios");
      return;
    }
    if (!String(formData.correo || "").trim()) {
      setError("El correo es obligatorio");
      return;
    } // Validación de formato de correo

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError("Por favor ingresa un correo válido");
      return;
    } // Validación de contraseñas (para crear o si se está modificando en edición)

    if (!editingUsuario) {
      if (!formData.contrasena) {
        setError("La contraseña es obligatoria para usuarios nuevos");
        return;
      }
    }
    if (formData.contrasena) {
      if (formData.contrasena.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (formData.contrasena !== formData.confirmarContrasena) {
        setError("Las contraseñas no coinciden");
        return;
      }
    } // Se prepara el objeto a enviar, omitiendo la contraseña si está vacía en edición

    const dataToSend = {
      username: formData.username, // Solo incluye 'contrasena' si tiene un valor (para no borrarla en PUT si no se cambia)
      contrasena: formData.contrasena || undefined,
      id_perfil: formData.id_perfil,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      correo: formData.correo,
      provider: formData.provider,
      estado: formData.estado,
    };

    try {
      if (editingUsuario) {
        await axios.put(`${API_URL}/${editingUsuario.id_usuario}`, dataToSend);
        openConfirmModal("Éxito", "Usuario actualizado exitosamente.", null); // Alerta simple
      } else {
        await axios.post(API_URL, dataToSend);
        openConfirmModal("Éxito", "Usuario creado exitosamente.", null); // Alerta simple
      }

      setShowModal(false);
      await fetchUsuarios();
    } catch (err) {
      console.error(
        "Error al guardar usuario (frontend):",
        err.response ?? err.message ?? err
      );
      setError(
        err.response?.data?.message ||
          err.response?.data?.details ||
          "Error al conectar con el servidor. Inténtalo de nuevo."
      );
    }
  };

  const handleInhabilitar = (usuario) => {
    const action = usuario.estado === 1 ? "inhabilitar" : "habilitar";
    const newEstado = usuario.estado === 1 ? 0 : 1;
    const message = `¿Está seguro de ${action} al usuario "${usuario.username}"?`;

    openConfirmModal(
      `${action === "inhabilitar" ? "Inhabilitar" : "Habilitar"} Usuario`,
      message,
      async () => {
        try {
          // Se actualiza el estado usando el endpoint PUT estándar
          await axios.put(`${API_URL}/${usuario.id_usuario}`, {
            estado: newEstado,
          });
          openConfirmModal(
            "Éxito",
            `Usuario ${
              action === "inhabilitar" ? "inhabilitado" : "habilitado"
            } exitosamente.`,
            null
          );
          await fetchUsuarios();
          closeConfirmModal();
        } catch (error) {
          console.error(`Error al ${action} usuario:`, error);
          openConfirmModal(
            "Error",
            `Fallo al ${action} usuario: ${
              error.response?.data?.message || "Error de conexión."
            }`,
            null
          );
        }
      }
    );
  };

  const handleEliminar = (usuario) => {
    const message = `¿Está seguro de ELIMINAR PERMANENTEMENTE al usuario "${usuario.username}"? Esta acción no se puede deshacer.`;

    openConfirmModal("Confirmar Eliminación Permanente", message, async () => {
      try {
        await axios.delete(`${API_URL}/${usuario.id_usuario}`);
        openConfirmModal("Éxito", "Usuario eliminado permanentemente.", null);
        await fetchUsuarios();
        closeConfirmModal();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        openConfirmModal(
          "Error",
          `Fallo al eliminar usuario: ${
            error.response?.data?.message || "Error de conexión."
          }`,
          null
        );
      }
    });
  }; /* --------------------------------------------------------------------
    RENDER
    -------------------------------------------------------------------- */

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50 font-sans">
           {" "}
      <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header */}       {" "}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                   {" "}
          <div>
                       {" "}
            <h1 className="text-3xl font-extrabold text-gray-800">
                            Gestión de Usuarios            {" "}
            </h1>
                       {" "}
            <p className="text-gray-600 mt-1 text-sm">
                            Administra las credenciales y permisos de los
              usuarios            {" "}
            </p>
                     {" "}
          </div>
                   {" "}
          <button
            onClick={handleNuevo}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl active:shadow-md transform active:scale-95 text-sm font-semibold"
            disabled={loading}
          >
                        <Plus className="w-5 h-5" />           {" "}
            <span>Nuevo Usuario</span>         {" "}
          </button>
                 {" "}
        </div>
                {/* Buscador */}       {" "}
        <div className="bg-white rounded-xl shadow-lg p-4">
                   {" "}
          <div className="relative">
                       {" "}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                       {" "}
            <input
              type="text"
              placeholder="Buscar por username, nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            />
                     {" "}
          </div>
                 {" "}
        </div>
                {/* Tabla / Estado de carga */}       {" "}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                   {" "}
          {loading ? (
            <div className="text-center py-12">
                           {" "}
              <Loader className="w-8 h-8 text-cyan-500 animate-spin mx-auto" /> 
                         {" "}
              <p className="text-gray-500 mt-3">Cargando usuarios...</p>       
                 {" "}
            </div>
          ) : errorCarga ? (
            <div className="text-center py-12 bg-red-50 border-t-4 border-red-500">
                           {" "}
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />         
                  <p className="text-red-700 font-medium mt-3">{errorCarga}</p> 
                         {" "}
              <button
                onClick={fetchUsuarios}
                className="mt-4 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md"
              >
                                Reintentar Conexión              {" "}
              </button>
                         {" "}
            </div>
          ) : (
            <div className="overflow-x-auto">
                           {" "}
              <table className="min-w-full">
                               {" "}
                <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
                                   {" "}
                  <tr>
                                       {" "}
                    {[
                      "ID",
                      "Username",
                      "Nombre Completo",
                      "Correo",
                      "Rol",
                      "Proveedor",
                      "Estado",
                      "Acciones",
                    ].map((col) => {
                      const isActions = col === "Acciones";
                      return (
                        <th
                          key={col}
                          className={`px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-700 align-middle ${
                            isActions ? "text-center" : "text-left"
                          }`}
                        >
                                                    {col}                       {" "}
                        </th>
                      );
                    })}
                                   {" "}
                  </tr>
                                 {" "}
                </thead>
                               {" "}
                <tbody className="divide-y divide-gray-200">
                                   {" "}
                  {filteredUsuarios.map((usuario) => (
                    <tr
                      key={usuario.id_usuario ?? Math.random()}
                      className="hover:bg-gray-50 transition-colors"
                    >
                                           {" "}
                      <td className="px-6 py-4 text-sm text-gray-800 align-middle">
                                                {usuario.id_usuario}           
                                 {" "}
                      </td>
                                           {" "}
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 align-middle">
                                                {usuario.username}             
                               {" "}
                      </td>
                                           {" "}
                      <td className="px-6 py-4 text-sm text-gray-800 align-middle">
                                                {/* mostramos fullName */}     
                                         {" "}
                        {usuario.fullName ||
                          `${usuario.nombres} ${usuario.apellidos}`.trim()}
                                             {" "}
                      </td>
                                           {" "}
                      <td className="px-6 py-4 text-sm text-gray-600 align-middle">
                                                {usuario.correo}               
                             {" "}
                      </td>
                                           {" "}
                      <td className="px-6 py-4 align-middle">
                                               {" "}
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRolColor(
                            usuario.rol
                          )}`}
                        >
                                                    {usuario.rol}               
                                 {" "}
                        </span>
                                             {" "}
                      </td>
                                           {" "}
                      <td className="px-6 py-4 text-sm text-gray-600 align-middle">
                                               {" "}
                        {usuario.provider === "local"
                          ? "🔑 Local"
                          : "🌐 Google"}
                                             {" "}
                      </td>
                                           {" "}
                      <td className="px-6 py-4 align-middle">
                                               {" "}
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            usuario.estado === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                                                   {" "}
                          {usuario.estado === 1 ? "Activo" : "Inactivo"}       
                                       {" "}
                        </span>
                                           {" "}
                      </td>
                                         {" "}
                      <td className="px-6 py-4 text-center align-middle">
                                             {" "}
                        <div className="flex items-center justify-center space-x-2">
                                                 {" "}
                          <button
                            onClick={() => handleEditar(usuario)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all active:bg-blue-100"
                            title="Editar"
                          >
                                                     {" "}
                            <Edit2 className="w-4 h-4" />                       {" "}
                          </button>
                                                 {" "}
                          <button
                            onClick={() => handleInhabilitar(usuario)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                              usuario.estado === 1
                                ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                            title={
                              usuario.estado === 1 ? "Inhabilitar" : "Habilitar"
                            }
                          >
                                                     {" "}
                            {usuario.estado === 1 ? "Inhabilitar" : "Habilitar"}
                                                   {" "}
                          </button>
                                                 {" "}
                          <button
                            onClick={() => handleEliminar(usuario)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all active:bg-red-100"
                            title="Eliminar permanentemente"
                          >
                                                     {" "}
                            <Trash2 className="w-4 h-4" />                     
                             {" "}
                          </button>
                                               {" "}
                        </div>
                                           {" "}
                      </td>
                                       {" "}
                    </tr>
                  ))}
                                 {" "}
                </tbody>
                             {" "}
              </table>
                         {" "}
            </div>
          )}
                   {" "}
          {!loading && !errorCarga && filteredUsuarios.length === 0 && (
            <div className="text-center py-12">
                           {" "}
              <p className="text-gray-500">
                                No se encontraron usuarios{" "}
                {searchTerm ? `para el término "${searchTerm}"` : ""}.          
                   {" "}
              </p>
                         {" "}
            </div>
          )}
                 {" "}
        </div>
                {/* MODAL CREAR/EDITAR */}       {" "}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                       {" "}
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                           {" "}
              <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 z-10">
                               {" "}
                <h3 className="text-xl font-bold text-gray-800">
                                   {" "}
                  {editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}         
                       {" "}
                </h3>
                               {" "}
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                                    <X className="w-6 h-6" />               {" "}
                </button>
                             {" "}
              </div>
                           {" "}
              <div className="p-6 space-y-5">
                               {" "}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start space-x-2">
                                       {" "}
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                       {" "}
                    <p className="text-sm text-red-600">{error}</p>             
                       {" "}
                  </div>
                )}
                                {/* Username */}               {" "}
                <div>
                                   {" "}
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username{" "}
                    <span className="text-red-500">*</span>                 {" "}
                  </label>
                                   {" "}
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="usuario123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                                 {" "}
                </div>
                                {/* Nombres y Apellidos */}               {" "}
                <div className="grid md:grid-cols-2 gap-4">
                                   {" "}
                  <div>
                                       {" "}
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombres{" "}
                      <span className="text-red-500">*</span>                   {" "}
                    </label>
                                       {" "}
                    <input
                      type="text"
                      value={formData.nombres}
                      onChange={(e) =>
                        setFormData({ ...formData, nombres: e.target.value })
                      }
                      placeholder="Juan Carlos"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                    />
                                   {" "}
                  </div>
                                 {" "}
                  <div>
                                     {" "}
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Apellidos{" "}
                      <span className="text-red-500">*</span>                 {" "}
                    </label>
                                     {" "}
                    <input
                      type="text"
                      value={formData.apellidos}
                      onChange={(e) =>
                        setFormData({ ...formData, apellidos: e.target.value })
                      }
                      placeholder="Pérez García"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                    />
                                   {" "}
                  </div>
                                 {" "}
                </div>
                                {/* Correo */}               {" "}
                <div>
                                   {" "}
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Correo electrónico{" "}
                    <span className="text-red-500">*</span>                 {" "}
                  </label>
                                   {" "}
                  <input
                    type="email"
                    value={formData.correo}
                    onChange={(e) =>
                      setFormData({ ...formData, correo: e.target.value })
                    }
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                                 {" "}
                </div>
                                {/* Contraseñas */}               {" "}
                <div className="grid md:grid-cols-2 gap-4">
                                   {" "}
                  <div>
                                       {" "}
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                           {" "}
                      {editingUsuario
                        ? "Nueva contraseña (dejar vacío para no cambiar)"
                        : "Contraseña"}
                                           {" "}
                      {!editingUsuario && (
                        <span className="text-red-500">*</span>
                      )}
                                         {" "}
                    </label>
                                       {" "}
                    <input
                      type="password"
                      value={formData.contrasena}
                      onChange={(e) =>
                        setFormData({ ...formData, contrasena: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                    />
                                     {" "}
                  </div>
                                   {" "}
                  <div>
                                       {" "}
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirmar contraseña                
                         {" "}
                    </label>
                                       {" "}
                    <input
                      type="password"
                      value={formData.confirmarContrasena}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmarContrasena: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                    />
                                     {" "}
                  </div>
                                 {" "}
                </div>
                                {/* Perfil/Rol, Proveedor y Estado */}         
                     {" "}
                <div className="grid md:grid-cols-3 gap-4">
                                    {/* Perfil/Rol */}                 {" "}
                  <div>
                                       {" "}
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Perfil/Rol{" "}
                      <span className="text-red-500">*</span>                   {" "}
                    </label>
                                       {" "}
                    <select
                      value={formData.id_perfil}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          id_perfil: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white"
                    >
                                           {" "}
                      {perfilesDisponibles.map((perfil) => (
                        <option key={perfil.id_perfil} value={perfil.id_perfil}>
                                                    {perfil.nombre}             
                                   {" "}
                        </option>
                      ))}
                                         {" "}
                    </select>
                                     {" "}
                  </div>
                                    {/* Proveedor */}                 {" "}
                  <div>
                                       {" "}
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Proveedor                    {" "}
                    </label>
                                       {" "}
                    <select
                      value={formData.provider}
                      onChange={(e) =>
                        setFormData({ ...formData, provider: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white"
                    >
                                            <option value="local">Local</option>
                                           {" "}
                      <option value="google">Google</option>                   {" "}
                    </select>
                                     {" "}
                  </div>
                                    {/* Estado */}                 {" "}
                  <div>
                                       {" "}
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Estado                    {" "}
                    </label>
                                       {" "}
                    <select
                      value={formData.estado}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estado: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white"
                    >
                                            <option value={1}>Activo</option>   
                                        <option value={0}>Inactivo</option>     
                                   {" "}
                    </select>
                                     {" "}
                  </div>
                                 {" "}
                </div>
                             {" "}
              </div>
                            {/* Footer del modal */}             {" "}
              <div className="sticky bottom-0 bg-white flex items-center justify-end space-x-3 p-6 border-t border-gray-200 z-10">
                               {" "}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all text-sm font-semibold"
                >
                                    Cancelar                {" "}
                </button>
                               {" "}
                <button
                  onClick={handleGuardar}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md active:shadow-none transform active:scale-95 text-sm font-semibold"
                >
                                    {editingUsuario ? "Actualizar" : "Crear"}   
                             {" "}
                </button>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
        )}
                {/* Modal de Confirmación/Alerta */}       {" "}
        {showConfirmModal && (
          <ConfirmationModal
            title={modalContent.title}
            message={modalContent.message}
            onConfirm={modalContent.onConfirm}
            onClose={closeConfirmModal}
            isConfirmation={modalContent.isConfirmation}
          />
        )}
             {" "}
      </div>
         {" "}
    </div>
  );
};

// Exportamos el componente envuelto en ErrorBoundary
const UsuarioManagement = (props) => (
  <ErrorBoundary>
        <UsuarioManagementInner {...props} /> {" "}
  </ErrorBoundary>
);

export default UsuarioManagement;
