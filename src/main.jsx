import { StrictMode } from "react";
// Importamos la función para crear la raíz de React 18
import { createRoot } from "react-dom/client";
// Importamos los estilos globales de Tailwind CSS
import "./index.css";
// Importamos el componente principal de la aplicación
import App from "./App.jsx";
// Importamos el proveedor de contexto de autenticación
import { AuthProvider } from "./contexts/AuthContext.jsx";

// Seleccionamos el elemento del DOM donde inyectaremos la aplicación (usualmente un div con id="root")
createRoot(document.getElementById("root")).render(
  // StrictMode ayuda a encontrar problemas en la aplicación durante el desarrollo
  <StrictMode>
       {" "}
    {/* Envolvemos toda la aplicación con el proveedor de autenticación
        para que todos los componentes dentro puedan acceder a los datos y funciones del usuario.
    */}
       {" "}
    <AuthProvider>
            {/* El componente principal de nuestra UI */}
            <App />   {" "}
    </AuthProvider>
     {" "}
  </StrictMode>
);
