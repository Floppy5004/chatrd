# ChatRD Updates

## 🟣 Twitch

- Chat and Events codes edited to be in compliance with the current **Twitch EventSub API** and **Streamer.bot 1.0.5 alpha**.
  - Stopped using ```messages``` and now it's relying on ```parts```.
- The "Highlight My Message" channel point reward event will highlight the message. It can come before or after the event shows on ChatRD.
- Hype Train support added. It's off by default so you have to enable it.
- Twitch Goals support added. Shows if you have active goals on Twitch. It's off by default so you have to enable it.
  - **GOALS FETCHER:** While not mandatory, if you want your current active goals on Twitch to appear on ChatRD, you **must import chatrd.sb** again. New actions were added.
  - **KNOWN ISSUE:** Active "New Bits" and "New Cheerers" goals will be identified as "New Bits/Cheerers" when ChatRD load. Twitch's API doesn't return the proper type indicators for them on active goals. That happens because the "goal type" field for these returns empty when fetching them using Twitch's API. **This is not a ChatRD issue.**

## 🔴 YouTube

- Red color on the Events and Statistics was toned down.

## ⚫ TikTok

- Changed hot pink color to black (#242424)

## 🟢 Kick

- Removed the "Kick Username" field. Now ChatRD gets it from Streamer.bot Kick Integration.
- Kick Viewer Update Event now comes straight from Streamer.bot.

## 🫡 General

- Added a "Scroll Down" button. It only works when the Scroll Bar is enabled.
- The Row Cap was increased from 50 to 100.
- Spacing between messages and events edited. Should feel more uniform.
- ChatRD URL Generation function refactored. Now, if you set a parameter that's default, it won't be on the URL and the system will assume it as default. With this, the URL size should decrease next time you copy it.
- Import Settings updated following the URL Generation.
- Changes to the skins "Bubbles", "Kimballs" and "Nutting".
- Fixed overall bugs.
