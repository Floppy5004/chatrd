/* ----------------------- */
/*     MOCKUP SYSTEM       */
/* ----------------------- */

let mockupInterval = null;
let isMockupActive = false;
const mockupDelay = 2500; // 2 seconds between events
let mockupConnectionState = false; // Track mock connection state

// Sample data for mockup events
const mockData = {
    avatars: [
        'https://static-cdn.jtvnw.net/user-default-pictures-uv/dbdc9198-def8-11e9-8681-784f43822e80-profile_image-300x300.png',
        'https://static-cdn.jtvnw.net/user-default-pictures-uv/13e5fa74-defa-11e9-809c-784f43822e80-profile_image-300x300.png',
        'https://static-cdn.jtvnw.net/user-default-pictures-uv/215b7342-def9-11e9-9a66-784f43822e80-profile_image-300x300.png',
        'https://static-cdn.jtvnw.net/user-default-pictures-uv/ce57700a-def9-11e9-842d-784f43822e80-profile_image-300x300.png'
    ],
    users: [
        { name: 'Ninja' },
        { name: 'SypherPK' },
        { name: 'CouRageJD', },
        { name: 'Gaules' },
        { name: 'Nadeshot' },
        { name: 'WILDCAT', },
        { name: 'NickEh30' },
        { name: 'LEGIQN' },
        { name: 'moistcr1tikal' },
        { name: 'FISHNOTHING' },
        { name: 'smii7y' },
        { name: 'kinggothalion', },
        { name: 'harrisheller' },
        { name: 'kaicenat' },
        { name: 'caseoh_' }
    ],
    messages: [
        "Hey everyone! How's the stream going?",
        "This game looks awesome!",
        "LOL that was hilarious",
        "GG WP!",
        "When are you playing Minecraft next?",
        "Love the new overlay!",
        "First time watching, this is great!",
        "Can you explain that strategy again?",
        "Greetings from Germany!",
        "What's your favorite game?",
    
        "Let's gooooo!",
        "That clutch tho 🔥",
        "I can't stop laughing 😂",
        "You just destroyed them!",
        "What a play!",
        "Did anyone else see that??",
        "Streamer luck confirmed 😆",
        "Please do that move again!",
        "Bro you cracked?",
        "This chat is wild tonight",
    
        "Can you shout out my friend?",
        "What setup are you using?",
        "Mic sounds super clean",
        "W stream fr",
        "Hydrate check! 💧",
        "Pet the dog on stream pls",
        "That reaction time 😳",
        "You're my comfort streamer 🧡",
        "This game brings back memories",
        "Why is this so intense omg",
    
        "Chat, what’s your favorite snack?",
        "That edit was slick",
        "Mobile gang where you at?",
        "Sheeesh 🥶",
        "This is better than Netflix",
        "How long you been streaming?",
        "Can we get some hype in the chat?",
        "I wish I was this good",
        "Can mods ban that guy?",
        "Backseat gaming intensifies 😅",
    
        "This reminds me of old-school Twitch",
        "Nice aim bot... jk (I hope)",
        "Wanna 1v1?",
        "The vibes are immaculate today",
        "Who else is vibing with the music?",
        "That moment needs to be clipped",
        "Streamer out here cooking 🔥",
        "Yo, this community is chill",
        "Day made. Thanks for the laughs!",
        "Okay but that was actually insane"
    ],
    
    emotes: [
        {
            "id": "emotesv2_9eade28238d64e83b0219a9025d4692d",
            "type": "Twitch",
            "name": "AnotherRecord",
            "startIndex": 24,
            "endIndex": 36,
            "imageUrl": "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_9eade28238d64e83b0219a9025d4692d/default/dark/2.0"
        },
        {
            "id": "301428702",
            "type": "Twitch",
            "name": "BOP",
            "startIndex": 20,
            "endIndex": 22,
            "imageUrl": "https://static-cdn.jtvnw.net/emoticons/v2/301428702/default/dark/2.0"
        },
        {
            "id": "354",
            "type": "Twitch",
            "name": "4Head",
            "startIndex": 14,
            "endIndex": 18,
            "imageUrl": "https://static-cdn.jtvnw.net/emoticons/v2/354/default/dark/2.0"
        },
        {
            "id": "425618",
            "type": "Twitch",
            "name": "LUL",
            "startIndex": 10,
            "endIndex": 12,
            "imageUrl": "https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/2.0"
        },
        {
            "id": "305954156",
            "type": "Twitch",
            "name": "PogChamp",
            "startIndex": 0,
            "endIndex": 7,
            "imageUrl": "https://static-cdn.jtvnw.net/emoticons/v2/305954156/default/dark/2.0"
        }
    ],
    emotesInsideMessages: [
        'PogChamp',
        'LUL',
        'BOP',
        '4Head',
        'AnotherRecord'
    ],
    rewards: [
        'Highlight My Message',
        'Play Sound Effect',
        'Choose Next Game',
        'Song Request',
        'Dad Joke',
        'Hydration Check'
    ],
    announcements: [
        'Welcome to the stream everyone!',
        'Don\'t forget to follow for stream notifications!',
        'We\'re going to raid someone awesome after this game!',
        'Thanks for all the subs today!',
        'New emotes coming next week!'
    ],
    badges: [
        { "imageUrl": "https://static-cdn.jtvnw.net/badges/v1/28ac9d77-bba9-4281-aba9-716081aee210/3" },
        { "imageUrl": "https://static-cdn.jtvnw.net/badges/v1/c4a29737-e8a5-4420-917a-314a447f083e/3" },
        { "imageUrl": "https://static-cdn.jtvnw.net/badges/v1/ae1c6c62-c057-4fad-a1d4-663bf988701f/3" },
        { "imageUrl": "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/3" },
        { "imageUrl": "https://static-cdn.jtvnw.net/badges/v1/2de71f4f-b152-4308-a426-127a4cf8003a/3" },
        { "imageUrl": "https://static-cdn.jtvnw.net/badges/v1/4149750c-9582-4515-9e22-da7d5437643b/3" },
        { "imageUrl": "https://static-cdn.jtvnw.net/badges/v1/5864739a-5e58-4623-9450-a2c0555ef90b/3" }
    ],
    superstickers: [
        { "imageUrl": "https://lh3.googleusercontent.com/G2OgWJkuvSullUPp2i09zG_WR0IpQu-6Ti4pFXn_FJ1OkR6zU5GdiP9cBavimQopETyojInsRCe8uefjJBqn=s148-rwa" },
        { "imageUrl": "https://lh3.googleusercontent.com/-21C0x6zYcDxpJVYKl8CCKroyjW2Hdvh2FWBipCTFhonaPy2cSJZWTGvmjsoBJu-LedOHQrw1Qu7TYXxIlxv=s148-rwa" },
        { "imageUrl": "https://lh3.googleusercontent.com/kpwCxm65pv0p2YMunCEHaYcD1A0TnwTg4uSJMDsBriu6cZSGOAjXw_CPvV5PajvWEq1LANypR_WHRpA7HU8=s148-rwa" },
        { "imageUrl": "https://lh3.googleusercontent.com/y4t53UFh4eWO9FmuXgELtXn0cWsZEAJOWCExbumx2vcNclm2VYJkd4Omo7lKLxOg78zaXBmukrN0ONPRDwM=s148-rwa" },
        { "imageUrl": "https://lh3.googleusercontent.com/aQTC6r0gjuns5TwJTMoA_mqOH3mizXxzlAJqh_CpLx8lWyKiUgS_EjTATRTX0Qzm8MlZyXAg7r6kFzlH8HgS=s148-rwa" },
        { "imageUrl": "https://lh3.googleusercontent.com/oUIeg07YsvEuUcF7wOg6U3o1dOCANoBWuF1DYr2jGPFOyQ-bEFRiFm-6gU3urJPaX_AqtZgsNpGb0KNimA=s148-rwa" },
        { "imageUrl": "https://lh3.googleusercontent.com/gauEuKs0cTW_YrtkKit45UrShY7KuK2-Kh9RV3H3Eirtx2KY6PHLeaDHbFz-l9OGMYISF0F57Wk2lzTiHw=s148-rwa" },
        { "imageUrl": "https://lh3.googleusercontent.com/PQlPxOdeVk_oY3D_Ow0JRXvV3AbVIEoApzvenbfgsAHoLF4_EgxCV7Dsd-kqMsCAqhHhNG0vUY2Ssoa03iW_=s148-rwa" },
        { "imageUrl": "https://lh3.googleusercontent.com/Cmmj_3s8DpgpuHdOhUmIZQU0Gmex9IISD2SNk4UQY-HA1jHfSPYCk6-gZ-PEpLKGHgyEfZNRCiAV_lHC_Q=s148-rwa" },
    ],
    tiktokGifts: [
        { name: "Rose", coins: 1 },
        { name: "Finger Heart", coins: 5 },
        { name: "TikTok", coins: 10 },
        { name: "Confetti", coins: 100 },
        { name: "Galaxy", coins: 1000 }
    ]
};

