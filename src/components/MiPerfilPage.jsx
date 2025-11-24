// src/components/MiPerfilPage.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Edit2,
  Save,
  AlertCircle,
  CheckCircle,
  Shield,
} from "lucide-react";

// Página/modal para ver y editar el perfil del usuario.
// Comentarios escritos de forma simple, como los pondría un dev junior.
const MiPerfilPage = ({ onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [datos, setDatos] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    direccion: "",
    usuario: "",
    rol: "",
    tipo_documento: "",
    numero_documento: "",
  });

  const [datosCopia, setDatosCopia] = useState({});

  // Obtener los datos del perfil al montar el componente
  useEffect(() => {
    const obtenerMiPerfil = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "http://localhost:5000/api/perfiles/mi-perfil",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("sapzurro_token")}`,
            },
          }
        );

        if (response.data.success) {
          const { datos: datosFetch } = response.data;

          const datosFormateados = {
            nombres: datosFetch.persona?.nombres || "",
            apellidos: datosFetch.persona?.apellidos || "",
            correo: datosFetch.persona?.correo || "",
            telefono: datosFetch.persona?.telefono || "",
            direccion: datosFetch.persona?.direccion || "",
            usuario: datosFetch.usuario || "",
            rol: datosFetch.perfil?.nombre || "",
            tipo_documento: datosFetch.persona?.tipo_documento || "",
            numero_documento: datosFetch.persona?.numero_documento || "",
          };

          setDatos(datosFormateados);
          setDatosCopia(datosFormateados);
        } else {
          setError(response.data.message || "Error al obtener datos");
        }
      } catch (err) {
        console.error("Error:", err);
        setError(
          err.response?.data?.message || err.message || "Error al cargar perfil"
        );
      } finally {
        setLoading(false);
      }
    };

    obtenerMiPerfil();
  }, []);

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  // Cancelar edición y restaurar datos originales
  const handleCancelar = () => {
    setDatos(datosCopia);
    setIsEditing(false);
    setError(null);
  };

  // Guardar cambios en el perfil
  const handleGuardar = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // validación básica
      if (!datos.nombres || !datos.apellidos || !datos.correo) {
        setError("Nombres, apellidos y correo son obligatorios");
        setSaving(false);
        return;
      }

      const payload = {
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        correo: datos.correo,
        telefono: datos.telefono,
        direccion: datos.direccion,
      };

      const response = await axios.put(
        "http://localhost:5000/api/perfiles/mi-perfil",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sapzurro_token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess("Perfil actualizado exitosamente");
        setDatosCopia(datos);
        setIsEditing(false);

        // limpiar mensaje luego de un tiempo
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.data.message || "Error al actualizar perfil");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.response?.data?.message || err.message || "Error al guardar cambios"
      );
    } finally {
      setSaving(false);
    }
  };

  // Mostrar loader mientras carga los datos
  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-12">
          <div className="animate-spin inline-block">⏳</div>
          <p className="text-gray-600 mt-2">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Render del modal/página de perfil
  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        {/* Encabezado con título y cerrar */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 flex justify-between items-start rounded-t-2xl">
          <div>
            <h2 className="text-3xl font-bold mb-1">Mi Perfil</h2>
            <p className="text-cyan-100">
              Visualiza y edita tu información personal
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-6 space-y-6">
          {/* Mensajes de error o éxito */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-800">Éxito</p>
                <p className="text-emerald-700 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Info de usuario y rol */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Usuario</p>
                <p className="font-semibold text-gray-800 mb-2">
                  {datos.usuario}
                </p>
                <p className="text-sm text-gray-600">Rol</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {datos.rol}
                </p>
              </div>
            </div>
          </div>

          {/* Formulario con los campos del perfil */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">
              Información Personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombres *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="nombres"
                    value={datos.nombres}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Apellidos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="apellidos"
                    value={datos.apellidos}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Correo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="correo"
                    value={datos.correo}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="telefono"
                    value={datos.telefono}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Tipo de documento (solo lectura) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={datos.tipo_documento}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Número de documento (solo lectura) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Documento
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={datos.numero_documento}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="direccion"
                  value={datos.direccion}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Botones de acción: editar / cancelar / guardar */}
          <div className="flex space-x-3 pt-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg"
              >
                <Edit2 className="w-5 h-5" />
                <span>Editar Perfil</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancelar}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  disabled={saving}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin">⏳</div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiPerfilPage;
