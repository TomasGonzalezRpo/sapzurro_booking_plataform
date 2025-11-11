import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext();
const STORAGE_KEY = "sapzurro_user";

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

  // Sincroniza user <-> localStorage
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  // Función de LOGIN
  const login = async (email, password) => {
    setLoading(true);
    try {
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
        // Simulación de usuario inhabilitado (estado=0)
        throw new Error("El usuario está inactivo o ha sido inhabilitado.");
      } else {
        // Simulación de credenciales incorrectas
        throw new Error("Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error en login:", error.message);
      throw error; // Propagar el error al LoginForm
    } finally {
      setLoading(false);
    }
  };

  // Función de REGISTRO
  const registerUser = async (formData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newUser = buildUser({ ...formData, id_perfil: 2, rol: "Usuario" });
      setUser(newUser); // Inicia sesión inmediatamente después de registrar
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
  });

  // Función de RECUPERACIÓN
  const recoverCredentials = async (email) => {
    setLoading(true);
    try {
      // Implementar llamada real a la API para enviar correo
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simula latencia y envío de email

      // Simulación de error (correo no registrado)
      if (email.toLowerCase().includes("notfound")) {
        // Mensaje que cumple con el requisito si el usuario no está registrado
        throw new Error("El usuario no se encuentra registrado");
      }

      // Simulación de éxito
      console.log(
        `[RECOVERY]: Solicitud de credenciales para ${email} procesada.`
      );
    } catch (error) {
      console.error("Error en recoverCredentials:", error.message);
      throw error;
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
