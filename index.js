const http = require('http');
const express = require('express');
const axios = require('axios');
const fs = require("fs");
const wiegine = require("ws3-fca");
const { spawn } = require('child_process');

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
          if (!event.body.toLowerCase().includes("•talk") && event.body.toLowerCase().includes("jarvis")) {
            event.body = event.body.replace(/jarvis stark|jarvis|@/gi, "");
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
  const cookieString = fs.readFileSync("session.txt", "utf8");

  wiegine.login(cookieString, (err, api) => {
    if (err) {
      console.error("login error:", err);
      return;
    }

    api.setOptions({ listenEvents: true });

    const stopListening = api.listenMqtt((err, event) => {
      if (err) {
        console.error("listen error:", err);
        return;
      }

      // Your custom handlers
      antiUnsend(api, event);
      // tt(api, event); // Uncomment if needed
      startListener(api, event);
    });
  });
}

start();
