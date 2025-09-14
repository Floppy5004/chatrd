/* ----------------------- */
/* TIKTOK MODULE VARIABLES */
/* ----------------------- */

const showTiktok                    = getURLParam("showTiktok", false);

const showTikTokMessages            = getURLParam("showTikTokMessages", true);
const showTikTokJoins               = getURLParam("showTikTokJoins", false);
const showTikTokFollows             = getURLParam("showTikTokFollows", true);
const showTikTokLikes               = getURLParam("showTikTokLikes", false);
const showTikTokShares              = getURLParam("showTikTokShares", false);
const showTikTokGifts               = getURLParam("showTikTokGifts", true);
const showTikTokSubs                = getURLParam("showTikTokSubs", true);
const showTikTokStatistics          = getURLParam("showTikTokStatistics", true);

userColors.set('tiktok', new Map());

document.addEventListener('DOMContentLoaded', () => {
    if (showTiktok) {
        const tiktokStatistics = `
            <div class="platform" id="tiktok" style="display: none;">
                <img src="js/modules/tiktok/images/logo-tiktok.svg" alt="">
                <span class="viewers"><i class="fa-solid fa-user"></i> <span>0</span></span>
                <span class="likes"><i class="fa-solid fa-heart"></i> <span>0</span></span>
            </div>
        `;

        document.querySelector('#statistics').insertAdjacentHTML('beforeend', tiktokStatistics);

        if (showTikTokStatistics == true) { document.querySelector('#statistics #tiktok').style.display = ''; }
        
        console.debug('[TikTok][Debug] DOMContentLoaded fired');
        
        tiktokConnection();
    }
});



let tiktoJoinTimeOut;


// -----------------------
// TIKTOK CONNECT HANDLER

async function tiktokConnection() {
    const tikfinityWebSocketURL = 'ws://localhost:21213/'; // Replace with real URL
    const reconnectDelay = 10000; // 10 seconds
    const maxTries = 20;
    let retryCount = 0;

    function connect() {
        const tikfinityWebSocket = new WebSocket(tikfinityWebSocketURL);

        tikfinityWebSocket.onopen = () => {
            console.debug(`[TikFinity] Connected to TikFinity successfully!`);
            retryCount = 0; // Reset retry count on success

            notifySuccess({
                title: 'Connected to TikFinity',
                text: ``
            });
        };

        tikfinityWebSocket.onmessage = (response) => {

            const data = JSON.parse(response.data);
            const tiktokData = data.data;

            console.debug(`[TikTok] ${data.event}`, data.data);

            switch (data.event) {
                case 'roomUser' : tiktokUpdateStatistics(tiktokData, 'viewers'); break;
                case 'like': tiktokLikesMessage(tiktokData); tiktokUpdateStatistics(tiktokData, 'likes'); break;
                case 'member' : tiktokJoinMessage(tiktokData); break;
                case 'share' : tiktokShareMessage(tiktokData); break;
                case 'chat': tiktokChatMessage(tiktokData); break;
                case 'follow': tiktokFollowMessage(tiktokData); break;
                case 'gift': tiktokGiftMessage(tiktokData); break;
                case 'subscribe': tiktokSubMessage(tiktokData); break;
            }
        };

        tikfinityWebSocket.onclose = (event) => {

            setTimeout(() => {
                    connect();
                }, reconnectDelay);


            /*console.error(`[TikFinity] Disconnected (code: ${event.code})`);

            if (retryCount < maxTries) {
                retryCount++;
                console.warn(`[TikFinity] Attempt ${retryCount}/${maxTries} - Reconnecting in ${reconnectDelay / 1000}s...`);

                notifyError({
                    title: 'TikFinity Disconnected',
                    text: `Attempt ${retryCount}/${maxTries} - Reconnecting in ${reconnectDelay / 1000}...`
                });

                setTimeout(() => {
                    connect();
                }, reconnectDelay);
            }
            else {
                notifyError({
                    title: 'TikFinity Reconnect Failed',
                    text: `Maximum retries (${maxTries}) reached. Reload ChatRD to try again.<br>(Check DevTools Debug for more info).`
                });
                console.error('[TikFinity] Max reconnect attempts reached. Giving up.');
            }*/
        };

        tikfinityWebSocket.onerror = (error) => {
            console.error(`[TikFinity] Connection error:`, error);

            // Force close to trigger onclose and centralize retry logic
            if (tikfinityWebSocket.readyState !== WebSocket.CLOSED) {
                tikfinityWebSocket.close();
            }
        };

        return tikfinityWebSocket;
    }

    return connect(); // Returns the initial WebSocket instance
}













