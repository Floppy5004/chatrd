/* ----------------------- */
/* TWITCH MODULE VARIABLES */
/* ----------------------- */

const showTwitch                    = getURLParam("showTwitch", false);

const showTwitchMessages            = getURLParam("showTwitchMessages", true);
const showTwitchFollows             = getURLParam("showTwitchFollows", true);
const showTwitchBits                = getURLParam("showTwitchBits", true);
const showTwitchAnnouncements       = getURLParam("showTwitchAnnouncements", true);
const showTwitchSubs                = getURLParam("showTwitchSubs", true);
const showTwitchGiftedSubs          = getURLParam("showTwitchGiftedSubs", true);
const showTwitchGiftedSubsUserTrain = getURLParam("showTwitchGiftedSubsUserTrain", true);
const showTwitchMassGiftedSubs      = getURLParam("showTwitchMassGiftedSubs", true);
const showTwitchRewardRedemptions   = getURLParam("showTwitchRewardRedemptions", true);
const showTwitchRaids               = getURLParam("showTwitchRaids", true);
const showTwitchSharedChat          = getURLParam("showTwitchSharedChat", true);
const showTwitchPronouns            = getURLParam("showTwitchPronouns", false);
const showTwitchViewers             = getURLParam("showTwitchViewers", true);

const twitchAvatars = new Map();
const twitchPronouns = new Map();

// TWITCH EVENTS HANDLERS

const twitchMessageHandlers = {
    'Twitch.ChatMessage': (response) => {
        twitchChatMessage(response.data);
    },
    'Twitch.Follow': (response) => {
        twitchFollowMessage(response.data);
    },
    'Twitch.Announcement': (response) => {
        twitchAnnouncementMessage(response.data);
    },
    'Twitch.Cheer': (response) => {
        twitchBitsMessage(response.data);
    },
    'Twitch.AutomaticRewardRedemption': (response) => {
        twitchChatMessageGiantEmote(response.data);
    },
    'Twitch.RewardRedemption': (response) => {
        twitchRewardRedemption(response.data);
    },
    'Twitch.Sub': (response) => {
        twitchSubMessage(response.data);
    },
    'Twitch.ReSub': (response) => {
        twitchReSubMessage(response.data);
    },
    'Twitch.GiftSub': (response) => {
        twitchGiftMessage(response.data);
    },
    'Twitch.GiftBomb': (response) => {
        twitchGiftBombMessage(response.data);
    },
    'Twitch.Raid': (response) => {
        twitchRaidMessage(response.data);
    },
    'Twitch.ChatMessageDeleted': (response) => {
        twitchChatMessageDeleted(response.data);
    },
    'Twitch.UserBanned': (response) => {
        twitchUserBanned(response.data);
    },
    'Twitch.UserTimedOut': (response) => {
        twitchUserBanned(response.data);
    },
    'Twitch.ViewerCountUpdate': (response) => {
        twitchUpdateStatistics(response.data);
    },
    'Twitch.ChatCleared': (response) => {
        twitchChatClearMessages();
    }
};



if (showTwitch) {
    
    const twitchStatistics = `
        <div class="platform" id="twitch" style="display: none;">
            <img src="js/modules/twitch/images/logo-twitch.svg" alt="">
            <span class="viewers"><i class="fa-solid fa-user"></i> <span>0</span></span>
        </div>
    `;

    document.querySelector('#statistics').insertAdjacentHTML('beforeend', twitchStatistics);

    if (showTwitchViewers == true) { document.querySelector('#twitch').style.display = ''; }

    registerPlatformHandlersToStreamerBot(twitchMessageHandlers, '[Twitch]');

}



// ---------------------------
// TWITCH EVENT FUNCTIONS

