let streamerBotClient = null
let streamerBotConnected = false;

let resetButtonDefault;
let spinButtonDefault;

/* -------------------------
   Salvar configurações 
-------------------------- */


function saveSettingsToStreamerBot(data) {
    if (!streamerBotClient) return;
    
    const checkboxes = document.querySelectorAll("input[type=checkbox]:not(.avoid)");
    const textfields = document.querySelectorAll("input[type=text]:not(.avoid)");
    const numberfields = document.querySelectorAll("input[type=number]:not(.avoid)");
    const colorfields = document.querySelectorAll("input[type=color]:not(.avoid)");
    const selects = document.querySelectorAll("select:not(.avoid)");
    const ranges = document.querySelectorAll("input[type=range]:not(.avoid)");
    const settings = {};

    checkboxes.forEach(cb => settings[cb.name] = cb.checked);
    ranges.forEach(r => settings[r.name] = r.value);
    textfields.forEach(tf => settings[tf.name] = tf.value);
    numberfields.forEach(nf => settings[nf.name] = nf.value);
    colorfields.forEach(cf => settings[cf.name] = cf.value);
    selects.forEach(s => settings[s.name] = s.value);

    const json = JSON.stringify(JSON.stringify(settings));

    streamerBotClient.doAction({ name: "Save RouletteRD" }, {
        "rouletterd": json,
    }).then((res) => {
        console.debug('[RouletteRD][Settings] Saving Roulette Settings... ', res);
        generateUrl();
    });
}

async function loadSettingsFromStreamerBot() {
    if (!streamerBotClient) return Promise.resolve(null);

    const saved = await streamerBotClient.getGlobal("rouletterd").then((res) => {

        console.debug('[RouletteRD][Settings] Loading Global Vars...');
        const rouletterdglobal = res.variable;

        if (!rouletterdglobal) {
            console.warn('[RouletteRD][Settings] Global variable "rouletterd" not found.');
            return null;
        }
        try {
            return JSON.parse(rouletterdglobal.value);
        }
        catch (e) {
            console.error('[RouletteRD][Settings] Failed to parse RouletteRD Settings JSON', e);
            return null;
        }
    });

    if (!saved) return;

    const settings = JSON.parse(saved);
    console.debug('[RouletteRD][Settings] Settings found and parsed.', settings);

    Object.keys(settings).forEach(key => {
        const input = document.querySelector(`[name="${key}"]`);
        
        if (key == "lang") {
            (async () => {
                await i18n.setLocale( settings[key] );

                resetButtonDefault = document.querySelector('#resetRoulette').innerHTML;
                spinButtonDefault = document.querySelector('#spinRoulette').innerHTML;

            })();
        }

        if (input) {

            if (input.type === "checkbox") {
                input.checked = settings[key];

                if (input.id === "runAction") {
                    const actionsMenu = document.querySelector('#streamerBotActions');
                    const status = input.checked;
                    if (status) { actionsMenu.disabled = false; }
                    else { actionsMenu.disabled = true; }
                }

            }
            else {
                input.value = settings[key];
            }
        }
    });

    document.querySelector('#speed-value').textContent = document.querySelector('#speed').value;
    document.querySelector('#duration-value').textContent = Math.floor(document.querySelector('#duration').value / 1000) + 's';
}


async function saveStreamerBotSettings() {
    const streamerBotServerAddress = document.querySelector('input[type=text][name=streamerBotServerAddress]').value;
    const streamerBotServerPort = document.querySelector('input[type=text][name=streamerBotServerPort]').value;

    const settings = {
        streamerBotServerAddress : streamerBotServerAddress,
        streamerBotServerPort : streamerBotServerPort
    }

    localStorage.setItem("rouletterdStreamerBotSettings", JSON.stringify(settings));
}

async function loadStreamerBotSettings() {
    const saved = localStorage.getItem("rouletterdStreamerBotSettings");
    if (!saved) return;

    const settings = JSON.parse(saved);

    Object.keys(settings).forEach(key => {
        const input = document.querySelector(`[type=text][name="${key}"]`);
        input.value = settings[key];
    });
}





