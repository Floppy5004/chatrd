const showFourthwallDonations           = getURLParam("showFourthwallDonations", true);

const showFourthwallOrders              = getURLParam("showFourthwallOrders", true);
const showFourthwallShowImage           = getURLParam("showFourthwallShowImage", true);
const showFourthwallBigImage            = getURLParam("showFourthwallBigImage", true);

const showFourthwallSubscriptions       = getURLParam("showFourthwallSubscriptions", true);

const showFourthwallGiftPurchase        = getURLParam("showFourthwallGiftPurchase", true);
const showFourthwallShowGiftImage       = getURLParam("showFourthwallShowGiftImage", true);
const showFourthwallBigGiftImage        = getURLParam("showFourthwallBigGiftImage", true);

const showFourthwallGiftDraw            = getURLParam("showFourthwallGiftDraw", true);
const fourthWallGiftDrawCommand         = getURLParam("fourthWallGiftDrawCommand", "!enter");

const fourthwallMessageHandlers = {
    'Fourthwall.Donation': (response) => {
        console.debug('Fourthwall Donation', response.data);
        fourthwallDonationMessage(response.data);
    },
    'Fourthwall.OrderPlaced': (response) => {
        console.debug('Fourthwall Order', response.data);
        fourthwallOrderMessage(response.data);
    },
    'Fourthwall.SubscriptionPurchased': (response) => {
        console.debug('Fourthwall Sub', response.data);
        fourthwallSubMessage(response.data);
    },
    'Fourthwall.GiftPurchase': (response) => {
        console.debug('Fourthwall Gift', response.data);
        fourthwallGiftMessage(response.data);
    },
    'Fourthwall.GiftDrawStarted': (response) => {
        console.debug('Fourthwall Gift Draw Start', response.data);
        fourthwallGiftDrawStartMessage(response.data);
    },
    'Fourthwall.GiftDrawEnded': (response) => {
        console.debug('Fourthwall Gift Draw Start', response.data);
        fourthwallGiftDrawEndMessage(response.data);
    },
};

for (const [event, handler] of Object.entries(fourthwallMessageHandlers)) {
    streamerBotClient.on(event, handler);
}


async function fourthwallDonationMessage(data) {
    
    if (showFourthwallDonations == false) return;

    const {
        username : userName,
        amount,
        currency,
        message: text
    } = data;

    const userID = createRandomString(40);
    const messageID = createRandomString(40);

    var money = formatCurrency(amount,currency);

    const [avatar, message] = await Promise.all([
        '',
        currentLang.fourthwall.donation({
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
    
    addEventToChat(userID, messageID, 'fourthwall', messageData);
}


async function fourthwallOrderMessage(data) {
    
    if (showFourthwallOrders == false) return;

    const username = data.username;
	const total = data.total;
	const currency = data.currency;
	const item = data.variants[0].name;
	const itemsQuantity = data.variants.length;
	const text = stripStringFromHtml(data.statmessageus);
	const imageUrl = data.variants[0].image;

    const userID = createRandomString(40);
    const messageID = createRandomString(40);

    var userName = '';
    if (username == undefined) { userName = currentLang.fourthwall.someone(); }
    else { userName = username; }

    var money = '';
    if (total == 0) { money = 0; }
    else { money = formatCurrency(total,currency); }

    var fourthWallImage = '';
    if (showFourthwallShowImage == true) {
        fourthWallImage = imageUrl
    }

    const [avatar, message] = await Promise.all([
        '',
        currentLang.fourthwall.order({
            money: money,
            firstItem: item,
            items: itemsQuantity,
            message: text,
            image: fourthWallImage
        }),
    ]);

    const classes = ['order'];
    if (showFourthwallBigImage == true) {
        classes.push('giantimage');
    }

    const messageData = {
        classes: classes.join(' '),
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    };
    
    addEventToChat(userID, messageID, 'fourthwall', messageData);
}


async function fourthwallSubMessage(data) {
    
    if (showFourthwallSubscriptions == false) return;

    const {
        nickname : userName,
        amount,
        currency
    } = data;

    const userID = createRandomString(40);
    const messageID = createRandomString(40);

    var money = formatCurrency(amount,currency);

    const [avatar, message] = await Promise.all([
        '',
        currentLang.fourthwall.donation({
            money: money
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
    
    addEventToChat(userID, messageID, 'fourthwall', messageData);
}


async function fourthwallGiftMessage(data) {
    
    if (showFourthwallGiftPurchase == false) return;

    const userName = data.username;
	const total = data.total;
	const currency = data.currency;
	const gifts = data.gifts.length;
	const item = data.offer.name;
	const imageUrl = data.offer.imageUrl;
	const text = stripStringFromHtml(data.statmessageus);

    const userID = createRandomString(40);
    const messageID = createRandomString(40);

    var money = '';
    if (total == 0) { money = 0; }
    else { money = formatCurrency(total,currency); }

    var fourthWallImage = '';
    if (showFourthwallShowGiftImage == true) {
        fourthWallImage = imageUrl
    }

    const [avatar, message] = await Promise.all([
        '',
        currentLang.fourthwall.gift({
            money: money,
            firstItem: item,
            items: gifts,
            message: text,
            image: fourthWallImage
        }),
    ]);

    const classes = ['order'];
    if (showFourthwallBigGiftImage == true) {
        classes.push('giantimage');
    }

    const messageData = {
        classes: classes.join(' '),
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    };
    
    addEventToChat(userID, messageID, 'fourthwall', messageData);
}

async function fourthwallGiftDrawStartMessage(data) {
    
    if (showFourthwallGiftDraw == false) return;

    const {
        offer: {
            name: itemName
        },
        durationSeconds
    } = data;

    var userName = '';
    const userID = createRandomString(40);
    const messageID = createRandomString(40);

    const [avatar, message] = await Promise.all([
        '',
        currentLang.fourthwall.drawstart({
            gift: itemName,
            command: fourthWallGiftDrawCommand,
            time: durationSeconds
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
    
    addEventToChat(userID, messageID, 'fourthwall', messageData);
}

async function fourthwallGiftDrawEndMessage(data) {
    
    if (showFourthwallGiftDraw == false) return;

    const {
        gifts
    } = data;

    var userName = '';
    const userID = createRandomString(40);
    const messageID = createRandomString(40);

    const [avatar, message] = await Promise.all([
        '',
        currentLang.fourthwall.drawend({
            winners: await getWinnersList(gifts)
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
    
    addEventToChat(userID, messageID, 'fourthwall', messageData);
}




async function getWinnersList(gifts) {
	const winners = gifts.map(gift => gift.winner).filter(Boolean); // Remove null/undefined

	const numWinners = winners.length;

	if (numWinners === 0) { return ""; }
	if (numWinners === 1) { return winners[0]; }
	if (numWinners === 2) { return `${winners[0]} and ${winners[1]}`; }

	// For 3 or more, use the Oxford comma style: A, B, and C
	const allButLast = winners.slice(0, -1).join(", ");
	const lastWinner = winners[winners.length - 1];
	return `${allButLast}, and ${lastWinner}`;
}
