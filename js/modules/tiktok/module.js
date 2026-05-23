
// -----------------------
// TIKTOK CONNECT HANDLER

async function tiktokConnection() {
    
    if (!rouletteConfig.enableTiktok) { return; }

    const tikfinityWebSocketURL = 'ws://localhost:21213/'; // Replace with real URL
    const reconnectDelay = 10000; // 10 seconds
    const maxTries = 20;
    let retryCount = 0;

    function connect() {
        const tikfinityWebSocket = new WebSocket(tikfinityWebSocketURL);

        tikfinityWebSocket.onopen = () => {
            console.debug(`[RouletteRD][TikFinity] Connected to TikFinity successfully!`);
            retryCount = 0; // Reset retry count on success

            notifySuccess({
                title: 'RouletteRD 🤝 TikFinity',
                text: ``
            });
        };

        tikfinityWebSocket.onmessage = (response) => {

            const data = JSON.parse(response.data);
            const tiktokData = data.data;

            console.debug(`[RouletteRD][TikTok] ${data.event}`, data);

            switch (data.event) {
                case 'chat': tiktokChatMessage(tiktokData); break;
            }
        };

        tikfinityWebSocket.onclose = (event) => {

            setTimeout(() => {
                    connect();
                }, reconnectDelay);
                
        };

        tikfinityWebSocket.onerror = (error) => {
            console.error(`[RouletteRD][TikFinity] Connection error:`, error);

            // Force close to trigger onclose and centralize retry logic
            if (tikfinityWebSocket.readyState !== WebSocket.CLOSED) {
                tikfinityWebSocket.close();
            }
        };

        return tikfinityWebSocket;
    }

    return connect(); // Returns the initial WebSocket instance
}













// ---------------------------
// TIKTOK UTILITY FUNCTIONS

async function tiktokChatMessage(data) {

    if (rouletteConfig.test) { return; }
    
    if (!data?.comment) { data.comment = " "; }

    const chatMessage = data.comment.trim();
    const chatCommand = rouletteConfig.joinCommand;
    const userId = data.userId;
    
    if (chatMessage != chatCommand) return;
    const all = document.querySelectorAll(`div.s-item.tiktok[data-user="${userId}"]`);
    if (all.length > 0) return;
    
    const avatar = data.profilePictureUrl;
    const user = data.nickname;

    addParticipant(user, 'tiktok', avatar, userId);
}