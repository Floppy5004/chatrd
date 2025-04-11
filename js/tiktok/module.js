/* ----------------------------------------------------------------------------------------- */
/*                               TikFinity >< Streamer.Bot                                   */
/* ----------------------------------------------------------------------------------------- */
/* In Streamer.bot, go into Servers/Clients, then Websocket clients,                         */
/* and add the server info for TikFinity Desktop App.                                        */
/* ----------------------------------------------------------------------------------------- */
/* If it's also running on the same computer, the address will be: ws://127.0.0.1:21213/     */
/* ----------------------------------------------------------------------------------------- */

const showTikTokMessages            = getURLParam("showTikTokMessages", true);
const showTikTokFollows             = getURLParam("showTikTokFollows", true);
const showTikTokGifts               = getURLParam("showTikTokGifts", true);
const showTikTokSubs                = getURLParam("showTikTokSubs", true);
const showTikTokStatistics          = getURLParam("showTikTokStatistics", true);

userColors.set('tiktok', new Map());

if (showTikTokStatistics == false) { document.querySelector('#statistics #tiktok').style.display = 'none'; }



streamerBotClient.on('General.Custom', (response) => {
    if (response.data.platform === 'TikTok') {
        
        let json = response.data; 
        let jsonData = json.data.data;

        switch (json.data.event) {
            case 'roomUser' :
                if (showPlatformStatistics == false || showTikTokStatistics == false) return;
                tiktokUpdateStatistics(jsonData, 'viewers');
            break;
            case 'like' :
                if (showPlatformStatistics == false || showTikTokStatistics == false) return;
                tiktokUpdateStatistics(jsonData, 'likes');
            break;
            case 'chat' :
                console.debug(json);
                if (showTikTokMessages == false) return;
                if (ignoreUserList.includes(jsonData.nickname.toLowerCase())) return;
                tiktokChatMessage(jsonData);
            break;
            case 'follow' : 
                if (showTikTokFollows == false) return;
                tiktokFollowMessage(jsonData);
            break;
            case 'subscribe' : 
                if (showTikTokSubs == false) return;
                tiktokSubMessage(jsonData);
            break;
            case 'gift' : 
                if (showTikTokGifts == false) return;
                if (jsonData.giftType === 1 && !jsonData.repeatEnd) {}
                else {
                    tiktokGiftMessage(jsonData);
                }                
            break;
        default:
            //console.debug(json);
        }
    }
    
});




async function tiktokChatMessage(data) {
    if (data.comment.startsWith("!") && excludeCommands == true) 
        return;
    

    const {
        userId: userID,
        msgId: messageID,
        profilePictureUrl: avatar,
        comment: message,
        emotes,
        nickname: userName,
        isSubscriber,
        isModerator,
    } = data;

    const badgesHTML = [
        isSubscriber && '<i class="fa-solid fa-star"></i>',
        isModerator && '<i class="fa-solid fa-user-gear"></i>',
    ].filter(Boolean).join('');

    const classes = [
        isSubscriber && 'sub',
        isModerator && 'mod',
    ].filter(Boolean);

    var fullmessage = message;

    emotes.forEach(emote => {
        var emotetoadd = ` <img src="${emote.emoteImageUrl}" class="emote" data-emote-id="${emote.emoteId}"> `;
        var position = emote.placeInComment;
        fullmessage = [fullmessage.slice(0, position), emotetoadd, fullmessage.slice(position)].join('');
    });

    const messageData = {
        classes: classes.join(' '),
        avatar,
        badges: badgesHTML,
        userName,
        color: await createRandomColor('tiktok', userID),
        message: fullmessage,
        reply: '',
    };

    addMessageToChat(userID, messageID, 'tiktok', messageData);
}



async function tiktokFollowMessage(data) {
    const {
        userId: userID,
        msgId: messageID,
        profilePictureUrl: avatar,
        nickname: userName,
    } = data;

    const message = currentLang.tiktok.follow();
    const classes = 'follow'

    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    };

    addEventToChat(userID, messageID, 'tiktok', messageData);
}



async function tiktokSubMessage(data) {
    const {
        userId: userID,
        msgId: messageID,
        profilePictureUrl: avatar,
        nickname: userName,
    } = data;

    const message = currentLang.tiktok.sub({
        months : data.subMonth
    });

    const classes = 'sub'

    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    };

    addEventToChat(userID, messageID, 'tiktok', messageData);
}



async function tiktokGiftMessage(data) {
    const {
        userId: userID,
        msgId: messageID,
        profilePictureUrl: avatar,
        nickname: userName,
    } = data;

    var coins = Math.floor(data.repeatCount*data.diamondCount);

    const message = currentLang.tiktok.gift({
        gift : data.giftName,
        count : data.repeatCount,
        coins : coins
    });

    const classes = 'gift'

    const messageData = {
        classes: classes,
        avatar,
        badges: '',
        userName,
        color: '#FFF',
        message,
        reply: '',
    };

    addEventToChat(userID, messageID, 'tiktok', messageData);
}






async function tiktokUpdateStatistics(data, type) {
    

    if (type == 'viewers') {
        const viewers = DOMPurify.sanitize(data.viewerCount);
        document.querySelector('#statistics #tiktok .viewers span').textContent = formatNumber(viewers);
    }

    if (type == 'likes') {
        const likes = DOMPurify.sanitize(data.totalLikeCount);
        document.querySelector('#statistics #tiktok .likes span').textContent = formatNumber(likes);
    }
    
    
}