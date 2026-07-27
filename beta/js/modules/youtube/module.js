/* ------------------------ */
/* YOUTUBE MODULE VARIABLES */
/* ------------------------ */

const showYoutube                       = getURLParam("showYoutube", false);
const showYouTubeMessages               = getURLParam("showYouTubeMessages", true);
const showYouTubeSuperChats             = getURLParam("showYouTubeSuperChats", true);
const showYouTubeSuperStickers          = getURLParam("showYouTubeSuperStickers", true);
const showYouTubeSuperStickerGif        = getURLParam("showYouTubeSuperStickerGif", true);
const showYouTubeMemberships            = getURLParam("showYouTubeMemberships", true);
const showYouTubeGiftMemberships        = getURLParam("showYouTubeGiftMemberships", true);
const showYouTubeMembershipsTrain       = getURLParam("showYouTubeMembershipsTrain", true);
const showYouTubeJewels                 = getURLParam("showYouTubeJewels", true);
const showSmallYouTubeJewels            = getURLParam("showSmallYouTubeJewels", false);
const showYouTubeStatistics             = getURLParam("showYouTubeStatistics", true);

const youtubeStreamer = {};
const youtubeJewelsComboState = new Map();

let youTubeCustomEmotes = [];
let youTubeBTTVEmotes = [];

userColors.set('youtube', new Map());

const youtubeStatistics = `
    <div class="platform youtube" id="youtube" style="display: none;">
        <img src="js/modules/youtube/images/logo-youtube.svg" alt="">
        <span class="viewers"><i class="fa-solid fa-user"></i> <span>0</span></span>
        <span class="likes"><i class="fa-solid fa-thumbs-up"></i> <span>0</span></span>
        <span class="title"></span>
    </div>
`;

// YOUTUBE EVENTS HANDLERS

const youtubeMessageHandlers = {
    'YouTube.Message': (response) => {
        youTubeChatMessage(response.data);
    },
    'YouTube.UserBanned': (response) => {
        setTimeout(() => { youTubeUserBanned(response.data); }, 3000);
    },
    'YouTube.SuperChat': (response) => {
        youTubeSuperChatMessage(response.data);
    },
    'YouTube.SuperSticker': (response) => {
        youTubeSuperStickerMessage(response.data);
    },
    'YouTube.NewSponsor': (response) => {
        youTubeNewSponsorMessage(response.data);
    },
    'YouTube.MemberMileStone': (response) => {
        youTubeNewSponsorMessage(response.data);
    },
    'YouTube.MembershipGift': (response) => {
        youTubeGiftBombMessage(response.data);
    },
    'YouTube.GiftMembershipReceived': (response) => {
        youTubeGiftBombReceivedMessage(response.data);
    },
    'YouTube.StatisticsUpdated': (response) => {
        youTubeUpdateStatistics(response.data);
    },
    'YouTube.BroadcastUpdated': (response) => {
        youTubeAddStatistics(response.data);
    },
    'YouTube.JewelsGifted': (response) => {
        youTubeJewels(response.data);
    },
    'YouTube.BroadcastEnded': (response) => {
        
        if ((showYouTubeStatistics == true) && (showPlatformStatistics == true)) {
            document.querySelector('#statistics').insertAdjacentHTML('beforeend', youtubeStatistics);
            document.querySelector('#youtube').style.display = '';
        }
        
    }
};


if (showYoutube) {

    if ((showYouTubeStatistics == true) && (showPlatformStatistics == true)) {
        document.querySelector('#statistics').insertAdjacentHTML('beforeend', youtubeStatistics);
        document.querySelector('#youtube').style.display = '';
    }

    registerPlatformHandlersToStreamerBot(youtubeMessageHandlers, '[ChatRD][YouTube]');
}




// ---------------------------
// YOUTUBE EVENT FUNCTIONS

