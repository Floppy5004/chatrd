/* ----------------------- */
/* TWITCH MODULE VARIABLES */
/* ----------------------- */

const twitchModule = true;

const showTwitch                    = getURLParam("showTwitch", false);

const showTwitchMessages            = getURLParam("showTwitchMessages", true);
const showTwitchFollows             = getURLParam("showTwitchFollows", true);
const showTwitchWatchStreak         = getURLParam("showTwitchWatchStreak", false);
const showTwitchBits                = getURLParam("showTwitchBits", true);
const showTwitchAnnouncements       = getURLParam("showTwitchAnnouncements", true);
const showTwitchSubs                = getURLParam("showTwitchSubs", true);
const showTwitchGiftedSubs          = getURLParam("showTwitchGiftedSubs", true);
const showTwitchGiftedSubsUserTrain = getURLParam("showTwitchGiftedSubsUserTrain", true);
const showTwitchMassGiftedSubs      = getURLParam("showTwitchMassGiftedSubs", true);
const showTwitchRewardRedemptions   = getURLParam("showTwitchRewardRedemptions", true);
const showTwitchRaids               = getURLParam("showTwitchRaids", true);
const showTwitchHypeTrain           = getURLParam("showTwitchHypeTrain", false);
const showTwitchHypeTrainBar        = getURLParam("showTwitchHypeTrainBar", false);
const showTwitchGoals               = getURLParam("showTwitchGoals", false);
const showTwitchGoalsBars           = getURLParam("showTwitchGoalsBars", false);
const showTwitchSharedChat          = getURLParam("showTwitchSharedChat", true);
const showTwitchPronouns            = getURLParam("showTwitchPronouns", false);
const showTwitchViewers             = getURLParam("showTwitchViewers", true);

const twitchStreamer = {};

const twitchAvatars = new Map();
const twitchPronouns = new Map();
const twitchGoals = new Map();

const bitsGifAnimations = [
    { min: 1, max: 99, gifId: 1 },
    { min: 100, max: 999, gifId: 100 },
    { min: 1000, max: 4999, gifId: 1000 },
    { min: 5000, max: 9999, gifId: 5000 },
    { min: 10000, max: 99999, gifId: 10000 },
    { min: 100000, max: 1000000000000000, gifId: 100000 },
];

const bitsGiftsClasses = [
    { min: 1,  max: 99, class: 'normal-gift' },
    { min: 100,  max: 499, class: 'bigger-than-100' },
    { min: 500,  max: 999, class: 'bigger-than-500' },
    { min: 1000,  max: 4999, class: 'bigger-than-1000' },
    { min: 5000,  max: 9999, class: 'bigger-than-5000' },
    { min: 10000,  max: 49999, class: 'bigger-than-10000' },
    { min: 50000,  max: 99999, class: 'bigger-than-50000' },
    { min: 100000,  max: 99999999999, class: 'bigger-than-100000' },
];

// TWITCH EVENTS HANDLERS

