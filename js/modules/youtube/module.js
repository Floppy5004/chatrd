
// YOUTUBE EVENTS HANDLERS

const youtubeMessageHandlers = {
    'YouTube.Message': (response) => {
        youTubeChatMessage(response.data);
    }
}


async function youtubeConnection() {
    if (rouletteConfig.enableYoutube) {
        registerPlatformHandlersToStreamerBot(youtubeMessageHandlers, '[RouletteRD][YouTube]');
    }
}



// ---------------------------
// YOUTUBE EVENT FUNCTIONS

async function youTubeChatMessage(data) {

    if (rouletteConfig.test) { return; }

    const chatMessage = data.message.trim();
    const chatCommand = rouletteConfig.joinCommand;
    const userId = data.user.id;
    
    if (chatMessage != chatCommand) return;
    const all = document.querySelectorAll(`div.s-item.youtube[data-user="${userId}"]`);
    if (all.length > 0) return;
    
    const avatar = data.user.profileImageUrl;
    const user = data.user.name;

    addParticipant(user, 'youtube', avatar, userId);

}