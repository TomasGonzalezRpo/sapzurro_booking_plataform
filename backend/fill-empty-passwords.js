// backend/fill-empty-passwords.js
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

(async () => {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sapzurro_ecoturismo",
    port: 3307,
  });

  const defaults = {
    admin: "admin123",
    hotelmar: "clave123",
    usuario1: "usuario123",
  };

  const [rows] = await conn.execute(
    `SELECT id_usuario, usuario, contrasena FROM usuario WHERE contrasena IS NULL OR contrasena = ''`
  );

  if (!rows.length) {
    console.log("No se encontraron usuarios con contrasena vacía.");
    await conn.end();
    return;
  }

  for (const r of rows) {
    const username = r.usuario;
    const id = r.id_usuario;
    const plain = defaults[username] ?? "default123";
    const hash = await bcrypt.hash(plain, 10);
    await conn.execute(
      "UPDATE usuario SET contrasena = ? WHERE id_usuario = ?",
      [hash, id]
    );
    console.log(
      `id ${id} (${username}) actualizado -> contraseña establecida como '${plain}' (hashed).`
    );
  }

  await conn.end();
  console.log("Proceso completado. Verifica la DB y prueba login.");
})().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
