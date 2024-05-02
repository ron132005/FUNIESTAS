const http = require('http');
const express = require('express');
const axios = require('axios');
const fs = require("fs");
const login = require("fb-chat-api-temp");
const { spawn } = require('child_process');

const app = express();

// Route to respond with "hello"
app.get('/', (req, res) => {
  res.send('hello');
});

const PORT = 10000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const startTime = new Date();

function formatUptime(uptime) {
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor(uptime / 3600);
    const days = Math.floor(uptime / 86400);

    let uptimeString = '';

    if (days > 0) {
        uptimeString += `${days} ${days === 1 ? 'day' : 'days'}`;
    }

    if (hours > 0) {
        uptimeString += ` ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }

    if (minutes > 0 || uptimeString === '') {
        uptimeString += ` ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }

    if (seconds > 0 || uptimeString === '') {
        uptimeString += ` ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
    }

    return uptimeString.trim();
}

function displayUptime(api, event) {
    const currentTime = new Date();
    const uptime = (currentTime - startTime) / 1000;
        api.sendMessage(`🤖 Jarvis has been running for ${formatUptime(uptime)}!\n\nLooking for Virtual Private Server(VPS)?\n🤖 Message this account and we'll arrange your VPS`, event.threadID, event.messageID);
}

function saveCookiesToFile(cookies) {
  const fs = require('fs');
  const data = JSON.stringify(cookies);
  
  fs.writeFile('session.json', data, (err) => {
    if (err) {
      console.error("Error saving cookies to file:", err);
    } else {
      console.log("Cookies saved to session.json");
    }
  });
}




const loginCred = {
  appState: JSON.parse(fs.readFileSync("session.json", "utf-8")),
};

    // Here you can use the api             
let running = false;
let stopListener = null;

function startListener(api, event) {
     if (event.type == "message_reply" || event.type == "message") {
        try {
          if (event.body.startsWith("•define")) {
            event.body = event.body.replace("•define", "");
            require("./functions/define.js")(api, event);
          }
          if (event.body.startsWith("•img")) {
            event.body = event.body.replace("•img", "");
            require("./functions/img.js")(api, event);
          }
          //reaction triggers
          if (event.body.includes("ayie")) {
            api.setMessageReaction(":love:", event.messageID, (err) => {
              if (err) {
                console.error(err);
                return;
              }
            });
          }
          if (
            event.body.toLowerCase().includes("haha") ||
            event.body.toLowerCase().includes("stupid") ||
            event.body.toLowerCase().includes("fuck") ||
            event.body.toLowerCase().includes("shit")
          ) {
            api.setMessageReaction(":laughing:", event.messageID, (err) => {
              if (err) {
                console.error(err);
                return;
              }
            });
          }
          //forbidden jutsu 
          if (!event.body.toLowerCase().includes("•talk") && event.body.toLowerCase().includes("jarvis") || event.body.toLowerCase().includes("ultron")) {

            require("./functions/gemini.js")(api, event)
          }

          //summoning ai
          if (event.body.toLowerCase().includes("howard")) {
            event.body = event.body.replace(/howard/i, "");
            event.body = "act like a conyo boy, use taglish" + event.body;


            require("./functions/handler.js")(api, event, (err, data) => {
              console.log(err);
              console.log(data);
              if (err) {
                api.sendMessage(
                  `Error: ${err}`,
                  event.threadID,
                  event.messageID
                );
                return;
              }
            });
          }
          //generate image
          if (event.body.startsWith("•ai")) {
            event.body = event.body.replace("•ai", "");
            require("./functions/imghandler")(api, event);
          }

          //lyrics
          if (event.body.startsWith("•lyrics")) {
            event.body = event.body.replace("•lyrics", "");
            require("./functions/lyrics.js")(api, event);
          }

          //song
          if (event.body.startsWith("•song")) {
            event.body = event.body.replace("•song", "");
            require("./functions/song.js")(api, event);
          }

          //webss
          if (event.body.startsWith("•webscreenshot")) {
            event.body = event.body.replace("•webscreenshot", "");
            require("./functions/thumio.js")(api, event);
          }

          //dictionary
          if (event.body.startsWith("•dictionary")) {
            event.body = event.body.replace("•dictionary", "");
            require("./functions/dictionary.js")(api, event);
          }
          

          //meme
       if (event.body.startsWith("•uptime")) {
            displayUptime(api, event);
}
          
          if (event.body.toLowerCase().includes("•talk•")) {
            require("./functions/tts.js")(api, event)
          }
          
          if (event.body.includes("•pokemon")) { require("./functions/pokemon.js")(api, event);
          }
          if (event.body.includes("•meme")) { require("./functions/meme.js")(api, event);
                                               }
          
          if (event.body.includes("•movie")) { require("./functions/movie.js")(api, event);
                                            }
          if(event.body.includes("•yts")) { 
    event.body =  event.body.replace("•yts", "");      require("./functions/yts.js")(api, event);
          }
          
          if (event.body.startsWith("•fact")) {
              require("./functions/fact.js")(api, event);
          }

          //trial0

          if (event.body === "•help") {
         require("./functions/help.js")(api, event);
          } 
        } catch (error) {
          console.log(error);
        }
      }
    }

function start() {
  login(loginCred, (err, api) => {
    if (err) {
      console.error("login cred error", err);
      return;
    }
    let cookies;
    api.listenMqtt((err, event) => {
      api.setOptions({ listenEvents: true });
      if (err) {
        console.error("listen error:", err);
        return;
      }

      //trial
      api.getAppState((err, appState) => {
        if (err) {
          console.error("Error getting app state:", err);
          return;
        }

        cookies = appState; // Save appState to cookies constant

        // Save cookies to 'session.json' every 50 minutes
        setInterval(() => {
          saveCookiesToFile(cookies);
        }, 50 * 60 * 1000);
        //trialend

        //console.log(event);
        //require("./moderation/antiunsend.js")(api, event);
        require("./moderation/tt.js")(api, event);
        startListener(api, event);
      });
      //trial
      //trial
    });
  });
}

start();
