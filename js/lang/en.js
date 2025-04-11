const en = {
    streamerbotconnected: 'Streamer.bot Online!',
    streamerbotdisconnected: 'Streamer.bot Disconnected!',

    twitch : {
        follow : () => ` followed the channel.`,
        announcement : () => ` <div class="reply">📢 <strong>Announcement</strong></div>`,
        channelpoints : ({ title }) => ` <div class="reply"><i class="fa-solid fa-wand-magic-sparkles"></i> <strong>Channel Points - ${title}</strong></div>`,
        bits : ({ bits, message }) => ` cheered <i class="fa-regular fa-gem fall-and-bounce"></i> <strong>${bits} bits</strong>${message ? ' - '+message : ''}`,

        sub : ({ months, isPrime, tier }) => ` subscribed for
            ${isPrime == true ? '<i class="fa-solid fa-crown"></i>' : '<i class="fa-solid fa-star"></i>'}
            <strong>${months || 1 } ${months == 1 ? 'month' : 'months'}
            (${isPrime == true ? 'Prime' : 'Tier '+tier.toString().charAt(0)})</strong>`,

        resub : ({ months, isPrime, tier }) => ` subscribed for
            ${isPrime == true ? '<i class="fa-solid fa-crown"></i>' : '<i class="fa-solid fa-star"></i>'}
            <strong>${months || 1 } ${months == 1 ? 'month' : 'months'}
            (${isPrime == true ? 'Prime' : 'Tier '+tier.toString().charAt(0)})</strong>`,

        gifted : ({ gifted, months, tier, total }) => ` gifted
            <strong>${months || 1 } ${months == 1 ? 'month' : 'months'}
            of Tier ${tier.toString().charAt(0)} sub</strong>
            to <i class="fa-solid fa-gift"></i> <strong>${gifted}</strong>`,
        
        giftedbomb : ({ count, total, tier }) => ` gifted <i class="fa-solid fa-gift"></i> <strong>${count} Tier ${tier.toString().charAt(0)} subs</strong> to the Community, <strong>${total || 1} ${total == 1 ? 'gift' : 'gifts'} in total.</strong>`,

        raid : ({ viewers }) => ` raided the channel with <i class="fa-solid fa-users"></i> <strong>${viewers} viewers</strong>`
        
    },


    youtube : {
        superchat : ({ money, message }) => ` superchatted <i class="fa-solid fa-comments-dollar"></i> <strong>${money}</strong>
        ${message ? ' - '+message : ''}
        `,

        supersticker : ({ money, message }) => ` sent a supersticker of <i class="fa-solid fa-comments-dollar"></i> <strong>${money}</strong>
        ${message ? ' - '+message : ''}
        `,

        member : ({ months, tier }) => ` became a member for
            <i class="fa-solid fa-star"></i>
            <strong>${months || 1 } ${months == 1 ? 'month' : 'months'}
            (Tier ${tier})</strong>`,
        
        giftedmembers : ({ total, tier }) => ` gifted <i class="fa-solid fa-gift"></i> <strong>${total} Tier ${tier} memberships</strong>`,

        giftedtrainmembers : ({ gifted, tier }) => ` gifted a membership
            <strong>(${tier})</strong>
            to <i class="fa-solid fa-gift"></i> <strong>${gifted}</strong>`,
        
    },


    streamlabs : {
        tip : ({ money, message }) => ` donated 🪙 <strong>${money}</strong><!-- ${message} -->`,
    },


    streamelements : {
        tip : ({ money, message }) => ` donated 🪙 <strong>${money}</strong><!-- ${message} -->`,
    },


    tiktok : {
        follow : () => ` followed the channel.`,
        sub : ({ months }) => ` subscribed for <i class="fa-solid fa-star"></i> <strong>${months || 1 } ${months == 1 ? 'month' : 'months'}.</strong>`,
        gift : ({ gift, count, coins }) => ` gifted <strong>${gift} x${count}</strong> (🪙 <strong>${coins} ${coins == 1 ? 'coin' : 'coins'}).</strong>`,
        
    }
}