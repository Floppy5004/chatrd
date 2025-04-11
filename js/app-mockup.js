/* ----------------------- */
/*     MOCKUP SYSTEM       */
/* ----------------------- */

let mockupInterval = null;
let isMockupActive = false;
const mockupDelay = 2500; // 2 seconds between events
let mockupConnectionState = false; // Track mock connection state

// Sample data for mockup events
const mockData = {
    users: [
        { id: 'user1', name: 'ViewerPro', avatar: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/75305d54-c7cc-40d1-bb9c-91fbe85943c7-profile_image-70x70.png' },
        { id: 'user2', name: 'StreamFan42', avatar: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/41780b5a-def8-11e9-94d9-784f43822e80-profile_image-70x70.png' },
        { id: 'user3', name: 'ProGamerVIP', avatar: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/dbdc9198-def8-11e9-8681-784f43822e80-profile_image-70x70.png' },
        { id: 'user4', name: 'GameQueen', avatar: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png' },
    ],
    messages: [
        'Hey everyone! How\'s the stream going?',
        'This game looks awesome!',
        'LOL that was hilarious',
        'GG WP!',
        'When are you playing Minecraft next?',
        'Love the new overlay!',
        'First time watching, this is great!',
        'Can you explain that strategy again?',
        'Greetings from Germany!',
        'What\'s your favorite game?'
    ],
    emotes: [
        '<img src="https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0" class="emote">',
        '<img src="https://static-cdn.jtvnw.net/emoticons/v2/425671/default/dark/1.0" class="emote">',
        '<img src="https://static-cdn.jtvnw.net/emoticons/v2/301428702/default/dark/1.0" class="emote">'
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
    ]
};

// Function to generate a random mockup event
function generateMockEvent() {
    const eventTypes = [
        'chat', 'chat', 'chat', 'chat', 'chat', 'chat', 'chat', 'chat', // More weight to regular chat messages
        'follow', 'sub', 'bits', 'raid', 'superchat', 'gift',
        'announcement', 'reward', 'resub', 'giftsub'
    ];
    
    // Select random event type and user
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const user = mockData.users[Math.floor(Math.random() * mockData.users.length)];
    const messageId = createRandomString(40);
    
    switch(eventType) {
        case 'chat':
            // Generate a regular chat message
            const message = mockData.messages[Math.floor(Math.random() * mockData.messages.length)];
            // Randomly add an emote
            const includeEmote = Math.random() > 0.7;
            const fullMessage = includeEmote ? 
                message + ' ' + mockData.emotes[Math.floor(Math.random() * mockData.emotes.length)] : 
                message;
                
            const platform = Math.random() > 0.5 ? 'twitch' : (Math.random() > 0.5 ? 'youtube' : 'tiktok');
            
            const messageData = {
                classes: Math.random() > 0.8 ? 'sub' : '',
                avatar: user.avatar,
                badges: Math.random() > 0.8 ? '<i class="fa-solid fa-star"></i>' : '',
                userName: user.name,
                color: `hsl(${Math.random() * 360}, 100%, 75%)`,
                message: fullMessage,
                reply: '',
                shared: ''
            };
            
            addMessageToChat(user.id, messageId, platform, messageData);
            break;
            
        case 'follow':
            const followData = {
                classes: 'follow',
                avatar: user.avatar,
                badges: '',
                userName: user.name,
                color: '#FFF',
                message: currentLang.twitch.follow(),
                reply: '',
            };
            
            addEventToChat(user.id, messageId, 'twitch', followData);
            break;
            
        case 'sub':
            const subData = {
                classes: 'sub',
                avatar: user.avatar,
                badges: '',
                userName: user.name,
                color: '#FFF',
                message: currentLang.twitch.sub({
                    months: Math.floor(Math.random() * 24) + 1,
                    isPrime: Math.random() > 0.5,
                    tier: Math.floor(1000 * randomIntFromInterval(1,3))
                }),
                reply: '',
            };
            
            addEventToChat(user.id, messageId, 'twitch', subData);
            break;
            
        case 'resub':
            const resubData = {
                classes: 'sub',
                avatar: user.avatar,
                badges: '',
                userName: user.name,
                color: '#FFF',
                message: currentLang.twitch.resub({
                    months: Math.floor(Math.random() * 24) + 1,
                    isPrime: Math.random() > 0.5,
                    tier: Math.floor(1000 * randomIntFromInterval(1,3))
                }),
                reply: '',
            };
            
            addEventToChat(user.id, messageId, 'twitch', resubData);
            break;
            
        case 'bits':
            const bitsAmount = Math.floor(Math.random() * 5000) + 100;
            const bitsData = {
                classes: 'bits',
                avatar: user.avatar,
                badges: '',
                userName: user.name,
                color: '#FFF',
                message: currentLang.twitch.bits({ bits: bitsAmount }),
                reply: '',
            };
            
            addEventToChat(user.id, messageId, 'twitch', bitsData);
            break;
            
        case 'raid':
            const viewerCount = Math.floor(Math.random() * 500) + 10;
            const raidData = {
                classes: 'raid',
                avatar: user.avatar,
                badges: '',
                userName: user.name,
                color: '#FFF',
                message: currentLang.twitch.raid({ viewers: viewerCount }),
                reply: '',
            };
            
            addEventToChat(user.id, messageId, 'twitch', raidData);
            break;
            
        case 'superchat':
            const amount = (Math.random() * 100 + 5).toFixed(2);
            const currencies = ['USD', 'EUR', 'CAD', 'GBP', 'AUD'];
            const currency = currencies[Math.floor(Math.random() * currencies.length)];
            
            const superChatData = {
                classes: 'superchat',
                avatar: user.avatar,
                badges: '',
                userName: user.name,
                color: '#FFF',
                message: currentLang.youtube.superchat({
                    money: formatCurrency(amount, currency),
                    message: mockData.messages[Math.floor(Math.random() * mockData.messages.length)]
                }),
                reply: '',
            };
            
            addEventToChat(user.id, messageId, 'youtube', superChatData);
            break;
            
        case 'gift':
            const giftData = {
                classes: 'gift',
                avatar: user.avatar,
                badges: '',
                userName: user.name,
                color: '#FFF',
                message: currentLang.tiktok.gift({
                    gift: 'Rose',
                    count: Math.floor(Math.random() * 50) + 1,
                    coins: Math.floor(Math.random() * 1000) + 100
                }),
                reply: '',
            };
            
            addEventToChat(user.id, messageId, 'tiktok', giftData);
            break;
            
        case 'announcement':
            const announcementText = mockData.announcements[Math.floor(Math.random() * mockData.announcements.length)];
            const announcementData = {
                classes: 'announcement',
                avatar: user.avatar,
                badges: '',
                userName: user.name,
                color: '#FFF',
                message: ` ${announcementText}`,
                reply: currentLang.twitch.announcement(),
            };
            
            addEventToChat(user.id, messageId, 'twitch', announcementData);
            break;
            
        case 'reward':
            const rewardTitle = mockData.rewards[Math.floor(Math.random() * mockData.rewards.length)];
            const userInput = Math.random() > 0.5 ? mockData.messages[Math.floor(Math.random() * mockData.messages.length)] : '';
            
            const rewardData = {
                classes: 'rewards-redemption',
                avatar: user.avatar,
                badges: '',
                userName: user.name,
                color: '#FFF',
                message: ` ${userInput}`,
                reply: currentLang.twitch.channelpoints({ title : rewardTitle }),
            };
            
            addEventToChat(user.id, messageId, 'twitch', rewardData);
            break;
            
        case 'giftsub':
            const recipientUser = mockData.users[Math.floor(Math.random() * mockData.users.length)];
            
            const giftsubData = {
                classes: 'sub',
                avatar: user.avatar,
                badges: '',
                userName: user.name,
                color: '#FFF',
                message: currentLang.twitch.gifted({
                    gifted: recipientUser.name,
                    months: Math.floor(Math.random() * 12) + 1,
                    tier: Math.floor(1000 * randomIntFromInterval(1,3)),
                    total: Math.floor(Math.random() * 50) + 1   
                }),
                reply: '',
            };
            
            addEventToChat(user.id, messageId, 'twitch', giftsubData);
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
            title: currentLang.streamerbotdisconnected || "Streamer.Bot Disconnected",
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
        
        // Clear chat to start fresh with real events
        chatContainer.innerHTML = '';
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




function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
