/* ----------------------- */
/* STREAMER.BOT CONNECTION */
/* ----------------------- */

const streamerBotServerAddress      = getURLParam("streamerBotServerAddress", "127.0.0.1");
const streamerBotServerPort         = getURLParam("streamerBotServerPort", "8080");

const showSpeakerbot                = getURLParam("showSpeakerbot", true);
const speakerBotServerAddress       = getURLParam("speakerBotServerAddress", "127.0.0.1");
const speakerBotServerPort          = getURLParam("speakerBotServerPort", "7580");
const speakerBotChatRead            = getURLParam("speakerBotChatRead", false);
const speakerBotEventRead           = getURLParam("speakerBotEventRead", false);
const speakerBotVoiceAlias          = getURLParam("speakerBotVoiceAlias", "Maria");
const speakerBotChatTemplate        = getURLParam("speakerBotChatTemplate", "{user} said {message}");

if (showSpeakerbot == true ) {

    const speakerBotClient = new SpeakerBotClient({
        host: speakerBotServerAddress,
        port: speakerBotServerPort,
        voiceAlias: speakerBotVoiceAlias,
        onConnect: (data) => {
            
            notifySuccess({
                title: 'Connected to Speaker.bot',
                text: ``
            });
        },
    });

}

const streamerBotClient = new StreamerbotClient({
	host: streamerBotServerAddress,
	port: streamerBotServerPort,

	onConnect: (data) => {
		console.debug(`[ChatRD][Overlay] Connected to Streamer.bot successfully!`);
		
        notifySuccess({
            title: 'Connected to Streamer.bot',
            text: ``
        });
	},
});

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