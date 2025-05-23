const kickUserName                = getURLParam("kickUserName", false);

const showKickMessages            = getURLParam("showKickMessages", true);
const showKickFollows             = getURLParam("showKickFollows", true);
const showKickSubs                = getURLParam("showKickSubs", true);
const showKickGiftedSubs          = getURLParam("showKickGiftedSubs", true);
const showKickMassGiftedSubs      = getURLParam("showKickMassGiftedSubs", true);
const showKickRaids               = getURLParam("showKickRaids", true);
const showKickViewers             = getURLParam("showKickViewers", true);

const kickAvatars = new Map();
const kick7TVEmojis = new Map();

if (showKickViewers == false) { document.querySelector('#statistics #kick').style.display = 'none'; }

if (kickUserName) {

    const kickWebSocket = new WebSocket(
        `wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false`
    );

    kickWebSocket.onerror = (error) => {
        console.error("Kick WebSocket Error: " + error);
    };

    kickWebSocket.onopen = () => {

        kickGetUserInfo(kickUserName)
        .then((userInfo) => {
            console.log('Got Kick User Info', userInfo);

            (async () => {
                const kick7TVEmotes = await get7TVEmotes(userInfo.user_id);
                if (kick7TVEmotes != null) {
                    console.debug("Getting all Kick's 7TV Emojis + Globals", kick7TVEmotes);

                    kick7TVEmotes.forEach(emote => {
                        kick7TVEmojis.set(emote.name, emote.url);
                    });
                }
            })();

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

            setInterval(() => {
                kickWebSocket.send(
                    JSON.stringify({
                        event: "pusher:ping",
                        data: {},
                    })
                );
            }, 60000);

            kickUpdateStatistics(userInfo);
            setInterval(() => {
                kickGetUserInfo(kickUserName)
                .then((data) =>{
                    kickUpdateStatistics(data);
                });
            }, 15000);

            
        });

    };

    kickWebSocket.onmessage = async ({ data }) => {
        const parsed = JSON.parse(data);
        const json = JSON.parse(parsed.data);

        if (!parsed.event.includes("pusher")) { 

            switch (parsed.event) {
                case "App\\Events\\ChatMessageEvent":
                    console.debug('Kick Chat', json);
                    kickChatMessage(json);
                break;
                
                case "App\\Events\\MessageDeletedEvent":
                    kickChatMessageDeleted(json);
                break;

                case "App\\Events\\UserBannedEvent":
                    kickUserBanned(json);
                break;

                case "App\\Events\\ChatroomClearEvent":
                    kickChatClearMessages()
                break;

                default:
                    console.debug('Kick Event From WebSocket', parsed.event, json);
            }

        }
    };
}

else {
    console.debug('Kick User not set in ChatRD');
}



streamerBotClient.on('General.Custom', (response) => {


    if (response.data.platform === 'Kick') {
        
        const data = response.data.data;

        switch (data.triggerCustomCodeEventName) {
            case "kickFollow" : 
                console.debug('Kick Follow', data);
                kickFollowMessage(data);
            break;
            case "kickSub" : 
                console.debug('Kick Sub', data);
                kickSubMessage(data);
            break;
            case "kickGift" : 
                console.debug('Kick Sub Gift', data);
                kickGiftMessage(data);
            break;
            case "kickGifts" : 
                console.debug('Kick Mass Sub Gift', data);
                kickGiftSubsMessage(data);
            break;
            case "kickIncomingRaid" : 
                console.debug('Kick Raid', data);
                kickRaidMessage(data);
            break;
            default:
                //console.debug('Kick Event', response.data);
        }
    }


});