const twitchMessageHandlers = {
    'Twitch.ChatMessage': (response) => {
        twitchChatMessage(response.data);
    },
    'Twitch.WatchStreak': (response) => {
        twitchWatchStreakMessage(response.data);
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
        if (response.data.reward_type === "gigantify_an_emote") {
            twitchChatMessageGiantEmote(response.data);
        }
        else {
            twitchAutomaticRewardRedemption(response.data);
        }
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
    

    'Twitch.SharedChatMessageDeleted': (response) => {
	    twitchChatMessageDeleted(response.data);
    },

    'Twitch.SharedChatUserBanned': (response) => {
        twitchUserBanned(response.data);
    },

    'Twitch.SharedChatUserTimedout': (response) => {
        twitchUserBanned(response.data);
    },


    'Twitch.ViewerCountUpdate': (response) => {
        twitchUpdateStatistics(response.data);
    },
    'Twitch.ChatCleared': (response) => {
        twitchChatClearMessages();
    },


    'Twitch.HypeTrainStart' : (response) => {
        twitchHypeTrainStart(response.data);
    },
    'Twitch.HypeTrainUpdate' : (response) => {
        twitchHypeTrainUpdate(response.data);
    },
    'Twitch.HypeTrainLevelUp' : (response) => {
        twitchHypeTrainLevelUp(response.data);
    },
    'Twitch.HypeTrainEnd' : (response) => {
        twitchHypeTrainEnd(response.data);
    },

    'Twitch.GoalBegin' : (response) => {
        twitchGoalBegin(response.data);
    },
    'Twitch.GoalProgress' : (response) => {
         twitchGoalProgress(response.data);
    },
    'Twitch.GoalEnd' : (response) => {
         twitchGoalEnd(response.data);
    },

    'General.Custom': (response) => {
        if (response.data?.data?.eventName === 'Twitch.GoalFetch' && response.data.data.event) {
            twitchGoalsRenderer(response.data.data.event);
        }

    }
};



if (showTwitch) {

    if ((showTwitchViewers == true) && (showPlatformStatistics == true)) {
        const twitchStatistics = `
            <div class="platform" id="twitch" style="display: none;">
                <img src="js/modules/twitch/images/logo-twitch.svg" alt="">
                <span class="viewers"><i class="fa-solid fa-user"></i> <span>0</span></span>
            </div>
        `;
        document.querySelector('#statistics').insertAdjacentHTML('beforeend', twitchStatistics);
        document.querySelector('#twitch').style.display = '';
    }
    
    registerPlatformHandlersToStreamerBot(twitchMessageHandlers, '[Twitch]');
    twitchGoalsFetch();
}



// ---------------------------
// TWITCH EVENT FUNCTIONS



async function twitchChatMessage(data) {
    
    if (showTwitchMessages == false) return;
    
    if (ignoreUserList.includes(data.user.login)) return;
    if (data.text.startsWith("!") && excludeCommands == true)  return;

	const template = chatTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.messageId;
    const userId = data.user.login;

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

    const [avatarImage, badgeList] = await Promise.all([
        //getTwitchAvatar(data.message.username),
        getTwitchAvatar(data.user.login),
        getTwitchBadges(data.user.badges)
    ]);

    header.remove();

    //let streamData = data;

    if (isOBS == false) {
        if (!twitchStreamer.broadcastUser) {
            const streamerInfo = await getStreamerInfo();
            twitchStreamer.broadcastUser = streamerInfo.platforms.twitch.broadcastUser;
        }
        
        if (data.text.toLowerCase().includes( twitchStreamer.broadcastUser.toLowerCase() )) {
            classes.push('streamer-mentioned');
        }
    }

    

    const userLinkElement = user.querySelector('a');
    const userLink = `https://twitch.tv/${data.user.login}`;

    userLinkElement.href = userLink;
    userLinkElement.target = '_blank';
    userLinkElement.style = `--user-color: ${data.user.color}`;
    userLinkElement.textContent = data.user.name;
    userLinkElement.title = `${data.user.name} @ ${userLink}`;



    if (data.meta.isMe) {
        message.style.color = data.user.color;
    }

    if (showAvatar) avatar.innerHTML = `<img src="${avatarImage}">`; else avatar.remove();
    if (showBadges) badges.innerHTML = badgeList; else badges.remove();

    if (data.user.role == 4) { classes.push('streamer'); }

    if (data.meta.firstMessage) {
        classes.push('first-chatter');
    }
    else { firstMessage.remove(); }

    if (data.meta.isHighlighted) {
        classes.push('highlighted');
    }
    

    if (data.isReply == true) {
        classes.push('reply');

        let replyMessage = data.reply.msgBody.replace(/^@\S+\s*/, '') ?? '';

        reply.insertAdjacentHTML('beforeend', ` <strong>${tRD('twitch.reply_label', { user: escapeHTML(data.reply.userName) })}</strong> ${escapeHTML(replyMessage)}`);
    }
    else { reply.remove(); }

    if (data.isFromSharedChatGuest) {
        if (showTwitchSharedChat == true) {
            classes.push('shared-chat');

            let sharedStreamer = data.sharedChatSource.login.toLowerCase();
            let sharedStreamerAvatar = await getTwitchAvatar( sharedStreamer );

            sharedChat.querySelector('span.origin img').src = sharedStreamerAvatar;
            sharedChat.querySelector('span.origin strong').textContent = data.sharedChatSource.name;
        }
        else {
            return;
        }
    }
    else { sharedChat.remove(); }

    if (showTwitchPronouns === true) {
        const userPronouns = await getTwitchUserPronouns(data.user.login);
        if (userPronouns) {
            pronoun.innerHTML = userPronouns;
        }
    }
    else { pronoun.remove(); }

    let messageFromParts;

    if (data.isReply == true) {
        const cleanParts = data.parts.map((part, index) => {
            if (index === 0 && part.type === 'text') {
                return { ...part, text: part.text.replace(/^@\S+\s*/, '') };
            }
            return part;
        });

        messageFromParts = await getTwitchMessageFromParts(cleanParts);
    }
    else {
        messageFromParts = await getTwitchMessageFromParts(data.parts);
    }

    message.innerHTML = DOMPurify.sanitize(messageFromParts);

    addMessageItem('twitch', clone, classes, userId, messageId);
}



async function twitchChatMessageGiantEmote(data) {
    
    if (showTwitchMessages == false) return;
    
    const userMessages = chatContainer.querySelectorAll(`.chat.twitch[data-user="${data.user_login}"]`);

    if (userMessages.length === 0) return;

    const firstMessage = userMessages[0];
    const emoteImages = firstMessage.querySelectorAll(`img.emote[alt="${data.gigantified_emote.name}"]`);

    if (emoteImages.length === 0) return;

    emoteImages.forEach(img => {
        img.classList.add("gigantified");
        if (img.src.endsWith("2.0")) {
            img.src = img.src.replace("2.0", "3.0");
        }
    });
}



async function twitchWatchStreakMessage(data) {

    if (showTwitchWatchStreak == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.msgId;
    const userId = data.userName.toLowerCase();

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

    const classes = ['twitch', 'watch-streak'];

    header.remove();

    user.textContent = data.displayName;

    action.innerHTML = tRD('twitch.watch_streak_action');
    value.innerHTML = `<strong>${tRD('twitch.watch_streak_value', { count: data.watchStreak })}</strong>!`;

    let messageFromParts = await getTwitchMessageFromParts(data.parts);
    message.innerHTML = DOMPurify.sanitize(messageFromParts);

    addEventItem('twitch', clone, classes, userId, messageId);
}



async function twitchFollowMessage(data) {

    if (showTwitchFollows == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = createRandomString(40);
    const userId = data.user_login.toLowerCase();

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

    user.textContent = data.user_name;

    action.innerHTML = tRD('twitch.follow_action');

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

    const [badgeList] = await Promise.all([
        getTwitchBadges(data.user.badges)
    ]);

    header.innerHTML = `<span><i class="fa-solid fa-bullhorn"></i> ${tRD('twitch.announcement_header')}</span>`;


    

    const userLinkElement = user.querySelector('a');
    const userLink = `https://twitch.tv/${data.user.login}`;

    userLinkElement.href = userLink;
    userLinkElement.target = '_blank';
    userLinkElement.style = `--user-color: ${data.user.color}`;
    userLinkElement.textContent = data.user.name;
    userLinkElement.title = `${data.user.name} @ ${userLink}`;




    if (showBadges) badges.innerHTML = badgeList; else badges.remove();

    let messageFromParts = await getTwitchMessageFromParts(data.parts);
    message.innerHTML = DOMPurify.sanitize(messageFromParts);

    addMessageItem('twitch', clone, classes, userId, messageId);
}



async function twitchRewardRedemption(data) {

    if (showTwitchRewardRedemptions == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = createRandomString(40);
    const userId = data.user_login.toLowerCase();

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
    
    

    user.textContent = data.user_name;



    action.innerHTML = tRD('twitch.reward_action');

    value.innerHTML = `
        <div class="gift-info">
            <span class="gift-image"><strong>${data.reward.title}</strong></span>
            <span class="gift-value"><img src="js/modules/twitch/images/icon-channel-points.svg" alt="Channel Points"> ${data.reward.cost}</span>
        </div>
    `;
    
    var userInput = data.user_input ? `${data.user_input}` : '';
    message.textContent = userInput;

    addEventItem('twitch', clone, classes, userId, messageId);
}



async function twitchAutomaticRewardRedemption(data) {

    if (showTwitchRewardRedemptions == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = createRandomString(40);
    const userId = data.user_login.toLowerCase();

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

    let title;

    switch (data.reward_type) {
        case "send_highlighted_message" :
            title = tRD('twitch.reward_auto.send_highlighted_message');
        break;

        case "chosen_sub_emote_unlock" :
            title = tRD('twitch.reward_auto.chosen_sub_emote_unlock');
        break;

        case "chosen_sub_emote_unlock" :
            title = tRD('twitch.reward_auto.random_sub_emote_unlock');
        break;

        case "chosen_modified_sub_emote_unlock" :
            title = tRD('twitch.reward_auto.chosen_modified_sub_emote_unlock');
        break;

    }
    
    
    

    const userLinkElement = user.querySelector('a');
    const userLink = `https://twitch.tv/${data.user_login}`;

    userLinkElement.href = userLink;
    userLinkElement.target = '_blank';
    userLinkElement.textContent = data.user_name;
    userLinkElement.title = `${data.user_name} @ ${userLink}`;



    action.innerHTML = tRD('twitch.reward_action');

    value.innerHTML = `
        <div class="gift-info">
            <span class="gift-image"><strong>${title}</strong></span>
            <span class="gift-value"><img src="js/modules/twitch/images/icon-channel-points.svg" alt="Channel Points"> ${data.cost}</span>
        </div>
    `;
    
    /*var userInput = data.user_input ? `${data.user_input}` : '';
    message.textContent = `${userInput}`;*/
    message.remove();
    
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
    
    user.textContent = data.user.name;
    action.innerHTML = tRD('twitch.bits_action');

    var bits = data.bits > 1 ? tRD('twitch.bits_plural') : tRD('twitch.bits_singular');

    const match = bitsGifAnimations.find(lv => data.bits >= lv.min && data.bits <= lv.max);
    
    const bitsMatch = bitsGiftsClasses.find(lv => data.bits >= lv.min && data.bits <= lv.max);
    classes.push(bitsMatch.class);

    value.innerHTML = `
        <div class="gift-info">
            <span class="gift-image"><strong>${data.bits} ${bits}</strong></span>
            <span class="gift-value"><img src="https://d3aqoihi2n8ty8.cloudfront.net/actions/cheer/dark/animated/${match.gifId}/4.gif" alt="${data.bits} ${bits}"></span>
        </div>
    `;

    let messageFromParts = await getTwitchMessageFromParts(data.parts);
    message.innerHTML = DOMPurify.sanitize(messageFromParts);

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

    
    user.textContent = data.user.name;

    action.innerHTML = tRD('twitch.sub_action');
    var months = formatSubMonthDuration(data.duration_months);
    var tier = data.is_prime ? 'Prime' : 'Tier '+Math.floor(data.sub_tier/1000);

    //value.innerHTML = `<strong>${months} (${tier})</strong>`;
    value.innerHTML = `
        <div class="gift-info">
            <span class="gift-image"><strong>${months}</strong></span>
            <span class="gift-value">${tier}</span>
        </div>
    `;

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
    
    header.remove();
    
    user.textContent = data.user.name;

    action.innerHTML = tRD('twitch.resub_action');

    //var months = data.cumulativeMonths > 1 ? 'months' : 'month';
    var months = formatSubMonthDuration(data.cumulativeMonths);
    var tier = data.isPrime ? 'Prime' : 'Tier '+Math.floor(data.subTier/1000);
    
    //value.innerHTML = `<strong>${months} (${tier})</strong>`;
    value.innerHTML = `
        <div class="gift-info">
            <span class="gift-image"><strong>${months}</strong></span>
            <span class="gift-value">${tier}</span>
        </div>
    `;

    /*message.textContent = data.text;
    await getTwitchEmotesOnParts(data, message);*/
    
    let messageFromParts = await getTwitchMessageFromParts(data.parts);
    message.innerHTML = DOMPurify.sanitize(messageFromParts);

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

    
    user.textContent = data.user.name;

    var months = formatSubMonthDuration(data.durationMonths);
    var subs = data.durationMonths > 1 ? tRD('twitch.giftsub_plural') : tRD('twitch.giftsub_singular');

    action.innerHTML = tRD('twitch.giftsub_action', { months: `<strong>${months}</strong>`, tier: `<strong>${Math.floor(data.subTier/1000)}</strong>`, duration: subs });
    
    value.innerHTML = `<strong>${escapeHTML(data.recipient.name)}</strong>`;

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

    
    user.textContent = data.user.name;

    var subs = data.total > 1 ? tRD('twitch.giftbomb_subs_plural') : tRD('twitch.giftbomb_subs_singular');
    action.innerHTML = tRD('twitch.giftbomb_action', { total: `<strong>${data.total}</strong>`, tier: Math.floor(data.sub_tier/1000), subs: `<strong>${subs}</strong>` });

    message.innerHTML = tRD('twitch.giftbomb_message', { total: `<strong>${data.cumulative_total} subs</strong>` });

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

    
    user.textContent = data.from_broadcaster_user_name;

    var viewers = data.viewers > 1 ? tRD('twitch.raid_plural') : tRD('twitch.raid_singular');
    action.innerHTML = tRD('twitch.raid_action');
    value.innerHTML = `<strong>${data.viewers} ${viewers}</strong>`;

    addEventItem('twitch', clone, classes, userId, messageId);
}



async function twitchChatMessageDeleted(data) {
    document.getElementById(data.messageId)?.remove();
}



async function twitchUserBanned(data) {
    chatContainer.querySelectorAll(`[data-user="${data.targetUser.login}"]`).forEach(element => {
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

    const viewers = formatNumber(DOMPurify.sanitize(data.viewerCount))  || "0";
    document.querySelector('#statistics #twitch .viewers span').textContent = viewers;
}





async function twitchHypeTrainStart(data) {

    const classes = ['twitch', 'hypetrain'];

    const {
        level,
        is_golden_kappa_train,
        is_treasure_train,
        goal,
        progress,
        started_at,
        expires_at
    } = data;

    let hypetrainInfo = tRD('twitch.hypetrain.started');
    
    let htProgress = Math.floor(progress/goal * 100);

    if (is_golden_kappa_train == true) {
        hypetrainInfo = tRD('twitch.hypetrain.started_golden');
        classes.push('golden-kappa-train');
    }

    if (is_treasure_train == true) {
        hypetrainInfo = tRD('twitch.hypetrain.started_treasure');
        classes.push('treasure-train');
    }
    
    

    if (showTwitchHypeTrain == true) {

        const template = eventTemplate;
        const clone = template.content.cloneNode(true);
        const messageId = createRandomString(40);
        const userId = createRandomString(40);

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

        header.remove();

        user.textContent = hypetrainInfo;
        action.textContent = ``;
        value.innerHTML = `
            <div class="gift-info">
                <span class="gift-value"><strong>LVL ${level}</strong> @ <strong>${htProgress}%</strong></span>
            </div>
        `;

        message.remove();

        addEventItem('twitch', clone, classes, userId, messageId);

    }


    /* HYPE TRAIN BAR */

    if (showTwitchHypeTrainBar == true) {
        const goalElement = document.querySelector('#goals');
        const hypeTrainTemplate = document.querySelector('#hypetrain-template');
        const hypeTrainClone = hypeTrainTemplate.content.cloneNode(true);
        const hypeTrainElement = hypeTrainClone.firstElementChild;

        const {
            'progressbar-fill': progressBarFill,
            logo,
            icon,
            'level' : currentLevel,
            'timeremaining' : timeRemaining,
            percentage,
            info
        } = Object.fromEntries(
            [...hypeTrainClone.querySelectorAll('[class]')]
                .map(el => [el.className, el])
        );

        if (is_golden_kappa_train == true) {
            hypeTrainElement.classList.add('golden-kappa-train');
            logo.querySelector('img').src = 'js/modules/twitch/images/golden-kappa-emote.png';
            icon.querySelector('span').textContent = tRD('twitch.hypetrain.bar_golden_kappa');
        }

        if (is_treasure_train == true) {
            hypeTrainElement.classList.add('treasure-train');
            logo.querySelector('img').src = 'js/modules/twitch/images/icon-treasure.svg';
            icon.querySelector('i').remove();
            icon.querySelector('span').textContent = tRD('twitch.hypetrain.bar_treasure');
        }

        currentLevel.textContent = `LVL ${level}`;
        progressBarFill.style.width = `${htProgress}%`;
        percentage.textContent = `${htProgress}%`;

        info.textContent = hypetrainInfo;
        info.classList.add('animate__animated');

        hypeTrainElement.classList.add('animate__fadeInDown');

        goalElement.insertAdjacentElement('beforeend', hypeTrainElement);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {

                setTimeout(() => {
                    document.querySelector('#hypetrain').classList.remove('animate__fadeInDown');
                }, 1000);

                setTimeout(() => {
                    document.querySelector('#hypetrain').querySelector('.info').classList.add('animate__fadeOut');
                }, 3000);

                hypeTrainStartCountdown(started_at, expires_at);

            });
        });
        
    }

}


async function twitchHypeTrainUpdate(data) {

    if (showTwitchHypeTrainBar == false) return;

    const hypetrainElement = document.querySelector('#hypetrain');

    if (hypetrainElement == null) return;

    const {
        goal,
        progress
    } = data;

    let htProgress = Math.floor(progress/goal * 100);

    hypetrainElement.querySelector('.progressbar-fill').style.width = `${htProgress}%`;
    hypetrainElement.querySelector('.percentage').textContent = `${htProgress}%`;
}


async function twitchHypeTrainLevelUp(data) {

    const classes = ['twitch', 'hypetrain'];

    const {
        level,
        is_golden_kappa_train,
        is_treasure_train,
        goal,
        progress,
        started_at,
        expires_at
    } = data;

    let hypetrainInfo = tRD('twitch.hypetrain.levelup');
    let htProgress = Math.floor(progress/goal * 100);

    if (is_golden_kappa_train == true) {
        hypetrainInfo = tRD('twitch.hypetrain.levelup_golden');
        classes.push('golden-kappa-train');
    }

    if (is_treasure_train == true) {
        hypetrainInfo = tRD('twitch.hypetrain.levelup_treasure');
        classes.push('treasure-train');
    }
   
    if (showTwitchHypeTrain == true) {    
        const template = eventTemplate;
        const clone = template.content.cloneNode(true);
        const messageId = createRandomString(40);
        const userId = createRandomString(40);

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

        header.remove();

        user.textContent = hypetrainInfo;
        action.textContent = ``;
        value.innerHTML = `
            <div class="gift-info">
                <span class="gift-value"><strong>LVL ${level}</strong> @ <strong>${htProgress}%</strong></span>
            </div>
        `;

        message.remove();

        addEventItem('twitch', clone, classes, userId, messageId);
    }


    /* HYPE TRAIN BAR */

    if (showTwitchHypeTrainBar == true) {

        const hypetrainElement = document.querySelector('#hypetrain');

        hypetrainElement.querySelector('.level').textContent = `LVL ${level}`;
        hypetrainElement.querySelector('.progressbar-fill').style.width = `${htProgress}%`;
        hypetrainElement.querySelector('.percentage').textContent = `${htProgress}%`;

        hypetrainElement.querySelector('.info').textContent = hypetrainInfo;

        hypeTrainStopCountdown();
        hypeTrainStartCountdown(started_at, expires_at);

        hypetrainElement.classList.add('animate__pulse');
        
        hypetrainElement.querySelector('.info').classList.remove('animate__fadeOut');
        hypetrainElement.querySelector('.info').classList.add('animate__fadeIn');

        setTimeout(() => {
            hypetrainElement.classList.remove('animate__pulse');
        }, 1000);

        setTimeout(() => {
            hypetrainElement.querySelector('.info').classList.remove('animate__fadeIn');
            hypetrainElement.querySelector('.info').classList.add('animate__fadeOut');
        }, 3000);

    }
    

}


async function twitchHypeTrainEnd(data) {

    const classes = ['twitch', 'hypetrain'];
    
    const {
        level,
        is_golden_kappa_train,
        is_treasure_train
    } = data;

    let hypetrainInfo = tRD('twitch.hypetrain.ended');

    if (is_golden_kappa_train == true) {
        hypetrainInfo = tRD('twitch.hypetrain.ended_golden');
        classes.push('golden-kappa-train');
    }
    
    if (is_treasure_train == true) {
        hypetrainInfo = tRD('twitch.hypetrain.ended_treasure');
        classes.push('treasure-train');
    }
    
    if (showTwitchHypeTrain == true) {    

        const template = eventTemplate;
        const clone = template.content.cloneNode(true);
        const messageId = createRandomString(40);
        const userId = createRandomString(40);

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

        header.remove();

        user.textContent = hypetrainInfo;
        action.textContent = ` 👏👏👏 `;
        value.innerHTML = `
            <div class="gift-info">
                <span class="gift-value"><strong>LVL ${level}</strong></span>
            </div>
        `;

        message.remove();

        addEventItem('twitch', clone, classes, userId, messageId);

    }
    


    /* HYPE TRAIN BAR */

    if (showTwitchHypeTrainBar == true) {

        const hypetrainElement = document.querySelector('#hypetrain');

        if (is_golden_kappa_train == true) hypetrainElement.classList.add('golden-kappa-train');
        if (is_treasure_train == true) hypetrainElement.classList.add('treasure-train');

        hypetrainElement.querySelector('.info').textContent = `${hypetrainInfo} @ LVL ${level} 👏👏👏`;

        hypeTrainStopCountdown();
        
        hypetrainElement.querySelector('.info').classList.remove('animate__fadeOut');
        hypetrainElement.querySelector('.info').classList.add('animate__fadeIn');

        setTimeout(() => {
            hypetrainElement.classList.add('animate__fadeOut');
            setTimeout(() => {
                hypetrainElement.remove();
            }, 1000);
        }, 6000);

    }


}


let hypeTrainTimerInterval = null;

function hypeTrainStartCountdown(startedAt, expiresAt) {
    hypeTrainStopCountdown();

    const total = new Date(expiresAt) - new Date(startedAt);
    
    hypeTrainTimerInterval = setInterval(() => {
        const remaining = new Date(expiresAt) - Date.now();
        
        if (remaining <= 0) {
            hypeTrainStopCountdown();
            hypeTrainUpdateDisplay(0);
            return;
        }
        
        hypeTrainUpdateDisplay(remaining);
    }, 1000);

    hypeTrainUpdateDisplay(new Date(expiresAt) - Date.now());
}

function hypeTrainStopCountdown() {
    if (hypeTrainTimerInterval) {
        clearInterval(hypeTrainTimerInterval);
        hypeTrainTimerInterval = null;
    }
}

function hypeTrainUpdateDisplay(remaining) {
    const seconds = Math.max(0, Math.floor(remaining / 1000));

    const hypetrainElement = document.querySelector('#hypetrain');
    hypetrainElement.querySelector('.timeremaining').textContent = `${formatTime(seconds)}`;
}





async function twitchGoalsRenderer(data) {

    const {
        id,
        type,
        description,
        'currentAmount' : current_amount,
        'targetAmount' : target_amount
    } = data;

    const goalMap = {
        follower:                   { type: tRD('twitch.goal.types.follower'),              item: tRD('twitch.goal.items.follower') },
        subscription:               { type: tRD('twitch.goal.types.subscription'),          item: tRD('twitch.goal.items.subscription') },
        subscription_count:         { type: tRD('twitch.goal.types.subscription_count'),    item: tRD('twitch.goal.items.subscription_count') },
        new_subscription:           { type: tRD('twitch.goal.types.new_subscription'),      item: tRD('twitch.goal.items.new_subscription') },
        new_subscription_count:     { type: tRD('twitch.goal.types.new_subscription_count'),item: tRD('twitch.goal.items.new_subscription_count') },
        new_bit:                    { type: tRD('twitch.goal.types.new_bit'),                item: tRD('twitch.goal.items.new_bit') },
        new_cheerer:                { type: tRD('twitch.goal.types.new_cheerer'),            item: tRD('twitch.goal.items.new_cheerer') },
    };

    const resolvedKey = type || 'unknown';

    const { type: goalType, item: goalItem } = goalMap[resolvedKey] ?? { type: tRD('twitch.goal.types.unknown'), item: tRD('twitch.goal.items.unknown') };


    /* GOAL BAR */

    if (showTwitchGoalsBars == true) {

        const goalBarId = `goal-${id}`;

        if (document.getElementById(goalBarId)) return;

        const goalElement = document.querySelector('#goals');
        const goalBarTemplate = document.querySelector('#goal-template');
        const goalBarClone = goalBarTemplate.content.cloneNode(true);
        const goalBarElement = goalBarClone.firstElementChild;

        const {
            logo,
            icon,
            percentage,
            info,
            'progressbar-fill': progressBarFill,
        } = Object.fromEntries(
            [...goalBarClone.querySelectorAll('[class]')]
                .map(el => [el.className, el])
        );

        let goalProgress = Math.floor(current_amount/target_amount * 100);

        goalBarElement.id = goalBarId;
        icon.querySelector('span').textContent = description ? `${description}`: goalType;
        progressBarFill.style.width = `${goalProgress}%`;
        percentage.querySelector('span').textContent = `${current_amount}/${target_amount}`;
        percentage.querySelector('small').textContent = `${goalItem}`;

        goalBarElement.classList.add('animate__fadeInDown');

        goalElement.insertAdjacentElement('beforeend', goalBarElement);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {

                setTimeout(() => {
                    goalBarElement.classList.remove('animate__fadeInDown');
                }, 1000);

            });
        });
        
    }

}





async function twitchGoalBegin(data) {

    const classes = ['twitch', 'goal'];

    const {
        id,
        type,
        description,
        current_amount,
        target_amount
    } = data;

    twitchGoals.set(id, {
        "current_amount": current_amount,
        "target_amount": target_amount,
        "complete" : false
    });

    const goalMap = {
        follow:                     { type: tRD('twitch.goal.types.follow'),                 item: tRD('twitch.goal.items.follow') },
        subscription:               { type: tRD('twitch.goal.types.subscription'),           item: tRD('twitch.goal.items.subscription') },
        subscription_count:         { type: tRD('twitch.goal.types.subscription_count'),     item: tRD('twitch.goal.items.subscription_count') },
        new_subscription:           { type: tRD('twitch.goal.types.new_subscription'),       item: tRD('twitch.goal.items.new_subscription') },
        new_subscription_count:     { type: tRD('twitch.goal.types.new_subscription_count'), item: tRD('twitch.goal.items.new_subscription_count') },
        new_bit:                    { type: tRD('twitch.goal.types.new_bit'),                 item: tRD('twitch.goal.items.new_bit') },
        new_cheerer:                { type: tRD('twitch.goal.types.new_cheerer'),             item: tRD('twitch.goal.items.new_cheerer') },
    };

    const { type: goalType, item: goalItem } = goalMap[type] ?? { type: '', item: '' };

    if (showTwitchGoals == true) {

        const template = eventTemplate;
        const clone = template.content.cloneNode(true);
        const messageId = createRandomString(40);
        const userId = createRandomString(40);

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

        header.remove();

        user.textContent = tRD('twitch.goal.new', { type: goalType });
        action.textContent = description ? ` - ${description} ` : ``;
        value.innerHTML = `
            <div class="gift-info">
                <span class="gift-value">${current_amount}/${target_amount} ${goalItem}</span>
            </div>
        `;

        addEventItem('twitch', clone, classes, userId, messageId);

    }


    /* GOAL BAR */

    if (showTwitchGoalsBars == true) {
        const goalElement = document.querySelector('#goals');
        const goalBarTemplate = document.querySelector('#goal-template');
        const goalBarClone = goalBarTemplate.content.cloneNode(true);
        const goalBarElement = goalBarClone.firstElementChild;

        const {
            logo,
            icon,
            percentage,
            info,
            'progressbar-fill': progressBarFill,
        } = Object.fromEntries(
            [...goalBarClone.querySelectorAll('[class]')]
                .map(el => [el.className, el])
        );

        let goalProgress = Math.floor(current_amount/target_amount * 100);

        const goalBarId = `goal-${id}`;
        goalBarElement.id = goalBarId;
        icon.querySelector('span').textContent = description ? `${description}`: goalType;
        progressBarFill.style.width = `${goalProgress}%`;
        percentage.querySelector('span').textContent = `${current_amount}/${target_amount}`;
        percentage.querySelector('small').textContent = `${goalItem}`;

        goalBarElement.classList.add('animate__fadeInDown');

        goalElement.insertAdjacentElement('beforeend', goalBarElement);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {

                setTimeout(() => {
                    goalBarElement.classList.remove('animate__fadeInDown');
                }, 1000);

            });
        });
        
    }

}





