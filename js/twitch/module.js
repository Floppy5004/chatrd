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
const showTwitchViewers             = getURLParam("showTwitchViewers", true);

if (showTwitchViewers == false) { document.querySelector('#statistics #twitch').style.display = 'none'; }

const twitchMessageHandlers = {
    'Twitch.ChatMessage': (response) => {
        console.debug('Twitch Chat', response.data);
        if (showTwitchMessages == false)
            return;
        if (ignoreUserList.includes(response.data.message.username.toLowerCase()))
            return;
        twitchChatMessage(response.data);
    },
    'Twitch.Follow': (response) => {
        console.debug('Twitch Follow', response.data);
        if (showTwitchFollows == false)
            return;
        twitchFollowMessage(response.data);
    },
    'Twitch.Announcement': (response) => {
        console.debug('Twitch Announcements', response.data);
        if (showTwitchAnnouncements == false) return;
        twitchAnnouncementMessage(response.data);
    },
    'Twitch.Cheer': (response) => {
        console.debug('Twitch Cheer/Bits', response.data);
        if (showTwitchBits == false) return;
        twitchBitsMessage(response.data);
    },
    'Twitch.AutomaticRewardRedemption': (response) => {
        console.debug('Twitch Auto Reward Redemption', response.data);
        if (showTwitchMessages == false) return;
        twitchChatMessageGiantEmote(response.data);
    },
    'Twitch.RewardRedemption': (response) => {
        console.debug('Twitch Reward Redemption', response.data);
        if (showTwitchRewardRedemptions == false) return;
        twitchRewardRedemption(response.data);
    },
    'Twitch.Sub': (response) => {
        console.debug('Twitch Sub', response.data);
        if (showTwitchSubs == false) return;
        twitchSubMessage(response.data);
    },
    'Twitch.ReSub': (response) => {
        console.debug('Twitch Resub', response.data);
        if (showTwitchSubs == false) return;
        twitchReSubMessage(response.data);
    },
    'Twitch.GiftSub': (response) => {
        console.debug('Twitch Gift Sub', response.data);
        if (response.data.fromCommunitySubGift === false) {
            if (showTwitchSubs == false || showTwitchGiftedSubs == false) return;
            twitchGiftMessage(response.data);
        }
        else {
            if (showTwitchSubs == false || showTwitchGiftedSubsUserTrain == false) return;
            twitchGiftMessage(response.data);
        }
        
    },
    'Twitch.GiftBomb': (response) => {
        console.debug('Twitch Gift Bomb', response.data);
        if (showTwitchSubs == false || showTwitchMassGiftedSubs == false) return;
        twitchGiftSubsMessage(response.data);
    },
    'Twitch.Raid': (response) => {
        console.debug('Twitch Raid', response.data);
        if (showTwitchRaids == false) return;
        twitchRaidMessage(response.data);
    },
    'Twitch.ChatMessageDeleted': (response) => {
        console.debug(response.data);
        twitchChatMessageDeleted(response.data);
    },
    'Twitch.UserBanned': (response) => {
        console.debug(response.data);
        twitchUserBanned(response.data);
    },
    'Twitch.UserTimedOut': (response) => {
        console.debug(response.data);
        twitchUserBanned(response.data);
    },
    'Twitch.ViewerCountUpdate': (response) => {
        console.debug(response.data);
        if (showPlatformStatistics == false || showTwitchViewers == false) return;
        twitchUpdateStatistics(response.data);
    },
    'Twitch.ChatCleared': (response) => {
        console.debug(response.data);
        twitchChatClearMessages();
    }
};

for (const [event, handler] of Object.entries(twitchMessageHandlers)) {
    streamerBotClient.on(event, handler);
}   