async function youTubeChatMessage(data) {
    
    if (showYouTubeMessages == false) return;
    if (ignoreUserList.includes(data.user.name.toLowerCase())) return;
    if (data.message.startsWith("!") && excludeCommands == true) return;

	const template = chatTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.eventId;
    const userId = data.user.id;
    const broadcastId = data.broadcast.id;

    const root = clone.querySelector(".item");
    root.dataset.broadcast = broadcastId;

    const {
        'first-message': firstMessage,
        'shared-chat': sharedChat,
        
        header,
        timestamp,
        platform,
        badges,
        avatar,
        pronouns: pronoun,
        user,
        
        reply,
        'actual-message': message
    } = Object.fromEntries(
        [...clone.querySelectorAll('[class]')]
            .map(el => [el.className, el])
    );

    const classes = ['youtube', 'msg'];

    const verticalTags = ["vertical", "shorts"];
    const isVertical = data.broadcast.tags.some(item =>
        verticalTags.some(target => item.toLowerCase() === target.toLowerCase())
    );

    if (isVertical) { classes.push('youtube-vertical'); }

    const [badgeList] = await Promise.all([
        getYouTubeBadges(data)
    ]);

    header.remove();
    firstMessage.remove();
    sharedChat.remove();
    reply.remove();
    pronoun.remove();

    

        
    if (!youtubeStreamer.broadcastUserName) {
        const streamerInfo = await getStreamerInfo();
        youtubeStreamer.broadcastUserName = streamerInfo.platforms.youtube.broadcastUserName;
    }
    
    if (data.message.toLowerCase().includes( youtubeStreamer.broadcastUserName.toLowerCase() )) {
        classes.push('streamer-mentioned');
    }



    var color = await createRandomColor('youtube', data.user.name);
    
    

    const userLinkElement = user.querySelector('a');
    //const userLink = `https://youtube.com/channel/${userId}`;
    const userLink = `${data.user.url}`;

    userLinkElement.href = userLink;
    userLinkElement.target = '_blank';
    userLinkElement.style = `--user-color: ${color}`;
    userLinkElement.textContent = data.user.name;
    userLinkElement.title = `${data.user.name} @ ${userLink}`;

    message.textContent = data.message;
    await getYouTubeEmotes(data, message);

    if (showAvatar) avatar.innerHTML = `<img src="${data.user.profileImageUrl}">`; else avatar.remove();
    if (showBadges) badges.innerHTML = badgeList; else badges.remove();


    if (data.user.isSponsor) { classes.push('sponsor'); }
    if (data.user.isModerator) { classes.push('moderator'); }
    if (data.user.isVerified) { classes.push('verified'); }

    
    if (data.user.isOwner) {
        classes.push('streamer');
        userLinkElement.style = `--user-color: #000000`;
    }

    addMessageItem('youtube', clone, classes, userId, messageId);
}


setTimeout(() => {
    youTubeChatMessage({
        "message": "the youtube notification thing",
        "emotes": [],
        "parts": [
            {
                "text": "the youtube notification thing"
            }
        ],
        "broadcast": {
            "id": "IQhOS-1kXLw",
            "channelId": "UCke8WMjtyqZ1wMNYr5wwLWA",
            "liveChatId": "KicKGFVDa2U4V01qdHlxWjF3TU5ZcjV3d0xXQRILSVFoT1MtMWtYTHc",
            "title": "🔴 [LIVE] TEST",
            "description": "✅ Não esqueça de dar LIKE, SE INSCREVER e LIGAR AS NOTIFICAÇÕES!\n\n👇🏽😊\n🟣 - https://twitch.tv/vortisrd\n🔴 - https://youtube.com/@vortisrd\n🟢 - https://kick.com/vortisrd\n⚫ - https://tiktok.com/@vortisrd\n🔵 - https://twitter.com/vortisrd\n\n💰- https://livepix.gg/vortisrd\n💰- https://streamelements.com/vortisrd/tip\n\n#hollowknight #silksong #teamcherry",
            "categoryId": "20",
            "privacy": "public",
            "publishedAt": "2026-07-25T12:02:01Z",
            "scheduledStartTime": "2026-07-26T09:52:54.689597Z",
            "scheduledEndTime": "2026-07-26T09:52:54.689597Z",
            "actualStartTime": "2026-07-26T09:52:54.689597Z",
            "actualEndTime": "2026-07-26T09:52:54.689597Z",
            "tags": [
                "vortis",
                "vortisrd",
                "vortisrd live",
                "gaming",
                "live",
                "games",
                "hollow knight silksong",
                "live hollow knight silksong",
                "stream hollow knight silksong",
                "silksong ao vivo",
                "gameplay ao vivo",
                "metroidvania",
                "jogo indie",
                "gameplay silksong",
                "dicas hollow knight silksong",
                "exploração hollow knight silksong",
                "boss fight hollow knight silksong",
                "gaming br",
                "live br",
                "streamer brasileiro",
                "hornet gameplay",
                "hollow knight silksong pt br",
                "pharloom",
                "silksong 2025"
            ],
            "defaultLanguage": "pt-BR",
            "defaultAudioLanguage": "pt-BR",
            "status": "live"
        },
        "eventId": "LCC.EhwKGkNLQ3dyTEdZOHBVREZiakF3Z1FkUFZNcnFR",
        "user": {
            "id": "UCpHjJxWs4C_JFS7hqC_Lhvg",
            "url": "http://www.youtube.com/channel/UCpHjJxWs4C_JFS7hqC_Lhvg",
            "name": "RodrigoEmanuel",
            "profileImageUrl": "https://yt3.ggpht.com/ytc/AIdro_mBpsXZL5pJ2_vbR2E_CO92fNILsFFO2WoXHg2LsMj7z7iN=s88-c-k-c0x00ffffff-no-rj",
            "isOwner": false,
            "isModerator": true,
            "isSponsor": false,
            "isVerified": false
        },
        "publishedAt": "2026-07-27T03:06:33.114709-03:00"
    });
}, 3000);