async function twitchChatMessage(data) {
    
    if (showTwitchMessages == false) return;
    if (ignoreUserList.includes(data.message.username.toLowerCase())) return;
    if (data.message.message.startsWith("!") && excludeCommands == true)  return;

	const template = chatTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.messageId;
    const userId = data.message.username;

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

    const classes = ['twitch', 'chat'];

    const [avatarImage, fullmessage, badgeList] = await Promise.all([
        getTwitchAvatar(data.message.username),
        getTwitchEmotes(data),
        getTwitchBadges(data)
    ]);

    header.remove();

    user.style.color = data.message.color;
    user.innerHTML = `<strong>${data.message.displayName}</strong>`;
    message.innerHTML = fullmessage;

    if (data.message.isMe) {
        message.style.color = data.message.color;
    }

    if (showAvatar) avatar.innerHTML = `<img src="${avatarImage}">`; else avatar.remove();
    if (showBadges) badges.innerHTML = badgeList; else badges.remove();
    

    if (data.user.role == 4) { classes.push('streamer'); }


    if (data.message.firstMessage) {
        classes.push('first-chatter');
    }
    else { firstMessage.remove(); }
    

    if (data.message.isReply) {
        classes.push('reply');
        reply.insertAdjacentHTML('beforeend', ` <strong>${data.message.reply.userName}:</strong> ${data.message.reply.msgBody}`);
    }
    else { reply.remove(); }


    if (data.message.isSharedChat) {
        if (showTwitchSharedChat == true) {
            classes.push('shared-chat');

            if (!data.sharedChat.primarySource) {
                sharedChat.querySelector('span.origin').insertAdjacentHTML('beforeend', ` <strong>${data.sharedChat.sourceRoom.name}</strong>`);
            }
        }
        else if (!data.sharedChat.primarySource && showTwitchSharedChat == false) {
            return;
        }
    }
    else { sharedChat.remove(); }



    if (showTwitchPronouns === true) {
        const userPronouns = await getTwitchUserPronouns(data.message.username);
        if (userPronouns) {
            pronoun.innerHTML = userPronouns;
        }
    }
    else { pronoun.remove(); }

    addMessageItem('twitch', clone, classes, userId, messageId);
}



async function twitchChatMessageGiantEmote(data) {
    
    if (showTwitchMessages == false) return;
    
    const userMessages = chatContainer.querySelectorAll(`.chat.twitch[data-user="${data.user_login}"]`);

    if (userMessages.length === 0) return;

    const firstMessage = userMessages[0];
    const emoteImages = firstMessage.querySelectorAll(`img[data-emote-id="${data.gigantified_emote.id}"]`);

    if (emoteImages.length === 0) return;

    emoteImages.forEach(img => {
        img.classList.add("gigantified");
        if (img.src.endsWith("2.0")) {
            img.src = img.src.replace("2.0", "3.0");
        }
    });
}




