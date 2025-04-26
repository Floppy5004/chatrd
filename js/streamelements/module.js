const showStreamElementsTips        = getURLParam("showStreamElementsTips", true);

const streamElementsHandlers = {
    'StreamElements.Tip': (response) => {
        console.debug(response.data);
        streamElementsEventMessage(response.data);
    },
};
for (const [event, handler] of Object.entries(streamElementsHandlers)) {
    streamerBotClient.on(event, handler);
}



async function streamElementsEventMessage(data) {
    
    if (showStreamElementsTips == false) return;
    
    const {
        username: userName,
        amount: moneyFromUser,
        currency: currencyFromUser,
        message: messageFromUser,
    } = data;
    
    const userID = createRandomString(40);
    const messageID = createRandomString(40);
    const [avatar, message] = await Promise.all([
        '',
        currentLang.streamlabs.tip({
            money : formatCurrency(moneyFromUser,currencyFromUser),
            message : messageFromUser
        })
    ]);
    const classes = 'streamelements';
    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    };
    addEventToChat(userID, messageID, 'dollar-sign', messageData);
}