async function kickChatMessage(data) {
    
    if (showKickMessages == false) return;
    if (ignoreUserList.includes(data.sender.username.toLowerCase())) return;
    if (data.content.startsWith("!") && excludeCommands == true)  return;

    const {
        id: messageId,
        type,
        content: text,
        sender: {
            id: userID,
            slug: userSlug,
            username: userName,
            identity: {
                color,
                badges: badgesToParse
            }
        }

    } = data;

    const [avatar, message, badges] = await Promise.all([
        getKickAvatar(userSlug),
        getKickEmotes(text),
        getKickBadges(badgesToParse),
    ]);

    const replyHTML = (type == "reply" ?
        `<div class="reply"><i class="fa-solid fa-arrow-turn-up"></i> <strong>${data.metadata.original_sender.username}:</strong> ${await getKickEmotes(data.metadata.original_message.content)}</div>` : '');
    
    const messageData = {
        classes: '',
        avatar,
        badges,
        userName,
        color,
        message,
        shared: '',
        reply: replyHTML,
    };

    addMessageToChat(userSlug, messageId, 'kick', messageData);
}





async function kickFollowMessage(data) {
    
    if (showKickFollows == false) return;

    const {
        userName : userID,
        user : userName
    } = data;

    const messageID = createRandomString(40);

    const [avatar, message] = await Promise.all([
        '',
        currentLang.kick.follow(),
    ]);

    const classes = 'follow';
    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    };
    
    addEventToChat(userID, messageID, 'kick', messageData);
}



async function kickSubMessage(data) {

    if (showKickSubs == false) return;

    const {
        userName: userID,
        user: userName,
        tier,
        cumulative
    } = data;

    const messageID = createRandomString(40);
    const [avatar, message] = await Promise.all([
        '',
        currentLang.kick.sub({
            months : cumulative,
            tier : tier
        })
    ]);

    const classes = 'sub';
    
    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    };
    addEventToChat(userID, messageID, 'kick', messageData);
}




async function kickGiftMessage(data) {

    if (showKickSubs == false || showKickGiftedSubs == false) return;

    const {
        user: userName,
        userName: userID,
        recipientUser: recipientName,
        tier,
        totalSubsGifted
    } = data;

    const messageID = createRandomString(40);

    const [avatar, message] = await Promise.all([
        '',
        currentLang.kick.gifted({
            gifted : recipientName,
            tier : tier,
            total : totalSubsGifted
        })
    ]);

    const classes = 'sub';
    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    };

    addEventToChat(userID, messageID, 'kick', messageData);
}




async function kickGiftSubsMessage(data) {

    if (showKickSubs == false || showKickMassGiftedSubs == false) return;
    
    const {
        user: userName,
        userName: userID,
        tier,
        gifts
    } = data;

    const messageID = createRandomString(40);

    const [avatar, message] = await Promise.all([
        '',
        currentLang.kick.giftedbomb({
            count : gifts,
            tier : tier
        })
    ]);

    const classes = 'sub';
    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    };
    addEventToChat(userID, messageID, 'kick', messageData);
}




async function kickRaidMessage(data) {

    if (showKickRaids == false) return;

    const {
        user: userName,
        viewers
    } = data;

    const userID = userName.toLowerCase();

    const messageID = createRandomString(40);
    const [avatar, message] = await Promise.all([
        '',
        currentLang.kick.raid({ viewers : viewers })
    ]);

    const classes = 'raid';
    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    };

    addEventToChat(userID, messageID, 'kick', messageData);
}



async function kickChatMessageDeleted(data) {
    document.getElementById(data.message.id)?.remove();
}



async function kickUserBanned(data) {
    chatContainer.querySelectorAll(`[data-user="${data.user.slug}"]:not(.event)`).forEach(element => {
        element.remove();
    });
}



async function kickChatClearMessages() {
    chatContainer.querySelectorAll(`.kick:not(.event)`).forEach(element => {
        element.remove();
    });
}



async function kickUpdateStatistics(data) {

    if (showPlatformStatistics == false || showKickViewers == false) return;

    if (data.livestream == null) { }
    else {
        const viewers = DOMPurify.sanitize(data.livestream.viewer_count);
        document.querySelector('#statistics #kick .viewers span').textContent = formatNumber(viewers);
    }

}




async function kickGetUserInfo(user) {
    const response = await fetch( `https://kick.com/api/v2/channels/${user}` );
    
    if (response.status === 404) {
        console.error("Kick user was not found!");
        return 404;
    }
    else {
        const data = await response.json();
        return data;
    }
    
}


