/*
const kickWebSocket = new WebSocket(
    `wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false`
);

kickWebSocket.onerror = (error) => {
    console.error("Kick WebSocket Error: " + error);
};

kickWebSocket.onopen = () => {

    kickGetUserInfo(kickUser)
    .then((userInfo) => {
        console.log('Got Kick User Info', userInfo);

        kickWebSocket.send(
            JSON.stringify({
                event: "pusher:subscribe",
                data: {
                    auth: null,
                    channel: `chatrooms.${userInfo.chatroom.id}.v2`
                },
            })
        );

        kickWebSocket.send(
            JSON.stringify({
                event: "pusher:subscribe",
                data: {
                    auth: null,
                    channel: `channel.${userInfo.chatroom.channel_id}`
                },
            })
        );

        kickWebSocket.send(
            JSON.stringify({
                event: "pusher:subscribe",
                data: {
                    auth: null,
                    channel: `private-channel_${userInfo.chatroom.channel_id}`
                },
            })
        );

        
    });

};

kickWebSocket.onmessage = async ({ data }) => {
    const parsed = JSON.parse(data);
    const json = JSON.parse(parsed.data);

    console.debug('Kick Event', parsed.event, json);

    if (parsed.event === "App\\Events\\ChatMessageEvent") {
        console.debug('Kick Chat', json);
        kickChatMessage(json);
    }
};

*/
