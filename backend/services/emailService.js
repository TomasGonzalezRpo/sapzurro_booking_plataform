// backend/services/emailService.js
const emailjs = require("@emailjs/nodejs"); // Importa el SDK de EmailJS para Node.js

/**
 * Enviar correo de recuperación de contraseña
 * @param {string} email - Email del usuario destinatario
 * @param {string} recoveryLink - Enlace de recuperación que contiene el token
 * @param {string} userName - Nombre del usuario para personalización
 */
exports.sendRecoveryEmail = async (email, recoveryLink, userName) => {
  try {
    console.log("📧 Intentando enviar email a:", email); // Parámetros que serán sustituidos en la plantilla de EmailJS

    const templateParams = {
      user_email: email,
      user_name: userName,
      recovery_link: recoveryLink,
    };

    console.log("📤 Enviando con EmailJS SDK (modo estricto)..."); // Función principal para enviar el correo

    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID, // ID del servicio de EmailJS (ej: Gmail, SendGrid)
      process.env.EMAILJS_TEMPLATE_ID, // ID de la plantilla de correo configurada en EmailJS
      templateParams, // Datos a inyectar en la plantilla
      {
        // Credenciales de autenticación estrictas para la API
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log("✅ Email enviado correctamente");
    console.log("   Status:", result.status);
    console.log("   Text:", result.text); // Típicamente 'OK'
    return true;
  } catch (error) {
    // Manejo de errores detallado
    console.error("❌ Error al enviar email:");
    console.error("   Status:", error.status); // Código de error HTTP
    console.error("   Text:", error.text); // Mensaje de error de la API
    console.error("   Message:", error.message); // Depuración de variables de entorno para facilitar la identificación del problema

    console.log("\n🔍 Verificando variables de entorno:");
    console.log("  SERVICE_ID:", process.env.EMAILJS_SERVICE_ID ? "✅" : "❌");
    console.log(
      "  TEMPLATE_ID:",
      process.env.EMAILJS_TEMPLATE_ID ? "✅" : "❌"
    );
    console.log("  PUBLIC_KEY:", process.env.EMAILJS_PUBLIC_KEY ? "✅" : "❌");
    console.log(
      "  PRIVATE_KEY:",
      process.env.EMAILJS_PRIVATE_KEY ? "✅" : "❌"
    ); // Propaga el error como una excepción controlada

    throw new Error("No se pudo enviar el email de recuperación");
  }
};
