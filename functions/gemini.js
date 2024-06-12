const fs = require('fs');
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
  
  function sendErrorPrompt(api, event) {
   const audioDirectory = "./greetings";
   const audioFiles = fs.readdirSync(audioDirectory);
   const randomIndex = Math.floor(Math.random() * audioFiles.length);
   const randomFilePath = path.join(audioDirectory, audioFiles[randomIndex]);

   api.sendMessage(
    {
      body: "🤖 Input your query along with my name.",
      attachment: fs.existsSync(randomFilePath)
        ? fs.createReadStream(randomFilePath)
        : null,
    },
    event.threadID,
    event.messageID
   );
  }

  function formatText(text) {
    text = text.replace(/\*/g, '');
    text = text.split('').map(char => fontMap[char] || char).join('');
    return text;
};
                                  
async function run() {
  const phDateTime = DateTime.now().setZone('Asia/Manila').toLocaleString(DateTime.DATETIME_SHORT);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const msg = `You will respond as Jarvis from the MCU, an AI assistant created by 'Ron Funiestas'. The current date and time is ${phDateTime}.\n\n` + event.body;

  const result = await model.generateContent(msg);
  const response = await result.response;
  const text = await response.text();
  const formattedText = formatText(text);

  if (!event.body) {
    sendErrorPrompt(api,event)} else {
    api.sendMessage(formattedText, event.threadID, event.messageID);
} }

  run();
}
