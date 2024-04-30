module.exports = (api, event) => {
api.sendMessage(`Here's the list of what I can do:

╰┈➤》Artificial Intelligence

    ➣  JARVIS - (Just A Rather Very Intelligent System) Created by Ron Funiestas. This AI provides accurate and reliable information.


╰┈➤》Media

    ➯  •lyrics - Get lyrics of any song
    ➯  •song - Get the audio tracks of any song
    ➯  •movie - Get the data of any song
    ➯  •yts - Get the direct download link of any movie
    ➯  •webscreenshot - Prints the page of any website


╰┈➤》Entertainment

    ➯  •pokemon - Get the pokemon details
    ➯  •fact - Get a random fact


╰┈➤》Education

    ➯  •define - Get the definition of words


╰┈➤》System

 ➣ •uptime - check uptime 
 ➣ •patch - check version
 

    𖣘 Resends the unsent messages, exposing the name of the author and the message body
    𖣘 Gives emoji reactions to certain messages
    𖣘 Automatically downloads videos from TikTok links`, event.threadID, event.messageID)
}
