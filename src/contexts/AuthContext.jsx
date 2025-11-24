// AuthProvider.jsx - VERSIÓN MEJORADA (comentarios actualizados)
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

// Habilita el envío de cookies en todas las peticiones axios (útil si el backend usa cookies de sesión)
axios.defaults.withCredentials = true;

// Interceptor global: si hay token en localStorage lo añade al header Authorization de todas las peticiones
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usuarios ficticios para testing/local: permite hacer login sin backend durante desarrollo
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

// Hook de consumo: arroja si se utiliza fuera del provider para ayudar en debugging
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  return ctx;
};

// Normaliza/estructura un objeto usuario con valores por defecto seguros.
// Esto facilita la integración con componentes que esperan ciertas propiedades.
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

// Provider principal que expone estado y funciones de autenticación a la app
export const AuthProvider = ({ children }) => {
  // Cargar usuario inicial desde localStorage (si existe)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      // En caso de JSON inválido, devolvemos null para evitar romper la app
      return null;
    }
  });

  // Control del modal de autenticación (login/register)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // Estado de carga global para operaciones auth (login, register, recuperar)
  const [loading, setLoading] = useState(false);

  // Mantener sincronizado el usuario en localStorage cada vez que cambie
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  /**
   * login(email, password)
   * - Soporta dos modos:
   *    1) MOCK: usuarios definidos en MOCK_USERS (útil en desarrollo)
   *    2) BACKEND: hace POST a /api/auth/login y guarda token si el backend lo retorna
   * - Valida estado del usuario (campo `estado`) para evitar logins de cuentas inactivas.
   * - Guarda token en localStorage bajo TOKEN_KEY.
   * - Devuelve objeto { success: true, from: 'mock'|'backend' } en caso de éxito.
   * - Lanza error con mensaje amigable en caso de fallo.
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const mail = (email || "").toLowerCase().trim();

      // Modo mock (sin backend) — atajo para pruebas locales
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

        // Genera y guarda un token simulado para permitir que otras llamadas usen el interceptor
        const mockToken = `mock_token_${mail}_${Date.now()}`;
        localStorage.setItem(TOKEN_KEY, mockToken);

        const u = buildUser(mock);
        setUser(u);
        setIsAuthModalOpen(false);
        return { success: true, from: "mock" };
      }

      // Modo real: solicitar login al backend
      const response = await axios.post(`${API_URL}/login`, {
        correo: email,
        password,
      });

      // El backend puede devolver user directamente o dentro de response.data.user
      const userData = response.data?.user || response.data;

      if (!userData) {
        throw new Error("Respuesta inválida del servidor.");
      }

      if (userData.estado === 0) {
        throw new Error("El usuario está inactivo o ha sido inhabilitado.");
      }

      // Si el backend envía token, guardarlo en localStorage para futuras peticiones
      if (response.data?.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
      }

      const u = buildUser(userData);
      setUser(u);
      setIsAuthModalOpen(false);
      return { success: true, from: "backend" };
    } catch (error) {
      console.error("Error en login:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Correo o contraseña incorrectos. Inténtalo de nuevo.";
      // Re-lanzamos el error para que el componente llamador pueda mostrarlo al usuario
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * registerUser(formData)
   * - Crea un nuevo usuario estándar (id_perfil: 2) en el backend.
   * - Si el backend retorna token y user, los guarda/localiza en el provider.
   * - Devuelve un objeto con success/message/user para manejo desde el UI.
   */
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
        tipo_documento: formData.tipo_documento ?? null,
        numero_documento: formData.numero_documento ?? null,
      };

      const response = await axios.post(`${API_URL}/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data || {};

      // Guardar token si el backend lo devuelve tras registro
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }

      // Si el backend devuelve el usuario creado, lo usamos para iniciar sesión automáticamente
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
      console.error("registerUser error:", err?.response?.data || err.message);
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

  /**
   * registerAliado(formData)
   * - Solicitud para registrar un aliado/negocio (id_perfil: 3).
   * - No inicia sesión automáticamente; en su lugar devuelve mensaje sobre el envío.
   */
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
        tipo_documento: formData.tipo_documento ?? null,
        numero_documento: formData.numero_documento ?? null,
      };

      const response = await axios.post(`${API_URL}/register-aliado`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data || {};
      return {
        success: true,
        message:
          data.message ||
          "Solicitud enviada. Un administrador revisará tu solicitud en las próximas 24-48 horas.",
      };
    } catch (err) {
      console.error(
        "registerAliado error:",
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

  /**
   * recoverCredentials(email)
   * - Inicia el flujo de recuperación / "forgot password".
   * - Lanza un error si algo falla para que el UI pueda mostrarlo.
   * - Registra logs en consola para ayudar durante desarrollo.
   */
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

  /**
   * logout()
   * - Limpia el usuario del estado y elimina keys de localStorage.
   * - Redirige a la raíz (puedes cambiar esto por un comportamiento menos intrusivo si lo prefieres).
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY); // eliminar token al cerrar sesión
    // Redirigir a la home para evitar estados inconsistentes en la UI
    window.location.href = "/";
  };

  // Abrir / cerrar modal de autenticación (expuesto al UI)
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Memoizar el valor del contexto para evitar rerenders innecesarios
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