// Function to generate a random mockup event
function generateMockEvent() {
    const eventTypes = [
        'twitch-chat', 'twitch-chat', 'twitch-chat', 'twitch-chat', 'twitch-chat', 
        'twitch-chat', 'twitch-chat', 'twitch-chat', 'twitch-chat', 'twitch-chat', 
        
        'twitch-follow', 'twitch-bits', 'twitch-sub', 'twitch-resub', 
        'twitch-giftsub', 'twitch-giftbomb', 'twitch-raid',
        'twitch-announcement', 'twitch-reward', 'twitch-gigantifyemote',

        'youtube-chat', 'youtube-chat', 'youtube-chat', 'youtube-chat', 'youtube-chat', 
        'youtube-chat', 'youtube-chat', 'youtube-chat', 'youtube-chat', 'youtube-chat', 
        'youtube-superchat', 'youtube-supersticker', 'youtube-newsponsor', 'youtube-membermilestone', 'youtube-membergift',

        'tiktok-chat', 'tiktok-chat', 'tiktok-chat', 'tiktok-chat', 'tiktok-chat', 
        'tiktok-chat', 'tiktok-chat', 'tiktok-chat', 'tiktok-chat', 'tiktok-chat', 
        'tiktok-follow', 'tiktok-sub', 'tiktok-gift',

        'streamlabs-tip', 'streamelements-tip',
    ];
    
    // Select random event type and user
    
    const fakeAvatar = mockData.avatars[Math.floor(Math.random() * mockData.avatars.length)];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const user = mockData.users[Math.floor(Math.random() * mockData.users.length)];
    const announcement = mockData.announcements[Math.floor(Math.random() * mockData.announcements.length)];
    const reward = mockData.rewards[Math.floor(Math.random() * mockData.rewards.length)];
    const emote = mockData.emotes[Math.floor(Math.random() * mockData.emotes.length)];
    const emotesInsideMessages = mockData.emotesInsideMessages[Math.floor(Math.random() * mockData.emotesInsideMessages.length)];
    const messagetext = mockData.messages[Math.floor(Math.random() * mockData.messages.length)];
    const messageId = randomString(40);

    const shuffledBadges = [...mockData.badges].sort(() => Math.random() - 0.5);
    const badgeCount = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const badgeschosen = shuffledBadges.slice(0, badgeCount);

    const randomIndex = Math.floor(Math.random() * mockData.superstickers.length);
    const randomStickerUrl = mockData.superstickers[randomIndex].imageUrl;

    const tiktokGift = mockData.tiktokGifts[Math.floor(Math.random() * mockData.tiktokGifts.length)];

    const firstMessage = Math.random() < 0.1;
    
    switch(eventType) {
        case 'twitch-chat' :
            
            var data = {
                emotes: mockData.emotes,
                message: {
                    username: user.name.toLowerCase(),
                    color: randomColor(),
                    displayName: user.name,
                    message: messagetext + ' ' + emotesInsideMessages,
                    firstMessage: firstMessage,
                    badges: badgeschosen,
                },
                messageId: messageId,
            };            

            const ifHasReply = Math.random() < 0.05;
            if (ifHasReply) {
                data.message.isReply = true;
                var replier = mockData.users[Math.floor(Math.random() * mockData.users.length)];
                data.message.reply = {
                    userName: replier.name,
                    msgBody: mockData.messages[Math.floor(Math.random() * mockData.messages.length)]
                };
            }

            const ifHasShared = Math.random() < 0.05;
            if (ifHasShared) {
                data.message.isSharedChat = true;
                var sharedParentUser = mockData.users[Math.floor(Math.random() * mockData.users.length)];

                data.sharedChat = {
                    sourceRoom: {
                        name: sharedParentUser.name
                    }
                };
            }


            twitchChatMessage(data);

        break;
        case 'twitch-follow' :

            var data = {
                user_id: user.name.toLowerCase(),
                user_name: user.name,
            };  

            twitchFollowMessage(data);
            
        break;
        case 'twitch-bits' :

            var data = {
                
                emotes: mockData.emotes,
                user: {
                    id: user.name.toLowerCase(),
                    name: user.name
                },
                message: {
                    bits: Math.floor(Math.random() * 10000) + 1,
                    message: messagetext,
                },
                messageId: messageId,
            }; 

            twitchBitsMessage(data);

        break;
        case 'twitch-sub' :

            var data = {
                user: {
                    id: user.name.toLowerCase(),
                    name: user.name
                },
                duration_months: 1,
                sub_tier: parseInt(Math.floor(Math.random() * 3) + 1),
                isPrime: Math.random() < 0.1,
                text: messagetext
            }

            twitchSubMessage(data);

        break;
        case 'twitch-resub' :

            var data = {
                user: {
                    id: user.name.toLowerCase(),
                    name: user.name
                },
                cumulativeMonths: Math.floor(Math.random() * 50) + 1,
                subTier: parseInt(Math.floor(Math.random() * 3) + 1),
                isPrime: Math.random() < 0.1,
                text: messagetext
            }

            twitchReSubMessage(data);

        break;
        case 'twitch-giftsub' :
            
            var gifterUser = mockData.users[Math.floor(Math.random() * mockData.users.length)];
            var data = {
                user: {
                    id: user.name.toLowerCase(),
                    name: user.name
                },
                recipient: { name: gifterUser.name },
                durationMonths: Math.floor(Math.random() * 50) + 1,
                subTier: parseInt(Math.floor(Math.random() * 3) + 1),
                cumlativeTotal: Math.floor(Math.random() * 200) + 1
            }

            twitchGiftMessage(data);

        break;
        case 'twitch-giftbomb' :

            var data = {
                user: {
                    id: user.name.toLowerCase(),
                    name: user.name
                },
                total: Math.floor(Math.random() * 50) + 1,
                sub_tier: parseInt(Math.floor(Math.random() * 3) + 1),
                cumulative_total: Math.floor(Math.random() * 200) + 1
            }

            twitchGiftSubsMessage(data);

        break;
        case 'twitch-raid' :

            var data = {
                from_broadcaster_user_login: user.name.toLowerCase(),
                from_broadcaster_user_name: user.name,
                viewers: Math.floor(Math.random() * 200) + 1
            }

            twitchRaidMessage(data);

        break;
        case 'twitch-announcement' :
            
            var data = {
                messageId: messageId,
                user: {
                    id: user.name.toLowerCase(),
                    name: user.name
                },
                text: announcement,
                parts: mockData.emotes
            }

            twitchAnnouncementMessage(data);

        break;
        case 'twitch-reward' :

            var data = {
                user_id: user.name.toLowerCase(),
                user_name: user.name,
                user_input: announcement,
                reward: {
                    title: reward
                }
            }

            twitchRewardRedemption(data);

        break;

        case 'youtube-chat' :

            var amIMod = Math.random() < 0.1;
            var amISub = Math.random() < 0.1;
            var amIOwner = Math.random() < 0.1;

            if (amIOwner == true) {
                amIMod = false;
                amISub = false;
            }

            var data = {
                user : {
                    id: user.name.toLowerCase(),
                    profileImageUrl: fakeAvatar,
                    name: user.name,
                    isVerified: Math.random() < 0.2,
                    isSponsor: amISub,
                    isModerator: amIMod,
                    isOwner: amIOwner,
                },
                emotes: mockData.emotes,
                message: messagetext,
                eventId: messageId,
            };

            youTubeChatMessage(data);

        break;
        case 'youtube-superchat' :

            var data = {
                user: {
                    id: user.name.toLowerCase(),
                    name: user.name,
                },
                eventId: messageId,
                amount: '$' + Math.floor(Math.random() * 2000) + 1,
                message : messagetext
            };

            console.log('superchat', data.amount);

            youTubeSuperChatMessage(data);

        break;
        case 'youtube-supersticker' :
            
            var data = {
                user: {
                    id: user.name.toLowerCase(),
                    name: user.name
                },
                eventId: messageId,
                amount: '$' + Math.floor(Math.random() * 2000) + 1,
                _fVK15WwYFFCcGLW0zi1jLCJXj3f: {
                    imageUrl: randomStickerUrl
                }
            };

            youTubeSuperStickerMessage(data);
            

        break;
        case 'youtube-newsponsor' :

            var data = {
                user: {
                    id: user.name.toLowerCase(),
                    name: user.name,
                },
                eventId: messageId,
                levelName: parseInt(Math.floor(Math.random() * 3) + 1),
                months: 1
            };

            youTubeNewSponsorMessage(data);

        break;
        case 'youtube-membermilestone' :

            var data = {
                user: {
                    id: user.name.toLowerCase(),
                    name: user.name,
                },
                eventId: messageId,
                levelName: parseInt(Math.floor(Math.random() * 3) + 1),
                months: Math.floor(Math.random() * 50) + 1,
                message: messagetext
            };

            youTubeNewSponsorMessage(data);


        break;
        case  'youtube-membergift' :

            var data = {
                user : {
                    id: user.name.toLowerCase(),
                    name: user.name,
                },
                tier: parseInt(Math.floor(Math.random() * 3) + 1),
                count: Math.floor(Math.random() * 50) + 1,
                eventId: messageId,
            };

            youTubeGiftedMembersMessage(data);
    
        break;

        case 'tiktok-chat' :

            var data = {
                userId: user.name.toLowerCase(),
                nickname: user.name,
                profilePictureUrl: fakeAvatar,
                isSubscriber: Math.random() < 0.2,
                isModerator: Math.random() < 0.1,
                isOwner: Math.random() < 0.05,

                emotes: {},
                
                comment: messagetext,

                msgId: messageId,
            };

            tiktokChatMessage(data);
    
        break;
        case 'tiktok-follow' :

            var data = {
                userId: user.name.toLowerCase(),
                nickname: user.name,
                profilePictureUrl: fakeAvatar,
                msgId: messageId,
            };

            tiktokFollowMessage(data);

        break;
        case 'tiktok-sub' :

            var data = {
                userId: user.name.toLowerCase(),
                nickname: user.name,
                profilePictureUrl: fakeAvatar,
                msgId: messageId,
                subMonth: Math.floor(Math.random() * 50) + 1
            };

            tiktokSubMessage(data);

        break;
        case 'tiktok-gift' :

            var data = {
                userId: user.name.toLowerCase(),
                nickname: user.name,
                profilePictureUrl: fakeAvatar,
                msgId: messageId,

                giftName: tiktokGift.name,
                repeatCount: Math.floor(Math.random() * 50) + 1,
                diamondCount: tiktokGift.coins,
            };

            tiktokGiftMessage(data);


        break;

        case 'streamlabs-tip' :

            var data = {
                from: user.name,
                formattedAmount: Math.floor(Math.random() * 2000) + 1,
                currency: 'USD',
                message: messagetext
            };

            streamLabsEventMessage(data);

        break;

        case 'streamelements-tip' :

            var data = {
                username: user.name,e,
                amount: Math.floor(Math.random() * 2000) + 1,
                currency: 'USD',
                message: messagetext
            };

            streamElementsEventMessage(data);

        break;
    }
}

