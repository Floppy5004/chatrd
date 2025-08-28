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
const showYouTubeStatistics             = getURLParam("showYouTubeStatistics", true);

let youTubeCustomEmotes = [];
let youTubeBTTVEmotes = [];

userColors.set('youtube', new Map());


// YOUTUBE EVENTS HANDLERS

const youtubeMessageHandlers = {
    'YouTube.Message': (response) => {
        youTubeChatMessage(response.data);
    },
    'YouTube.UserBanned': (response) => {
        youTubeUserBanned(response.data);
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
    }
};



if (showYoutube) {

    const youtubeStatistics = `
        <div class="platform" id="youtube" style="display: none;">
            <img src="js/modules/youtube/images/logo-youtube.svg" alt="">
            <span class="viewers"><i class="fa-solid fa-user"></i> <span>0</span></span>
            <span class="likes"><i class="fa-solid fa-heart"></i> <span>0</span></span>
        </div>
    `;

    document.querySelector('#statistics').insertAdjacentHTML('beforeend', youtubeStatistics);

    if (showYouTubeStatistics == true) { document.querySelector('#youtube').style.display = ''; }

    registerPlatformHandlersToStreamerBot(youtubeMessageHandlers, '[YouTube]');
    
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

    const classes = ['youtube', 'chat'];

    const [fullmessage, badgeList] = await Promise.all([
        getYouTubeEmotes(data),
        getYouTubeBadges(data)
    ]);

    header.remove();
    firstMessage.remove();
    sharedChat.remove();
    reply.remove();
    pronoun.remove();

    var color = await createRandomColor('youtube', data.user.name);

    user.style.color = color;
    user.innerHTML = `<strong>${data.user.name}</strong>`;
    message.innerHTML = fullmessage;

    if (showAvatar) avatar.innerHTML = `<img src="${data.user.profileImageUrl}">`; else avatar.remove();
    if (showBadges) badges.innerHTML = badgeList; else badges.remove();

    if (data.user.isOwner) { classes.push('streamer'); }

    addMessageItem('youtube', clone, classes, userId, messageId);
}




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

    header.remove();

    
    user.innerHTML = `<strong>${data.user.name}</strong>`;
    action.innerHTML = ` superchatted `;
    value.innerHTML = `<strong>${data.amount}</strong>`;

    var fullmessage = await getYouTubeEmotes(data);
    message.innerHTML = fullmessage;

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

    if (showYouTubeSuperStickerGif == true) {
        youtubeStickerUrl = await getYouTubeStickerImage(data);
        header.innerHTML = `<img src="${youtubeStickerUrl}" class="sticker">`;
    }
    else {
        header.remove();
    }

    
    user.innerHTML = `<strong>${data.user.name}</strong>`;
    action.innerHTML = ` sent a supersticker `;

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

    header.remove();

    
    user.innerHTML = `<strong>${data.user.name}</strong>`;
    action.innerHTML = ` became a member `;

    var months = data.months > 1 ? 'months' : 'month';
    value.innerHTML = `<strong>${data.months || 1} ${months}</strong>`;

    var fullmessage = await getYouTubeEmotes(data);
    message.innerHTML = fullmessage;

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

    header.remove();

    
    user.innerHTML = `<strong>${data.user.name}</strong>`;
    action.innerHTML = ` gifted `;

    var count = data.count > 1 ? 'memberships' : 'membership';
    value.innerHTML = `<strong>${data.count} ${count} (Tier ${data.tier})</strong> to the channel`;

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

    header.remove();

    
    user.innerHTML = `<strong>${data.user.name}</strong>`;
    action.innerHTML = ` gifted a membership <strong>(Tier ${data.tier})</strong> to `;
    value.innerHTML = `<strong>${data.gifter.name}</strong>`;

    message.remove();

    addEventItem('youtube', clone, classes, userId, messageId);
}



async function youTubeUserBanned(data) {
    chatContainer.querySelectorAll(`[data-user="${data.bannedUser.id}"]:not(.event)`).forEach(element => {
        element.remove();
    });
}



async function youTubeUpdateStatistics(data) {
    
    if (showPlatformStatistics == false || showYouTubeStatistics == false) return;
    
    const viewers = DOMPurify.sanitize(data.concurrentViewers);
    const likes = DOMPurify.sanitize(data.likeCount);
    document.querySelector('#statistics #youtube .viewers span').textContent = formatNumber(viewers);
    document.querySelector('#statistics #youtube .likes span').textContent = formatNumber(likes);
}