// ---------------------------
// TIKTOK UTILITY FUNCTIONS

async function tiktokChatMessage(data) {
    
    if (!data?.comment) { data.comment = " "; }
    if (showTikTokMessages == false) return;
    //if (ignoreUserList.includes(data.nickname.toLowerCase())) return;
    if (ignoreUserList.includes(data.uniqueId.toLowerCase())) return;
    if (data.comment.startsWith("!") && excludeCommands == true) return;

	const template = chatTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.msgId;
    const userId = data.userId;

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

    const classes = ['tiktok', 'chat'];

    if (data.isModerator) classes.push('mod');
    if (data.isSubscriber) classes.push('sub');

    const [avatarImage, messageHTML, badgesHTML] = await Promise.all([
        getTikTokAvatar(data),
        getTikTokEmotes(data),
        getTikTokBadges(data),
    ]);

    header.remove();
    firstMessage.remove();

    sharedChat.remove();
    reply.remove();
    pronoun.remove();

    if (showAvatar) avatar.innerHTML = `<img src="${avatarImage}">`; else avatar.remove();
    
    if (showBadges) {
        if (!badgesHTML) { badges.remove(); }
        else { badges.innerHTML = badgesHTML; }
     }
    else { badges.remove(); }

    var color = await createRandomColor('tiktok', data.uniqueId);

    user.style.color = color;
    user.innerHTML = `<strong>${data.nickname}</strong>`;
    message.innerHTML = messageHTML;

    addMessageItem('tiktok', clone, classes, userId, messageId);
}



