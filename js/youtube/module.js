const showYouTubeMessages           = getURLParam("showYouTubeMessages", true);
const showYouTubeSuperChats         = getURLParam("showYouTubeSuperChats", true);
const showYouTubeSuperStickers      = getURLParam("showYouTubeSuperStickers", false);
const showYouTubeMemberships        = getURLParam("showYouTubeMemberships", true);
const showYouTubeGiftMemberships    = getURLParam("showYouTubeGiftMemberships", true);
const showYouTubeMembershipsTrain   = getURLParam("showYouTubeMembershipsTrain", true);
const showYouTubeStatistics         = getURLParam("showYouTubeStatistics", true);

userColors.set('youtube', new Map());

if (showYouTubeStatistics == false) { document.querySelector('#statistics #youtube').style.display = 'none'; }

const youtubeMessageHandlers = {
    'YouTube.Message': (response) => {
        console.debug(response.data);
        if (showYouTubeMessages == false)
            return;
        if (ignoreUserList.includes(response.data.user.name.toLowerCase()))
            return;
        youTubeChatMessage(response.data);
    },
    'YouTube.StatisticsUpdated': (response) => {
        console.debug(response.data);
        if (showYouTubeStatistics == false) return;
        youTubeUpdateStatistics(response.data);
    }
};


for (const [event, handler] of Object.entries(youtubeMessageHandlers)) {
    streamerBotClient.on(event, handler);
}





streamerBotClient.on('General.Custom', (response) => {
    if (response.data.platform === 'YouTube') {
        
        let json = response.data; 
        let ytdata = response.data.data;

        console.debug(ytdata);

        switch (json.data.eventname) {

            case 'Super Chat' :
                if (showYouTubeSuperChats == false) return;
                youTubeSuperChatMessage(ytdata);
            break;

            case 'Super Sticker' :
                if (showPlatformStatistics == false || showYouTubeSuperStickers == false) return;
                youTubeSuperStickerMessage(ytdata);
            break;

            case 'New Sponsor' :
                if (showYouTubeMemberships == false) return;
                youTubeNewSponsorMessage(ytdata);
            break;

            case 'Member Milestone' :
                if (showYouTubeMemberships == false) return;
                youTubeNewSponsorMessage(ytdata);
            break;

            case 'Membership Gift' : 
                if (showYouTubeGiftMemberships == false) return;
                youTubeGiftedMembersMessage(ytdata);
            break;

            case 'Gift Membership Received' : 
                if (showYouTubeMembershipsTrain == false) return;
                YouTubeGiftReceivedMessage(ytdata);
            break;

            default:
                console.debug(ytdata);
        }
    }
    
});




async function youTubeChatMessage(data) {
    if (data.message.startsWith("!") && excludeCommands == true) 
        return;
    
    const {
        user: {
            id: userID,
            profileImageUrl: avatar,
            name: userName,
            isVerified,
            isSponsor,
            isModerator,
            isOwner,
        },
        eventId: messageID,
        message,
    } = data;
    
    const badgesHTML = [
        isVerified && '<i class="fa-solid fa-check"></i>',
        isSponsor && '<i class="fa-solid fa-star"></i>',
        isModerator && '<i class="fa-solid fa-wrench"></i>',
        isOwner && '<i class="fa-solid fa-video"></i>',
    ].filter(Boolean).join('');

    const classes = [
        isSponsor && 'sub',
        isModerator && 'mod',
        isOwner && 'owner',
    ].filter(Boolean);

    const messageData = {
        classes: classes.join(' '),
        avatar,
        badges: badgesHTML,
        userName,
        color: await createRandomColor('youtube', userID),
        message,
        reply: '',
    };
    addMessageToChat(userID, messageID, 'youtube', messageData);
}


async function youTubeSuperChatMessage(data) {
    const {
        user: {
            id: userID,
            name: userName,
        },
        eventId: messageID,
        currency,
        amount,
        message : textmessage
    } = data;
    
    var moneycurrency = currency || 'USD';
    var money = formatCurrency(amount, moneycurrency);

    const [avatar, message] = await Promise.all([
        ``,
        currentLang.youtube.superchat({
            money : money,
            message : textmessage
        })
    ]);
    const classes = 'superchat';
    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    }
    addEventToChat(userID, messageID, 'youtube', messageData);
}


async function youTubeSuperStickerMessage(data) {
    const {
        user: {
            id: userID,
            name: userName,
        },
        eventId: messageID,
        currency,
        amount,
        message : textmessage
    } = data;
    var moneycurrency = currency || 'USD';
    var money = formatCurrency(amount, moneycurrency);
    const [avatar, message] = await Promise.all([
        ``,
        currentLang.youtube.superchat({
            money : money,
            message : textmessage
        })
    ]);
    const classes = 'supersticker';
    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    }
    addEventToChat(userID, messageID, 'youtube', messageData);
}

async function youTubeNewSponsorMessage(data) {
    const {
        user: {
            id: userID,
            name: userName,
        },
        eventId: messageID,
        levelName,
        months,
        tier,
    } = data;
    const [avatar, message] = await Promise.all([
        ``,
        currentLang.youtube.member({
            months : months,
            tier : levelName,
        })
    ]);
    const classes = 'member';
    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    }
    addEventToChat(userID, messageID, 'youtube', messageData);
}


async function youTubeGiftedMembersMessage(data) {
    const {
        user: {
            id: userID,
            name: userName,
        },
        eventId: messageID,
        tier,
        count
    } = data;
    const [avatar, message] = await Promise.all([
        ``,
        currentLang.youtube.giftedmembers({
            total : count,
            tier : tier
        })
    ]);
    const classes = 'giftedmembers';
    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    }
    addEventToChat(userID, messageID, 'youtube', messageData);
}

async function YouTubeGiftReceivedMessage(data) {
    const {
        user: {
            id: userID,
            name: userName,
        },
        gifter: {
            id : gifterUserId,
            name: gifterUserName
        },
        eventId: messageID,
        tier
    } = data;
    const [avatar, message] = await Promise.all([
        ``,
        currentLang.youtube.giftedmembers({
            gifted : gifterUserName,
            tier : tier
            
        })
    ]);
    const classes = 'giftedtrainmembers';
    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    }
    addEventToChat(userID, messageID, 'youtube', messageData);
}


async function youTubeUpdateStatistics(data) {
    const viewers = DOMPurify.sanitize(data.concurrentViewers);
    const likes = DOMPurify.sanitize(data.likeCount);
    document.querySelector('#statistics #youtube .viewers span').textContent = formatNumber(viewers);
    document.querySelector('#statistics #youtube .likes span').textContent = formatNumber(likes);
}