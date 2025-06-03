const showYouTubeMessages               = getURLParam("showYouTubeMessages", true);
const showYouTubeSuperChats             = getURLParam("showYouTubeSuperChats", true);
const showYouTubeSuperStickers          = getURLParam("showYouTubeSuperStickers", true);
const showYouTubeSuperStickerGif        = getURLParam("showYouTubeSuperStickerGif", true);
const showYouTubeSuperStickerFullSize   = getURLParam("showYouTubeSuperStickerFullSize", false);
const showYouTubeMemberships            = getURLParam("showYouTubeMemberships", true);
const showYouTubeGiftMemberships        = getURLParam("showYouTubeGiftMemberships", true);
const showYouTubeMembershipsTrain       = getURLParam("showYouTubeMembershipsTrain", true);
const showYouTubeStatistics             = getURLParam("showYouTubeStatistics", true);

let youTubeCustomEmotes = [];

let youTubeBTTVEmotes = [];

userColors.set('youtube', new Map());

if (showYouTubeStatistics == false) { document.querySelector('#statistics #youtube').style.display = 'none'; }

const youtubeMessageHandlers = {
    'YouTube.Message': (response) => {
        console.debug('YouTube Chat', response.data);
        youTubeChatMessage(response.data);
    },
    'YouTube.UserBanned': (response) => {
        console.debug('YouTube Timeout/Hide/Ban', response.data);
        youTubeUserBanned(response.data);
    },
    'YouTube.SuperChat': (response) => {
        console.debug('YouTube SuperChat', response.data);
        youTubeSuperChatMessage(response.data);
    },
    'YouTube.SuperSticker': (response) => {
        console.debug('YouTube Super Sticker', response.data);
        youTubeSuperStickerMessage(response.data);
    },
    'YouTube.NewSponsor': (response) => {
        console.debug('YouTube New Member', response.data);
        youTubeNewSponsorMessage(response.data);
    },
    'YouTube.MemberMileStone': (response) => {
        console.debug('YouTube Member Milestone', response.data);
        youTubeNewSponsorMessage(response.data);
    },
    'YouTube.MembershipGift': (response) => {
        console.debug('YouTube Gifted Membership', response.data);
        youTubeGiftedMembersMessage(response.data);
    },
    'YouTube.GiftMembershipReceived': (response) => {
        console.debug('YouTube Gifted Membership Bomb', response.data);
        YouTubeGiftReceivedMessage(response.data);
    },
    'YouTube.StatisticsUpdated': (response) => {
        console.debug(response.data);
        youTubeUpdateStatistics(response.data);
    }
};


for (const [event, handler] of Object.entries(youtubeMessageHandlers)) {
    streamerBotClient.on(event, handler);
}



async function youTubeChatMessage(data) {
    
    if (showYouTubeMessages == false) return;
    if (ignoreUserList.includes(data.user.name.toLowerCase())) return;
    if (data.message.startsWith("!") && excludeCommands == true) return;

    if (streamerBotConnected == true) {
        if (youTubeCustomEmotes.length == 0) {
            streamerBotClient.getGlobals().then( (getglobals) => {
                youTubeCustomEmotes = JSON.parse(JSON.parse(getglobals.variables.chatrdytcustomemotes.value));
                console.debug('Getting YouTube Emotes from Streamer.Bot', youTubeCustomEmotes);
            });
        }
    }

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
    } = data;

    var messageHTML = await getYouTubeEmotes(data);
    
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
        message : messageHTML,
        reply: '',
    };
    addMessageToChat(userID, messageID, 'youtube', messageData);
}


async function youTubeUserBanned(data) {
    chatContainer.querySelectorAll(`[data-user="${data.bannedUser.id}"]:not(.event)`).forEach(element => {
        element.remove();
    });
}


