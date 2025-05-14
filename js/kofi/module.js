const showKofiSubscriptions             = getURLParam("showKofiSubscriptions", true);
const showKofiDonations                 = getURLParam("showKofiDonations", true);
const showKofiOrders                    = getURLParam("showKofiOrders", true);

const kofiMessageHandlers = {
    'Kofi.Donation': (response) => {
        console.debug('Kofi Donation', response.data);
        kofiDonationMessage(response.data);
    },
    'Kofi.Subscription': (response) => {
        console.debug('Kofi Sub', response.data);
        kofiSubMessage(response.data);
    },
    'Kofi.Resubscription': (response) => {
        console.debug('Kofi Resub', response.data);
        kofiReSubMessage(response.data);
    },
    'Kofi.ShopOrder': (response) => {
        console.debug('Kofi Order', response.data);
        kofiOrderMessage(response.data);
    },
};

for (const [event, handler] of Object.entries(kofiMessageHandlers)) {
    streamerBotClient.on(event, handler);
}   


async function kofiDonationMessage(data) {
    
    if (showKofiDonations == false) return;

    const {
        from : userName,
        amount,
        currency,
        message: text
    } = data;

    const userID = createRandomString(40);
    const messageID = createRandomString(40);

    var money = formatCurrency(amount,currency);

    const [avatar, message] = await Promise.all([
        '',
        currentLang.kofi.donation({
            money: money,
            message: text
        }),
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
    
    addEventToChat(userID, messageID, 'kofi', messageData);
}   


async function kofiSubMessage(data) {
    
    if (showKofiSubscriptions == false) return;

    const {
        from : userName,
        amount,
        currency,
        message: text
    } = data;

    const userID = createRandomString(40);
    const messageID = createRandomString(40);

    var money = formatCurrency(amount,currency);

    const [avatar, message] = await Promise.all([
        '',
        currentLang.kofi.sub({
            money: money,
            message: text
        }),
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
    
    addEventToChat(userID, messageID, 'kofi', messageData);
}   


async function kofiReSubMessage(data) {
    
    if (showKofiSubscriptions == false) return;

    const {
        from : userName,
        amount,
        currency,
        tier,
        message: text
    } = data;

    const userID = createRandomString(40);
    const messageID = createRandomString(40);

    var money = formatCurrency(amount,currency);

    const [avatar, message] = await Promise.all([
        '',
        currentLang.kofi.resub({
            money: money,
            tier: tier,
            message: text
        }),
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
    
    addEventToChat(userID, messageID, 'kofi', messageData);
}


async function kofiOrderMessage(data) {
    
    if (showKofiOrders == false) return;
    const {
        from : userName,
        amount,
        currency,
        items
    } = data;

    const userID = createRandomString(40);
    const messageID = createRandomString(40);

    var money = '';

    if (amount == 0) { money = 0; }
    else { money = formatCurrency(amount,currency); }

    var itemsQuantity = items.length

    const [avatar, message] = await Promise.all([
        '',
        currentLang.kofi.order({
            money: money,
            items: itemsQuantity
        }),
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
    
    addEventToChat(userID, messageID, 'kofi', messageData);
}