# 💬 ChatRD

**EN:** ChatRD is a chat overlay widget for OBS that unifies messages and events from **Twitch**, **YouTube**, **TikTok** (and more to come). 

**PT-BR:** ChatRD é um widget de chat para OBS, que unifica mensagens e eventos do **Twitch**, **YouTube**, **TikTok** (mais plataformas em breve). 

---

## 🚀 Features | Funcionalidades

- 💬 **Multi-platform chat** | Chat unificado de várias plataformas 
- 💬 **Multi-Language events** | Eventos em várias línguas
- 📊 **Events and Live stats** | Eventos e Estatísticas ao vivo (viewers, likes, etc)  
- 🎨 **Customizable** | Personalizável  
- 💾 **Saves your settings using localStorage** | Salva suas configurações usando localStorage


---

## 🛠️ How to Use Online | Como Usar Online

**EN:**

1. Make sure your **Twitch** and **YouTube** accounts are connected on **Streamer.bot** and you have **TikFinity Desktop App** installed and set up to your account on **TikTok**. **BOTH APPS NEED TO RUN ON THE SAME PC**.
2. In **Streamer.bot**, go to **Server/Clients → WebSocket Server** and make sure it is running
3. Import the string inside the file [streamerbot-import.vortisrd](https://github.com/vortisrd/chatrd/blob/main/streamerbot-import.vortisrd) to your **Streamer.bot** using the **Import** button at the top.
4. Open the [Settings Page](https://vortisrd.github.io/chatrd) in your browser  
5. Choose your desired options  
6. Click **"Copy URL"**
7. Add a Browser Source in OBS and paste the link  

**PT-BR:**

1. Make sure your **Twitch** and **YouTube** accounts are connected on **Streamer.bot** and you have **TikFinity Desktop App** installed and set up to your account on **TikTok**. **BOTH APPS NEED TO RUN ON THE SAME PC**.
2. No **Streamer.bot**, vá em **Server/Clients → WebSocket Server** e garanta que o servidor esteja ativo  
3. Importe a string dentro do arquivo [streamerbot-import.vortisrd](https://github.com/vortisrd/chatrd/blob/main/streamerbot-import.vortisrd) para o seu **Streamer.bot** usando o botão no topo.
4. Abra a [Página de Configurações](https://vortisrd.github.io/chatrd) em seu navegador  
5. Selecione suas opções desejadas  
6. Clique em **"Copy URL"** e copie o link  
7. Adicione uma **Fonte do Navegador no OBS** e cole o link  

---

## 🛠️ How to Use in a Local Network | Como Usar em Rede Local

**EN:** 

1. On **Streamer.bot**,  go to **Server/Clients → WebSocket Server** and make sure the Address is set to the Local Network IP from the PC, for example **192.168.0.10**
2. On the [Settings Page](https://vortisrd.github.io/chatrd), make sure you set that IP on **Streamer.bot WebSocket Server**.
3. Turn the **"Run Locally"** switch on.
4. Click **"Copy URL"**
5. [Download ChatRD](https://github.com/vortisrd/chatrd/archive/refs/heads/main.zip) on the machine you want to see the chat on or want to set up OBS in, unzipping the file.
6. Open it on your browser or add it in OBS as Browser Source (don't tick **Local File**)following the file trail, for example: **file:///C:/PATH_TO_THE_FILE/chat.html**.
7. After **chat.html**, paste the URL copied from the configurator. The full link should be like this: **file:///C:/PATH_TO_THE_FILE/chat.html?language=ptbr&showPlatform=true&showAvatar=true&showTimestamps=false&showBadges=true&showPlatformStatistics=false&excludeCommands=true&showTwitchMessages=true&showTwitchFollows=true&showTwitchBits=true&showTwitchAnnouncements=true&showTwitchSubs=true&showTwitchGiftedSubs=true&showTwitchMassGiftedSubs=true&showTwitchGiftedSubsUserTrain=true&showTwitchRewardRedemptions=true&showTwitchRaids=true&showTwitchSharedChat=true&showTwitchViewers=true&showYouTubeMessages=true&showYouTubeSuperChats=true&showYouTubeSuperStickers=false&showYouTubeMemberships=true&showYouTubeGiftMemberships=true&showYouTubeMembershipsTrain=true&showYouTubeStatistics=true&showTikTokMessages=true&showTikTokFollows=true&showTikTokGifts=true&showTikTokSubs=true&showTikTokStatistics=true&showStreamlabsDonations=true&showStreamElementsTips=true&ignoreChatters=&streamerBotServerAddress=127.0.0.1&streamerBotServerPort=8080&=&hideAfter=0**

**PT-BR**

1. No **Streamer.bot**, acesse **Server/Clients → WebSocket Server** e certifique-se de que o Endereço esteja definido como o IP da Rede Local do PC, por exemplo, **192.168.0.10** ... ou, se preferir, use **0.0.0.0**.
2. Na [Página de Configurações](https://vortisrd.github.io/chatrd), certifique-se de definir o IP no **Streamer.bot WebSocket Server**.
3. Ative a opção **"Run Locally"**.
4. Clique em **"Copy URL"**
5. [Baixe o ChatRD](https://github.com/vortisrd/chatrd/archive/refs/heads/main.zip) na máquina em que deseja visualizar o chat ou configurar o OBS, descompactando o arquivo.
6. Abra-o no seu navegador ou adicione-o ao OBS como Origem do Navegador (não marque **Arquivo Local**) seguindo o caminho do arquivo, por exemplo: **file:///C:/CAMINHO_DO_ARQUIVO/chat.html**.
7. Após **chat.html**, cole a URL copiada do configurador. O link completo deve ficar assim: **file:///C:/CAMINHO_DO_ARQUIVO/chat.html?language=ptbr&showPlatform=true&showAvatar=true&showTimestamps=false&showBadges=true&showPlatformStatistics=false&excludeCommands=true&showTwitchMessages=true&showTwitchFollows=true&showTwitchBits=true&showTwitchAnnouncements=true&showTwitchSubs=true&showTwitchGiftedSubs=true&showTwitchMassGiftedSubs=true&showTwitchGiftedSubsUserTrain=true&showTwitchRewardRedemptions=true&showTwitchRaids=true&showTwitchSharedChat=true&showTwitchViewers=true&showYouTubeMessages=true&showYouTubeSuperChats=true&showYouTubeSuperStickers=false&showYouTubeMemberships=true&showYouTubeGiftMemberships=true&showYouTubeMembershipsTrain=true&showYouTubeStatistics=true&showTikTokMessages=true&showTikTokFollows=true&showTikTokGifts=true&showTikTokSubs=true&showTikTokStatistics=true&showStreamlabsDonations=true&showStreamElementsTips=true&ignoreChatters=&streamerBotServerAddress=127.0.0.1&streamerBotServerPort=8080&=&hideAfter=0**


---

## 🧩 Integrations | Integrações

- 🟣 **Twitch** (via Streamer.bot)  
- 🔴 **YouTube** (via Streamer.bot)  
- ⚫ **TikTok** (via TikFinity Desktop App)  
- 💸 **Streamlabs / StreamElements**  

---

## ⚙️ Customization | Personalização

**EN:**

- Toggle avatars, badges, timestamps  
- Filter commands and ignored users  
- Customize hide delay and event types  

**PT-BR:**

- Ative/desative avatar, badges, timestamps  
- Filtro de comandos e usuários ignorados  
- Personalize tempo de ocultação e tipos de eventos

---

## 🤔 Known Issues | Bugs Identificados

**EN:**

- Super Stickers are not working in **Streamer.bot**. They show on simulated events but don't on real streams, so they've been disabled for now.

**PT-BR:**

- Os Super Stickers não estão funcionando no **Streamer.bot**. Aparecem em eventos simulados, mas não funcionam em transmissões reais, por isso foram desativados por enquanto.

---

## 📦 Dependencies | Dependências

- [Streamer.bot](https://streamer.bot)  
- [Streamer.bot Client JS](https://streamerbot.github.io/client/)
- [TikFinity Desktop App](https://tikfinity.zerody.one/)  
- [Font Awesome](https://fontawesome.com/)  
- [Animate.css](https://animate.style/)  
- [Simple Notify](https://simple-notify.github.io/simple-notify/)  
- [DOMPurify](https://github.com/cure53/DOMPurify)  

---

## 📝 To-Do List | Próximos Objetivos

- Trovo
- Kick
- Patreon
- Ko-Fi
- TipeeeStream
- Fourthwall
- LivePix
- Tipa.Ai

---

## ✨ Credits | Créditos

Made with ❤️ by **VortisRD**  
🔗 [GitHub](https://github.com/vortisrd) • [Twitch](https://twitch.tv/vortisrd) • [YouTube](https://youtube.com/@vortisrd) • [TikTok](https://tiktok.com/@vortisrd) • [Twitter / X](https://twitter.com/vortisrd)  

Heavily inspired by [Nutty](https://nutty.gg)
🔗 [GitHub](https://github.com/nuttylmao) • [Twitch](https://twitch.tv/nutty) • [YouTube](https://youtube.com/@nuttylmao) • [TikTok](https://tiktok.com/@nuttylmao) • [Twitter / X](https://x.com/nuttylmao)


