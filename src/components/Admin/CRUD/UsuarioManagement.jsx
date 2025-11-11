import React, { useState, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

/**
 * Componente Modal de Confirmación o Mensaje
 * Reemplaza los usos de alert() y confirm()
 */
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
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden transform transition-all scale-100">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${bg}`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">{message}</p>
        </div>

        <div className="flex justify-end space-x-3 p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
          >
            {isConfirmation ? "Cancelar" : "Cerrar"}
          </button>
          {isConfirmation && (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md"
            >
              Confirmar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const UsuarioManagement = () => {
  // Datos simulados
  const [usuarios, setUsuarios] = useState([
    {
      id_usuario: 1,
      username: "admin",
      contrasena: "admin123",
      id_persona: 1,
      nombres: "Yonier",
      apellidos: "Garcés",
      correo: "Yonier@gmail.com",
      id_perfil: 1,
      rol: "Administrador",
      provider: "local",
      estado: 1,
    },
    {
      id_usuario: 2,
      username: "hotelmar",
      contrasena: "clave123",
      id_persona: 2,
      nombres: "Tomas",
      apellidos: "Gonzáles",
      correo: "yonier@gmail.com",
      id_perfil: 3,
      rol: "Aliado",
      provider: "local",
      estado: 1,
    },
    {
      id_usuario: 3,
      username: "usuario1",
      contrasena: "usuario123",
      id_persona: 3,
      nombres: "Andrés",
      apellidos: "González",
      correo: "maria@gmail.com",
      id_perfil: 2,
      rol: "Usuario",
      provider: "local",
      estado: 1,
    },
  ]);

  // Perfiles disponibles
  const perfilesDisponibles = [
    { id_perfil: 1, nombre: "Administrador" },
    { id_perfil: 2, nombre: "Usuario" },
    { id_perfil: 3, nombre: "Aliado" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  // Estado para el modal de Crear/Editar
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

  // ESTADOS PARA EL MODAL DE CONFIRMACIÓN/MENSAJES (Reemplaza alert/confirm)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalContent, setModalContent] = useState({}); // { title, message, onConfirm, isConfirmation }

  // Función para abrir el modal de confirmación/mensaje
  const openConfirmModal = useCallback((title, message, onConfirm = null) => {
    setModalContent({
      title,
      message,
      onConfirm,
      isConfirmation: !!onConfirm,
    });
    setShowConfirmModal(true);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setShowConfirmModal(false);
    setModalContent({});
  }, []);

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  };

  // Abrir modal para crear
  const handleNuevo = () => {
    setEditingUsuario(null);
    setFormData({
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
    setError("");
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEditar = (usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      username: usuario.username,
      contrasena: "", // No mostrar contraseña actual
      confirmarContrasena: "",
      id_perfil: usuario.id_perfil,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      provider: usuario.provider,
      estado: usuario.estado,
    });
    setError("");
    setShowModal(true);
  };

  // Guardar (crear o actualizar)
  const handleGuardar = () => {
    setError("");

    // Validaciones
    if (!formData.username.trim()) {
      setError("El username es obligatorio");
      return;
    }

    if (!formData.nombres.trim() || !formData.apellidos.trim()) {
      setError("Nombres y apellidos son obligatorios");
      return;
    }

    if (!formData.correo.trim()) {
      setError("El correo es obligatorio");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError("Por favor ingresa un correo válido");
      return;
    }

    // Validar contraseña solo al crear o si se está cambiando
    if (!editingUsuario) {
      if (!formData.contrasena) {
        setError("La contraseña es obligatoria");
        return;
      }
      if (formData.contrasena.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (formData.contrasena !== formData.confirmarContrasena) {
        setError("Las contraseñas no coinciden");
        return;
      }
    } else if (formData.contrasena) {
      // Si está editando y quiere cambiar la contraseña
      if (formData.contrasena.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (formData.contrasena !== formData.confirmarContrasena) {
        setError("Las contraseñas no coinciden");
        return;
      }
    }

    // Verificar duplicados
    const usernameDuplicado = usuarios.find(
      (u) =>
        u.username.toLowerCase() === formData.username.toLowerCase() &&
        (!editingUsuario || u.id_usuario !== editingUsuario.id_usuario)
    );
    if (usernameDuplicado) {
      setError("Ya existe un usuario con este username");
      return;
    }

    const correoDuplicado = usuarios.find(
      (u) =>
        u.correo.toLowerCase() === formData.correo.toLowerCase() &&
        (!editingUsuario || u.id_usuario !== editingUsuario.id_usuario)
    );
    if (correoDuplicado) {
      setError("Ya existe un usuario con este correo");
      return;
    }

    // Obtener nombre del rol
    const rolSeleccionado = perfilesDisponibles.find(
      (p) => p.id_perfil === formData.id_perfil
    );

    if (editingUsuario) {
      // Actualizar
      setUsuarios(
        usuarios.map((u) =>
          u.id_usuario === editingUsuario.id_usuario
            ? {
                ...u,
                username: formData.username,
                ...(formData.contrasena && { contrasena: formData.contrasena }), // Solo actualizar si hay nueva contraseña
                id_perfil: formData.id_perfil,
                rol: rolSeleccionado.nombre,
                nombres: formData.nombres,
                apellidos: formData.apellidos,
                correo: formData.correo,
                provider: formData.provider,
                estado: formData.estado,
              }
            : u
        )
      );
      // Reemplazo de alert()
      openConfirmModal("Éxito", "Usuario actualizado exitosamente.");
    } else {
      // Crear
      const newUsuario = {
        id_usuario: Math.max(...usuarios.map((u) => u.id_usuario)) + 1,
        id_persona: Math.max(...usuarios.map((u) => u.id_persona || 0)) + 1,
        username: formData.username,
        contrasena: formData.contrasena,
        id_perfil: formData.id_perfil,
        rol: rolSeleccionado.nombre,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        provider: formData.provider,
        estado: formData.estado,
      };
      setUsuarios([...usuarios, newUsuario]);
      // Reemplazo de alert()
      openConfirmModal("Éxito", "Usuario creado exitosamente.");
    }

    setShowModal(false);
  };

  // Inhabilitar (borrado lógico)
  const handleInhabilitar = (usuario) => {
    const action = usuario.estado === 1 ? "inhabilitar" : "habilitar";
    const message = `¿Está seguro de ${action} al usuario "${usuario.username}"?`;

    // Reemplazo de confirm()
    openConfirmModal(
      `${action === "inhabilitar" ? "Inhabilitar" : "Habilitar"} Usuario`,
      message,
      () => {
        setUsuarios((currentUsers) =>
          currentUsers.map((u) =>
            u.id_usuario === usuario.id_usuario
              ? { ...u, estado: u.estado === 1 ? 0 : 1 }
              : u
          )
        );
        // Reemplazo de alert()
        openConfirmModal(
          "Éxito",
          `Usuario ${
            action === "inhabilitar" ? "inhabilitado" : "habilitado"
          } exitosamente.`
        );
      }
    );
  };

  // Eliminar físicamente
  const handleEliminar = (usuario) => {
    const message = `¿Está seguro de ELIMINAR PERMANENTEMENTE al usuario "${usuario.username}"? Esta acción no se puede deshacer.`;

    // Reemplazo de confirm()
    openConfirmModal("Confirmar Eliminación Permanente", message, () => {
      setUsuarios((currentUsers) =>
        currentUsers.filter((u) => u.id_usuario !== usuario.id_usuario)
      );
      // Reemplazo de alert()
      openConfirmModal("Éxito", "Usuario eliminado permanentemente.");
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 mt-2">
            Administra las credenciales y permisos de los usuarios
          </p>
        </div>
        <button
          onClick={handleNuevo}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md active:shadow-none transform active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por username, nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Nombre Completo
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Correo
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Proveedor
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Estado
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsuarios.map((usuario) => (
                <tr
                  key={usuario.id_usuario}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {usuario.id_usuario}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {usuario.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {usuario.nombres} {usuario.apellidos}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {usuario.correo}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRolColor(
                        usuario.rol
                      )}`}
                    >
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {usuario.provider === "local" ? "🔑 Local" : "🌐 Google"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        usuario.estado === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {usuario.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditar(usuario)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all active:bg-blue-100"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Botón Inhabilitar/Habilitar */}
                      <button
                        onClick={() => handleInhabilitar(usuario)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-sm ${
                          usuario.estado === 1
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                        title={
                          usuario.estado === 1 ? "Inhabilitar" : "Habilitar"
                        }
                      >
                        {usuario.estado === 1 ? "Inhabilitar" : "Habilitar"}
                      </button>

                      {/* Botón Eliminar */}
                      <button
                        onClick={() => handleEliminar(usuario)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all active:bg-red-100"
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

        {filteredUsuarios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header del modal */}
            <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 z-10">
              <h3 className="text-xl font-bold text-gray-800">
                {editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="usuario123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {editingUsuario
                      ? "Nueva contraseña (dejar vacío para no cambiar)"
                      : "Contraseña"}
                    {!editingUsuario && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.contrasena}
                    onChange={(e) =>
                      setFormData({ ...formData, contrasena: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar contraseña
                  </label>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombres}
                    onChange={(e) =>
                      setFormData({ ...formData, nombres: e.target.value })
                    }
                    placeholder="Juan Carlos"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) =>
                      setFormData({ ...formData, apellidos: e.target.value })
                    }
                    placeholder="Pérez García"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perfil/Rol <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.id_perfil}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id_perfil: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                  >
                    {perfilesDisponibles.map((perfil) => (
                      <option key={perfil.id_perfil} value={perfil.id_perfil}>
                        {perfil.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proveedor
                  </label>
                  <select
                    value={formData.provider}
                    onChange={(e) =>
                      setFormData({ ...formData, provider: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                  >
                    <option value="local">Local</option>
                    <option value="google">Google</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estado: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-white flex items-center justify-end space-x-3 p-6 border-t border-gray-200 z-10">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md active:shadow-none transform active:scale-95"
              >
                {editingUsuario ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación/Mensaje */}
      {showConfirmModal && (
        <ConfirmationModal
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={modalContent.onConfirm}
          onClose={closeConfirmModal}
          isConfirmation={modalContent.isConfirmation}
        />
      )}
    </div>
  );
};

export default UsuarioManagement;
