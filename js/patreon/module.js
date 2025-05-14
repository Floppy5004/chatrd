const showPatreonMemberships        = getURLParam("showPatreonMemberships", true);

const patreonHandlers = {
    'Patreon.PledgeCreate': (response) => {
        console.debug('Patreon Membersihp', response.data);
        patreonMemberships(response.data);
    },
};
for (const [event, handler] of Object.entries(patreonHandlers)) {
    streamerBotClient.on(event, handler);
}



async function patreonMemberships(data) {
    
    if (showPatreonMemberships == false) return;

    const {
        attributes: {
            full_name: userName,
            will_pay_amount_cents: money
        }
    } = data;
    
    const userID = createRandomString(40);
    const messageID = createRandomString(40);

    const [avatar, message] = await Promise.all([
        '',
        currentLang.patreon.membership({
            money : (money / 100).toFixed(2)
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
    addEventToChat(userID, messageID, 'patreon', messageData);
}
