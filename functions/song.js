const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const search = require("yt-search");

const downloadSong = async (videoId, filePath) => {
  try {
    const downloadStream = ytdl(videoId, { quality: 'highestaudio' });
    const writer = fs.createWriteStream(filePath);
    downloadStream.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    throw new Error(`Error downloading the song: ${error.message}`);
  }
};

const searchAndDownloadSong = async (songQuery) => {
  try {
    const { videos } = await search(songQuery);
    const firstVideo = videos[0];

    if (!firstVideo) {
      throw new Error("Video information not found");
    }

    const { videoId, title, author } = firstVideo;
    const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "_");
    const filePath = path.join(__dirname, "temp", "song", `${safeTitle}.mp3`);

    await downloadSong(videoId, filePath);

    return { filePath, videoTitle: title, channelName: author.name };
  } catch (error) {
    throw new Error(`Error searching and downloading the song: ${error.message}`);
  }
};

module.exports = async (api, event) => {
  const songQuery = event.body;

  if (!songQuery) {
    api.sendMessage("🔃 𝗘𝗻𝘁𝗲𝗿 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝗿𝘆.", event.threadID, event.messageID);
    return;
  }

  try {
    api.sendMessage("🔍 𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝘀𝗼𝗻𝗴...", event.threadID, event.messageID);

    const { filePath, videoTitle, channelName } = await searchAndDownloadSong(songQuery);

    const stream = fs.createReadStream(filePath);

    api.sendMessage(
      {
        body: `🎵𝗦𝗼𝗻𝗴 𝗡𝗮𝗺𝗲: ${videoTitle}\n👤𝗔𝗿𝘁𝗶𝘀𝘁: ${channelName}`,
        attachment: stream,
      },
      event.threadID,
      (err, messageInfo) => {
        if (err) {
          console.log(err);
          return;
        }

        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.log(`Error deleting the file: ${unlinkErr.message}`);
          }
        });
      }
    );
  } catch (error) {
    console.log(`Error processing the song request: ${error.message}`);
    api.sendMessage("🚨 𝗦𝗼𝗻𝗴 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱.", event.threadID, event.messageID);
  }
};
