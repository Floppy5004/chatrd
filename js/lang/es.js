const es = {
    streamerbotconnected: '¡Streamer.bot en línea!',
    streamerbotdisconnected: '¡Streamer.bot desconectado!',
    ttschat: 'dijo',

    chatsendmessage: 'Enviar mensaje',

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
        likes : (likes) => `envió <strong><i class="fa-solid fa-heart"></i> <em class="likecount" style="font-style: normal;">${likes}</em> likes</strong>`,
        sub : ({ months }) => ` se suscribió por <i class="fa-solid fa-star"></i> <strong>${months || 1 } ${(months && months > 1) ? 'meses' : 'mes'}</strong>`,
        gift : ({ gift, count, coins }) => ` regaló <strong>${gift} x${count}</strong> (🪙 <strong>${coins} ${(coins && coins > 1) ? 'monedas' : 'moneda'})</strong>`,
    },

    kick : {
        follow : () => ` siguió el canal`,

        sub : ({ months, tier }) => ` se suscribió por
            <strong>${months || 1 } ${months == 1 ? 'mes' : 'meses'}
            (Tier ${tier})</strong>`,

        gifted : ({ gifted, tier, total }) => ` regaló
            <strong>${total || 1 } ${total == 1 ? 'suscripción' : 'suscripciones'}
            (Tier ${tier})</strong>
            a <i class="fa-solid fa-gift"></i> <strong>${gifted}</strong>`,
        
        giftedbomb : ({ count, tier }) => ` regaló <i class="fa-solid fa-gift"></i> <strong>${count} suscripciones (Tier ${tier})</strong> a la comunidad`,

        raid : ({ viewers }) => ` hizo una raid al canal con <i class="fa-solid fa-users"></i> <strong>${viewers} espectadores</strong>`
        
    },

    patreon: {
        membership: ({ money }) => ` apoyó con una membresía ($${money})`
        
    },

    tipeeestream : {
        tip : ({ money, message }) => ` donó 🪙 <strong>${money}</strong>${message ? '<br>'+message : ''}`,
    },

    kofi : {
        donation : ({ money, message }) => ` donó 🪙 <strong>${money}</strong>${message ? '<br>'+message : ''}`,
        sub : ({ money, tier, message }) => ` se suscribió <strong>(${money}) ${tier ? '(Tier '+tier+')' : ''}</strong>${message ? '<br>'+message : ''}`,
        resub : ({ money, tier, message }) => ` renovó la suscripción <strong>${money} ${tier ? '(Tier '+tier+')' : ''}</strong>${message ? '<br>'+message : ''}`,
        order : ({ money, items }) => ` compró <strong>${items} ${items == 1 ? 'artículo' : 'artículos'} (${money == 0 ? 'Gratis' : money})`,
    },

    fourthwall : {
        someone : () => `Alguien`,

        donation : ({ money, message }) => ` donó 🪙 <strong>${money}</strong>${message ? '<br>'+message : ''}`,
        sub : ({ money }) => ` se suscribió <strong>(${money})</strong>`,

        order : ({
            money,
            firstItem,
            items,
            message,
            image,
            
        }) => ` 
        ${image ? '<br>': ''}
        compró <strong>${firstItem}</strong> ${items > 1 ? 'y <strong>'+(items - 1)+' '+((items - 1) == 1 ? 'artículo' : 'artículos')+'</strong>' : ''} 
        (${money == 0 ? 'Gratis' : money})
        ${message.trim() ? '<br>'+message : ''}
        ${image ? '</span></span><span class="image"><img src="'+image+'"></span>': ''}
        `,

        gift : ({
            money,
            firstItem,
            items,
            message,
            image,
            
        }) => ` 
        ${image ? '<br>': ''}
        regaló <strong>${items}x ${firstItem}</strong>
        (${money == 0 ? 'Gratis' : money})
        ${message.trim() ? '<br>'+message : ''}
        ${image ? '</span></span><span class="image"><img src="'+image+'"></span>': ''}
        `,


        
        drawstart : ({ gift, command, time }) => ` 
        <strong><i class="fa-solid fa-gift"></i> ¡Sorteo iniciado!</strong> 
        <br>Escribe <strong>${command}</strong> para tener la oportunidad de ganar <strong>${gift}</strong>. ¡Tienes <strong>${time} segundos</strong>!`,

        drawend : ({ winners }) => ` 
        <strong>🎉 ¡Sorteo finalizado!</strong> 
        <br>Felicitaciones <strong>${winners}</strong>`,
    },
}

