// AuthProvider.jsx - VERSIÓN MEJORADA Y CORREGIDA
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

const AuthContext = createContext();
const STORAGE_KEY = "sapzurro_user";
const TOKEN_KEY = "sapzurro_token";

const API_URL = "http://localhost:5000/api/auth";

// Configurar axios para incluir credenciales en TODAS las peticiones
axios.defaults.withCredentials = true;

// Interceptor: añade el token a cada petición
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log(
    "🔑 Token enviado en request:",
    token ? "✅ Presente" : "❌ Ausente"
  );

  if (token) {
    // Asegurarse de que tenga el formato correcto
    const formattedToken = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
    config.headers.Authorization = formattedToken;
    console.log(
      "📨 Authorization header:",
      config.headers.Authorization.substring(0, 20) + "..."
    );
  }
  return config;
});

const MOCK_USERS = {
  "test@admin.com": {
    password: "123",
    id_perfil: 1,
    rol: "Administrador",
    username: "admin",
    nombres: "Admin",
    apellidos: "Test",
    correo: "test@admin.com",
    estado: 1,
  },
  "inactivo@test.com": {
    password: "cualquier",
    id_perfil: 2,
    rol: "Usuario",
    username: "inactivo",
    nombres: "Usuario",
    apellidos: "Inactivo",
    correo: "inactivo@test.com",
    estado: 0,
  },
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  return ctx;
};

const buildUser = (data = {}) => ({
  id_usuario: data.id_usuario ?? Math.floor(Math.random() * 10000),
  username: data.username ?? "",
  nombres: data.nombres ?? "",
  apellidos: data.apellidos ?? "",
  correo: data.correo ?? "",
  telefono: data.telefono ?? "",
  id_perfil: data.id_perfil ?? 2,
  rol: data.rol ?? "Usuario",
  foto_url: data.foto_url ?? null,
  estado: data.estado ?? 1,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const mail = (email || "").toLowerCase().trim();

      if (Object.prototype.hasOwnProperty.call(MOCK_USERS, mail)) {
        const mock = MOCK_USERS[mail];

        if (mock.estado === 0) {
          throw new Error("El usuario está inactivo o ha sido inhabilitado.");
        }

        if (mock.password && mock.password !== password) {
          throw new Error(
            "Correo o contraseña incorrectos (usuario de prueba)."
          );
        }

        // ✨ NUEVO: Guardar un token mock para usuarios de prueba
        const mockToken = `mock_token_${mail}_${Date.now()}`;
        localStorage.setItem(TOKEN_KEY, mockToken);
        console.log("✅ Token mock guardado:", mockToken);

        const u = buildUser(mock);
        setUser(u);
        setIsAuthModalOpen(false);
        return { success: true, from: "mock" };
      }

      // Login real
      console.log("🔐 Intentando login con:", email);
      const response = await axios.post(`${API_URL}/login`, {
        correo: email,
        password,
      });

      console.log("✅ Login response:", response.data);

      const userData = response.data?.user || response.data;

      if (!userData) {
        throw new Error("Respuesta inválida del servidor.");
      }

      if (userData.estado === 0) {
        throw new Error("El usuario está inactivo o ha sido inhabilitado.");
      }

      // ✨ NUEVO: Guardar el token del backend
      if (response.data?.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        console.log("✅ Token JWT guardado en localStorage");
      }

      const u = buildUser(userData);
      setUser(u);
      setIsAuthModalOpen(false);
      return { success: true, from: "backend" };
    } catch (error) {
      console.error("❌ Error en login:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Correo o contraseña incorrectos. Inténtalo de nuevo.";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        usuario: formData.username,
        password: formData.password,
        id_perfil: 2,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        telefono: formData.telefono ?? "",
        direccion: formData.direccion ?? "",
        tipo_documento: formData.tipo_documento ?? "CC",
        numero_documento: formData.numero_documento ?? "",
        id_tipo_persona: formData.id_tipo_persona ?? 1, // ← AGREGAR TIPO DE PERSONA
      };

      console.log("📝 Registro payload:", payload);

      const response = await axios.post(`${API_URL}/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Registro response:", response.data);

      const data = response.data || {};

      // ✨ NUEVO: Guardar token tras registro
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        console.log("✅ Token JWT guardado después de registro");
      }

      if (data.user) {
        const newUser = buildUser(data.user);
        setUser(newUser);
        setIsAuthModalOpen(false);
      }

      return {
        success: true,
        message: data.message || "Usuario registrado exitosamente",
        user: data.user ?? null,
      };
    } catch (err) {
      console.error(
        "❌ registerUser error:",
        err?.response?.data || err.message
      );
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Ocurrió un error al registrar el usuario.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const registerAliado = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        usuario: formData.username,
        password: formData.password,
        id_perfil: 3,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        telefono: formData.telefono ?? "",
        direccion: formData.direccion ?? "",
        nombreNegocio: formData.nombreNegocio,
        tipoNegocio: formData.tipoNegocio,
        descripcionNegocio: formData.descripcionNegocio ?? "",
        tipo_documento: formData.tipo_documento ?? "CC",
        numero_documento: formData.numero_documento ?? "",
        id_tipo_persona: formData.id_tipo_persona ?? 1, // ← AGREGAR TIPO DE PERSONA
      };

      console.log("📝 Aliado registro payload:", payload);

      const response = await axios.post(`${API_URL}/register-aliado`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data || {};

      console.log("✅ Aliado registro response:", response.data);

      return {
        success: true,
        message:
          data.message ||
          "Solicitud enviada. Un administrador revisará tu solicitud en las próximas 24-48 horas.",
      };
    } catch (err) {
      console.error(
        "❌ registerAliado error:",
        err?.response?.data || err.message
      );
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Error al enviar la solicitud del aliado.";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const recoverCredentials = async (email) => {
    setLoading(true);
    try {
      console.log("📧 Iniciando recuperación de contraseña para:", email);

      const response = await axios.post(
        `${API_URL}/forgot-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Respuesta del backend:", response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Error al recuperar contraseña"
        );
      }

      return {
        success: true,
        message:
          response.data.message ||
          "Correo de recuperación enviado (si la cuenta existe)",
      };
    } catch (error) {
      console.error("❌ Error en recoverCredentials:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Error al procesar la recuperación de contraseña.";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("🚪 Cerrando sesión...");
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/";
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAuthModalOpen,
      loading,
      login,
      logout,
      registerUser,
      registerAliado,
      recoverCredentials,
      openAuthModal,
      closeAuthModal,
    }),
    [user, isAuthModalOpen, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