async function twitchFollowMessage(data) {

    if (showTwitchFollows == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = createRandomString(40);
    const userId = data.user_name.toLowerCase();

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

    const classes = ['twitch', 'follow'];

    header.remove();
    message.remove();
    value.remove();

    
    user.innerHTML = `<strong>${data.user_name}</strong>`;

    action.innerHTML = ` followed you`;

    addEventItem('twitch', clone, classes, userId, messageId);
}



async function twitchAnnouncementMessage(data) {

    if (showTwitchAnnouncements == false) return;

    const template = chatTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.messageId;
    const userId = data.user.name.toLowerCase();

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

    const classes = ['twitch', 'announcement'];

    classes.push(data.announcementColor.toLowerCase());

    firstMessage.remove();
    sharedChat.remove();
    timestamp.remove();
    //platform.remove();
    avatar.remove();
    pronoun.remove();
    reply.remove();

    const [fullmessage, badgeList] = await Promise.all([
        getTwitchEmotesOnParts(data),
        getTwitchAnnouncementBadges(data)
    ]);

    header.innerHTML = `<span><i class="fa-solid fa-bullhorn"></i> Announcement</span>`;

    user.style.color = data.user.color;
    user.innerHTML = `<strong>${data.user.name}</strong>`;
    message.innerHTML = fullmessage;

    if (showBadges) badges.innerHTML = badgeList; else badges.remove();

    addMessageItem('twitch', clone, classes, userId, messageId);
}



async function twitchRewardRedemption(data) {

    if (showTwitchRewardRedemptions == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = createRandomString(40);
    const userId = data.user_name.toLowerCase();

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

    const classes = ['twitch', 'reward'];

    header.remove();

    
    user.innerHTML = `<strong>${data.user_name}</strong>`;
    action.innerHTML = ` redeemed `;
    value.innerHTML = `<strong>${data.reward.title}</strong> (${data.reward.cost})`;
    
    var userInput = data.user_input ? `- ${data.user_input}` : '';
    message.innerHTML = `${userInput}`;

    addEventItem('twitch', clone, classes, userId, messageId);
}



async function twitchBitsMessage(data) {

    if (showTwitchBits == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.messageId;
    const userId = data.user.name.toLowerCase();

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

    const classes = ['twitch', 'bits'];

    header.remove();

    
    user.innerHTML = `<strong>${data.user.name}</strong>`;
    action.innerHTML = ` cheered with `;

    var bits = data.message.bits > 1 ? 'bits' : 'bit';
    value.innerHTML = `<strong>${data.message.bits} ${bits}</strong>`;

    var fullmessage = data.message.message.replace(/\bCheer\d+\b/g, '').replace(/\s+/g, ' ').trim();
    message.innerHTML = fullmessage;

    addEventItem('twitch', clone, classes, userId, messageId);
}



async function twitchSubMessage(data) {

    if (showTwitchSubs == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = createRandomString(40);
    const userId = data.user.name.toLowerCase();

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

    const classes = ['twitch', 'sub'];

    header.remove();
    message.remove();

    
    user.innerHTML = `<strong>${data.user.name}</strong>`;

    action.innerHTML = ` subscribed for `;

    var months = data.duration_months > 1 ? 'months' : 'month';
    var tier = data.is_prime ? 'Prime' : 'Tier '+Math.floor(data.sub_tier/1000);

    value.innerHTML = `<strong>${data.duration_months} ${months} (${tier})</strong>`;

    addEventItem('twitch', clone, classes, userId, messageId);
}



async function twitchReSubMessage(data) {

    if (showTwitchSubs == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = createRandomString(40);
    const userId = data.user.name.toLowerCase();

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

    const classes = ['twitch', 'resub'];

    const [fullmessage] = await Promise.all([
        getTwitchEmotesOnParts(data)
    ]);

    header.remove();

    
    user.innerHTML = `<strong>${data.user.name}</strong>`;

    action.innerHTML = ` subscribed for `;

    var months = data.cumulativeMonths > 1 ? 'months' : 'month';
    var tier = data.isPrime ? 'Prime' : 'Tier '+Math.floor(data.subTier/1000);
    
    value.innerHTML = `<strong>${data.cumulativeMonths} ${months} (${tier})</strong>`;

    message.innerHTML = fullmessage;

    addEventItem('twitch', clone, classes, userId, messageId);
}



async function twitchGiftMessage(data) {

    const isSub = showTwitchSubs === false;
    const isGift = showTwitchGiftedSubs === false;
    const isGiftTrain = showTwitchGiftedSubsUserTrain === false;

    if (
        (!data.fromCommunitySubGift && (isSub || isGift)) ||
        (data.fromCommunitySubGift && (isSub || isGiftTrain))
    ) {
        return;
    }

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = createRandomString(40);
    const userId = data.user.name.toLowerCase();

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

    const classes = ['twitch', 'giftsub'];

    header.remove();
    message.remove();

    
    user.innerHTML = `<strong>${data.user.name}</strong>`;

    var months = data.durationMonths > 1 ? 'months' : 'month';
    action.innerHTML = ` gifted <strong>${data.durationMonths} ${months}</strong> subscription <strong>(Tier ${Math.floor(data.subTier/1000)})</strong> to `;
    
    value.innerHTML = `<strong>${data.recipient.name}</strong>`;

    addEventItem('twitch', clone, classes, userId, messageId);
}



async function twitchGiftBombMessage(data) {

    if (showTwitchSubs == false || showTwitchMassGiftedSubs == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = createRandomString(40);
    const userId = data.user.name.toLowerCase();

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

    const classes = ['twitch', 'giftbomb'];

    header.remove();
    value.remove();

    
    user.innerHTML = `<strong>${data.user.name}</strong>`;

    var subs = data.total > 1 ? 'subs' : 'sub';
    action.innerHTML = ` gifted <strong>${data.total} Tier ${Math.floor(data.sub_tier/1000)} ${subs}</strong> to the Community`;

    message.innerHTML = `They've gifted a total of <strong>${data.cumulative_total} subs</strong>`;

    addEventItem('twitch', clone, classes, userId, messageId);
}



async function twitchRaidMessage(data) {

    if (showTwitchRaids == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = createRandomString(40);
    const userId = data.from_broadcaster_user_name.toLowerCase();

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

    const classes = ['twitch', 'raid'];

    header.remove();
    message.remove();

    
    user.innerHTML = `<strong>${data.from_broadcaster_user_name}</strong>`;

    var viewers = data.viewers > 1 ? 'viewers' : 'viewer';
    action.innerHTML = ` raided the channel with `;
    value.innerHTML = `<strong>${data.viewers} ${viewers}</strong>`;

    addEventItem('twitch', clone, classes, userId, messageId);
}



async function twitchChatMessageDeleted(data) {
    document.getElementById(data.messageId)?.remove();
}



async function twitchUserBanned(data) {
    chatContainer.querySelectorAll(`[data-user="${data.user_login}"]`).forEach(element => {
        element.remove();
    });
}



async function twitchChatClearMessages() {
    chatContainer.querySelectorAll(`.item.twitch`).forEach(element => {
        element.remove();
    });
}



async function twitchUpdateStatistics(data) {
    if (showPlatformStatistics == false || showTwitchViewers == false) return;

    const viewers = DOMPurify.sanitize(data.viewerCount);
    document.querySelector('#statistics #twitch .viewers span').textContent = formatNumber(viewers);
}













// ---------------------------
// TWITCH UTILITY FUNCTIONS

async function getTwitchAvatar(user) {
    if (twitchAvatars.has(user)) {
        console.debug(`Twitch avatar found for ${user}!`);
        return twitchAvatars.get(user);
    }

    console.debug(`Twitch avatar not found for ${user}! Getting it from DECAPI!`);
    
    try {
        const response = await fetch(`https://decapi.me/twitch/avatar/${user}`);
        let avatar = await response.text();
        
        if (!avatar) {
            avatar = 'https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-300x300.png';
        }

        twitchAvatars.set(user, avatar);
        return avatar;
    }
    catch (err) {
        console.error(`Failed to fetch avatar for ${user}:`, err);
        return 'https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-300x300.png';
    }
}



async function getTwitchEmotes(data) {
    const message = data.message.message;
    const emotes = data.emotes.sort((a, b) => b.startIndex - a.startIndex);

    const words = message.split(" ").map(word => {
        const emote = emotes.find(e => e.name === word);
        return emote
            ? `<img src="${emote.imageUrl}" data-emote-id="${emote.id}" alt="${emote.name}" class="emote">`
            : word;
    });

    return words.join(" ");
}



async function getTwitchBadges(data) {
    const badges = data.message.badges;
    return badges
        .map(badge => `<img src="${badge.imageUrl}" class="badge">`)
        .join('');
}



async function getTwitchEmotesOnParts(data) {
    let messageText = data.text;

    for (const part of data.parts) {
        if (part.type === 'emote') {
            const emoteName = part.text;
            const emoteUrl = part.imageUrl;
            const emoteHTML = `<img src="${emoteUrl}" class="emote" alt="${emoteName}">`;

            const escaped = emoteName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            let pattern;

            if (/^\w+$/.test(emoteName)) {
                pattern = `\\b${escaped}\\b`;
            } else {
                pattern = `(?<=^|[^\\w])${escaped}(?=$|[^\\w])`;
            }

            const regex = new RegExp(pattern, 'g');
            messageText = messageText.replace(regex, emoteHTML);
        }
    }

    return messageText;
}




async function getTwitchAnnouncementBadges(data) {
    const badges = data.user.badges;
    return badges
        .map(badge => `<img src="${badge.imageUrl}" class="badge">`)
        .join('');
}


async function getTwitchUserPronouns(username) {
    if (twitchPronouns.has(username)) {
        console.debug(`Pronouns found for ${username}. Getting it from Map...`);
        return twitchPronouns.get(username);
    }

    console.debug(`Pronouns not found for ${username} in the Map! Retrieving...`);
    
    try {
        const response = await streamerBotClient.getUserPronouns('twitch', username);

        const pronoun = response?.pronoun?.userFound
            ? `<em>${response.pronoun.pronounSubject}/${response.pronoun.pronounObject}</em>`
            : '';

        twitchPronouns.set(username, pronoun);
        return pronoun;
    }
    
    catch (err) {
        console.error(`Couldn't retrieve pronouns for ${username}:`, err);
        return '';
    }
}