async function youTubeSuperChatMessage(data) {
    
    if (showYouTubeSuperChats == false) return;

    const {
        user: {
            id: userID,
            name: userName,
        },
        eventId: messageID,
        amount,
        message : textmessage
    } = data;

    var money = amount;
    var messagewithemotes = await getYouTubeEmotes(textmessage);

    const [avatar, message] = await Promise.all([
        ``,
        currentLang.youtube.superchat({
            money : money,
            message : messagewithemotes
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
    
    if (showYouTubeSuperStickers == false) return;

    const {
        user: {
            id: userID,
            name: userName,
        },
        eventId: messageID,
        amount
    } = data;

    var money = amount;
    var youtubeStickerUrl = '';

    if (showYouTubeSuperStickerGif == true) {
        youtubeStickerUrl = await getYouTubeStickerImage(data);
    }

    const [avatar, message] = await Promise.all([
        ``,
        currentLang.youtube.supersticker({
            money : money,
            sticker : youtubeStickerUrl
        })
    ]);
    
    const classes = ['supersticker'];
    if (showYouTubeSuperStickerFullSize == true) {
        classes.push('giantsupersticker');
    }

    const messageData = {
        classes: classes.join(' '),
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
    
    if (showYouTubeMemberships == false) return;
    
    const {
        user: {
            id: userID,
            name: userName,
        },
        eventId: messageID,
        levelName,
        months,
        message: messagetext,
    } = data;

    var messagewithemotes = '';

    if (messagetext) {
        messagewithemotes = await getYouTubeEmotes(messagetext);
    }

    const [avatar, message] = await Promise.all([
        ``,
        currentLang.youtube.member({
            months : months,
            tier : levelName,
            message: messagewithemotes
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

    if (showYouTubeGiftMemberships == false) return;

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
    
    if (showYouTubeMembershipsTrain == false) return;

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
    addEventToChat(gifterUserId, messageID, 'youtube', messageData);
}


async function youTubeUpdateStatistics(data) {
    
    if (showYouTubeStatistics == false) return;
    
    const viewers = DOMPurify.sanitize(data.concurrentViewers);
    const likes = DOMPurify.sanitize(data.likeCount);
    document.querySelector('#statistics #youtube .viewers span').textContent = formatNumber(viewers);
    document.querySelector('#statistics #youtube .likes span').textContent = formatNumber(likes);
}


async function getYouTubeEmotes(data) {
    let message = data.message;
    const channelId = data.broadcast?.channelId;
    if (!channelId) return message;

    // Carrega os emotes do canal BTTV se ainda não estiverem carregados
    if (youTubeBTTVEmotes.length === 0) {
        try {
            const res = await fetch(`https://api.betterttv.net/3/cached/users/youtube/${channelId}`);
            const emoteData = await res.json();
            console.debug('Getting YouTube BTTV Channel Emojis', `https://api.betterttv.net/3/cached/users/youtube/${channelId}`, emoteData);
            youTubeBTTVEmotes = [
                ...(emoteData.sharedEmotes || []),
                ...(emoteData.channelEmotes || [])
            ];
        } catch (err) {
            console.warn("Failed to load BTTV emotes:", err);
        }
    }

    // Cria o mapa de emotes
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

    // Custom Member Emotes (também com dois-pontos)
    if (data.user.isSponsor === true || data.user.isOwner === true) {
        for (const [name, url] of Object.entries(youTubeCustomEmotes)) {
            const emoteElement = `<img src="${url}" class="emote" alt="${name}">`;
            emoteMap.set(`:${name}:`, { html: emoteElement, raw: `:${name}:` });
        }
    }

    // Usa DOMParser para substituir apenas nós de texto
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${message}</div>`, 'text/html');
    const container = doc.body.firstChild;

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function replaceEmotesInText(text) {
        // Ordena por tamanho decrescente pra evitar conflitos entre nomes parecidos
        const sorted = Array.from(emoteMap.values()).sort((a, b) => b.raw.length - a.raw.length);

        for (const { raw, html } of sorted) {
            const escaped = escapeRegex(raw);

            // Emotes com dois-pontos: :emote: → permitem colados
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
