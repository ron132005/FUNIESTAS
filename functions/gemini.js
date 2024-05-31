const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDBqRrTyKIjDq20TDMIun9hBeCEvMcgfoc");
module.exports = (api, event) => {
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

      api.sendMessage(text, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error - You can log it or send a different message as a response
      api.sendMessage("An error occurred. Please try again later.", event.threadID);
    }
  }

  run();
}
