/* ----------------------- */
/*         OPTIONS         */
/* ----------------------- */

const streamerBotServerAddress      = getURLParam("streamerBotServerAddress", "127.0.0.1");
const streamerBotServerPort         = getURLParam("streamerBotServerPort", "8080");

const ttsSpeakerBotChat             = getURLParam("ttsSpeakerBotChat", false);
const ttsSpeakerBotEvents           = getURLParam("ttsSpeakerBotEvents", false);

let streamerBotConnected            = false;
const chatThreshhold                = 50;

const chatContainer                 = document.querySelector('#chat');
const chatFontSize                  = getURLParam("chatFontSize", 1);
const chatBackground                = getURLParam("chatBackground", "#121212"); 
const chatBackgroundOpacity         = getURLParam("chatBackgroundOpacity", 1); 
const chatScrollBar                 = getURLParam("chatScrollBar", false); 
const chatBiggerEmotes              = getURLParam("chatBiggerEmotes", false); 
const chatField                     = getURLParam("chatField", false);
const chatModeration                = getURLParam("chatModeration", false);

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

const userColors = new Map();

const ignoreUserList = ignoreChatters.split(',').map(item => item.trim().toLowerCase()) || [];

chatContainer.style.zoom = chatFontSize;
if (chatScrollBar == false) { chatContainer.classList.add('noscrollbar'); }
if (chatField == true) {
    const chatfieldelement = document.getElementById("chat-input");
    chatfieldelement.classList.add('enabled');
    chatfieldelement.querySelector('form input[type=text]').setAttribute('placeholder', currentLang.chatsendmessage);
}

/* ----------------------- */
/*          START          */
/* ----------------------- */

document.body.style.backgroundColor = hexToRGBA(chatBackground,chatBackgroundOpacity);