async function twitchGoalProgress(data) {

    const {
        id,
        current_amount,
        target_amount
    } = data;

    twitchGoals.set(id, {
        "current_amount": current_amount,
        "target_amount": target_amount,
        "complete" : false
    });

    /* GOAL BAR */

    if (showTwitchGoalsBars == true) {
        
        const goalElement = document.querySelector('#goals');
        const goalBarId = `goal-${id}`;
        const goalBarElement = goalElement.querySelector(`#${goalBarId}`);

        const {
            percentage,
            'progressbar-fill': progressBarFill,
        } = Object.fromEntries(
            [...goalBarElement.querySelectorAll('[class]')]
                .map(el => [el.className, el])
        );


        let goalProgress = Math.floor(current_amount/target_amount * 100);
        progressBarFill.style.width = `${goalProgress}%`;
        percentage.querySelector('span').textContent = `${current_amount}/${target_amount}`;
        
    }

}



async function twitchGoalEnd(data) {

    const classes = ['twitch', 'goal'];

    const {
        id,
        type,
        description,
        current_amount,
        target_amount
    } = data;

    const getTwitchGoalMap = twitchGoals.get(id);

    if (getTwitchGoalMap.complete == true) return;

    const goalMap = {
        follow:                     { type: tRD('twitch.goal.types.follow'),                 item: tRD('twitch.goal.items.follow') },
        subscription:               { type: tRD('twitch.goal.types.subscription'),           item: tRD('twitch.goal.items.subscription') },
        subscription_count:         { type: tRD('twitch.goal.types.subscription_count'),     item: tRD('twitch.goal.items.subscription_count') },
        new_subscription:           { type: tRD('twitch.goal.types.new_subscription'),       item: tRD('twitch.goal.items.new_subscription') },
        new_subscription_count:     { type: tRD('twitch.goal.types.new_subscription_count'), item: tRD('twitch.goal.items.new_subscription_count') },
        new_bit:                    { type: tRD('twitch.goal.types.new_bit'),                 item: tRD('twitch.goal.items.new_bit') },
        new_cheerer:                { type: tRD('twitch.goal.types.new_cheerer'),             item: tRD('twitch.goal.items.new_cheerer') },
    };

    const { type: goalType, item: goalItem } = goalMap[type] ?? { type: '', item: '' };

    const template = eventTemplate;
    const clone = template.content.cloneNode(true);
    const messageId = createRandomString(40);
    const userId = createRandomString(40);

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

    header.remove();

    const goalStatus = current_amount >= target_amount ? tRD('twitch.goal.completed') : tRD('twitch.goal.ended');

    if (current_amount >= target_amount) {
        twitchGoals.set(id, {
            "current_amount": current_amount,
            "target_amount": target_amount,
            "complete" : true
        });
    }

    if (showTwitchGoals == true) {

        user.textContent = `${goalType} ${goalStatus}`;
        action.textContent = description ? ` - ${description} ` : ``;
        value.innerHTML = `
            <div class="gift-info">
                <span class="gift-value">${current_amount}/${target_amount} ${goalItem}</span>
            </div>
        `;

        addEventItem('twitch', clone, classes, userId, messageId);

    }


    /* GOAL BAR */

    if (showTwitchGoalsBars == true) {
        const goalElement = document.querySelector('#goals');
        const goalBarId = `goal-${id}`;
        const goalBarElement = goalElement.querySelector(`#${goalBarId}`);

        goalBarElement.classList.add('animate__fadeOut');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {

                setTimeout(() => {
                    goalBarElement.remove();
                }, 1000);

            });
        });
        
    }

}


