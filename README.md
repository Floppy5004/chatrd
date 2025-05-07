# 💬 ChatRD

ChatRD is a chat overlay widget for OBS that unifies messages and events from **Twitch**, **YouTube**, **TikTok** (and more to come). 

![ChatRD Config UI](https://i.imgur.com/Ga9qeHr.png)

---

## 🚀 Features

- 💬 **Multi-platform chat**
- 💬 **Multi-language events**
- 📊 **Events and Live stats**
- 🎨 **Customizable** 
- 💾 **Saves your settings using localStorage and Streamer.Bot's Global Varaibles** 

---

## 🛠️ Usage

1. Make sure your **Twitch** and **YouTube** accounts are connected on **Streamer.Bot** and you have **TikFinity Desktop App** installed and set up to your account on **TikTok**. **BOTH APPS NEED TO RUN ON THE SAME PC**.
2. In **Streamer.Bot**, go to **Server/Clients → WebSocket Server** and make sure it is running
3. Import the string inside the file [streamerbot-import.vortisrd](https://github.com/vortisrd/chatrd/blob/main/streamerbot-import.vortisrd) to your **Streamer.Bot** using the **Import** button at the top.
4. Open the [Settings Page](https://vortisrd.github.io/chatrd) in your browser  
5. Choose your desired options  
6. Click **"Copy URL"**
7. Add a Browser Source in OBS and paste the link  

---

## 🛠️ How to Use it in a Local Network

1. On **Streamer.Bot**,  go to **Server/Clients → WebSocket Server** and make sure the Address is set to the Local Network IP from the PC, for example **192.168.0.10** ... or, if you prefer, use 0.0.0.0.
2. On the [Settings Page](https://vortisrd.github.io/chatrd), make sure you set that IP on **Streamer.Bot WebSocket Server**.
3. Turn the **"Run Locally"** switch on.
4. Click **"Copy URL"**
5. [Download ChatRD](https://github.com/vortisrd/chatrd/archive/refs/heads/main.zip) on the machine you want to see the chat on or want to set up OBS in, unzipping the file.
6. Open it on your browser or add it in OBS as Browser Source (don't tick **Local File**)following the file trail, for example: **file:///C:/PATH_TO_THE_FILE/chat.html**.
7. After **chat.html**, paste the URL copied from the configurator. The full link should be like this: **file:///C:/PATH_TO_THE_FILE/chat.html?language=ptbr&showPlatform=true&showAvatar=true&showTimestamps=false&showBadges=true&showPlatformStatistics=false&excludeCommands=true&showTwitchMessages=true&showTwitchFollows=true&showTwitchBits=true&showTwitchAnnouncements=true&showTwitchSubs=true&showTwitchGiftedSubs=true&showTwitchMassGiftedSubs=true&showTwitchGiftedSubsUserTrain=true&showTwitchRewardRedemptions=true&showTwitchRaids=true&showTwitchSharedChat=true&showTwitchViewers=true&showYouTubeMessages=true&showYouTubeSuperChats=true&showYouTubeSuperStickers=false&showYouTubeMemberships=true&showYouTubeGiftMemberships=true&showYouTubeMembershipsTrain=true&showYouTubeStatistics=true&showTikTokMessages=true&showTikTokFollows=true&showTikTokGifts=true&showTikTokSubs=true&showTikTokStatistics=true&showStreamlabsDonations=true&showStreamElementsTips=true&ignoreChatters=&streamerBotServerAddress=127.0.0.1&streamerBotServerPort=8080&=&hideAfter=0**

---

## 🔊 How to set TTS with Speaker.Bot

### Speaker.Bot Setup
1. Go to **Settings → WebSocket Server**, click on *Start Server*. Make sure to also tick the *Auto-Start* checkbox.
2. Go  to **Settings → Speech Engine** and add the TTS Service of your preference. (Sapi5 is the Windows default).
3. Go to **Settings → Voice Aliases**, name the voice *SpeakerBot* and click **Add** right next to it.
4. In the Left Column, click on the **SpeakerBot** you just added and on the **Speak!** section, select the voice you want to use and click **Add**. (If you're using Sapi5, I recommend using *Microsoft Zira Desktop* as a voice).

### Streamer.Bot Setup
1. Import the [streamerbot-import.vortisrd](https://github.com/vortisrd/chatrd/blob/main/streamerbot-import.vortisrd) file to your **Streamer.Bot**. There's a new action that will handle the **Speaker.Bot** integration.
2. Go to **Integrations → Speaker.Bot**, click on *Connect*. Make sure to also tick the *Auto-Start* and *Auto-Connect* checkboxes.

---

## 🧩 Integrations

- 🟣 **Twitch** (via Streamer.Bot)  
- 🔴 **YouTube** (via Streamer.Bot)  
- ⚫ **TikTok** (via TikFinity Desktop App)  
- 💸 **Streamlabs / StreamElements**  

---

## 📦 Dependencies

- [Streamer.Bot](https://streamer.bot)  
- [Speaker.Bot](https://speaker.bot/) 
- [Streamer.Bot Client JS](https://streamerbot.github.io/client/)
- [TikFinity Desktop App](https://tikfinity.zerody.one/)  
- [Font Awesome](https://fontawesome.com/)  
- [Animate.css](https://animate.style/)  
- [Simple Notify](https://simple-notify.github.io/simple-notify/)  
- [DOMPurify](https://github.com/cure53/DOMPurify)  

---

## 📝 To-Do List

- Trovo
- Kick
- Patreon
- Ko-Fi
- TipeeeStream
- Fourthwall
- LivePix
- Tipa.Ai

---

## **⚠️ DISCLAIMERS ⚠️**

### About YouTube Membership Emojis
I tried to add member emotes but **that is currently impossible due to YouTube's API not exposing Members Emotes and with that, Streamer.Bot won't be able to show them.**. So I've added a way for the users to add them manually at the overlay, with the data saved as a Streamer.Bot Global Variable.

What Casterlabs Caffeinated, Social Stream Ninja and Onecomme do to scrape the emotes won't work with the current way Streamer.Bot and my code works, so I had to choose between **making the user add them manually** or build a **server-sided executable (using NodeJS, Python or whatever) to read the chat as it's going or scrape the HTML code**. I don't want to add another executable on top of the user's flow, so it would be easier to use what it's currently available. **And no, I won't do any research based on what other tools do.** Tried to do that and wasted 1 week of my life doing it.  

When YouTube decide to expose their Partner Emotes on their API, I'll come back to this.

### About Custom Styling
The safest way to customize ChatRD is open either the Chat or the Config in your browser and use [it's Dev Tools](https://cdn.discordapp.com/attachments/1360070885620453496/1363850037276180591/image.png?ex=680a2ad3&is=6808d953&hm=aac3045c97602afcb7eacf207eb73bccf036348a2daf27ced49f1e422f380f7a&format=webp&quality=lossless&width=1872&height=541) to look for the tags, their classes, identifiers and then style in the way you want. **You need basic CSS knowledge for that**.

After you finish it, paste the CSS inside the [Custom CSS field within Browser Source Property Window](https://media.discordapp.net/attachments/1360070885620453496/1363577945117032578/image.png?ex=6809d62c&is=680884ac&hm=fe81c53d8b144ca48506ff5d143dbb3a43cabefbb55e4d4b19943a9607f2bf96&=&format=webp&quality=lossless&width=994&height=960).

### About Support on Changing the Javascript or other Core Files
If you break it, you fix it. 😊


---

## ✨ Credits

Made with ❤️ by **VortisRD**  

🔗 [GitHub](https://github.com/vortisrd) • [Twitch](https://twitch.tv/vortisrd) • [YouTube](https://youtube.com/@vortisrd) • [TikTok](https://tiktok.com/@vortisrd) • [Twitter / X](https://twitter.com/vortisrd)  

Heavily inspired by [Nutty](https://nutty.gg)

🔗 [GitHub](https://github.com/nuttylmao) • [Twitch](https://twitch.tv/nutty) • [YouTube](https://youtube.com/@nuttylmao) • [TikTok](https://tiktok.com/@nuttylmao) • [Twitter / X](https://x.com/nuttylmao)
