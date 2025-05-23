# 💬 ChatRD

ChatRD is a chat tool and/or overlay widget that unifies messages and events from **Twitch**, **YouTube**, **TikTok**, **Kick**, **Streamlabs**, **StreamElements**, **Patreon**, **TipeeeStream**, **Ko-Fi**, **Fourthwall** (and more to come). 

![ChatRD Config UI](https://i.imgur.com/jQl1nWj.png)

---

## 🚀 Features

- 💬 **Multi-platform chat**
- 💬 **Multi-language events**
- 📊 **Events and Live stats**
- 🎨 **Customizable** 
- 💾 **Saves your settings using localStorage and Streamer.Bot's Global Varaibles** 

---

## 🛠️ Usage

Make sure your **Twitch** and **YouTube** accounts are connected on **Streamer.Bot** and you have **TikFinity Desktop App** installed and set up to your account on **TikTok**. **BOTH APPS NEED TO RUN ON THE SAME PC**. 

### Streamer.Bot & TikFinity
1. On **Streamer.Bot**, go to **Server/Clients → WebSocket Server** and make sure it is running
2. Import the string inside the file [streamerbot-import.vortisrd](https://github.com/vortisrd/chatrd/blob/main/streamerbot-import.vortisrd) to your **Streamer.Bot** using the **Import** button at the top.
3. Go to **Server/Clients → WebSocket Client** and make sure the *TikFinity* WebSocket is connected. If not, right-click on it and check *Auto-Connect* and *Reconnect* before clicking on *Connect*. 
4. Download [**TikFinity Desktop App**](https://tikfinity.zerody.one/) and make sure it's is opened and connected to your TikTok Account.
5. Open the [Settings Page](https://vortisrd.github.io/chatrd) in your browser.
6. Choose your desired options.
7. Click **"Copy URL"**.
8. Add the copied URL as a Browser Source in OBS. Or use it in your browser to read chat. 😊
9. For **Streamlabs**, **StreamElements**, **Patreon**, **TipeeeStream**, **Ko-Fi** and **Fourthwall**, you need to connect them to your Streamer.Bot account to their website. Follow the tutorial links in each section presented in the [Settings Page](https://vortisrd.github.io/chatrd).


### Kick.Bot installation on Streamer.Bot

1. First, [download Kick.Bot from Sehelitar's repo](https://github.com/Sehelitar/Kick.bot/releases/).
2. Unzip and copy the DLLs from **Kick.Bot** to the *dlls folder* inside **Streamer.Bot**. If it's not there, create one (name it "dlls", lowercase).
3. Import the action from *action.txt* file (inside the ZIP folder you just unzipped) to **Streamer.Bot**.
4. Close **Streamer.Bot** and open it again. After a few seconds, a window will appear asking you to login on *Kick*. 
5. Done! 😊

If **Kick.Bot** stops sending events to ChatRD, delete it's dlls in the *dlls folder*, delete the imported **Kick.Bot** action and delete the *Streamer.bot.exe.WebView2* folder. After that, reinstall **Kick.Bot** using the above instructions.


#### ⚠️ KICK IS A BETA FEATURE!
Kick doesn't offer an API like Twitch does. It's not feasible for Streamer.Bot do it in an easy manner like Twitch, YouTube, Trovo, etc.

[Kick.Bot](https://github.com/Sehelitar/Kick.bot/releases/) does an excelent job but there is some information missing on the payload from Kick, like *avatars*, *badges (gift sub, community, etc), viewership, etc*. And there will be some errors or some misinformation being shown. I tried my best to emulate these.

I couldn't test every single outcome because it's not possible to simulate the events besides Chat. I followed [Kick.Bot's](https://github.com/Sehelitar/Kick.bot/releases/) documentation and hoped for the best. 🙏

Also, at any point either **Kick** or **Kick.Bot** might change their stuff, so please, **be patient!** 😊

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


## 💻 Commands supported by the Chat Field

**Commands for Twitch**
- /me (message)
- /announce (message)
- /clear
- /slow (duration in seconds)
- /slowoff
- /subscribers
- /subscribersoff
- /commercial (duration in seconds)
- /timeout (user) (duration) (reason)
- /untimeout (user)
- /ban (user) (reason)
- /unban (user)
- /mod (user)
- /unmod (user)
- /vip (user)
- /unvip (user)
- /shoutout (user)
- /raid (user)
- /unraid

**Commands for YouTube**
- /yt/title (title)
- /yt/description (description)
- /yt/timeout (userID) (duration in seconds)
- /yt/ban (userID)

**TikTok**
- TikFinity's WebSocket doesn't allow to send messages without authentication, so it's disabled for the moment.

**Kick**
- Kick commands are not supported yet.


---

## 📝 To-Do List

- Trovo
- LivePix
- Tipa.Ai

---

## ❓ Frequently Asked Questions
**- Can I use it to read my chat?**
R: Yes you can. You can open it on your browser, use it as a chat overlay and use it as a dock in OBS.

**- What about YouTube Members Emotes?**
R: YouTube doesn't expose their Partner Emojis to Streamer.Bot. All you can do is add the emojis manually in ChatRD. Please [read this](https://github.com/vortisrd/chatrd#about-youtube-membership-emojis).

**- Can I set TTS to read only the events I want to read?**
R: ChatRD only reads either chats, events or both. If you want to filter the events, [I suggest you setup Speaker.Bot separately](https://github.com/vortisrd/chatrd?tab=readme-ov-file#about-speakerbot-tts-customization). 

**- TikTok events are not working anymore, what should I do?**
R: Make sure your TikFinity is connected to your account and you are live. Also go to **Server/Clients → WebSocket Client** and make sure the TikFinity WebSocket is connected. [Instructions here](https://github.com/vortisrd/chatrd#streamerbot--tikfinity).

**- Kick events are not working anymore, what should I do?**
R: Try reinstalling Kick.Bot [using the following methods](https://github.com/vortisrd/chatrd?tab=readme-ov-file#kickbot-installation-on-streamerbot).

**- Where are my Kick sub badges? And the X or Y badges?**
R: At the moment of this post, the WebSocket I connect to show Kick's chat doesn't expose the Badges like Twitch does. Twitch mentions the badges and sends the URL, showing it [like this](https://i.imgur.com/xwg39hO.png). **Kick doesn't, showing on code [like this](https://i.imgur.com/OtMcDzI.png)**. You can see the person is subscribed and it's a sub gifter, but it doesn't show the specified badges. I did the best I could with the other badges. When Kick improves their API, I will revisit this later. 

**- Can you add other streaming/payment platforms?**
R: ChatRD uses Streamer.Bot to 95% of all platform iterations. *TikFinity* is perfectly integrated via WebSockets and *Kick.Bot* adds a decent integration. So if the platform has a decent WebSocket API (not WebHooks, those need a server to be usable) and/or has any integration with Streamer.Bot, please feel free to suggest it. Other than that, there are no plans to add more platforms.

**- Can I customize it?**
R: If you mean visual styles, yes. [Read here](https://github.com/vortisrd/chatrd?tab=readme-ov-file#about-custom-styling).



---

## **⚠️ DISCLAIMERS ⚠️**

### About YouTube Membership Emojis
I tried to add member emotes but **that is currently impossible due to YouTube's API not exposing Members Emotes and with that, Streamer.Bot won't be able to show them.**. So I've added a way for the users to add them manually at the overlay, with the data saved as a Streamer.Bot Global Variable.

What Casterlabs Caffeinated, Social Stream Ninja and Onecomme do to scrape the emotes won't work with the current way Streamer.Bot and my code works, so I had to choose between **making the user add them manually** or build a **server-sided executable (using NodeJS, Python or whatever) to read the chat as it's going or scrape the HTML code**. I don't want to add another executable on top of the user's flow, so it would be easier to use what it's currently available. **And no, I won't do any research based on what other tools do.** Tried to do that and wasted 1 week of my life doing it.  

When YouTube decide to expose their Partner Emotes on their API, I'll come back to this.

### About Speaker.Bot TTS Customization
If you want to customize what events the TTS reads, like "I want it to read sub notifications but I don't want it to read bits", it's possible. But doing that means adding an extra TTS switch for every single event for all platforms, making the setup page almost triplicate in size and bloat the code. **I won't do that**. I want to keep it simple and contained.

If you want to have TTS for events separately, I suggest you **Disable TTS Events** on ChatRD and setup Speaker.Bot with the things you want. 😊

### About Custom Styling
The safest way to customize ChatRD is open either the Chat or the Config in your browser and use [it's Dev Tools](https://i.imgur.com/Nirwz5R.png) to look for the tags, their classes, identifiers and then style in the way you want. **You need basic CSS knowledge for that**.

After you finish it, paste the CSS inside the [Custom CSS field within Browser Source Property Window](https://i.imgur.com/BjvrV28.png).

### About Support on Changing the Javascript or other Core Files
If you break it, you fix it. 😊


---

## ✨ Credits

Made with ❤️ by **VortisRD**  

🔗 [GitHub](https://github.com/vortisrd) • [Twitch](https://twitch.tv/vortisrd) • [YouTube](https://youtube.com/@vortisrd) • [TikTok](https://tiktok.com/@vortisrd) • [Kick](https://kick.com/vortisrd) • [Twitter / X](https://twitter.com/vortisrd)  

Heavily inspired by [Nutty](https://nutty.gg)

🔗 [GitHub](https://github.com/nuttylmao) • [Twitch](https://twitch.tv/nutty) • [YouTube](https://youtube.com/@nuttylmao) • [TikTok](https://tiktok.com/@nuttylmao) • [Twitter / X](https://x.com/nuttylmao)
