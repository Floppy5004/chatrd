/* ---------------------- */
/* KICK MODULE VARIABLES */
/* ---------------------- */


let kickUserName = null;
const kickStreamer = {};
const kickWebSocketURL                 = 'wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false';

// -----------------------
// KICK CONNECT HANDLER
// -----------------------

async function kickConnection() {

    if (!rouletteConfig.enableKick) { return; }

    const kickMaxTries = 20;
    const kickReconnectDelay = 10000;
    let retryCount = 0;

    async function connect() {
        let kickUserInfo = "";
        
        try {
            if (kickUserName == null) {
                console.debug('[RouletteRD][Kick] Kick username is null. Trying to get it...');

                let streamerInfo = await getStreamerInfo();
                let kickUserLogin = streamerInfo.platforms.kick.broadcasterLogin;
                let kickUrlCheck = `https://kick.com/api/v2/channels/${kickUserLogin}`;

                try {
                    let response = await fetch(kickUrlCheck);
                    if (response.ok) {
                        kickUserName = kickUserLogin;
                        kickUserInfo = await response.json();
                    } 
                    else {
                        let kickTryUserAgain = kickUserLogin.replace(/_/g, "-");
                        kickUrlCheck = `https://kick.com/api/v2/channels/${kickTryUserAgain}`;
                        response = await fetch(kickUrlCheck);

                        if (response.ok) {
                            kickUserName = kickTryUserAgain;
                            kickUserInfo = await response.json();
                        }
                        else {
                            throw new Error(`HTTP error ${response.status}`);
                        }
                    }
                }
                catch (error) {
                    console.error("[RouletteRD][Kick] Failed to fetch user based on Streamer.bot's login: ", error.message);
                    return null;
                }

            }

            const kickUserId = kickUserInfo.user_id;

            if (!kickUserInfo || !kickUserInfo.chatroom || !kickUserInfo.chatroom.id) {
                throw new Error('Chatroom ID not found');
            }

            console.debug(`[RouletteRD][Kick] User info for ${kickUserName}!`, kickUserInfo);

            const kickChatRoomId = kickUserInfo.chatroom.id;
            const kickChannelId = kickUserInfo.chatroom.channel_id;

            if (!kickChatRoomId) {
                console.error(`[RouletteRD][Kick] Could not find chatroom id for ${kickUserName}!`);
                return;
            }
            
            console.debug(`[RouletteRD][Kick] Chatroom for ${kickUserName} Found! (ID: ${kickChatRoomId})`);

            const kickWebSocket = new WebSocket(kickWebSocketURL);

            kickWebSocket.onopen = () => {
                kickConnectionState = true;
                retryCount = 0;

                console.debug(`[RouletteRD][Kick] Connected to Kick!`);
                notifySuccess({
                    title: 'RouletteRD 🤝 Kick',
                });

            };

            kickWebSocket.onmessage = (response) => {
                const data = JSON.parse(response.data);
                const kickData = JSON.parse(data.data);
                const kickEvent = data.event.split('\\').pop();

                console.debug(`[RouletteRD][Kick] ${kickEvent}`, kickData);

                if (data.event === 'pusher:connection_established') {
                    
                    console.debug(`[RouletteRD][Kick][Pusher] Connection established! (ID:${kickData.socket_id})`);

                    const channels = [
                        `chatroom_${kickChatRoomId}`,
                        `chatrooms.${kickChatRoomId}`,
                        `chatrooms.${kickChatRoomId}.v2`,
                        `predictions-channel-${kickChatRoomId}`,
                        `channel_${kickChannelId}`
                    ];

                    channels.forEach(channel => {
                        kickWebSocket.send(JSON.stringify({
                            event: 'pusher:subscribe',
                            data: { channel }
                        }));
                    });
                }

                if (data.event === "pusher:ping") {
                    kickWebSocket.send(JSON.stringify({
                        event: "pusher:pong",
                        data: {}
                    }));
                }

                switch (kickEvent) {
                    case 'ChatMessageEvent': kickChatMessage(kickData); break;
                }
            };

            kickWebSocket.onclose = (event) => {
                setTimeout(connect, kickReconnectDelay);
            };

            kickWebSocket.onerror = (error) => {
                console.error('[RouletteRD][Kick] WebSocket error:', error);
                kickWebSocket.close();
            };

        }
        catch (error) {
            setTimeout(connect, kickReconnectDelay);
        }
    }

    return await connect();
}





// ---------------------------
// KICK UTILITY FUNCTIONS

async function kickChatMessage(data) {

    if (rouletteConfig.test) { return; }

    const chatMessage = data.content.trim();
    const chatCommand = rouletteConfig.joinCommand;
    const userId = data.sender.id;
    
    if (chatMessage != chatCommand) return;
    const all = document.querySelectorAll(`div.s-item.kick[data-user="${userId}"]`);
    if (all.length > 0) return;
    
    const avatar = await getKickAvatar(data.sender.slug);
    const user = data.sender.username;

    addParticipant(user, 'kick', avatar, userId);
    
}


async function getKickAvatar(user) {

    const DEFAULT_AVATAR = 'https://kick.com/img/default-profile-pictures/default2.jpeg';

    console.debug(`[RouletteRD][Kick] Kick avatar not found for ${user}! Trying to get it...`);

    try {
        const response = await kickGetUserInfo(user);
        const rawPic = response?.user?.profile_pic;

        const avatarUrl = (typeof rawPic === "string" && rawPic)
          ? rawPic.replace(/fullsize\.webp$/, "medium.webp")
          : DEFAULT_AVATAR;

        return avatarUrl;
    }
    
    catch (error) {
        console.warn(`[RouletteRD][Kick] Error getting Kick avatar for ${user}:`, error);
        return DEFAULT_AVATAR;
    }
}


async function kickGetUserInfo(user) {
    const response = await fetch( `https://kick.com/api/v2/channels/${user}` );
    
    if (response.status === 404) {
        console.error("[RouletteRD][Kick] User was not found!");
        return 404;
    }
    else {
        const data = await response.json();
        return data;
    }
}