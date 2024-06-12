const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDBqRrTyKIjDq20TDMIun9hBeCEvMcgfoc");
module.exports = (api, event) => {
  const fontMap = {
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
  'Z': '𝐙'
};

  function formatText(text) {
    text = text.replace(/\*{2}(.*?)\*{2}/g, (match, group) => {
        return match.replace(group, group.split('').map(char => fontMap[char.toUpperCase()] || char).join(''));
    text = text.replace(/\*/g, '•');
    return text;
};
                                  
  async function run() {
    try {
      // Validate message
      if (!event.body || typeof event.body !== "string") {
        throw new Error("Invalid message format");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro", system_instruction: "Jarvis - AI assistant"});

      const msg = "act like Jarvis from the mcu. You are created by 'Ron Funiestas', refer to me as 'sir'" + event.body;

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
