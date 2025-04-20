const ptbr = {
    streamerbotconnected: 'Streamer.bot Conectado!',
    streamerbotdisconnected: 'Streamer.bot Desconectado!',

    twitch : {
        follow : () => ` seguiu o canal.`,
        announcement : () => ` <div class="reply">📢 <strong>Anúncio</strong></div>`,
        channelpoints : ({ title }) => ` <div class="reply"><i class="fa-solid fa-wand-magic-sparkles"></i> <strong>Pontos do Canal - ${title}</strong></div>`,
        bits : ({ bits, message }) => ` doou <i class="fa-regular fa-gem fall-and-bounce"></i> <strong>${bits} bits</strong>${message ? ' - '+message : ''}`,

        sub : ({ months, isPrime, tier }) => ` se inscreveu por
            ${isPrime == true ? '<i class="fa-solid fa-crown"></i>' : '<i class="fa-solid fa-star"></i>'}
            <strong>${months || 1 } ${months == 1 ? 'mês' : 'meses'}
            (${isPrime == true ? 'Prime' : 'Tier '+tier.toString().charAt(0)})</strong>`,

        resub : ({ months, isPrime, tier }) => ` se inscreveu por
            ${isPrime == true ? '<i class="fa-solid fa-crown"></i>' : '<i class="fa-solid fa-star"></i>'}
            <strong>${months || 1 } ${months == 1 ? 'mês' : 'meses'}
            (${isPrime == true ? 'Prime' : 'Tier '+tier.toString().charAt(0)})</strong>`,

        gifted : ({ gifted, months, tier }) => ` doou
            <strong>${months || 1 } ${months == 1 ? 'mês' : 'meses'}
            de Tier ${tier.toString().charAt(0)}</strong>
            para <i class="fa-solid fa-gift"></i> <strong>${gifted}</strong>`,
        
        giftedbomb : ({ count, total, tier }) => ` doou <i class="fa-solid fa-gift"></i> <strong>${count} inscrições Tier ${tier.toString().charAt(0)}</strong> para a Comunidade, totalizando <strong>${total || 1} ${total == 1 ? 'doação' : 'doações'}.</strong>`,
            
        raid : ({ viewers }) => ` raidou o canal com <i class="fa-solid fa-users"></i> <strong>${viewers} pessoas</strong>`
        
    },


    youtube : {
        superchat : ({ money, message }) => ` fez um superchat de <i class="fa-solid fa-comments-dollar"></i> <strong>${money}</strong>
        ${message ? ' - '+message : ''}
        `,

        supersticker : ({ money, message }) => ` enviou um superchat de <i class="fa-solid fa-comments-dollar"></i> <strong>${money}</strong>
        ${message ? ' - '+message : ''}
        `,

        member : ({ months, tier }) => ` se inscreveu por
            <i class="fa-solid fa-star"></i>
            <strong>${months || 1 } ${months == 1 ? 'mês' : 'meses'}
            (Tier ${tier})</strong>`,
        
        giftedmembers : ({ total, tier }) => ` doou <i class="fa-solid fa-gift"></i> <strong>${total} inscrições (Tier ${tier})</strong>`,

        giftedtrainmembers : ({ gifted, tier }) => ` doou uma assinatura
            <strong>(${tier})</strong>
            para <i class="fa-solid fa-gift"></i> <strong>${gifted}</strong>`,
        
    },


    streamlabs : {
        tip : ({ money, message }) => ` doou 🪙 <strong>${money}</strong><!-- ${message} -->`,
    },


    streamelements : {
        tip : ({ money, message }) => ` doou 🪙 <strong>${money}</strong><!-- ${message} -->`,
    },


    tiktok : {
        follow : () => ` seguiu o canal.`,
        sub : ({ months }) => ` se inscreveu por <i class="fa-solid fa-star"></i> <strong>${months || 1 } ${months == 1 ? 'mês' : 'meses'}.</strong>`,
        gift : ({ gift, count, coins }) => ` doou <strong>${gift} x${count}</strong> (🪙 <strong>${coins} ${coins == 1 ? 'moeda' : 'moedas'}).</strong>`,
        
    }
}