const es = {
    streamerbotconnected: '¡Streamer.bot en línea!',
    streamerbotdisconnected: '¡Streamer.bot desconectado!',

    twitch : {
        firstMessage : () => `Primeira mensaje`,
        follow : () => ` siguió el canal`,
        announcement : () => ` <div class="reply">📢 <strong>Anuncio</strong></div>`,
        channelpoints : ({ title }) => ` <div class="reply"><i class="fa-solid fa-wand-magic-sparkles"></i> <strong>Puntos del canal - ${title}</strong></div>`,
        bits : ({ bits, message }) => ` envió <i class="fa-regular fa-gem fall-and-bounce"></i> <strong>${bits} bits</strong>${message ? '<br>'+message : ''}`,

        sub : ({ months, isPrime, tier }) => ` se suscribió por
            ${isPrime == true ? '<i class="fa-solid fa-crown"></i>' : '<i class="fa-solid fa-star"></i>'}
            <strong>${months || 1 } ${months == 1 ? 'mes' : 'meses'}
            (${isPrime == true ? 'Prime' : 'Tier '+tier.toString().charAt(0)})</strong>`,

        resub : ({ months, isPrime, tier, message }) => ` se volvió a suscribir por
            ${isPrime == true ? '<i class="fa-solid fa-crown"></i>' : '<i class="fa-solid fa-star"></i>'}
            <strong>${months || 1 } ${months == 1 ? 'mes' : 'meses'}
            (${isPrime == true ? 'Prime' : 'Tier '+tier.toString().charAt(0)})</strong>
            ${message ? '<br>'+message : '' }`,

        gifted : ({ gifted, months, tier }) => ` regaló
            <strong>${months || 1 } ${months == 1 ? 'mes' : 'meses'}
            de Tier ${tier.toString().charAt(0)} ${months == 1 ? 'suscripción' : 'suscripciones'}</strong>
            a <i class="fa-solid fa-gift"></i> <strong>${gifted}</strong>`,

        giftedbomb : ({ count, total, tier }) => ` regaló <i class="fa-solid fa-gift"></i> <strong>${count} suscripciones (Tier ${tier.toString().charAt(0)})</strong> a la comunidad, <strong>${total || 1} ${total == 1 ? 'regalo' : 'regalos'} en total</strong>`,

        raid : ({ viewers }) => ` hizo una raid al canal con <i class="fa-solid fa-users"></i> <strong>${viewers} espectadores</strong>`
    },

    youtube : {
        superchat : ({ money, message }) => ` envió un superchat <i class="fa-solid fa-comments-dollar"></i> <strong>${money}</strong>
        ${message ? '<br>'+message : ''}
        `,

        supersticker : ({ money, sticker }) => ` 
        ${sticker ? '<br>': ''}
        envió un supersticker de <i class="fa-solid fa-comments-dollar"></i> <strong>${money}</strong>
        ${sticker ? '</span></span><span class="sticker"><img src="'+sticker+'"></span>': ''}
        `,

        member : ({ months, tier, message }) => ` se hizo miembro por
            <i class="fa-solid fa-star"></i>
            <strong>${months || 1 } ${months && months > 1 ? 'meses' : 'mes'}
            (Tier ${tier})</strong>
            ${message ? '<br>'+message : ''}`,

        giftedmembers : ({ total, tier }) => ` regaló <i class="fa-solid fa-gift"></i> <strong>${total} ${total == 1 ? 'membresía' : 'membresías'} (Tier ${tier}) al canal</strong>`,

        giftedtrainmembers : ({ gifted, tier }) => ` regaló una membresía
            <strong>(Tier ${tier})</strong>
            a <i class="fa-solid fa-gift"></i> <strong>${gifted}</strong>`,
    },

    streamlabs : {
        tip : ({ money, message }) => ` donó 🪙 <strong>${money}</strong>${message ? '<br>'+message : ''}`,
    },

    streamelements : {
        tip : ({ money, message }) => ` donó 🪙 <strong>${money}</strong>${message ? '<br>'+message : ''}`,
    },

    tiktok : {
        follow : () => ` siguió el canal`,
        sub : ({ months }) => ` se suscribió por <i class="fa-solid fa-star"></i> <strong>${months || 1 } ${(months && months > 1) ? 'meses' : 'mes'}</strong>`,
        gift : ({ gift, count, coins }) => ` regaló <strong>${gift} x${count}</strong> (🪙 <strong>${coins} ${(coins && coins > 1) ? 'monedas' : 'moneda'})</strong>`,
    }
}
