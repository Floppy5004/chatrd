/* ----------------------- */
/* STREAMER.BOT CONNECTION */
/* ----------------------- */

const streamerBotServerAddress      = getURLParam("streamerBotServerAddress", "127.0.0.1");
const streamerBotServerPort         = getURLParam("streamerBotServerPort", "8080");

const rouletteConfig = {};

let streamerBotClientActive = null;

function streamerBotConnect() {
    
    if (streamerBotClientActive) {
        try {
            console.debug("[RouletteRD][Settings] Closing previous Streamer.bot connection...");
            streamerBotClientActive.disconnect?.();
            streamerBotClientActive = null;
        } catch (err) {
            console.error("[RouletteRD][Settings] Error closing previous client:", err);
        }
    }

    streamerBotClientActive = new StreamerbotClient({
        host: streamerBotServerAddress,
        port: streamerBotServerPort,
        
        onConnect: () => {
            notifySuccess({
                title: 'RouletteRD 🤝 Streamer.bot',
                text: ``
            });
            
            (async () => {
                await loadSettingsFromStreamerBot();
                
                twitchConnection();
                youtubeConnection();
                tiktokConnection();
                kickConnection();

                generateRoulette();
            })();
            
        },
        onDisconnect: () => {
            console.debug("[RouletteRD][Settings] Streamer.bot disconnected.");
        }
    });

    return streamerBotClientActive;
}

// mantém o const fixo apontando para a primeira conexão
const streamerBotClient = streamerBotConnect();

async function loadSettingsFromStreamerBot() {
    if (!streamerBotClientActive) return Promise.resolve(null);

    const saved = await streamerBotClient.getGlobals().then((globals) => {
        console.debug('[RouletteRD][Settings][Front] Loading Global Vars...');
        const rouletterdglobal = globals.variables?.rouletterd;

        if (!rouletterdglobal) {
            return null;
        }
        try {
            return JSON.parse(rouletterdglobal.value);
        }
        catch (e) {
            return null;
        }
    });

    if (!saved) return;

    const settings = JSON.parse(saved);

    Object.assign(rouletteConfig, settings);
}

async function getStreamerInfo() {
    const requestForStreamer = await streamerBotClient.getBroadcaster();
    return requestForStreamer;
}

function getURLParam(param, defaultValue) {
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(param);

    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === null) return defaultValue;

    return value;
}

function registerPlatformHandlersToStreamerBot(handlers, logPrefix = '') {
    for (const [event, handler] of Object.entries(handlers)) {
        streamerBotClient.on(event, (...args) => {
            if (logPrefix) {
                console.debug(`${logPrefix} ${event}`, args[0]);
            }
            handler(...args);
        });
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
        autotimeout: 2500,
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