async function twitchGoalsFetch() {

    if (!streamerBotStatus.connected) {
        setTimeout(twitchGoalsFetch, 1000);
        return;
    }

    if (showTwitchGoalsBars) {
        console.debug('[ChatRD][Twitch] Fetching Twitch Goals...');    
        streamerBotClient.doAction(
        { name : "[Twitch] Fetch Goals" }, { }
        ).then( () => {
            console.debug('[ChatRD][Twitch] Twitch Goals Fetched!');
        });   
    }
}






// ---------------------------
// TWITCH UTILITY FUNCTIONS

/*async function getTwitchAvatar(user) {
    const DEFAULT_AVATAR = 'https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-300x300.png';

    if (twitchAvatars.has(user)) {
        console.debug(`[ChatRD] Twitch avatar found in cache for ${user}!`);
        return twitchAvatars.get(user);
    }

    console.debug(`[ChatRD] Twitch avatar not found for ${user}! Fetching from DECAPI...`);
    
    try {
        const response = await fetch(`https://decapi.me/twitch/avatar/${user}`);

        if (!response.ok) {
            console.warn(`[ChatRD] DECAPI returned ${response.status} for ${user}. Using default avatar.`);
            twitchAvatars.set(user, DEFAULT_AVATAR);
            return DEFAULT_AVATAR;
        }

        const avatar = (await response.text()).trim() || DEFAULT_AVATAR;

        twitchAvatars.set(user, avatar);
        return avatar;
    }
    catch (err) {
        console.error(`[ChatRD] Failed to fetch avatar for ${user}:`, err);
        return DEFAULT_AVATAR; 
    }
}*/