// ---------------------------
// YOUTUBE UTILITY FUNCTIONS



async function getYouTubeEmotes(data) {
    let message = data.message;
    const channelId = data.broadcast?.channelId;
    if (!channelId) return message;

    if (youTubeCustomEmotes.length == 0) {
        streamerBotClient.getGlobals().then( (getglobals) => {
            youTubeCustomEmotes = JSON.parse(JSON.parse(getglobals.variables.chatrdytcustomemotes.value));
            console.debug('[YouTube] Getting YouTube Emotes from Streamer.Bot', youTubeCustomEmotes);
        });
    }

    // Load BTTV Emotes if not already loaded
    if (youTubeBTTVEmotes.length === 0) {
        try {
            const res = await fetch(`https://api.betterttv.net/3/cached/users/youtube/${channelId}`);
            const emoteData = await res.json();
            console.debug('[YouTube] Getting BTTV Channel Emotes', `https://api.betterttv.net/3/cached/users/youtube/${channelId}`, emoteData);
            youTubeBTTVEmotes = [
                ...(emoteData.sharedEmotes || []),
                ...(emoteData.channelEmotes || [])
            ];
            if (youTubeBTTVEmotes.length === 0) {
                console.debug('[YouTube] No BTTV Emotes found. Setting fake data so we avoid fetching the emotes again.');
                youTubeBTTVEmotes = [
                    {
                        code: 'fakeemote',
                        id: 'fakeemote'
                    }
                ];   
            }
        }
        catch (err) {
            console.warn("[YouTube] Failed to load BTTV emotes:", err);
        }
    }

    // Create an Emote Map
    const emoteMap = new Map();

    // BTTV emotes
    for (const emote of youTubeBTTVEmotes) {
        const imageUrl = `https://cdn.betterttv.net/emote/${emote.id}/1x`;
        const emoteElement = `<img src="${imageUrl}" class="emote" alt="${emote.code}">`;
        emoteMap.set(emote.code, { html: emoteElement, raw: emote.code });
    }

    // YouTube emotes (ex: :hand-pink-waving:)
    if (data.emotes) {
        for (const emote of data.emotes) {
            const emoteElement = `<img src="${emote.imageUrl}" class="emote" alt="${emote.name}">`;
            emoteMap.set(emote.name, { html: emoteElement, raw: emote.name });
        }
    }

    // Custom Member Emotes
    if (data.user.isSponsor === true || data.user.isOwner === true) {
        for (const [name, url] of Object.entries(youTubeCustomEmotes)) {
            const emoteElement = `<img src="${url}" class="emote" alt="${name}">`;
            emoteMap.set(`:${name}:`, { html: emoteElement, raw: `:${name}:` });
        }
    }

    // DOMParser just to replace the text nodes
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${message}</div>`, 'text/html');
    const container = doc.body.firstChild;

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function replaceEmotesInText(text) {
        // Sort them DESC to avoid conflicts with similar names
        const sorted = Array.from(emoteMap.values()).sort((a, b) => b.raw.length - a.raw.length);

        for (const { raw, html } of sorted) {
            const escaped = escapeRegex(raw);

            // Emotes with colons: :emote: → allow colons
            const isDelimited = raw.startsWith(':') && raw.endsWith(':');
            const regex = isDelimited
                ? new RegExp(escaped, 'g')
                : new RegExp(`(?<!\\S)${escaped}(?!\\S)`, 'g');

            text = text.replace(regex, html);
        }

        return text;
    }

    function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const replaced = replaceEmotesInText(node.nodeValue);
            if (replaced !== node.nodeValue) {
                const span = doc.createElement('span');
                span.innerHTML = replaced;
                node.replaceWith(...span.childNodes);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const child of Array.from(node.childNodes)) {
                walk(child);
            }
        }
    }

    walk(container);

    return container.innerHTML;
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
        isModerator && '<span class="badge mod"><i class="fa-solid fa-wrench"></i></span>',
        isOwner && '<span class="badge owner"><i class="fa-solid fa-video"></i></span>',
    ].filter(Boolean).join('');

    return badgesHTML;
}