/* -------------------------
   Configurar eventos para salvar mudanças
-------------------------- */
function pushChangeEvents() {
    const checkboxes = document.querySelectorAll("input[type=checkbox]:not(.avoid)");
    const textfields = document.querySelectorAll("input[type=text]:not(.avoid)");
    const numberfields = document.querySelectorAll("input[type=number]:not(.avoid)");
    const colorfields = document.querySelectorAll("input[type=color]:not(.avoid)");
    const selects = document.querySelectorAll("select:not(.avoid)");
    const ranges = document.querySelectorAll("input[type=range]:not(.avoid)");

    [...checkboxes, ...textfields, ...numberfields, ...colorfields, ...selects, ...ranges].forEach(el => {
        el.addEventListener('change', saveSettingsToStreamerBot);
        el.addEventListener('input', saveSettingsToStreamerBot);
    });

    const runAction = document.querySelector('#runAction');
    runAction.addEventListener('change', function () {        
        const actionsMenu = document.querySelector('#streamerBotActions');
        const status = runAction.checked;
        if (status) {
            actionsMenu.disabled = false;
        }
        else {
            actionsMenu.disabled = true;
        }

    });

    document.querySelector('#speed').addEventListener('input', function () {
        document.querySelector('#speed-value').textContent = this.value;
    });

    document.querySelector('#duration').addEventListener('input', function () {
        document.querySelector('#duration-value').textContent = Math.floor(this.value / 1000) + 's';
    });
}

/* -------------------------
   Gerar URL de preview
-------------------------- */
function generateUrl() {
    const streamerBotServerAddress = document.querySelector('input[type=text][name=streamerBotServerAddress]').value;
    const streamerBotServerPort = document.querySelector('input[type=text][name=streamerBotServerPort]').value;

    const outputField = document.getElementById("outputUrl");
    outputField.value = '';

    const baseUrlObj = new URL(window.location.href);

    // Garante que o pathname termine com "chat.html"
    if (!baseUrlObj.pathname.endsWith("roulette.html")) {
        if (baseUrlObj.pathname.endsWith("/") || baseUrlObj.pathname === "") {
            baseUrlObj.pathname += "roulette.html";
        } else if (baseUrlObj.pathname.endsWith("index.html")) {
            baseUrlObj.pathname = baseUrlObj.pathname.replace(/index\.html$/, "roulette.html");
        } else {
            baseUrlObj.pathname += "/roulette.html";
        }
    }

    const baseUrl = baseUrlObj.toString();

    var finalURL = baseUrl + `?streamerBotServerAddress=${streamerBotServerAddress}&streamerBotServerPort=${streamerBotServerPort}`;
    outputField.value = finalURL;
    const iframe = document.querySelector('#preview iframe');
    if (iframe) { iframe.src = finalURL; }

    resetRoulette('soft');
    fireResetEvent();
}