async function getTwitchAvatar(user) {
    const DEFAULT_AVATAR = 'https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-300x300.png';

    if (twitchAvatars.has(user)) {
        console.debug(`[ChatRD] Twitch avatar found in cache for ${user}!`);
        return twitchAvatars.get(user);
    }

    console.debug(`[ChatRD] Fetching Twitch avatar for ${user} from DECAPI...`);

    try {
        const response = await fetch(`https://decapi.me/twitch/avatar/${user}`);
        const text = (await response.text()).trim();
        const isInvalid = !response.ok || /user not found|invalid/i.test(text);

        if (!isInvalid) {
            console.debug(`[ChatRD] Twitch avatar found on DECAPI for ${user}!`);
            twitchAvatars.set(user, text);
            return text;
        }

        console.warn(`[ChatRD] DECAPI failed for ${user} (${response.status}: "${text}"). Trying Twitch GQL...`);
    }
    catch (err) {
        console.warn(`[ChatRD] DECAPI request failed for ${user}:`, err, `Trying Twitch GQL...`);
    }

    // Twitch GraphQL - Thanks Claude! ❤️

    try {
        const gqlResponse = await fetch("https://gql.twitch.tv/gql", {
            method: "POST",
            headers: {
                "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
                "Content-Type": "application/json",
            },
            body: JSON.stringify([{
                operationName: "StreamMetadata",
                variables: { channelLogin: user },
                extensions: {
                    persistedQuery: {
                        version: 1,
                        sha256Hash: "059c4653b788f5bdb2f5a2d2a24b0ddc3831a15079001a3d927556a96fb0517f"
                    }
                }
            }])
        });

        const data = await gqlResponse.json();
        const avatar = data?.[0]?.data?.user?.profileImageURL;

        if (avatar) {
            console.debug(`[ChatRD] Avatar found on Twitch GQL for ${user}!`);
            twitchAvatars.set(user, avatar);
            return avatar;
        }

        console.warn(`[ChatRD] Twitch GQL returned no avatar for ${user}. Using default.`);
    }
    catch (err) {
        console.error(`[ChatRD] Twitch GQL request failed for ${user}:`, err);
    }

    twitchAvatars.set(user, DEFAULT_AVATAR);
    return DEFAULT_AVATAR;
}





async function getTwitchBadges(badges) {
    return badges
        .map(badge => `<img src="${badge.imageUrl}" class="badge">`)
        .join('');
}




async function getTwitchMessageFromParts(parts) {
    const html = parts.map(part => {
        if (part.type === 'emote') {
            if (part.source == "Twemoji") {
                return escapeHTML(part.text);
            }
            else {
                return `<img src="${part.imageUrl}" alt="${escapeHTML(part.text)}" title="${escapeHTML(part.text)}" class="emote">`;
            }
        }

        if (part.type === 'cheer') {
            return ``;
        }
        
        return escapeHTML(part.text);
        
    }).join('');
    
    return html;
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