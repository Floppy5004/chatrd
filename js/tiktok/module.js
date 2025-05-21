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
const showTikTokLikes               = getURLParam("showTikTokLikes", true);
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
                tiktokUpdateStatistics(jsonData, 'viewers');
            break;
            case 'like' :
                tiktokUpdateStatistics(jsonData, 'likes');
                //console.log('TikTok Likes', jsonData);
                tiktokLikesMessage(jsonData);
            break;
            case 'chat' :
                console.log('TikTok Chat', jsonData);
                tiktokChatMessage(jsonData);
            break;
            case 'follow' : 
                console.log('TikTok Follow', jsonData);
                tiktokFollowMessage(jsonData);
            break;
            case 'subscribe' : 
                console.log('TikTok Sub', jsonData);
                tiktokSubMessage(jsonData);
            break;
            case 'gift' : 
                console.log('TikTok Gift', jsonData);
                tiktokGiftMessage(jsonData);         
            break;
        default:
            //console.debug(json);
        }
    }
    
});




async function tiktokChatMessage(data) {
    
    if (showTikTokMessages == false) return;
    if (ignoreUserList.includes(data.nickname.toLowerCase())) return;
    if (data.comment.startsWith("!") && excludeCommands == true) return;
    

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

    if (emotes.length > 0) {
        emotes.forEach(emote => {
            var emotetoadd = ` <img src="${emote.emoteImageUrl}" class="emote" data-emote-id="${emote.emoteId}"> `;
            var position = emote.placeInComment;
            fullmessage = [fullmessage.slice(0, position), emotetoadd, fullmessage.slice(position)].join('');
        });
    }

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
    
    if (showTikTokFollows == false) return;

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




async function tiktokLikesMessage(data) {

    if (showTikTokLikes == false) return;


    const {
        userId: userID,
        msgId: messageID,
        profilePictureUrl: avatar,
        nickname: userName,
        likeCount: likesSent
    } = data;

    var likeCountTotal = parseInt(likesSent);

    // Search for Previous Likes from the Same User
    const previousLikeContainer = chatContainer.querySelector(`div.message[data-user="${userID}"]`);

    // If found, fetches the previous likes, deletes the element
    // and then creates a new count with a sum of the like count
    if (previousLikeContainer) {
        const likeCountElem = previousLikeContainer.querySelector('.likecount');
        if (likeCountElem && likeCountElem.textContent) {
            var likeCountPrev = parseInt(likeCountElem.textContent);
            likeCountTotal = Math.floor(likeCountPrev + likeCountTotal);
            previousLikeContainer.remove();
        }
    }

    const message = currentLang.tiktok.likes(likeCountTotal)
    const classes = 'likes'

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
    
    if (showTikTokSubs == false) return;

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
    
    if (showTikTokGifts == false) return;
    if (data.giftType === 1 && !data.repeatEnd) {}
    else {
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
}






async function tiktokUpdateStatistics(data, type) {
    
    if (showPlatformStatistics == false || showTikTokStatistics == false) return;

    if (type == 'viewers') {
        const viewers = DOMPurify.sanitize(data.viewerCount);
        document.querySelector('#statistics #tiktok .viewers span').textContent = formatNumber(viewers);
    }

    if (type == 'likes') {
        const likes = DOMPurify.sanitize(data.totalLikeCount);
        document.querySelector('#statistics #tiktok .likes span').textContent = formatNumber(likes);
    }
    
    
}
