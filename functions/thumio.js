const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to fetch the image of a URL using Thum.io with authentication
async function getImage(url, apiKey) {
    try {
        const response = await axios.get(`https://image.thum.io/get/auth/${apiKey}/width/600/crop/800/${url}`, {
            responseType: 'stream'
        });

        const directoryPath = './temp/img';
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        // Generate a unique filename based on the current time
        const timestamp = Date.now();
        const filePath = path.join(directoryPath, `thumbnail_${timestamp}.jpg`);

        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('thumio in keys should be id-key. If correct, the error might be caused by the API');
        throw error;
    }
}

module.exports = (api, event) => {
const keys = fs.readFileSync('keys.txt', 'utf8').trim();
const apiKey = keys.thumio;
    const url = event.body;

    getImage(url, apiKey)
        .then(filePath => {
            console.log(`Image downloaded: ${filePath}`);
            // Send message with attachment
            api.sendMessage({
                body: url,
                attachment: fs.createReadStream(filePath),
            }, event.threadID, (err, res) => {
                if (err) {
                    console.error('Error sending message:', err);
                }
                // Remove the image file after sending
                fs.unlinkSync(filePath);
                console.log('Image sent and file removed.');
            });
        })
        .catch(error => {
            console.error('Failed to download image:', error);
        });
};
        
