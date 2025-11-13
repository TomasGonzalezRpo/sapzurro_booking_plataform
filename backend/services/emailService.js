// backend/services/emailService.js
const emailjs = require("@emailjs/nodejs");

/**
 * Enviar correo de recuperación de contraseña
 * @param {string} email - Email del usuario
 * @param {string} recoveryLink - Enlace de recuperación
 * @param {string} userName - Nombre del usuario
 */
exports.sendRecoveryEmail = async (email, recoveryLink, userName) => {
  try {
    console.log("📧 Intentando enviar email a:", email);

    const templateParams = {
      user_email: email,
      user_name: userName,
      recovery_link: recoveryLink,
    };

    console.log("📤 Enviando con EmailJS SDK (modo estricto)...");

    // Usar directamente send() con credenciales en las opciones
    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log("✅ Email enviado correctamente");
    console.log("   Status:", result.status);
    console.log("   Text:", result.text);
    return true;
  } catch (error) {
    console.error("❌ Error al enviar email:");
    console.error("   Status:", error.status);
    console.error("   Text:", error.text);
    console.error("   Message:", error.message);

    console.log("\n🔍 Verificando variables de entorno:");
    console.log("  SERVICE_ID:", process.env.EMAILJS_SERVICE_ID ? "✅" : "❌");
    console.log(
      "  TEMPLATE_ID:",
      process.env.EMAILJS_TEMPLATE_ID ? "✅" : "❌"
    );
    console.log("  PUBLIC_KEY:", process.env.EMAILJS_PUBLIC_KEY ? "✅" : "❌");
    console.log(
      "  PRIVATE_KEY:",
      process.env.EMAILJS_PRIVATE_KEY ? "✅" : "❌"
    );

    throw new Error("No se pudo enviar el email de recuperación");
  }
};
