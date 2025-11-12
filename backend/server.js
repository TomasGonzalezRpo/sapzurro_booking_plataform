const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models/index");

const perfilRoutes = require("./routes/perfil.routes");
const personaRoutes = require("./routes/persona.routes");
const usuarioRoutes = require("./routes/usuario.routes");

const authRoutes = require("./routes/usuario.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());

// ====================================================================
// Mapeo de Rutas
// ====================================================================

app.use("/api/perfiles", perfilRoutes);
app.use("/api/personas", personaRoutes);

// Mapeo de las rutas CRUD de usuarios
app.use("/api/usuarios", usuarioRoutes);

app.use("/api/auth", authRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL establecida correctamente.");

    await sequelize.sync({ alter: true });
    console.log(
      "🛠️ Modelos (Perfil, Persona, Usuario) sincronizados con la base de datos."
    );

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ Error al iniciar el servidor o conectar a la DB:",
      error.message
    );
  }
};

startServer();
