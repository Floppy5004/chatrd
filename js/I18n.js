
const lang = new URLSearchParams(window.location.search).get('lang') || 'en';
const LOCALES_PATH  = './locale';
let jsonLang;

async function loadLang() {
    console.debug(`[ChatRD][i18n] Loading locale "${lang}" ...`);
    try {
        const res = await fetch(`${LOCALES_PATH}/${lang}.json`);
        jsonLang = await res.json();
        console.debug(`[ChatRD][i18n] Locale "${lang}" loaded successfully!`);
    }
	catch (err) {
        console.error(`[ChatRD][i18n] Failed to load locale "${lang}":`, err);
    }
}

function tRD(key, vars) {
    let value = key.split('.').reduce((acc, part) => {
        if (acc == null || typeof acc !== 'object') return key;
        return acc[part];
    }, jsonLang) ?? key;

    if (vars) {
        value = value.replace(/\{(\w+)\}/g, (_, k) => k in vars ? vars[k] : `{${k}}`);
    }

    return value;
}
