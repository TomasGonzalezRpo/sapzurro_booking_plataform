import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
// Importar la librería de EmailJS
import emailjs from "@emailjs/browser";

const AuthContext = createContext();
const STORAGE_KEY = "sapzurro_user";

// 🎯 ACCIÓN REQUERIDA: Reemplaza estos IDs con tus valores reales de EmailJS
const SERVICE_ID = "service_jl0zlxh";
const TEMPLATE_ID = "template_dnmt1se";
const PUBLIC_KEY = "CL0NXTguTkfLmGwwv";

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
  id_perfil: data.id_perfil ?? 2, // por defecto: Usuario
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
  }, [user]); // Función de LOGIN

  const login = async (email, password) => {
    setLoading(true);
    try {
      // NOTA: Aquí deberías reemplazar la simulación con la llamada real a tu API de Backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "test@admin.com" && password === "123") {
        const userData = {
          id_perfil: 1,
          rol: "Administrador",
          correo: email,
          username: "admin",
        };
        const u = buildUser(userData);
        setUser(u);
        setIsAuthModalOpen(false);
      } else if (email === "inactivo@test.com") {
        throw new Error("El usuario está inactivo o ha sido inhabilitado.");
      } else {
        throw new Error("Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error en login:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }; // Función de REGISTRO
  const registerUser = async (formData) => {
    setLoading(true);
    try {
      // NOTA: Aquí deberías reemplazar la simulación con la llamada real a tu API de Backend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newUser = buildUser({ ...formData, id_perfil: 2, rol: "Usuario" });
      setUser(newUser);
      setIsAuthModalOpen(false);

      return { success: true, message: "Usuario registrado exitosamente" };
    } catch (error) {
      console.error("Error en registerUser:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerAliado = () => ({
    success: true,
    message:
      "Solicitud enviada. Un administrador revisará tu solicitud en las próximas 24-48 horas.",
  }); // 🎯 FUNCIÓN DE RECUPERACIÓN (CORREGIDA)

  const recoverCredentials = async (email) => {
    setLoading(true);
    try {
      // 1. LLAMADA AL BACKEND: Usando el puerto 5000 (el de tu servidor)
      const backendResponse = await fetch(
        "http://localhost:5000/api/auth/forgot-password", // ✅ PUERTO CORREGIDO
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!backendResponse.ok) {
        throw new Error("El servicio de recuperación no está disponible.");
      }

      const data = await backendResponse.json();
      const { recoveryLink } = data; // 2. Comprobación de Link Seguro: Si el Backend no devuelve el link (email no existe), salimos.

      if (!recoveryLink) {
        return;
      } // 3. ENVÍO DEL CORREO con EmailJS

      const templateParams = {
        user_email: email,
        recovery_link: recoveryLink, // Link generado por tu servidor
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      console.log(
        `[RECOVERY]: Correo de restablecimiento enviado con éxito a ${email}.`
      );
    } catch (error) {
      console.error("Error en recoverCredentials:", error.message);
      throw new Error(
        error.message ||
          "Ocurrió un error al procesar tu solicitud. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
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