async function getKickAvatar(user) {
    if (showAvatar == true) {
        if (kickAvatars.has(user)) {
            console.debug(`Kick avatar found for ${user}!`);
            return kickAvatars.get(user);
        }
        else {
            console.debug(`Kick avatar not found for ${user}! Trying to get it...`);

            const response = await kickGetUserInfo(user);
            var newavatar = '';

            if (response == 404) {
                newavatar = 'https://kick.com/img/default-profile-pictures/default2.jpeg';
            }
            else {
                if (response.user.profile_pic == null) { 
                    newavatar = 'https://kick.com/img/default-profile-pictures/default2.jpeg';
                }
                else {
                    newavatar = response.user.profile_pic;
                    newavatar = newavatar.replace(/fullsize(?=\.webp)/, "medium");
                }
                kickAvatars.set(user, newavatar);
            }
            
            return newavatar;
        }
    }

}


async function getKickEmotes(text) {
    var message = await parseKickEmojis(text);
    message = await parseKick7TVEmotes(message);
    return message;
}

async function parseKickEmojis(content) {
    const message = content;
    const messagewithemotes = message.replace(/\[emote:(\d+):([^\]]+)\]/g, (_, id, name) => {
        return `<img src="https://files.kick.com/emotes/${id}/fullsize" alt="${name}" class="emote" >`;
    });

    return messagewithemotes;
}

async function parseKick7TVEmotes(text) {
    const words = text.split(/\s+/);
    const parsedWords = words.map(word => {
        const clean = word.replace(/[^\w]/g, ''); // remove pontuação para comparar
        if (kick7TVEmojis.has(clean)) {
            const url = kick7TVEmojis.get(clean);
            return word.replace(clean, `<img src="${url}" alt="${clean}" class="emote" />`);
        }
        return word;
    });

    return parsedWords.join(' ');
}

async function get7TVEmotes(userid) { 
    const userSet = await fetch(`https://7tv.io/v3/users/kick/${userid}`);

    if (userSet.status === 404) {
        console.debug("7TV Profile based on this Kick user was not found");
        return null;
    }

    const userEmojis = await userSet.json();
    
    const gettingAllKick7TVEmotes = userEmojis?.emote_set?.emotes?.map(emote => ({
        name: emote.name,
        id: emote.id,
        url: `https://cdn.7tv.app/emote/${emote.id}/1x.webp`
    })) || [];

    const globalSet = await fetch(`https://7tv.io/v3/emote-sets/global`);
    const globalEmojis = await globalSet.json();
    
    const gettingAllGlobal7TVEmotes = globalEmojis?.emotes?.map(emote => ({
        name: emote.name,
        id: emote.id,
        url: `https://cdn.7tv.app/emote/${emote.id}/1x.webp`
    })) || [];

    const SevenTVEmotesFusion = [...gettingAllKick7TVEmotes, ...gettingAllGlobal7TVEmotes];
    return SevenTVEmotesFusion;
}



