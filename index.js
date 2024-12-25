const TelegramBot = require('node-telegram-bot-api');
const setupWallet = require('./setwallet');
const withdraw = require('./withdraw');
require("dotenv").config()
const express = require("express");


const app = express();
const PORT = process.env.PORT || 3000;

   
// Replace with your bot token from BotFather
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// List of channels to follow
const channels = [
    '@MAKE_MONEYK', // Replace with your channel usernames
    '@AIRDROP_FINDERK',
    '@FREE_UPDATEK'
];

// In-memory storage for user data
const users = {};

// Welcome message
const welcomeMessage = `
Welcome to the CHRISMAS EVE BOT! 
Please follow the channels below to begin:
${channels.join('\n')}
`;

// Start command
bot.onText(/\/start(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const referrerId = match[1].trim(); // Get the referrer ID from the command

    // Initialize user data if not already present
    if (!users[chatId]) {
        users[chatId] = {
            balance: 0,
            referrals: 0,
            referralLink: `https://t.me/Christmas20252_bot?start=${chatId}` // Unique referral link
        };
            bot.sendMessage(chatId, 'Welcome! Please choose an option:', {
        reply_markup: {
            keyboard: [
                [{ text: 'Set Wallet' }, { text: 'Withdraw' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });

        // If there's a referrer, update their balance and referral count
        if (referrerId && users[referrerId]) {
            users[referrerId].balance += 100; // Add 100₦ for the referral
            users[referrerId].referrals += 1; // Increment the referral count

            // Notify the referrer about the new referral
            bot.sendMessage(referrerId, `🎉 You have received 100₦ for a new referral! Total referrals: ${users[referrerId].referrals}`);
        }
    }

    bot.sendMessage(chatId, welcomeMessage, {
        reply_markup: {
            inline_keyboard: [[
                { text: 'DONE', callback_data: 'done' }
            ]]
        }
    });
});

// Handle the DONE button
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    if (data === 'done') {
        // Send the specified message after the user taps "DONE"
        const user = users[chatId];
        const responseMessage = `
🇳🇬 CHRISTMAS BIGGEST GIVEAWAY 🔥

🎉 EARN UNLIMITED NGN? JUST BY DOING TASK AND INVITING YOUR FRIENDS OR LOVED ONES.

GET REWARDED WITH 100₦! FOR EVERY VALID USER YOU INVITE.

TASK AND REFERRAL BALANCE CAN BE WITHDRAWN AT ANYTIME.
————————————————

🎊 ACCUMULATED BALANCE INFO:
 
 🤑 FROM INVITING: ${user.balance} ₦
 👛 FROM TASK: 0.0 ₦
 👨‍👩‍👧‍👦 TOTAL INVITATIONS: ${user.referrals}
 
————————————————

📎 Your referral link: 
${user.referralLink}

USING FAKE REFERRAL TOOLS TO GET MORE BALANCE OR MULTIPLE ACCOUNTS WILL NOT GET PAID....
 
KEEP IT CLEAN 😉
        `;

        // Send the response message and store the message ID
        bot.sendMessage(chatId, responseMessage, {
            reply_markup: {
                inline_keyboard: [[
                    { text: 'Refresh', callback_data: 'refresh' }
                ]]
            }
        }).then(sentMessage => {
            // Delete the original message that contained the "DONE" button
            bot.deleteMessage(chatId, callbackQuery.message.message_id);
        });
    } else if (data === 'refresh') {
        // Resend the referral information when the refresh button is pressed
        const user = users[chatId];
        const refreshMessage = `
🎊 ACCUMULATED BALANCE INFO:
 
 🤑 FROM INVITING: ${user.balance} ₦
 👛 FROM TASK: 0.0 ₦
 👨‍👩‍👧‍👦 TOTAL INVITATIONS: ${user.referrals}
        `;

        bot.sendMessage(chatId, refreshMessage);
    }
});

// Handle referral tracking
bot.onText(/\/referral (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const referralId = match[1].trim();

    if (users[referralId]) {
        users[chatId] = users[chatId] || { balance: 0, referrals: 0 };
        users[users[referralId]].balance += 100; // Add 100₦ for the referral
        users[users[referralId]].referrals += 1; // Increment the referral count

        bot.sendMessage(referralId, `🎉 You have received 100₦ for a new referral! Total referrals: ${users[referralId].referrals}`);
        bot.sendMessage(chatId, `You have successfully referred ${referralId}.`);
    } else {
        bot.sendMessage(chatId, `Invalid referral ID. Please check and try again.`);
    }
});

setupWallet(bot, users);
withdraw(bot, users);

async function startApp() {
    await Promise.all([
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      }),
    ]);
  }
  
  startApp().catch((error) => console.error("Error starting app:", error));