// AuthProvider.jsx
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

// --- Config EmailJS (reemplaza si es necesario) ---
// inicializar una vez

// --- Config Backend ---
const API_URL = "http://localhost:5000/api/auth";

// Usuarios de prueba locales
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
    password: "cualquier", // no usaremos password; el usuario está inactivo
    id_perfil: 2,
    rol: "Usuario",
    username: "inactivo",
    nombres: "Usuario",
    apellidos: "Inactivo",
    correo: "inactivo@test.com",
    estado: 0, // 0 = inactivo
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

  /**
   * login(email, password)
   * - Si email coincide con un MOCK_USER: usa la cuenta de prueba (sin llamar al backend)
   * - Si es 'inactivo@test.com' lanza error de usuario inactivo
   * - Si no coincide, intenta login contra el backend
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Normalizamos email
      const mail = (email || "").toLowerCase().trim();

      // 1) Si es un usuario de prueba
      if (Object.prototype.hasOwnProperty.call(MOCK_USERS, mail)) {
        const mock = MOCK_USERS[mail];

        // Usuario inactivo: rechazado
        if (mock.estado === 0) {
          throw new Error("El usuario está inactivo o ha sido inhabilitado.");
        }

        // Verificamos contraseña (solo para test admin)
        if (mock.password && mock.password !== password) {
          throw new Error(
            "Correo o contraseña incorrectos (usuario de prueba)."
          );
        }

        const u = buildUser(mock);
        setUser(u);
        setIsAuthModalOpen(false);
        return { success: true, from: "mock" };
      }

      // 2) Si no es usuario de prueba -> login real al backend
      const response = await axios.post(`${API_URL}/login`, {
        correo: email,
        password,
      });

      const userData = response.data?.user || response.data;

      if (!userData) {
        throw new Error("Respuesta inválida del servidor.");
      }

      // Si backend indica que el usuario está inactivo (campo 'estado' igual a 0)
      if (userData.estado === 0) {
        throw new Error("El usuario está inactivo o ha sido inhabilitado.");
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
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * registerUser: intenta registrar en backend y devuelve { success, message, user? }
   */
  const registerUser = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        usuario: formData.username,
        password: formData.password,
        id_perfil: 2,
        // Si tu backend crea la persona desde aquí, enviamos los campos personales
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

      // Si el backend devuelve el usuario creado, lo guardamos en el contexto
      if (data.user) {
        const newUser = buildUser(data.user);
        setUser(newUser);
        setIsAuthModalOpen(false);
      }

      // Mensaje exitoso (backend puede devolver message)
      return {
        success: true,
        message: data.message || "Usuario registrado exitosamente",
        user: data.user ?? null,
      };
    } catch (err) {
      // Log completo para debugging en consola
      console.error(
        "registerUser error detalle:",
        err?.response?.data || err.message
      );

      // Extraer mensaje amigable si viene del backend
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Ocurrió un error al registrar el usuario.";

      // No hacemos throw: devolvemos un objeto consistente que el formulario espera
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * registerAliado: registra solicitud de aliado y devuelve { success, message }
   */
  const registerAliado = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        usuario: formData.username,
        password: formData.password,
        id_perfil: 3, // si tus perfiles usan 3 para aliado
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
        "registerAliado error detalle:",
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
   * 🔐 recoverCredentials: Llama SOLO al backend
   * El backend se encarga de:
   * 1. Generar el token de recuperación
   * 2. Guardarlo en BD con expiración
   * 3. Enviar el correo con EmailJS (BACKEND, no frontend)
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
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