async function youTubeSuperChatMessage(data) {

    if (showYouTubeSuperChats == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.eventId;
    const userId = data.user.id;

    const {
        header,
        platform,
        user,
        action,
        value,
        'actual-message': message
    } = Object.fromEntries(
        [...clone.querySelectorAll('[class]')]
            .map(el => [el.className, el])
    );

    const classes = ['youtube', 'superchat'];

    const verticalTags = ["vertical", "shorts"];
    const isVertical = data.broadcast.tags.some(item =>
        verticalTags.some(target => item.toLowerCase() === target.toLowerCase())
    );

    if (isVertical) { classes.push('youtube-vertical'); }

    header.remove();

    
    const userLinkElement = user.querySelector('a');
    const userLink = `${data.user.url}`;

    userLinkElement.href = userLink;
    userLinkElement.target = '_blank';
    userLinkElement.textContent = data.user.name;
    userLinkElement.title = `${data.user.name} @ ${userLink}`;


    action.innerHTML = tRD('youtube.superchat_action');
    value.innerHTML = `<strong>${data.amount}</strong>`;

    message.textContent = data.message;
    await getYouTubeEmotes(data, message);

    addEventItem('youtube', clone, classes, userId, messageId);
}



async function youTubeSuperStickerMessage(data) {
    
    if (showYouTubeMemberships == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.eventId;
    const userId = data.user.id;

    const {
        header,
        platform,
        user,
        action,
        value,
        'actual-message': message
    } = Object.fromEntries(
        [...clone.querySelectorAll('[class]')]
            .map(el => [el.className, el])
    );

    const classes = ['youtube', 'sticker'];

    const verticalTags = ["vertical", "shorts"];
    const isVertical = data.broadcast.tags.some(item =>
        verticalTags.some(target => item.toLowerCase() === target.toLowerCase())
    );

    if (isVertical) { classes.push('youtube-vertical'); }

    if (showYouTubeSuperStickerGif == true) {
        youtubeStickerUrl = await getYouTubeStickerImage(data);
        header.innerHTML = `<img src="${youtubeStickerUrl}" class="sticker">`;
    }
    else {
        header.remove();
    }
    
    const userLinkElement = user.querySelector('a');
    const userLink = `${data.user.url}`;

    userLinkElement.href = userLink;
    userLinkElement.target = '_blank';
    userLinkElement.textContent = data.user.name;
    userLinkElement.title = `${data.user.name} @ ${userLink}`;

    action.innerHTML = tRD('youtube.supersticker_action');

    value.innerHTML = `<strong>(${data.amount})</strong>`;
    
    message.remove();

    addEventItem('youtube', clone, classes, userId, messageId);
}



async function youTubeNewSponsorMessage(data) {
    
    if (showYouTubeMemberships == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.eventId;
    const userId = data.user.id;

    const {
        header,
        platform,
        user,
        action,
        value,
        'actual-message': message
    } = Object.fromEntries(
        [...clone.querySelectorAll('[class]')]
            .map(el => [el.className, el])
    );

    const classes = ['youtube', 'sponsor'];

    const verticalTags = ["vertical", "shorts"];
    const isVertical = data.broadcast.tags.some(item =>
        verticalTags.some(target => item.toLowerCase() === target.toLowerCase())
    );

    if (isVertical) { classes.push('youtube-vertical'); }

    header.remove();

    
    const userLinkElement = user.querySelector('a');
    const userLink = `${data.user.url}`;

    userLinkElement.href = userLink;
    userLinkElement.target = '_blank';
    userLinkElement.textContent = data.user.name;
    userLinkElement.title = `${data.user.name} @ ${userLink}`;


    action.innerHTML = tRD('youtube.sponsor_action');

    //var months = data.months > 1 ? 'months' : 'month';
    var months = formatSubMonthDuration( (data.months ?? 1) );
    value.innerHTML = `<strong>${months}</strong>`;

    if (data.message) {
        message.textContent = data.message;
        await getYouTubeEmotes(data, message);
    }
    else { message.remove(); }

    addEventItem('youtube', clone, classes, userId, messageId);
}





async function youTubeGiftBombMessage(data) {
    
    if (showYouTubeMemberships == false || showYouTubeGiftMemberships == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.eventId;
    const userId = data.user.id;

    const {
        header,
        platform,
        user,
        action,
        value,
        'actual-message': message
    } = Object.fromEntries(
        [...clone.querySelectorAll('[class]')]
            .map(el => [el.className, el])
    );

    const classes = ['youtube', 'giftbomb'];

    const verticalTags = ["vertical", "shorts"];
    const isVertical = data.broadcast.tags.some(item =>
        verticalTags.some(target => item.toLowerCase() === target.toLowerCase())
    );

    if (isVertical) { classes.push('youtube-vertical'); }

    header.remove();

    
    const userLinkElement = user.querySelector('a');
    const userLink = `${data.user.url}`;

    userLinkElement.href = userLink;
    userLinkElement.target = '_blank';
    userLinkElement.textContent = data.user.name;
    userLinkElement.title = `${data.user.name} @ ${userLink}`;


    action.innerHTML = tRD('youtube.giftbomb_action');

    var count = data.count > 1 ? tRD('youtube.giftbomb_plural') : tRD('youtube.giftbomb_singular');
    value.innerHTML = `<strong>${data.count} ${count} (Tier ${data.tier})</strong>${tRD('youtube.giftbomb_suffix')}`;

    message.remove();

    addEventItem('youtube', clone, classes, userId, messageId);
}



async function youTubeGiftBombReceivedMessage(data) {
    
    if (showYouTubeMemberships == false || showYouTubeGiftMemberships == false || showYouTubeMembershipsTrain == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.eventId;
    const userId = data.user.id;

    const {
        header,
        platform,
        user,
        action,
        value,
        'actual-message': message
    } = Object.fromEntries(
        [...clone.querySelectorAll('[class]')]
            .map(el => [el.className, el])
    );

    const classes = ['youtube', 'giftbomb'];

    const verticalTags = ["vertical", "shorts"];
    const isVertical = data.broadcast.tags.some(item =>
        verticalTags.some(target => item.toLowerCase() === target.toLowerCase())
    );

    if (isVertical) { classes.push('youtube-vertical'); }

    header.remove();

    
    const userLinkElement = user.querySelector('a');
    const userLink = `${data.user.url}`;

    userLinkElement.href = userLink;
    userLinkElement.target = '_blank';
    userLinkElement.textContent = data.user.name;
    userLinkElement.title = `${data.user.name} @ ${userLink}`;

    
    action.innerHTML = tRD('youtube.giftbomb_received_action');
    value.innerHTML = `<strong>${escapeHTML(data.user.name)}</strong>`;

    message.remove();

    addEventItem('youtube', clone, classes, userId, messageId);
}



async function youTubeJewels(data) {

    if (showYouTubeJewels == false) return;

    const jewelsKey = `${data.user.id}::${data.name}`;
    const jewelsDurationMs = Math.round(data.duration.seconds * 1000);
    const jewelsCount = youtubeJewelsComboState.get(jewelsKey);
    const jewelsTotal = (jewelsCount ? jewelsCount.jewelsTotal : 0) + data.jewelsAmount;

    if (jewelsCount) { clearTimeout(jewelsCount.timer); }

    const jewelsCountdown = setTimeout(() => {

        const jewelsFinalState = youtubeJewelsComboState.get(jewelsKey);
        youtubeJewelsComboState.delete(jewelsKey);

        if (jewelsFinalState) {

            const template = eventTemplate;
            const clone = template.content.cloneNode(true);
            const messageId = data.eventId;
            const userId = data.user.id;

            const {
                header,
                platform,
                user,
                action,
                value,
                'actual-message': message
            } = Object.fromEntries(
                [...clone.querySelectorAll('[class]')]
                    .map(el => [el.className, el])
            );

            const classes = ['youtube', 'jewel'];

            if (showSmallYouTubeJewels == true) { classes.push('small-gift'); }

            header.remove();

            const userLinkElement = user.querySelector('a');
            const userLink = `${data.user.url}`;

            userLinkElement.href = userLink;
            userLinkElement.target = '_blank';
            userLinkElement.textContent = data.user.name;
            userLinkElement.title = `${data.user.name} @ ${userLink}`;

            action.innerHTML = tRD('youtube.jewels_action', { count: data.comboCount, name: data.name });
            value.innerHTML = `
                <div class="gift-info">
                    <span class="gift-image"><img src="${data.url}" alt="${data.name}"></span>
                    <span class="gift-value"><i class="fa-regular fa-gem"></i> ${jewelsFinalState.jewelsTotal}</span>
                </div>
            `;

            message.remove();

            addEventItem('youtube', clone, classes, userId, messageId);

        }
    }, jewelsDurationMs);

    youtubeJewelsComboState.set(jewelsKey, { timer: jewelsCountdown, jewelsTotal, lastData: data });
}



/*
let contador = 1;
const limite = 4;

const intervalId = setInterval(() => {
    
    youTubeJewels({
        "jewelsAmount": 10,
        "name": "Tamo junto",
        "url": "https://www.gstatic.com/youtube/img/pdg/gift/assets/tamo_junto.png",
        "duration": {
            "seconds": 3,
            "nanos": 0
        },
        "hasVisualEffect": false,
        "isCombo": true,
        "comboCount": contador,
        "altText": "Tamo junto",
        "language": "en_US",
        "broadcast": {
            "id": "38tP7e7SvKw",
            "channelId": "UCke8WMjtyqZ1wMNYr5wwLWA",
            "liveChatId": "KicKGFVDa2U4V01qdHlxWjF3TU5ZcjV3d0xXQRILMzh0UDdlN1N2S3c",
            "title": "🔴 [LIVE] Testando uma coisa...",
            "description": "✅ Não esqueça de dar LIKE, SE INSCREVER e LIGAR AS NOTIFICAÇÕES!\n\n👇🏽😊\n🟣 - https://twitch.tv/vortisrd\n🔴 - https://youtube.com/@vortisrd\n🟢 - https://kick.com/vortisrd\n⚫ - https://tiktok.com/@vortisrd\n🔵 - https://twitter.com/vortisrd\n\n💰- https://livepix.gg/vortisrd\n💰- https://streamelements.com/vortisrd/tip\n\n#hollowknight #silksong #teamcherry",
            "categoryId": "20",
            "privacy": "public",
            "publishedAt": "2026-07-25T11:40:13Z",
            "scheduledStartTime": "2026-07-25T11:40:15.0176811Z",
            "scheduledEndTime": "2026-07-25T11:40:15.0176811Z",
            "actualStartTime": "2026-07-25T11:40:15.0176811Z",
            "actualEndTime": "2026-07-25T11:40:15.0176811Z",
            "tags": [
                "vortis",
                "vortisrd",
                "vortisrd live",
                "gaming",
                "live",
                "games",
                "gameplay ao vivo",
                "jogo indie",
                "gaming br",
                "live br",
                "streamer brasileiro"
            ],
            "defaultLanguage": "pt-BR",
            "defaultAudioLanguage": "pt-BR",
            "status": "live"
        },
        "eventId": "LCC.EhwKGkNKSFN2NHpoN1pVREZidkN3Z1FkdTJ3V1hR",
        "user": {
            "id": "UCpHjJxWs4C_JFS7hqC_Lhvg",
            "url": "http://www.youtube.com/channel/UCpHjJxWs4C_JFS7hqC_Lhvg",
            "name": "RodrigoEmanuel",
            "profileImageUrl": "https://yt3.ggpht.com/ytc/AIdro_mBpsXZL5pJ2_vbR2E_CO92fNILsFFO2WoXHg2LsMj7z7iN=s88-c-k-c0x00ffffff-no-rj",
            "isOwner": false,
            "isModerator": true,
            "isSponsor": false,
            "isVerified": false
        },
        "publishedAt": "2026-07-25T08:48:32.928812-03:00"
});


    contador++;

    if (contador >= limite) {
        clearInterval(intervalId);
    }
}, 500);

youTubeJewels({
        "jewelsAmount": 2,
        "name": "Oi!",
        "url": "https://www.gstatic.com/youtube/img/pdg/gift/assets/oi.png",
        "duration": {
            "seconds": 3,
            "nanos": 0
        },
        "hasVisualEffect": false,
        "isCombo": true,
        "comboCount": 1,
        "altText": "Oi!",
        "language": "en_US",
        "broadcast": {
            "id": "6xuhz81NhzI",
            "channelId": "UCke8WMjtyqZ1wMNYr5wwLWA",
            "liveChatId": "KicKGFVDa2U4V01qdHlxWjF3TU5ZcjV3d0xXQRILNnh1aHo4MU5oekk",
            "title": "🔴 [LIVE] TEST",
            "description": "✅ Não esqueça de dar LIKE, SE INSCREVER e LIGAR AS NOTIFICAÇÕES!\n\n👇🏽😊\n🟣 - https://twitch.tv/vortisrd\n🔴 - https://youtube.com/@vortisrd\n🟢 - https://kick.com/vortisrd\n⚫ - https://tiktok.com/@vortisrd\n🔵 - https://twitter.com/vortisrd\n\n💰- https://livepix.gg/vortisrd\n💰- https://streamelements.com/vortisrd/tip\n\n#hollowknight #silksong #teamcherry",
            "categoryId": "20",
            "privacy": "public",
            "publishedAt": "2026-07-25T11:53:33Z",
            "scheduledStartTime": "2026-07-25T11:53:34.2191175Z",
            "scheduledEndTime": "2026-07-25T11:53:34.2191175Z",
            "actualStartTime": "2026-07-25T11:53:34.2191175Z",
            "actualEndTime": "2026-07-25T11:53:34.2191175Z",
            "tags": [
                "vortis",
                "vortisrd",
                "vortisrd live",
                "gaming",
                "live",
                "games",
                "hollow knight silksong",
                "live hollow knight silksong",
                "stream hollow knight silksong",
                "silksong ao vivo",
                "gameplay ao vivo",
                "metroidvania",
                "jogo indie",
                "gameplay silksong",
                "dicas hollow knight silksong",
                "exploração hollow knight silksong",
                "boss fight hollow knight silksong",
                "gaming br",
                "live br",
                "streamer brasileiro",
                "hornet gameplay",
                "hollow knight silksong pt br",
                "pharloom",
                "silksong 2025"
            ],
            "defaultLanguage": "pt-BR",
            "defaultAudioLanguage": "pt-BR",
            "status": "live"
        },
        "eventId": "LCC.EhwKGkNJcmF3ZGpqN1pVREZUZkx3Z1FkQmM0ekFR",
        "user": {
            "id": "UCpHjJxWs4C_JFS7hqC_Lhvg",
            "url": "http://www.youtube.com/channel/UCpHjJxWs4C_JFS7hqC_Lhvg",
            "name": "RodrigoEmanuel",
            "profileImageUrl": "https://yt3.ggpht.com/ytc/AIdro_mBpsXZL5pJ2_vbR2E_CO92fNILsFFO2WoXHg2LsMj7z7iN=s88-c-k-c0x00ffffff-no-rj",
            "isOwner": false,
            "isModerator": false,
            "isSponsor": false,
            "isVerified": false
        },
        "publishedAt": "2026-07-25T09:00:12.401147-03:00"
    });

*/

async function youTubeUserBanned(data) {
    chatContainer.querySelectorAll(`[data-user="${data.bannedUser.id}"]:not(.event)`).forEach(element => {
        element.parentNode.remove();
    });
}



async function youTubeAddStatistics(data) {
    
    if (showPlatformStatistics == false || showYouTubeStatistics == false) return;
    
    const status = data.status;
    const id = data.id;
    const title = data.title;
    const elementId = `youtubeStream-${id}`;

    const tags = data.broadcast?.tags || data.tags;

    if (status == 'live') {

        const original = document.querySelector('#statistics #youtube');
        if (original) original.remove();

        if (!document.querySelector( `#${elementId}` )) {
            let youtubeStatisticsHTML = youtubeStatistics.replace(`id="youtube"`, `id="${elementId}"`);
            
            const verticalTags = ["vertical", "shorts"];
            const isVertical = tags.some(item =>
                verticalTags.some(target => item.toLowerCase() === target.toLowerCase())
            );

            if (isVertical) {
                youtubeStatisticsHTML = youtubeStatisticsHTML.replace('logo-youtube.svg', 'logo-youtube-vertical.svg');
            }

            document.querySelector('#statistics').insertAdjacentHTML('beforeend', youtubeStatisticsHTML);

            const streamelement = document.querySelector(`#${elementId}`);
            const streamtitle = streamelement.querySelector(`#${elementId} .title`);
            
            streamtitle.textContent = title;
            streamelement.setAttribute('title', title);
            
            if (showYouTubeStatistics == true) {
                for (const el of document.querySelectorAll('.youtube')) {
                    el.style.display = '';
                }
            }
        }
        else {
            document.querySelector(`#${elementId} .title`).textContent = title;
        }
    }
    else if (status == 'complete') {
        const streamelement = document.querySelector(`#${elementId}`);
        streamelement.remove();

        const youtubeStreamBoxes = document.querySelectorAll('.youtube').length;

        if (youtubeStreamBoxes == 0) {
            document.querySelector('#statistics').insertAdjacentHTML('beforeend', youtubeStatistics);
            document.querySelector('#youtube').style.display = '';
        }
        
    }
}


async function youTubeUpdateStatistics(data) {
    
    if (showPlatformStatistics == false || showYouTubeStatistics == false) return;
    
    const id = data.broadcast.id;
    const viewers = formatNumber(DOMPurify.sanitize(data.concurrentViewers)) || "0";
    const likes = formatNumber(DOMPurify.sanitize(data.likeCount)) || "0";

    youTubeAddStatistics({
        status: data.broadcast.status,
        id: id,
        title: data.broadcast.title,
        tags: data.broadcast.tags
    })

    document.querySelector(`#statistics #youtubeStream-${id} .viewers span`).textContent = formatNumber(viewers);
    document.querySelector(`#statistics #youtubeStream-${id} .likes span`).textContent = formatNumber(likes);
}




        







// ---------------------------
// YOUTUBE UTILITY FUNCTIONS



async function getYouTubeEmotes(data, messageElement) {
    let message = data.message;
    const channelId = data.broadcast?.channelId;
    if (!channelId) return;

    // carrega os emotes customizados
    if (youTubeCustomEmotes.length == 0) {
        streamerBotClient.getGlobals().then((getglobals) => {
            youTubeCustomEmotes = JSON.parse(JSON.parse(getglobals.variables.chatrdytcustomemotes.value));
            console.debug('[ChatRD][YouTube] Getting YouTube Emotes from Streamer.Bot', youTubeCustomEmotes);
        });
    }

    // carrega os BTTV emotes se não carregados ainda
    if (youTubeBTTVEmotes.length === 0) {
        try {
            const res = await fetch(`https://api.betterttv.net/3/cached/users/youtube/${channelId}`);
            const emoteData = await res.json();
            console.debug('[ChatRD][YouTube] Getting BTTV Channel Emotes', `https://api.betterttv.net/3/cached/users/youtube/${channelId}`, emoteData);
            youTubeBTTVEmotes = [
                ...(emoteData.sharedEmotes || []),
                ...(emoteData.channelEmotes || [])
            ];
            if (youTubeBTTVEmotes.length === 0) {
                console.debug('[ChatRD][YouTube] No BTTV Emotes found. Setting fake data so we avoid fetching the emotes again.');
                youTubeBTTVEmotes = [
                    { code: 'fakeemote', id: 'fakeemote' }
                ];
            }
        }
        catch (err) {
            console.warn("[ChatRD][YouTube] Failed to load BTTV emotes:", err);
        }
    }

    // Helper: Twemoji URL
    function getTwemojiUrl(emoji) {
        const codePoints = Array.from(emoji).map(c => c.codePointAt(0).toString(16));
        let fileName = codePoints.join('-');
        fileName = fileName.replace(/-fe0f/g, ''); // remove FE0F
        return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${fileName}.png`;
    }

    // Limpa o elemento
    messageElement.innerHTML = '';

    // monta um mapa de emotes (nome → URL)
    const emoteMap = new Map();

    // O ":awesome:" nunca aparecia. Isso remedia isso.
    emoteMap.set(':awesome:', 'https://yt3.ggpht.com/xqqFxk7nC5nYnjy0oiSPpeWX4yu4I-ysb3QJMOuVml8dHWz82FvF8bhGVjlosZRIG_XxHA=w48-h48-c-k-nd');

    // BTTV emotes
    for (const emote of youTubeBTTVEmotes) {
        emoteMap.set(emote.code, `https://cdn.betterttv.net/emote/${emote.id}/1x`);
    }

    // YouTube emotes (Twemoji + normais)
    if (data.emotes) {
        for (const emote of data.emotes) {
            let emoteUrl = emote.imageUrl;
            if (String(emote.type || "").toLowerCase() === "twemoji") {
                emoteUrl = getTwemojiUrl(emote.name);
            }
            if (!emoteUrl || emoteUrl.trim() === '') continue;
            emoteMap.set(emote.name, emoteUrl);
        }
    }

    // Custom Member Emotes
    if (data.user.isSponsor === true || data.user.isOwner === true) {
        for (const [name, url] of Object.entries(youTubeCustomEmotes)) {
            emoteMap.set(`:${name}:`, url);
        }
    }

    // Nova quebra: detecta tokens de emotes/emoji mesmo colados
    const tokenRegex = /(:[a-zA-Z0-9_\-]+:)|([\p{Emoji_Presentation}\p{Extended_Pictographic}])/gu;
    let parts = [];
    let lastIndex = 0;

    for (const match of message.matchAll(tokenRegex)) {
        // texto antes do emote
        if (match.index > lastIndex) {
            parts.push(message.slice(lastIndex, match.index));
        }
        // o próprio emote/emoji
        parts.push(match[0]);
        lastIndex = match.index + match[0].length;
    }
    // resto do texto
    if (lastIndex < message.length) {
        parts.push(message.slice(lastIndex));
    }

    // monta a mensagem final
    for (const part of parts) {
        if (emoteMap.has(part)) {
            const img = document.createElement('img');
            img.src = emoteMap.get(part);
            img.alt = part;
            img.className = 'emote';
            img.onerror = () => (img.outerHTML = part);
            messageElement.appendChild(img);
        } else {
            messageElement.appendChild(document.createTextNode(part));
        }
    }
}





// ChatGPT created this. :)
async function getYouTubeStickerImage(data) {
    const stack = [data];

    while (stack.length) {
        const current = stack.pop();

        if (current && typeof current === 'object') {
            if ('imageUrl' in current && typeof current.imageUrl === 'string') {
                return current.imageUrl;
            }

            for (const key in current) {
                if (Object.hasOwn(current, key)) {
                    stack.push(current[key]);
                }
            }
        }
    }

    return null;
}

async function getYouTubeBadges(data) {
    const {
        user: {
            isVerified,
            isSponsor,
            isModerator,
            isOwner,
        }
    } = data;

    let badgesHTML = [
        isVerified && '<span class="badge verified"><i class="fa-solid fa-check"></i></span>',
        isSponsor && '<span class="badge member"><i class="fa-solid fa-star"></i></span>',
        isModerator && '<span class="badge mod"><i class="fa-solid fa-shield"></i></span>',
        isOwner && '<span class="badge owner"><i class="fa-solid fa-video"></i></span>',
    ].filter(Boolean).join('');

    return badgesHTML;
}