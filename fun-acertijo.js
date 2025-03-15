const fs = require('fs');

const timeout = 60000; // 60 segundos para responder
const recompensa = 1000; // Dinero ganado por respuesta correcta

const handler = async (m, { conn }) => {
  conn.tekateki = conn.tekateki || {};
  const id = m.chat;
  if (id in conn.tekateki) {
    conn.sendMessage(m.chat, { text: '❌ Ya hay un acertijo activo en este chat.' });
    return;
  }
  const acertijos = JSON.parse(fs.readFileSync('./src/game/acertijo.json'));
  const json = acertijos[Math.floor(Math.random() * acertijos.length)];
  const caption = `
🎭 *ACERTIJO*
🔹 *${json.question}*
⏳ *Tiempo:* ${(timeout / 1000).toFixed(0)} segundos
🏆 *Recompensa:* ${recompensa} dinero
`;
  conn.tekateki[id] = [
    await conn.sendMessage(m.chat, { text: caption }, { quoted: m }),
    json,
    recompensa,
    setTimeout(() => {
      if (conn.tekateki[id]) {
        conn.sendMessage(m.chat, { text: `⏳ ¡Se acabó el tiempo! La respuesta era: *${json.response}*` });
        delete conn.tekateki[id];
      }
    }, timeout)
  ];
};

handler.help = ['acertijo'];
handler.tags = ['fun'];
handler.command = ['acertijo', 'adivinanza'];

module.exports = handler;