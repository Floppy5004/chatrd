/* ----------------------- */
/*         OPTIONS         */
/* ----------------------- */

const streamerBotServerAddress      = getURLParam("streamerBotServerAddress", "127.0.0.1");
const streamerBotServerPort         = getURLParam("streamerBotServerPort", "8080");
let streamerBotConnected            = false;
const chatThreshhold                = 50;

const chatContainer                 = document.querySelector('#chat');
const chatFontSize                  = getURLParam("chatFontSize", 1);

const currentLang                   = lang[getURLParam("language", 'ptbr')]; 
const eventsMockup                  = getURLParam("eventsMockup", true); 
const chatHorizontal                = getURLParam("chatHorizontal", false); 
const showPlatform                  = getURLParam("showPlatform", false);
const showAvatar                    = getURLParam("showAvatar", false);
const showTimestamps                = getURLParam("showTimestamps", false);
const ampmTimeStamps                = getURLParam("ampmTimeStamps", false);
const showBadges                    = getURLParam("showBadges", true);
const showPlatformStatistics        = getURLParam("showPlatformStatistics", false);
const hideAfter                     = getURLParam("hideAfter", 0);
const ignoreChatters                = getURLParam("ignoreChatters", "");
const excludeCommands               = getURLParam("excludeCommands", true);

const avatars = new Map();
const userColors = new Map();

const ignoreUserList = ignoreChatters.split(',').map(item => item.trim().toLowerCase()) || [];

chatContainer.style.zoom = chatFontSize;

/* ----------------------- */
/*          START          */
/* ----------------------- */

if (showPlatformStatistics == false) { document.querySelector('#statistics').style.display = 'none'; }
if (chatHorizontal == true) { chatContainer.classList.add('horizontal'); }

/* ----------------------- */
/* STREAMER.BOT CONNECTION */
/* ----------------------- */

const streamerBotClient = new StreamerbotClient({
    host: streamerBotServerAddress,
    port: streamerBotServerPort,
    onConnect: (data) => {
        console.debug( currentLang.streamerbotconnected );
        console.debug(data);
        streamerBotConnected = true;
        notifySuccess({
            title: currentLang.streamerbotconnected,
            text: ``
        });
        if (eventsMockup == true) {
            chatContainer.innerHTML = '';
            stopMockupSystem();
        }
    },
    onDisconnect: () => {
        console.error(currentLang.streamerbotdisconnected);
        streamerBotConnected = false;
        if (eventsMockup == true) {
            startMockupSystem();
        }
        
    }
});


/* ----------------------- */
/*        UTILITIES        */
/* ----------------------- */



async function addMessageToChat(userID, messageID, platform, data) {

    const html = DOMPurify.sanitize(`
        <div id="${messageID}" data-user="${userID}" class="${platform} ${data.classes} message" style="">
            <div class="animate__animated ${chatHorizontal == true ? 'animate__fadeInRight' : 'animate__fadeInUp'} animate__faster">

                ${data.classes.includes("first-message") ? '<span class="first-chatter">✨</span>' : '' }

                ${!data.shared ? '' : data.shared}

                ${showTimestamps == true ? '<span class="time">'+whatTimeIsIt()+'</span>' : ''}
                
                ${showPlatform == true ? '<i class="platform fa-brands fa-'+platform+'"></i>' : '' }
                
                ${showAvatar == true ? '<span class="avatar"><img src="'+data.avatar+'"></span>' : ''}

                ${showBadges == true ? '<span class="badges">'+data.badges+'</span>' : ''}
                
                <span style="color: ${data.color}"  class="user">${data.userName}:</span>
                
                ${!data.reply ? '' : data.reply}
                
                <span class="text">${data.message}</span>
            </div>
        </div>
    `);

    chatContainer.insertAdjacentHTML('beforeend', html);

    const messageElement = document.getElementById(messageID);

    if (hideAfter > 0) {   
        setTimeout(function () {
            messageElement.style.opacity = 0;
            setTimeout(function () {
                messageElement.remove();
            }, 1000); 
        }, Math.floor(hideAfter * 1000));
    }
    
    removeExtraChatMessages();
}