// Function to start the mockup system
function startMockupSystem() {
    if (!isMockupActive) {
        console.debug('Starting mockup system...');
        isMockupActive = true;
        mockupConnectionState = false;
        
        // Add a notification about mockup mode
        notifyInfo({
            title: "Streamer.Bot Disconnected",
            text: "Running in mockup mode. Showing sample events."
        });
        
        // Start with a few initial events
        for (let i = 0; i < 3; i++) {
            setTimeout(() => generateMockEvent(), i * 500);
        }
        
        // Set interval for regular events
        mockupInterval = setInterval(generateMockEvent, mockupDelay);
        
        // Update statistics for demo
        updateMockStatistics();
    }
}

// Function to stop the mockup system
function stopMockupSystem() {
    if (isMockupActive) {
        console.debug('Stopping mockup system...');
        isMockupActive = false;
        mockupConnectionState = true;
        clearInterval(mockupInterval);
        mockupInterval = null;

        document.querySelector('#statistics #twitch .viewers span').textContent = '0';
        document.querySelector('#statistics #youtube .viewers span').textContent = '0';
        document.querySelector('#statistics #youtube .likes span').textContent = '0';
        document.querySelector('#statistics #tiktok .viewers span').textContent = '0';
        document.querySelector('#statistics #tiktok .likes span').textContent = '0';
    }
}

// Function to update mock statistics
function updateMockStatistics() {
    if (showPlatformStatistics) {
        if (showTwitchViewers) {
            document.querySelector('#statistics #twitch .viewers span').textContent = formatNumber(Math.floor(Math.random() * 500) + 50);
        }
        
        if (showYouTubeStatistics) {
            document.querySelector('#statistics #youtube .viewers span').textContent = formatNumber(Math.floor(Math.random() * 300) + 20);
            document.querySelector('#statistics #youtube .likes span').textContent = formatNumber(Math.floor(Math.random() * 1000) + 100);
        }
        
        if (showTikTokStatistics) {
            document.querySelector('#statistics #tiktok .viewers span').textContent = formatNumber(Math.floor(Math.random() * 800) + 200);
            document.querySelector('#statistics #tiktok .likes span').textContent = formatNumber(Math.floor(Math.random() * 5000) + 500);
        }
    }
}




function randomIntFromInterval(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function randomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function randomColor() {
    const randomColor = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
    return randomColor;
}