async function tiktokFollowMessage(data) {

    if (showTikTokFollows == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.msgId;
    const userId = data.userId;

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

    const classes = ['tiktok', 'follow'];

    header.remove();
    message.remove();
    value.remove();

    
    user.innerHTML = `<strong>${data.nickname}</strong>`;

    action.innerHTML = ` followed you`;

    addEventItem('tiktok', clone, classes, userId, messageId);
}


async function tiktokShareMessage(data) {

    if (showTikTokShares == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.msgId;
    const userId = data.userId;

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

    const classes = ['tiktok', 'share'];

    header.remove();
    message.remove();
    value.remove();

    
    user.innerHTML = `<strong>${data.nickname}</strong>`;

    action.innerHTML = ` shared the stream ↪️`;

    addEventItem('tiktok', clone, classes, userId, messageId);
}


async function tiktokJoinMessage(data) {
    if (showTikTokJoins == false) return;

    function onIdle() {
        container.style.paddingBottom = "0px";
        if (container.lastElementChild) {
            container.lastElementChild.remove();
        }
    }

    const messageId = data.msgId;
    const userId = data.userId;
    const userMessageHTML = `<strong>${data.nickname}</strong>`;
    const actionMessageHTML = ` joined the chat`;

    const joinElement = container.querySelector(".event.tiktok.join");

    if (joinElement) {
        const messageElement = joinElement.querySelector('.message');
        
        messageElement.classList.remove('animate__animated', 'animate__faster');

        if (chatHorizontal == true) {
            messageElement.classList.remove('animate__fadeInRight');
        }
        else {
            messageElement.classList.remove('animate__fadeInUp');
        }

        joinElement.querySelector('.user').innerHTML = userMessageHTML;
        joinElement.querySelector('.action').innerHTML = actionMessageHTML;

        messageElement.classList.add('animate__animated', 'animate__faster');

        if (chatHorizontal == true) {
            messageElement.classList.add('animate__fadeInRight');
        }
        else {
            messageElement.classList.add('animate__fadeInUp');
        }
        
        chatContainer.prepend(joinElement);
    }

    else {
        const template = eventTemplate;
        const clone = template.content.cloneNode(true);

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

        const classes = ['tiktok', 'join'];

        header.remove();
        message.remove();
        value.remove();

        user.innerHTML = userMessageHTML;
        action.innerHTML = actionMessageHTML;

        addEventItem('tiktok', clone, classes, userId, messageId);
    }

}



async function tiktokLikesMessage(data) {

    if (showTikTokLikes == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.msgId;
    const userId = data.userId;

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

    const classes = ['tiktok', 'likes'];

    var likeCountTotal = parseInt(data.likeCount);
    
    // Search for Previous Likes from the Same User
    const previousLikeContainer = chatContainer.querySelector(`div.event.tiktok.likes[data-user="${data.userId}"]`);

    // If found, fetches the previous likes, deletes the element
    // and then creates a new count with a sum of the like count
    if (previousLikeContainer) {
        const likeCountElem = previousLikeContainer.querySelector('.value strong');
        if (likeCountElem) {
            var likeCountPrev = parseInt(likeCountElem.textContent);
            likeCountTotal = Math.floor(likeCountPrev + likeCountTotal);
            //removeItem(previousLikeContainer);
            likeCountElem.textContent = likeCountTotal;
            //animateCounter(likeCountElem, likeCountPrev, likeCountTotal, 250);
            chatContainer.prepend(previousLikeContainer);
        }
    }
    else {

        header.remove();
        
        user.innerHTML = `<strong>${data.nickname}</strong>`;
        action.innerHTML = ` sent you `;

        var likes = likeCountTotal > 1 ? 'likes' : 'like';
        value.innerHTML = `<strong>${likeCountTotal}</strong> ${likes} ❤️`;

        message.remove();

        addEventItem('tiktok', clone, classes, userId, messageId);

    }
}



async function tiktokSubMessage(data) {

    if (showTikTokSubs == false) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.msgId;
    const userId = data.userId;

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

    const classes = ['tiktok', 'sub'];

    header.remove();

    
    user.innerHTML = `<strong>${data.nickname}</strong>`;
    action.innerHTML = ` subscribed for `;

    var months = data.subMonth > 1 ? 'months' : 'month';
    value.innerHTML = `<strong>${data.subMonth} ${months}</strong>`;

    message.remove();

    addEventItem('tiktok', clone, classes, userId, messageId);
}



async function tiktokGiftMessage(data) {

    if (showTikTokGifts == false) return;
    if (data.giftType === 1 && !data.repeatEnd) return;

    const template = eventTemplate;
	const clone = template.content.cloneNode(true);
    const messageId = data.msgId;
    const userId = data.userId;

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

    const classes = ['tiktok', 'gift'];

    header.remove();

    var coins = Math.floor(data.repeatCount*data.diamondCount);
    
    user.innerHTML = `<strong>${data.nickname}</strong>`;
    action.innerHTML = ` has sent you `;
    value.innerHTML = `<strong>x${data.repeatCount} ${data.giftName}</strong> <img src="${data.giftPictureUrl}"> <strong>(🪙 ${coins})</strong>`;

    message.remove();

    addEventItem('tiktok', clone, classes, userId, messageId);
}



async function getTikTokEmotes(data) {
    const {
        comment: message,
        emotes,
    } = data;

    var fullmessage = message;

    if (emotes.length > 0) {
        emotes.forEach(emote => {
            var emotetoadd = ` <img src="${emote.emoteImageUrl}" class="emote" data-emote-id="${emote.emoteId}"> `;
            var position = emote.placeInComment;
            fullmessage = [fullmessage.slice(0, position), emotetoadd, fullmessage.slice(position)].join('');
        });
    }

    return fullmessage;
}


async function getTikTokAvatar(data) {
    const {
        profilePictureUrl
    } = data;
    
    return profilePictureUrl;
}

async function getTikTokBadges(data) {
    const {
        isSubscriber,
        isModerator,
    } = data;

    let badgesHTML = [
        isSubscriber && '<span class="badge sub"><i class="fa-solid fa-star"></i></span>',
        isModerator && '<span class="badge mod"><i class="fa-solid fa-user-gear"></i></span>',
    ].filter(Boolean).join('');
    
    return badgesHTML;
}


async function tiktokUpdateStatistics(data, type) {
    
    if (showPlatformStatistics == false || showTikTokStatistics == false) return;

    if (type == 'viewers') {
        const viewers = formatNumber(DOMPurify.sanitize(data.viewerCount)) || "0";
        document.querySelector('#statistics #tiktok .viewers span').textContent = viewers;
    }

    if (type == 'likes') {
        const likes = formatNumber(DOMPurify.sanitize(data.totalLikeCount)) || "0";
        document.querySelector('#statistics #tiktok .likes span').textContent = likes;
    }
    
}