async function addEventToChat(userID, messageID, platform, data) {
    
    const html = DOMPurify.sanitize(`
        <div id="${messageID}" data-user="${userID}" class="${platform} ${data.classes} message event" style="">
            <div class="animate__animated ${chatHorizontal == true ? 'animate__fadeInRight' : 'animate__fadeInUp'} animate__faster">
                ${!data.reply ? '' : data.reply}

                ${showPlatform == true ? '<i class="platform '+(platform == 'money' ? 'fa-solid' : 'fa-brands')+' fa-'+platform+'"></i>' : '&nbsp;&nbsp;' }

                <span class="info">
                    <!--<span class="avatar"><img src="${data.avatar}"></span>-->
                    <span style="color: ${data.color}"  class="user">${data.userName}</span>
                    <span class="text">${data.message}</span>
                </span>
            </div>
        </div>
    `);

    chatContainer.insertAdjacentHTML('beforeend', html);
    
    const messageElement = document.getElementById(messageID);

    if (hideAfter > 0) {   
        setTimeout(function () {
            messageElement.style.opacity = 0;
            setTimeout(function () {
                messageElement.remove();
            }, 1000); 
        }, Math.floor(hideAfter * 1000));
    }

    removeExtraChatMessages();
}


const whatTimeIsIt = () => {
    const now = new Date();
    const hours24 = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = (hours24 % 12) || 12;

    if (ampmTimeStamps == true) { return `${hours12}:${minutes} ${ampm}`; }
    else { return `${hours24}:${minutes}`; }
};


function removeExtraChatMessages() {
    const chatMessages = chatContainer.querySelectorAll('div.message').length;
    if (chatMessages >= chatThreshhold) {
        for (let i = 0; i < Math.floor(chatThreshhold/2); i++) {
            chatContainer.removeChild(chatContainer.firstElementChild);
        }
    }
}


// Function to format large numbers (e.g., 1000 => '1K')
function formatNumber(num) {
    if (num >= 1000000) {
        let numStr = (num / 1000000).toFixed(1);
        if (numStr.endsWith('.0')) {
            numStr = numStr.slice(0, -2);
        }
        return numStr + 'M';
    }
    else if (num >= 1000) {
        let numStr = (num / 1000).toFixed(1);
        if (numStr.endsWith('.0')) {
            numStr = numStr.slice(0, -2);
        }
        return numStr + 'K';
    }
    return num.toString();
}


function formatCurrency(amount, currencyCode) {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}



function createRandomColor(platform, username) {
    if (userColors.get(platform).has(username)) {
        return userColors.get(platform).get(username);
    }
    else {
        const randomColor = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
        userColors.get(platform).set(username, randomColor);
        return randomColor;
    }
}


function createRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function getURLParam(param, defaultValue) {
    const chatQueryString = window.location.search;
    const urlParams = new URLSearchParams(chatQueryString);
    const paramVar = urlParams.get(param);

    switch (paramVar) {
        case 'true':
            return true;

        case 'false':
            return false;

        case null:
        case undefined:
            return defaultValue;

        default:
            return paramVar; 
    }
}


const pushNotify = (data) => {

    const SimpleNotify = {
        effect: 'fade',
        speed: 500,
        customClass: 'toasty',
        customIcon: '',
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 5000,
        notificationsGap: null,
        notificationsPadding: null,
        type: 'outline',
        position: 'x-center bottom',
        customWrapper: '',
    };

    const mergedData = {
        ...SimpleNotify,
        ...data
    }

    new Notify (mergedData);
}

const notifyError = (err) => {
    err.status = 'error';
    pushNotify(err);
}

const notifyInfo = (info) => {
    info.status = 'info';
    pushNotify(info);
}

const notifyWarning = (warn) => {
    warn.status = 'warning';
    pushNotify(warn);
}


const notifySuccess = (success) => {
    success.status = 'success';
    pushNotify(success);
}



function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}