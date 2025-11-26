// src/components/MiPerfilContent.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
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
  Loader,
} from "lucide-react";

const MiPerfilContent = () => {
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

  // OBTENER MIS DATOS
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

  // MANEJAR CAMBIOS EN INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  // CANCELAR EDICIÓN
  const handleCancelar = () => {
    setDatos(datosCopia);
    setIsEditing(false);
    setError(null);
  };

  // GUARDAR CAMBIOS
  const handleGuardar = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-12 h-12 text-cyan-500 mx-auto animate-spin" />
          <p className="text-gray-600 mt-4">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
        <p className="text-gray-600 mt-2">
          Visualiza y edita tu información personal
        </p>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border-l-4 border-l-red-500 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border-l-4 border-l-emerald-500 rounded-lg p-4 flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-800">Éxito</p>
            <p className="text-emerald-700 text-sm">{success}</p>
          </div>
        </div>
      )}

      {/* Información de rol y usuario */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 font-medium">Usuario</p>
            <p className="font-semibold text-gray-800 mb-3">{datos.usuario}</p>
            <p className="text-sm text-gray-600 font-medium">Rol</p>
            <p className="font-semibold text-gray-800 capitalize">
              {datos.rol}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">
          Información Personal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Tipo Documento */}
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

          {/* Número Documento */}
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

        {/* Dirección (full width) */}
        <div className="mt-6">
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

        {/* Botones de acción */}
        <div className="flex space-x-3 pt-8 mt-8 border-t border-gray-200">
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
                    <Loader className="w-5 h-5 animate-spin" />
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
  );
};

export default MiPerfilContent;