if (showPlatformStatistics == false) { document.querySelector('#statistics').style.display = 'none'; }
if (chatHorizontal == true) { chatContainer.parentElement.classList.add('horizontal'); }

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
    
    if (ttsSpeakerBotChat == true) { ttsSpeakerBotSays(data.userName, currentLang.ttschat, data.message); }

    let html = DOMPurify.sanitize(`
        <div id="${messageID}" data-user="${userID}" class="${platform} ${data.classes} ${chatBiggerEmotes == true ? 'bigger-emojis' : ''} message" style="">
            <div class="animate__animated ${chatHorizontal == true ? 'animate__fadeInRight' : 'animate__fadeInUp'} animate__faster">

                ${data.classes.includes("first-message") ? '<span class="first-chatter">✨</span>' : '' }

                ${!data.shared ? '' : data.shared}

                ${showTimestamps == true ? '<span class="time">'+whatTimeIsIt()+'</span>' : ''}

                ${showPlatform == true ? '<span class="platform"><img src="images/logo-'+platform+'.svg" ></span>' : '' }
                
                ${showAvatar == true ? (data.avatar ? '<span class="avatar"><img src="'+data.avatar+'"></span>' : '') : ''}

                ${showBadges == true ? '<span class="badges">'+data.badges+'</span>' : ''}
                
                <span style="color: ${data.color}"  class="user">${data.userName}:</span>
                
                ${!data.reply ? '' : data.reply}
                
                <span class="text">${data.message}</span>
            </div>

            ${chatModeration == true && platform == 'twitch' ? `[CHATMODERATIONSNIPPETTWITCH]` : ''}
            ${chatModeration == true && platform == 'youtube' ? `[CHATMODERATIONSNIPPETYOUTUBE]` : ''}

        </div>
    `);


    let chatmodtwitch = `<span class="chatmoderation twitch">
                <button onclick="executeModCommand(event, '/deletemessage ${messageID}')" title="Remove Message"><i class="fa-solid fa-trash-can"></i></button>
                <button onclick="executeModCommand(event, '/timeout ${userID}')" title="Timeout User"><i class="fa-solid fa-stopwatch"></i></button>
                <button onclick="executeModCommand(event, '/ban ${userID}')" title="Ban User"><i class="fa-solid fa-gavel"></i></button>
            </span>`;

    let chatmodyoutube = `<span class="chatmoderation youtube">
                <button onclick="executeModCommand(event, '/yt/timeout ${userID}')" title="Timeout User"><i class="fa-solid fa-stopwatch"></i></button>
                <button onclick="executeModCommand(event, '/yt/ban ${userID}')" title="Ban User"><i class="fa-solid fa-gavel"></i></button>
            </span>`;
    
    html = html.replace('[CHATMODERATIONSNIPPETTWITCH]', chatmodtwitch);
    html = html.replace('[CHATMODERATIONSNIPPETYOUTUBE]', chatmodyoutube);

    chatContainer.insertAdjacentHTML('afterbegin', html);

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
    
    if (ttsSpeakerBotEvents == true) { ttsSpeakerBotSays(data.userName, '', data.message); }
    
    const html = DOMPurify.sanitize(`
        <div id="${messageID}" data-user="${userID}" class="${platform} ${data.classes} message event" style="">
            <div class="animate__animated ${chatHorizontal == true ? 'animate__fadeInRight' : 'animate__fadeInUp'} animate__faster">
                ${!data.reply ? '' : data.reply}

                ${showPlatform == true ? '<span class="platform"><img src="images/logo-'+platform+'.svg" ></span>' : '' }

                <span class="info">
                    <span style="color: ${data.color}"  class="user">${data.userName}</span>
                    <span class="text">${data.message}</span>
                </span>
            </div>
        </div>
    `);

    chatContainer.insertAdjacentHTML('afterbegin', html);
    
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
    const chatMessages = chatContainer.querySelectorAll('div.message');
    const total = chatMessages.length;

    if (total >= chatThreshhold) {
        const toRemove = Math.floor(total * 0.25); // 25% do total
        for (let i = 0; i < toRemove; i++) {
            const last = chatContainer.lastElementChild;
            if (last) chatContainer.removeChild(last);
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


async function ttsSpeakerBotSays(user, action, message) {

    if (streamerBotConnected == false) return;
    
    const ttstext = await cleanStringOfHTMLButEmotes(message);
    const ttsmessage = user+' '+action+' '+ttstext;

    streamerBotClient.doAction(
        { name : "TTS Event" },
        {
            "ttsmessage": ttsmessage,
        }
    ).then( (ttsstuff) => {
        console.debug('Sending TTS to Streamer.Bot', ttsstuff);
    });
}


async function cleanStringOfHTMLButEmotes(string) {
    // Cria um elemento DOM temporário
    const container = document.createElement('div');
    container.innerHTML = string;

    // Substitui <img class="emote" alt="..."> por texto do alt
    const emotes = container.querySelectorAll('img.emote[alt]');
    emotes.forEach(img => {
        const altText = img.getAttribute('alt');
        const textNode = document.createTextNode(altText);
        img.replaceWith(textNode);
    });

    // Remove todo o restante do HTML
    return container.textContent || "";
}


function stripStringFromHtml(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}


function hexToRGBA(hexadecimal,opacity) {
    const hex = hexadecimal;
    const alpha = parseFloat(opacity);
    
    // Converter hex para RGB
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}



const chatInputSend = document.getElementById("chat-input-send");
const chatInputForm = document.querySelector("#chat-input form");
const chatInput = chatInputForm.querySelector("input[type=text]")
const chatSettings = document.getElementById("chat-input-settings");

chatInputForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var chatSendPlatforms = [];

    if (showTwitchMessages == true) {
        chatSendPlatforms.push('twitch');
    }

    if (showYouTubeMessages == true) {
        chatSendPlatforms.push('youtube');
    }

    chatSendPlatforms = chatSendPlatforms.join(',')

    const chatInput = chatInputForm.querySelector("input[type=text]")
    const chatInputText = chatInput.value;

    // Sends Message to Twitch and YouTube 
    streamerBotClient.doAction(
    { name : "ChatRD Messages and Commands" },
    {
        "type": "chat",
        "platforms": chatSendPlatforms,
        "message": chatInputText,
    }
    ).then( (sendchatstuff) => {
        console.debug('Sending Chat to Streamer.Bot', sendchatstuff);
    });
    
    if (showKickMessages == true) {
        // Sends Message to Kick that are not commands
        if (chatSendPlatforms.includes('kick')) {
            if (!chatInputText.startsWith('/')) {
                streamerBotClient.doAction(
                { name : "ChatRD Kick Messages" },
                {
                    "message": chatInputText,
                }
                ).then( (sendchatstuff) => {
                    console.debug('Sending Kick Chat to Streamer.Bot', sendchatstuff);
                });
            }
        }
    }

    chatInput.value = '';
});

