const showTipeeeDonations        = getURLParam("showTipeeeDonations", true);

const tipeeeHandlers = {
    'TipeeeStream.Donation': (response) => {
        console.debug('TipeeeStream Donation', response.data);
        tipeeeStreamDonation(response.data);
    },
};
for (const [event, handler] of Object.entries(tipeeeHandlers)) {
    streamerBotClient.on(event, handler);
}



async function tipeeeStreamDonation(data) {
    
    if (showTipeeeDonations == false) return;

    const {
        user: userName,
        amount,
        currency,
        message: text
    } = data;
    
    const userID = createRandomString(40);
    const messageID = createRandomString(40);

    const [avatar, message] = await Promise.all([
        '',
        currentLang.tipeeestream.tip({
            money : formatCurrency(amount,currency),
            message: text
        })
    ]);
    const classes = '';
    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    };
    addEventToChat(userID, messageID, 'tipeeestream', messageData);
}
