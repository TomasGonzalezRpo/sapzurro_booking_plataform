const bcrypt = require("bcrypt"); // Importa la librería para hasheo de contraseñas
const mysql = require("mysql2/promise"); // Importa el cliente MySQL que soporta promesas

// Función autoejecutable asíncrona para manejar la lógica
(async () => {
  try {
    // 1. Establecer la conexión a la base de datos
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", // ¡Asegúrate de que la contraseña aquí sea la correcta si la tienes!
      database: "sapzurro_ecoturismo",
      port: 3307,
    });
    console.log("✅ Conexión a MySQL establecida."); // 2. Definir los usuarios y sus nuevas contraseñas en texto plano

    const usuarios = [
      { correo: "yonier@gmail.com", password: "admin123" },
      { correo: "tomas@hotmail.com", password: "clave123" },
      { correo: "andres@gmail.com", password: "usuario123" },
      { correo: "tomasgonza-pk@hotmail.com", password: "123456" },
    ]; // 3. Iterar sobre la lista de usuarios para hashear y actualizar

    for (const user of usuarios) {
      // Generar el hash de la contraseña usando un factor de costo (salt) de 10
      const hashedPassword = await bcrypt.hash(user.password, 10); // Ejecutar la consulta SQL: Actualiza la columna 'contrasena' de la tabla 'usuario' // usando un JOIN con 'persona' para encontrar el registro por 'correo'.
      const [result] = await connection.execute(
        "UPDATE usuario u JOIN persona p ON u.id_persona = p.id_persona SET u.contrasena = ? WHERE p.correo = ?",
        [hashedPassword, user.correo] // Los '?' son sustituidos por hashedPassword y user.correo (protección contra inyección SQL)
      ); // Mostrar el resultado

      if (result.affectedRows > 0) {
        console.log(
          `✅ ${user.correo} -> Contraseña actualizada (hash) correctamente.`
        );
      } else {
        console.log(
          `⚠️ ${user.correo} -> Correo no encontrado en la base de datos, o ya tenía la misma contraseña.`
        );
      }
    } // 4. Cerrar la conexión

    await connection.end();
    console.log(
      "\nProceso completado. Ahora prueba iniciar sesión con los correos y contraseñas asignadas."
    );
  } catch (error) {
    console.error("❌ Error al ejecutar el script:", error);
  }
})();