/* -------------------------
   Copiar URL para clipboard
-------------------------- */
function copyUrl() {
    const output = document.getElementById("outputUrl");
    const value = output.value;
    const button = document.querySelector('#copyUrl');
    const buttonDefaultText = button.textContent;

    navigator.clipboard.writeText(value).then(() => {
        button.textContent = '👍';
        button.style.backgroundColor = "#00dd63";

        setTimeout(() => {
            button.textContent = buttonDefaultText;
            button.removeAttribute('style');
        }, 3000);
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}

let buttonInterval = null;

function spinRoulette() {

    const button = document.querySelector('#spinRoulette');
    const resetButton = document.querySelector('#resetRoulette');
    const duration = document.querySelector('#duration').value;
    const isDisabled = button.disabled;

    if (isDisabled) return;

    streamerBotClient.doAction({ name: "Ready RouletteRD" }, { }).then((res) => {
        console.debug('[RouletteRD][Settings] Readying Roulette...', res);
    });

    button.textContent = '👀';
    button.style.backgroundColor = "#DBB048";
    button.style.color = "#121212";
    button.disabled = true;

    buttonInterval = setTimeout(() => {
        const runAction = document.querySelector('#runAction');
        const actionsMenu = document.querySelector('#streamerBotActions');
        const status = runAction.checked;
        const action = actionsMenu.value;

        if (status) {
            streamerBotClient.doAction({ id: action }, { }).then((res) => {
                console.debug(`[RouletteRD][Settings] Running Action ${action}...`, res);
            });
        }

        button.textContent = '🔥';
        resetButton.classList.add('animate__animated', 'animate__pulse', 'animate__infinite');
        resetButton.style.backgroundColor = "#FF0000";
        resetButton.style.color = "#FFF";

        const winnerMessage = document.querySelector('#winnerMessage').textContent;

        streamerBotClient.doAction({ name: "Post RouletteRD" }, {
            "winnerMessage" : winnerMessage
        }).then((res) => {
            console.debug('[RouletteRD][Settings] Announcing Roulette Winners...', res);
        });
    }, duration);
}

function resetRoulette(action = false) {
    
    const button = document.querySelector('#resetRoulette');
    const spinButton = document.querySelector('#spinRoulette');

    /*streamerBotClient.doAction({ name: "Reset RouletteRD" }, { }).then((res) => {
        console.debug('[RouletteRD][Settings] Resetting Roulette...', res);
    });*/

    clearInterval(buttonInterval);

    if (action === 'soft') {
        button.removeAttribute('style');
        button.classList.remove('animate__animated', 'animate__pulse', 'animate__infinite');
        button.innerHTML = DOMPurify.sanitize( resetButtonDefault );

        spinButton.disabled = false;
        spinButton.removeAttribute('style');
        spinButton.innerHTML = DOMPurify.sanitize( spinButtonDefault );
    }

    else {
        button.style.backgroundColor = "#00dd63";
        button.style.color = "#FFF";
        button.classList.remove('animate__animated', 'animate__pulse', 'animate__infinite');
        button.textContent = '👍';

        spinButton.disabled = false;
        spinButton.removeAttribute('style');
        spinButton.innerHTML = DOMPurify.sanitize( spinButtonDefault );

        setTimeout(() => {
            button.removeAttribute('style');
            button.innerHTML = DOMPurify.sanitize( resetButtonDefault );
        }, 1500);
    }

}


function fireResetEvent() {
    streamerBotClient.doAction({ name: "Reset RouletteRD" }, { }).then((res) => {
        console.debug('[RouletteRD][Settings] Resetting Roulette...', res);
    });
}


async function registerEvents() {
    const rouletteHandlers = {
        'General.Custom': (response) => {
            (async () => {

                if (response.data?.eventName == 'RouletteRD.Reset') {
                    resetRoulette();
                }

            })();
        }
    };

    registerPlatformHandlersToStreamerBot(rouletteHandlers, '[RouletteRD][Events]');
}


async function getStreamerBotActions() {
    const response = await streamerBotClient.getActions();
    const select = document.getElementById('streamerBotActions');
    response.actions.forEach(action => {
        const option = document.createElement('option');
        option.value = action.id;
        option.textContent = action.name;
        select.appendChild(option);
    });
}



/* -------------------------
   Conexão com Streamer.bot
-------------------------- */
function streamerBotConnect() {
    const streamerBotStatus = document.getElementById('streamerBotStatus');

    const streamerBotServerAddress = document.querySelector('input[type=text][name=streamerBotServerAddress]').value;
    const streamerBotServerPort = document.querySelector('input[type=text][name=streamerBotServerPort]').value;

    // 🔎 Se já existe um cliente, encerra a tentativa anterior
    if (streamerBotClient) {
        try {
            console.debug("[RouletteRD][Settings] Closing previous Streamer.bot connection...");
            streamerBotClient.disconnect?.(); // usa se existir
            streamerBotClient = null;
        } catch (err) {
            console.error("[RouletteRD][Settings] Error closing previous client:", err);
        }
    }

    streamerBotClient = new StreamerbotClient({
        host: streamerBotServerAddress,
        port: streamerBotServerPort,
        onConnect: () => {
            console.debug(`[RouletteRD][Settings] Connected to Streamer.bot successfully!`);
            streamerBotConnected = true;

            streamerBotStatus.classList.add('connected');
            
            getStreamerBotActions();
            loadSettingsFromStreamerBot();
            pushChangeEvents();
            generateUrl();
        },
        onDisconnect: () => {
            streamerBotStatus.classList.remove('connected');
            streamerBotConnected = false;
            console.debug(`[RouletteRD][Settings] Streamer.bot Disconnected!`);
        }
    });
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




/* -------------------------
   Inicialização
-------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    loadStreamerBotSettings();
    setTimeout(() => {
        streamerBotConnect();
        registerEvents();
    }, 1000);

    const streamerBotServerAddressSwitch = document.querySelector('input[type=text][name=streamerBotServerAddress]');
    const streamerBotServerPortSwitch = document.querySelector('input[type=text][name=streamerBotServerPort]');

    streamerBotServerAddressSwitch.addEventListener('input', () => {
        saveStreamerBotSettings();
        streamerBotConnect();
        generateUrl();
    });
    
    streamerBotServerPortSwitch.addEventListener('input', () => {
        saveStreamerBotSettings();
        streamerBotConnect();
        generateUrl();
    });

});