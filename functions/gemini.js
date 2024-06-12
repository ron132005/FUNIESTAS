const { DateTime } = require('luxon');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDBqRrTyKIjDq20TDMIun9hBeCEvMcgfoc");
module.exports = (api, event) => {
  const fontMap = {
  'a': '𝐚',
  'b': '𝐛',
  'c': '𝐜',
  'd': '𝐝',
  'e': '𝐞',
  'f': '𝐟',
  'g': '𝐠',
  'h': '𝐡',
  'i': '𝐢',
  'j': '𝐣',
  'k': '𝐤',
  'l': '𝐥',
  'm': '𝐦',
  'n': '𝐧',
  'o': '𝐨',
  'p': '𝐩',
  'q': '𝐪',
  'r': '𝐫',
  's': '𝐬',
  't': '𝐭',
  'u': '𝐮',
  'v': '𝐯',
  'w': '𝐰',
  'x': '𝐱',
  'y': '𝐲',
  'z': '𝐳',
  'A': '𝐀',
  'B': '𝐁',
  'C': '𝐂',
  'D': '𝐃',
  'E': '𝐄',
  'F': '𝐅',
  'G': '𝐆',
  'H': '𝐇',
  'I': '𝐈',
  'J': '𝐉',
  'K': '𝐊',
  'L': '𝐋',
  'M': '𝐌',
  'N': '𝐍',
  'O': '𝐎',
  'P': '𝐏',
  'Q': '𝐐',
  'R': '𝐑',
  'S': '𝐒',
  'T': '𝐓',
  'U': '𝐔',
  'V': '𝐕',
  'W': '𝐖',
  'X': '𝐗',
  'Y': '𝐘',
  'Z': '𝐙',
  '1': '𝟭',
  '2': '𝟮',
  '3': '𝟯',
  '4': '𝟰',
  '5': '𝟱',
  '6': '𝟲',
  '7': '𝟳',
  '8': '𝟴',
  '9': '𝟵',
  '0': '𝟬'
};

  function formatText(text) {
    text = text.replace(/\*/g, '');
    text = text.split('').map(char => fontMap[char] || char).join('');
    return text;
};
                                  
  async function run() {
    try {
      const phDateTime = DateTime.now().setZone('Asia/Manila').toLocaleString(DateTime.DATETIME_SHORT);
      // Validate message
      if (!event.body || typeof event.body !== "string") {
        throw new Error("Invalid message format");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", system_instruction: `You are Jarvis, an AI assistant created by 'Ron Funiestas' Current DATE AND TIME: ${phDateTime}. You are from the MCU`});

      const msg = event.body;

      const result = await model.generateContent(msg);
      const response = await result.response;
      const text = await response.text();
      const formattedText = formatText(text);

      api.sendMessage(formattedText, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error - You can log it or send a different message as a response
      api.sendMessage("An error occurred. Please try again later.", event.threadID);
    }
  }

  run();
}
