const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "sapzurro_ecoturismo",
      port: 3307,
    });

    // Usuarios y contraseñas que quieres asignar
    const usuarios = [
      { correo: "yonier@gmail.com", password: "admin123" },
      { correo: "tomas@hotmail.com", password: "clave123" },
      { correo: "andres@gmail.com", password: "usuario123" },
      { correo: "tomasgonza-pk@hotmail.com", password: "123456" },
    ];

    for (const user of usuarios) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const [result] = await connection.execute(
        "UPDATE usuario u JOIN persona p ON u.id_persona = p.id_persona SET u.contrasena = ? WHERE p.correo = ?",
        [hashedPassword, user.correo]
      );
      console.log(`${user.correo} -> contraseña actualizada`);
    }

    await connection.end();
    console.log(
      "Proceso completado. Ahora prueba iniciar sesión con los correos y contraseñas asignadas."
    );
  } catch (error) {
    console.error("Error:", error);
  }
})();
