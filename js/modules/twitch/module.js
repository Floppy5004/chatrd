

// TWITCH EVENTS HANDLERS

const twitchMessageHandlers = {
    'Twitch.ChatMessage': (response) => {
        twitchChatMessage(response.data);
    }
};


async function twitchConnection() {
    if (rouletteConfig.enableTwitch) {
        registerPlatformHandlersToStreamerBot(twitchMessageHandlers, '[RouletteRD][Twitch]');
    }
}



// ---------------------------
// TWITCH EVENT FUNCTIONS


async function twitchChatMessage(data) {

    if (rouletteConfig.test) { return; }

    const chatMessage = data.text.trim();
    const chatCommand = rouletteConfig.joinCommand;
    const userId = data.user.login;
    
    if (chatMessage != chatCommand) return;
    const all = document.querySelectorAll(`div.s-item.twitch[data-user="${userId}"]`);
    if (all.length > 0) return;
    
    const avatar = await getTwitchAvatar(data.user.login);
    const user = data.user.name;

    addParticipant(user, 'twitch', avatar, userId);
    
}




// ---------------------------
// TWITCH UTILITY FUNCTIONS

async function getTwitchAvatar(user) {
    console.debug(`Twitch avatar not found for ${user}! Getting it from DECAPI!`);
    
    try {
        const response = await fetch(`https://decapi.me/twitch/avatar/${user}`);
        let avatar = await response.text();
        
        if (!avatar) {
            avatar = 'https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-300x300.png';
        }

        return avatar;
    }
    catch (err) {
        console.error(`Failed to fetch avatar for ${user}:`, err);
        return 'https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-300x300.png';
    }
}