async function twitchChatMessage(data) {
        if (data.message.message.startsWith("!") && excludeCommands == true) 
            return;

        const {
            message: {
                username: userID,
                color,
                displayName: userName,
                message: text,
                firstMessage,
                isReply,
                isSharedChat,
                reply: replyData,
            },
            messageId,
        } = data;

        const [avatar, message, badges] = await Promise.all([
            getTwitchAvatar(userID),
            getTwitchEmotes(data),
            getTwitchBadges(data),
        ]);

        const classes = firstMessage ? ['first-message'] : [];
        const replyHTML = isReply ?
            `<div class="reply"><i class="fa-solid fa-arrow-turn-up"></i> <strong>${replyData.userName}:</strong> ${replyData.msgBody}</div>` :
            '';

        var sharedChat = '';

        if (isSharedChat) {
            if (showTwitchSharedChat == true) {
                if (!data.sharedChat.primarySource)
                {
                    var sharedChat = `<div class="shared"><span><i class="fa-solid fa-comments"></i> <strong>${data.sharedChat.sourceRoom.name}</strong></span> <i class="fa-solid fa-arrow-turn-down"></i></div>`;
                }
            }
            else if (!data.sharedChat.primarySource && showTwitchSharedChat == false) {
                return;
            }
        }

        const messageData = {
            classes: classes.join(' '),
            avatar,
            badges,
            userName,
            color,
            message,
            shared: sharedChat,
            reply: replyHTML,
        };

        addMessageToChat(userID, messageId, 'twitch', messageData);
    }



    async function twitchChatMessageGiantEmote(data) {
        const { user_login: userID, gigantified_emote: { id: emoteGigantify } } = data;

        const userMessages = chatContainer.querySelectorAll(`.twitch.message[data-user="${userID}"]`);
        if (userMessages.length === 0) return;

        const firstMessage = userMessages[0];
        const emoteImages = firstMessage.querySelectorAll(`img[data-emote-id="${emoteGigantify}"]`);
        if (emoteImages.length === 0) return;

        emoteImages.forEach(img => {
            img.classList.add("gigantify");
            if (img.src.endsWith("2.0")) {
                img.src = img.src.replace("2.0", "3.0");
            }
        });
    }



    async function twitchFollowMessage(data) {
        const {
            user_id : userID,
            user_name : userName
        } = data;

        const messageID = createRandomString(40);

        const [avatar, message] = await Promise.all([
            getTwitchAvatar(userID),
            currentLang.twitch.follow(),
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

        addEventToChat(userID, messageID, 'twitch', messageData);
    }



    async function twitchBitsMessage(data) {
        
        const {
            messageId : messageID,
            user : {
                id : userID,
                name : userName
            }
        } = data;

        const [avatar, message] = await Promise.all([
            getTwitchAvatar(userID),
            currentLang.twitch.bits({
                bits: data.message.bits,
                message : data.message.message.replace(/\bCheer\d+\b/g, '').replace(/\s+/g, ' ').trim()
            }),
        ]);

        const classes = 'bits';

        const messageData = {
            classes: classes,
            avatar,
            badges: '',
            userName,
            color: '#FFF',
            message,
            reply: '',
        };

        addEventToChat(userID, messageID, 'twitch', messageData);
    }



    async function twitchAnnouncementMessage(data) {
            
        const {
            messageId : messageID,
            user : {
                id : userID,
                name : userName
            }
        } = data;

        data.message = {
            message: await getTwitchAnnouncementEmotes(data)
        };

        const replyHTML = currentLang.twitch.announcement();

        const [avatar, message] = await Promise.all([
            getTwitchAvatar(userID),
            ` ${data.message.message}`
        ]);

        const classes = 'announcement';

        const messageData = {
            classes: classes,
            avatar,
            badges: '',
            userName,
            color: '#FFF',
            message,
            reply: replyHTML,
        };

        addEventToChat(userID, messageID, 'twitch', messageData);
    }



    async function twitchRewardRedemption(data) {
            
        const {
            user_id : userID,
            user_name : userName,
        } = data;

        const messageID = createRandomString(40);

        const replyHTML = currentLang.twitch.channelpoints({ title : data.reward.title });

        const [avatar, message] = await Promise.all([
            getTwitchAvatar(userID),
            ` ${data.user_input}`
        ]);

        const classes = 'rewards-redemption';

        const messageData = {
            classes: classes,
            avatar,
            badges: '',
            userName,
            color: '#FFF',
            message,
            reply: replyHTML,
        };

        addEventToChat(userID, messageID, 'twitch', messageData);
    }



    async function twitchSubMessage(data) {

        const {
            user : {
                id : userID,
                name : userName
            }
        } = data;

        const messageID = createRandomString(40);

        const [avatar, message] = await Promise.all([
            getTwitchAvatar(userID),
            currentLang.twitch.sub({
                months : data.duration_months,
                isPrime : data.isPrime,
                tier : data.sub_tier
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

        addEventToChat(userID, messageID, 'twitch', messageData);
    }



    async function twitchReSubMessage(data) {

        const {
            user : {
                id : userID,
                name : userName
            }
        } = data;

        const messageID = createRandomString(40);

        const [avatar, message] = await Promise.all([
            getTwitchAvatar(userID),
            currentLang.twitch.resub({
                months : data.cumulativeMonths,
                isPrime : data.isPrime,
                tier : data.subTier
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

        addEventToChat(userID, messageID, 'twitch', messageData);
    }



    async function twitchGiftMessage(data) {

        const {
            user : {
                id : userID,
                name : userName
            }
        } = data;

        const messageID = createRandomString(40);

        const [avatar, message] = await Promise.all([
            getTwitchAvatar(userID),
            currentLang.twitch.gifted({
                gifted : data.recipient.name,
                months : data.durationMonths,
                tier : data.subTier,
                total : data.cumlativeTotal
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

        addEventToChat(userID, messageID, 'twitch', messageData);
    }



    async function twitchGiftSubsMessage(data) {

        const {
            user : {
                id : userID,
                name : userName
            }
        } = data;

        const messageID = createRandomString(40);

        const [avatar, message] = await Promise.all([
            getTwitchAvatar(userID),
            currentLang.twitch.giftedbomb({ count : data.total, tier : data.sub_tier, total : data.cumulative_total })
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

        addEventToChat(userID, messageID, 'twitch', messageData);
    }



    async function twitchRaidMessage(data) {

        const {
            from_broadcaster_user_login: userID,
            from_broadcaster_user_name: userName
        } = data;

        const messageID = createRandomString(40);

        const [avatar, message] = await Promise.all([
            getTwitchAvatar(userID),
            currentLang.twitch.raid({ viewers : data.viewers })
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

        addEventToChat(userID, messageID, 'twitch', messageData);
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
        chatContainer.innerHTML = '';
    }

    async function twitchUpdateStatistics(data) {
        const viewers = DOMPurify.sanitize(data.viewers);
        document.querySelector('#statistics #twitch .viewers span').textContent = formatNumber(viewers);
    }



    async function getTwitchEmotes(data) {
        const message = data.message.message;
        const emotes = data.emotes;

        const words = message.split(" ");
        emotes.sort((a, b) => b.startIndex - a.startIndex);

        for (let i = 0; i < words.length; i++) {
            emotes.forEach(emote => {
                if (words[i] === emote.name) {
                    words[i] = `<img src="${emote.imageUrl}" data-emote-id="${emote.id}" alt="${emote.name}" class="emote">`;
                }
            });
        }

        return words.join(" ");
    }


    async function getTwitchAnnouncementEmotes(data) {
        const message = data.text;
        const emotes = data.parts;

        const words = message.split(" ");
        emotes.sort((a, b) => b.startIndex - a.startIndex);

        for (let i = 0; i < words.length; i++) {
            emotes.forEach(emote => {
                if (words[i] === emote.text) {
                    words[i] = `<img src="${emote.imageUrl}" alt="${emote.text}" class="emote">`;
                }
            });
        }

        return words.join(" ");
    }


    async function getTwitchBadges(data) {
        const badges = data.message.badges;
        var htmlBadges = '';
        badges.forEach((badge) => {
            htmlBadges += `<img src="${badge.imageUrl}" class="badge">`;
        });

        return htmlBadges;
    }


    async function getTwitchAvatar(user) {
        if (showAvatar == true) {
            if (avatars.has(user)) {
                console.debug(`Avatar found for ${user}!`);
                return avatars.get(user);
            }
            else {
                console.debug(`Avatar not found for ${user}! Getting it from DECAPI!`);
                var decapi = await fetch('https://decapi.me/twitch/avatar/' + user);
                var newavatar = await decapi.text()
                avatars.set(user, newavatar);
                return newavatar;
            }
        }
    }