const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyD9hjR_ihWdtzH1kt9PyusTriKAWdywj3s");
module.exports = (api, event) => {
  async function run() {
    try {
      // Validate message
      if (!event.body || typeof event.body !== "string") {
        throw new Error("Invalid message format");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro", system_instruction: "Act like you are a robot created by Ron Funiestas. You're name is Jarvis, and you act like JARVIS from the MCU."});

      const msg = "act like Jarvis from the mcu, refer to me as 'sir'" + event.body;

      const result = await model.generateContent(msg);
      const response = await result.response;
      const text = await response.text();

      console.log(text);
      api.sendMessage(text, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error - You can log it or send a different message as a response
      api.sendMessage("An error occurred. Please try again later.", event.threadID);
    }
  }

  run();
}
