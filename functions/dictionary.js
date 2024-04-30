const axios = require('axios');

async function getWordData(word) {
    try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = response.data;

        const wordData = data[0]; // Assuming the first result is the main one

        const wordName = wordData.word;
        const phonetics = wordData.phonetics.map(phonetic => phonetic.text).filter(Boolean) || [];
        
        const meanings = wordData.meanings.map(meaning => {
            const partOfSpeech = meaning.partOfSpeech;
            const definitions = meaning.definitions.map(definition => {
                const text = definition.definition;
                const example = definition.example || "No example available";
                return { text, example };
            });
            return { partOfSpeech, definitions };
        });

        return { word: wordName, phonetics, meanings };
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
}

module.exports = (api, event) => {
    const word = event.body;

    getWordData(word)
        .then(wordData => {
            let message = `Word: ${wordData.word}\n`;
            if (wordData.phonetics.length > 0) {
                message += "Phonetics:\n";
                wordData.phonetics.forEach(phonetic => {
                    message += `- ${phonetic}\n`;
                });
            }
            if (wordData.meanings.length > 0) {
                message += "Meanings:\n";
                wordData.meanings.forEach(meaning => {
                    message += `Part of speech: ${meaning.partOfSpeech}\n`;
                    meaning.definitions.forEach(definition => {
                        message += `- Definition: ${definition.text}\n`;
                        message += `  Example: ${definition.example}\n`;
                    });
                });
            }
            api.sendMessage(message, event.threadID, event.messageID);
        })
        .catch(error => {
            api.sendMessage(`❌Failed to fetch word data for ${word}`, event.threadID, event.messageID);
        });
};
