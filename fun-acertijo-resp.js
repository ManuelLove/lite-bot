const similarity = require('similarity');

const threshold = 0.72; // Nivel de tolerancia para respuestas similares

const handler = (m, { conn }) => m;

handler.before = async function (m, { conn }) {
  console.log("🔍 Mensaje detectado:", m.text); // Ver si el bot detecta respuestas
  console.log("📌 Estado de tekateki:", conn.tekateki); // Ver si hay acertijos activos
  
  const id = m.chat;
  if (!m.quoted || !m.quoted.fromMe) return console.log("⚠️ Mensaje no citado o no del bot.");
  if (!(id in conn.tekateki)) {
    console.log("⚠️ No hay acertijo activo en este chat.");
    return;
  }

  const acertijo = conn.tekateki[id][1];
  const recompensa = conn.tekateki[id][2];

  console.log("✅ Respuesta esperada:", acertijo.response);

  if (m.text.toLowerCase().trim() === acertijo.response.toLowerCase().trim()) {
    console.log("🎉 Respuesta correcta detectada.");
    const user = global.db.data.users[m.sender] || { money: 0 };
    user.money += recompensa;
    m.reply(`🎉 ¡Respuesta correcta! Has ganado *${recompensa}* dinero.`);
    clearTimeout(conn.tekateki[id][3]);
    delete conn.tekateki[id];
  } else if (similarity(m.text.toLowerCase(), acertijo.response.toLowerCase()) >= threshold) {
    console.log("⚠️ Respuesta casi correcta.");
    m.reply(`🔹 ¡Casi lo logras! La respuesta es similar.`);
  } else {
    console.log("❌ Respuesta incorrecta.");
    m.reply(`❌ Respuesta incorrecta. Intenta de nuevo.`);
  }
};

handler.exp = 0;
module.exports = handler;