chatInputSend.addEventListener("click", function () {
    chatInputForm.requestSubmit();
});




async function executeModCommand(event, command) {
    event.preventDefault();

    if (streamerBotConnected == true) {
        chatInput.value = command;

        chatInputForm.requestSubmit();
    }
    else {
        
        notifyError({
            title: currentLang.streamerbotdisconnected,
            text: ``
        });
    }
}


let chatcommands = {
    "Twitch" : [
        { "name" : "/me", "usage" : "[message]"  },
        { "name" : "/announce", "usage" : "[message]"  },
        { "name" : "/clear", "usage" : ""  },
        { "name" : "/slow", "usage" : "[duration]"  },
        { "name" : "/slowoff", "usage" : ""  },
        { "name" : "/subscribers", "usage" : ""  },
        { "name" : "/subscribersoff", "usage" : ""  },
        { "name" : "/commercial", "usage" : "[duration]"  },
        { "name" : "/timeout", "usage" : "[user] [duration] [reason]"  },
        { "name" : "/untimeout", "usage" : "[user]"  },
        { "name" : "/ban", "usage" : "[user] [duration] [reason]"  },
        { "name" : "/unban", "usage" : "[user]"  },
        { "name" : "/mod", "usage" : "[user]"  },
        { "name" : "/unmod", "usage" : "[user]"  },
        { "name" : "/vip", "usage" : "[user]"  },
        { "name" : "/unvip", "usage" : "[user]"  },
        { "name" : "/shoutout", "usage" : "[user]"  },
        { "name" : "/raid", "usage" : "[user]"  },
        { "name" : "/unraid", "usage" : ""  }
    ],
    "YouTube" : [
        { "name" : "/yt/title", "usage" : "[title]"  },
        { "name" : "/yt/description", "usage" : "[description]"  },
        { "name" : "/yt/timeout", "usage" : "[user] [duration]"  },
        { "name" : "/yt/ban", "usage" : "[user]"  }
    ]
};

let chatcurrentFocus = -1;

const chatcommandslist = document.getElementById('chat-autocomplete-list');

chatInput.addEventListener('input', function () {
    const value = this.value.trim();
    chatcommandslist.innerHTML = '';
    chatcurrentFocus = -1;
    if (!value.startsWith('/')) return;
        Object.entries(chatcommands).forEach(([groupName, commands]) => {
        
        const filtered = commands.filter(cmd => cmd.name.startsWith(value));

        if (filtered.length === 0) return;

        const groupTitle = document.createElement('div');
        groupTitle.textContent = groupName;
        chatcommandslist.appendChild(groupTitle);
        filtered.forEach(cmd => {
            const item = document.createElement('div');
            item.classList.add('autocomplete-item');
            item.innerHTML = `<strong>${cmd.name}</strong><small> ${cmd.usage}</small>`;
            item.addEventListener('click', () => {
                chatInput.value = cmd.name + ' ';
                chatcommandslist.innerHTML = '';
            });
            chatcommandslist.appendChild(item);
        });
    });
});


chatInput.addEventListener('keydown', function (e) {
    const items = chatcommandslist.querySelectorAll('.autocomplete-item');
    
    if (items.length === 0) return;
    
    if (e.key === 'ArrowDown') {
        chatcurrentFocus++;
        highlightItem(items);
    }
    else if (e.key === 'ArrowUp') {
        chatcurrentFocus--;
        highlightItem(items);
    }
    
    else if (e.key === 'Enter') {
        e.preventDefault();
        if (chatcurrentFocus > -1 && items[chatcurrentFocus]) {
            items[chatcurrentFocus].click();
        }
    }
});


function highlightItem(items) {
    if (!items) return;

    items.forEach(item => item.classList.remove('active'));

    if (chatcurrentFocus >= items.length) chatcurrentFocus = 0;
    if (chatcurrentFocus < 0) chatcurrentFocus = items.length - 1;

    items[chatcurrentFocus].classList.add('active');
    items[chatcurrentFocus].scrollIntoView({ block: "nearest" });
}


document.addEventListener('click', function (e) {
    if (e.target !== chatcommandslist) {
        chatcommandslist.innerHTML = '';
    }
});