const en = {
    streamerbotconnected: 'Streamer.bot Online!',
    streamerbotdisconnected: 'Streamer.bot Disconnected!',

    twitch : {
        firstMessage : () => `First chatter`,
        follow : () => ` followed the channel`,
        announcement : () => ` <div class="reply">📢 <strong>Announcement</strong></div>`,
        channelpoints : ({ title }) => ` <div class="reply"><i class="fa-solid fa-wand-magic-sparkles"></i> <strong>Channel Points - ${title}</strong></div>`,
        bits : ({ bits, message }) => ` cheered <i class="fa-regular fa-gem fall-and-bounce"></i> <strong>${bits} bits</strong>${message ? '<br>'+message : ''}`,

        sub : ({ months, isPrime, tier }) => ` subscribed for
            ${isPrime == true ? '<i class="fa-solid fa-crown"></i>' : '<i class="fa-solid fa-star"></i>'}
            <strong>${months || 1 } ${months == 1 ? 'month' : 'months'}
            (${isPrime == true ? 'Prime' : 'Tier '+tier.toString().charAt(0)})</strong>`,

        resub : ({ months, isPrime, tier, message }) => ` subscribed for
            ${isPrime == true ? '<i class="fa-solid fa-crown"></i>' : '<i class="fa-solid fa-star"></i>'}
            <strong>${months || 1 } ${months == 1 ? 'month' : 'months'}
            (${isPrime == true ? 'Prime' : 'Tier '+tier.toString().charAt(0)})</strong>
            ${message ? '<br>'+message : '' }`,

        gifted : ({ gifted, months, tier }) => ` gifted
            <strong>${months || 1 } ${months == 1 ? 'month' : 'months'}
            of Tier ${tier.toString().charAt(0)} ${months == 1 ? 'sub' : 'subs'}</strong>
            to <i class="fa-solid fa-gift"></i> <strong>${gifted}</strong>`,
        
        giftedbomb : ({ count, total, tier }) => ` gifted <i class="fa-solid fa-gift"></i> <strong>${count} subs (Tier ${tier.toString().charAt(0)})</strong> to the Community, <strong>${total || 1} ${total == 1 ? 'gift' : 'gifts'} in total</strong>`,

        raid : ({ viewers }) => ` raided the channel with <i class="fa-solid fa-users"></i> <strong>${viewers} viewers</strong>`
        
    },


    youtube : {
        superchat : ({ money, message }) => ` superchatted <i class="fa-solid fa-comments-dollar"></i> <strong>${money}</strong>
        ${message ? '<br>'+message : ''}
        `,

        supersticker : ({ money, sticker }) => ` 
        ${sticker ? '<br>': ''}
        sent a supersticker of <i class="fa-solid fa-comments-dollar"></i> <strong>${money}</strong>
        ${sticker ? '</span></span><span class="sticker"><img src="'+sticker+'"></span>': ''}
        `,

        member : ({ months, tier, message }) => ` became a member for
            <i class="fa-solid fa-star"></i>
            <strong>${months || 1 } ${months && months > 1 ? 'months' : 'month'}
            (Tier ${tier})</strong>
            ${message ? '<br>'+message : ''}`,
        
        giftedmembers : ({ total, tier }) => ` gifted <i class="fa-solid fa-gift"></i> <strong>${total} ${total == 1 ? 'membership' : 'memberships'} (Tier ${tier}) to the channel</strong>`,

        giftedtrainmembers : ({ gifted, tier }) => ` gifted a membership
            <strong>(${tier})</strong>
            to <i class="fa-solid fa-gift"></i> <strong>${gifted}</strong>`,
        
    },


    streamlabs : {
        tip : ({ money, message }) => ` donated 🪙 <strong>${money}</strong>${message ? '<br>'+message : ''}`,
    },


    streamelements : {
        tip : ({ money, message }) => ` donated 🪙 <strong>${money}</strong>${message ? '<br>'+message : ''}`,
    },


    tiktok : {
        follow : () => ` followed the channel`,
        sub : ({ months }) => ` subscribed for <i class="fa-solid fa-star"></i> <strong>${months || 1 } ${(months && months > 1) ? 'months' : 'month'}</strong>`,
        gift : ({ gift, count, coins }) => ` gifted <strong>${gift} x${count}</strong> (🪙 <strong>${coins} ${(coins && coins > 1) ? 'coins' : 'coin'})</strong>`,
        
    }
}