const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to fetch the image of a URL using Thum.io with authentication
async function getImageWithDelay(url, apiKey, delay) {
    try {
        // Add a delay before fetching the image
        await new Promise(resolve => setTimeout(resolve, delay));

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
    const keys = JSON.parse(fs.readFileSync('keys.txt', 'utf8').trim());
    const apiKey = keys.thumio;

    let url = event.body;

    // Remove leading and trailing spaces
    url = url.trim();

    // Check if the URL starts with 'https://'
    if (!url.startsWith('https://')) {
        // If not, prepend 'https://'
        url = 'https://' + url;
    }

    // Remove all spaces
    url = url.replace(/\s/g, '');

    // Add a delay of 5 seconds (5000 milliseconds)
    const delay = 5000;

    getImageWithDelay(url, apiKey, delay)
        .then(filePath => {
            // Send message with attachment
            api.sendMessage({
                body: url,
                attachment: fs.createReadStream(filePath),
            }, event.threadID, (err, res) => {
                if (err) {
                    api.sendMessage(`❌Cannot screenshot the url ${url}!`, event.threadID, event.messageID)
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
