// AuthProvider.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";

const AuthContext = createContext();
const STORAGE_KEY = "sapzurro_user";

// --- Config EmailJS (reemplaza si es necesario) ---
const SERVICE_ID = "service_jl0zlxh";
const TEMPLATE_ID = "template_dnmt1se";
const PUBLIC_KEY = "CL0NXTguTkfLmGwwv";
emailjs.init(PUBLIC_KEY); // inicializar una vez

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
   * registerUser: intenta registrar en backend (mantengo tu implementación real)
   */
  const registerUser = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        usuario: formData.username,
        password: formData.password,
        id_perfil: 2,
        id_persona: formData.id_persona ?? null,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        telefono: formData.telefono ?? "",
      };

      const response = await axios.post(`${API_URL}/register`, payload);
      const userData = response.data?.user || response.data;

      const newUser = buildUser(userData);
      setUser(newUser);
      setIsAuthModalOpen(false);

      return { success: true, message: "Usuario registrado exitosamente" };
    } catch (error) {
      console.error("Error en registerUser:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Ocurrió un error al registrar el usuario.";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * registerAliado: ejemplo real que llama al backend
   */
  const registerAliado = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register-aliado`, formData);
      return {
        success: true,
        message:
          response.data?.message ||
          "Solicitud enviada. Un administrador revisará tu solicitud en las próximas 24-48 horas.",
      };
    } catch (error) {
      console.error("Error en registerAliado:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Error al enviar la solicitud del aliado."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * recoverCredentials: llama al backend para generar link y lo envía con EmailJS
   */
  const recoverCredentials = async (email) => {
    setLoading(true);
    try {
      const backendResponse = await axios.post(
        `${API_URL}/forgot-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      const { recoveryLink } = backendResponse.data;

      if (!recoveryLink) {
        console.error(
          "Backend no devolvió recoveryLink:",
          backendResponse.data
        );
        throw new Error(
          "El servidor no devolvió el enlace de recuperación. Revisa backend."
        );
      }

      const templateParams = {
        user_email: email,
        recovery_link: recoveryLink,
      };

      const emailjsResult = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );

      if (emailjsResult?.status && emailjsResult.status !== 200) {
        console.error(
          `[EMAILJS ERROR]: Status ${emailjsResult.status} - ${emailjsResult.text}`
        );
        throw new Error("Fallo el envío del correo. Revisa EmailJS.");
      }

      return { success: true, message: "Correo de recuperación enviado." };
    } catch (error) {
      console.error("Error en recoverCredentials:", error);
      const msg =
        error.response?.data?.message || error.message || "Error al recuperar.";
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