async function getKickBadges(badges) {
    const badgesArray = [];
    
    badges.forEach(badge => {
        switch (badge.type) {
            case "broadcaster":
                badgesArray.push('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" class="size-[calc(1em*(18/13))]"><defs><linearGradient id="HostBadgeA" x1="16" x2="16" y1="-197.5" y2="118.7" gradientUnits="userSpaceOnUse"><stop stop-color="#FF1CD2"></stop><stop offset="1" stop-color="#B20DFF"></stop></linearGradient><linearGradient id="HostBadgeB" x1="16" x2="16" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#FF1CD2"></stop><stop offset="1" stop-color="#B20DFF"></stop></linearGradient><linearGradient id="HostBadgeC" x1="16" x2="16" y1="-64" y2="-64" gradientUnits="userSpaceOnUse"><stop stop-color="#FF1CD2"></stop><stop offset="1" stop-color="#B20DFF"></stop></linearGradient><linearGradient id="HostBadgeD" x1="16" x2="16" y1="-197.5" y2="118.7" gradientUnits="userSpaceOnUse"><stop stop-color="#FF1CD2"></stop><stop offset="1" stop-color="#B20DFF"></stop></linearGradient><linearGradient id="HostBadgeE" x1="16" x2="16" y1="-74.7" y2="-74.7" gradientUnits="userSpaceOnUse"><stop stop-color="#FF1CD2"></stop><stop offset="1" stop-color="#B20DFF"></stop></linearGradient><linearGradient id="HostBadgeF" x1="27.2" x2="27.2" y1="-.5" y2="31.1" gradientUnits="userSpaceOnUse"><stop stop-color="#FF1CD2"></stop><stop offset="1" stop-color="#B20DFF"></stop></linearGradient></defs><path fill="url(#HostBadgeA)" d="M9.6 19.2H6.4v3.2h3.2v-3.2Z"></path><path fill="url(#HostBadgeB)" d="M12.8 19.2h6.4V16h3.2V3.2h-3.2V0h-6.4v3.2H9.6V16h3.2v3.2Z"></path><path fill="url(#HostBadgeC)" d="M6.4 12.8H3.2v6.4h3.2v-6.4Z"></path><path fill="url(#HostBadgeD)" d="M25.6 19.2h-3.2v3.2h3.2v-3.2Z"></path><path fill="url(#HostBadgeE)" d="M9.6 22.4v3.2h3.2v3.2H9.6V32h12.8v-3.2h-3.2v-3.2h3.2v-3.2H9.6Z"></path><path fill="url(#HostBadgeF)" d="M25.6 12.8v6.4h3.2v-6.4h-3.2Z"></path></svg>');
            break;
            case "sidekick": 
                badgesArray.push('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" class="size-[calc(1em*(18/13))]"><path fill="url(#SidekickBadgeA)" d="M0 5.5v11.3h2.3V20h2.3v3.2h2.2v3.2h6.9v-3.2h4.6v3.2H25v-3.2h2.3V20h2.3v-3.2H32V5.5h-9.2v3.2h-4.6V12h-4.5V8.7H9V5.5H0Zm13.7 13.7H7V16H4.6V9.6h2.3v3.2h4.5V16h2.3v3.2ZM27.4 16h-2.2v3.2h-6.9V16h2.3v-3.2h4.6V9.6h2.2V16Z"></path><defs><linearGradient id="SidekickBadgeA" x1="18.8" x2="11.7" y1="-2.7" y2="32.7" gradientUnits="userSpaceOnUse"><stop stop-color="#FF6A4A"></stop><stop offset="1" stop-color="#C70C00"></stop></linearGradient></defs></svg>');
            break;
            case "moderator":
                badgesArray.push('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" class="size-[calc(1em*(18/13))]"><path fill="#00C7FF" d="M23.5 2.5v3h-3v3h-3v3h-3v3h-3v-3h-6v6h3v3h-3v3h-3v6h6v-3h3v-3h3v3h6v-6h-3v-3h3v-3h3v-3h3v-3h3v-6h-6Z"></path></svg>');
            break;
            case "vip":
                badgesArray.push('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" class="size-[calc(1em*(18/13))]"><path fill="url(#VIPBadgeA)" d="M27.8 4.8V7h-2.5v4.5h-2.1v2.3h-2.3V9.3h-2.4V2.6h-5v6.7H11v4.5H8.8v-2.3H6.7V7H4.2V4.8H0v24.6h32V4.8h-4.2Z"></path><defs><linearGradient id="VIPBadgeA" x1="16" x2="16" y1="-1" y2="35.1" gradientUnits="userSpaceOnUse"><stop stop-color="#FFC900"></stop><stop offset="1" stop-color="#FF9500"></stop></linearGradient></defs></svg>');
            break;
            case "sub_gifter":
                badgesArray.push('<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-[calc(1em*(18/13))]"><g clip-path="url(#clip0_31_3197)"><path d="M22.34 9.5L26 4H18L16 7L14 4H6L9.66 9.5H4V15.1H28V9.5H22.34Z" fill="#2EFAD1"></path><path d="M26.08 19.1001H5.90002V28.5001H26.08V19.1001Z" fill="#2EFAD1"></path><path d="M26.08 15.1001H5.90002V19.1001H26.08V15.1001Z" fill="#00A18D"></path></g><defs><clipPath id="clip0_31_3197"><rect width="24" height="24.5" fill="white" transform="translate(4 4)"></rect></clipPath></defs></svg>');
            break;
            case "og":
                badgesArray.push('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" class="size-[calc(1em*(18/13))]"><g clip-path="url(#OGBadgeA)"><path fill="url(#OGBadgeB)" d="M32 32H18.3v-1.6h-1.5v-16h1.5v-1.6H32v6.4h-9v9.6h3v-3.2h-1.6v-3.2H32V32Z"></path><path fill="url(#OGBadgeC)" d="M13.6 17.6v1.6h-12v-1.6H0v-16h1.5V0h12.2v1.6h1.5v16h-1.6Zm-4.5-4.8V3.2H6v9.6h3Z"></path><path fill="#00FFF2" d="M13.6 30.4V32h-12v-1.6H0V17.6h1.5V16h12.2v1.6h1.5v12.8h-1.6Zm-4.5-1.6v-9.6H6v9.6h3ZM32 16H18.3v-1.6h-1.5V1.6h1.5V0H32v3.2h-9v9.6h3V9.6h-1.6V6.4H32V16Z"></path></g><defs><linearGradient id="OGBadgeB" x1="16" x2="16" y1="32" y2="2.5" gradientUnits="userSpaceOnUse"><stop stop-color="#00FFF2"></stop><stop offset="1" stop-color="#006399"></stop></linearGradient><linearGradient id="OGBadgeC" x1="15.5" x2="16.1" y1=".4" y2="31.7" gradientUnits="userSpaceOnUse"><stop stop-color="#00FFF2"></stop><stop offset="1" stop-color="#006399"></stop></linearGradient><clipPath id="OGBadgeA"><path fill="#fff" d="M0 0h32v32H0z"></path></clipPath></defs></svg>');
            break;
            case "founder":
                badgesArray.push('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" class="size-[calc(1em*(18/13))]"><g clip-path="url(#FounderBadgeA)"><path fill="url(#FounderBadgeB)" fill-rule="evenodd" d="M29.3 8V5.4h-2.7V2.7H24V0H8v2.7H5.4v2.7H2.6V8H0v16h2.6v2.6h2.8v2.7H8V32h16v-2.7h2.6v-2.7h2.7V24H32V8h-2.7Zm-9.5 17.7h-6.5V12.8H9v-2.4h2V8.2h2v-2h7v19.5Z" clip-rule="evenodd"></path></g><defs><linearGradient id="FounderBadgeB" x1="15.7" x2="16.3" y1="-4.5" y2="36.7" gradientUnits="userSpaceOnUse"><stop stop-color="#FFC900"></stop><stop offset="1" stop-color="#FF9500"></stop></linearGradient><clipPath id="FounderBadgeA"><path fill="#fff" d="M0 0h32v32H0z"></path></clipPath></defs></svg>');
            break;
            case "subscriber":
                badgesArray.push('<i class="fa-solid fa-star sub"></i>');
            break; 
            case "verified":
                badgesArray.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="size-[calc(1em*(18/13))]"><path fill="#1EFF00" d="M16 6.83512L13.735 4.93512L13.22 2.02512H10.265L8 0.120117L5.735 2.02012H2.78L2.265 4.93012L0 6.83512L1.48 9.39512L0.965 12.3051L3.745 13.3151L5.225 15.8751L8.005 14.8651L10.785 15.8751L12.265 13.3151L15.045 12.3051L14.53 9.39512L16.01 6.83512H16ZM6.495 12.4051L2.79 8.69512L4.205 7.28012L6.495 9.57512L11.29 4.78012L12.705 6.19512L6.5 12.4001L6.495 12.4051Z"></path></svg>');
            break;
        }
    });

    return badgesArray.join(' ');
}