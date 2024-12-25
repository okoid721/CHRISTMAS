// wallet.js
module.exports = (bot, users) => {
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;

        try {
            if (msg.text === 'Set Wallet') {
                bot.sendMessage(chatId, 'DROP YOUR OPAY ACCOUNT NUMBER (must not be more than 10 digits):');

                // Use a one-time listener for the account number
                bot.once('message', (msg) => {
                    const accountNumber = msg.text.trim();

                    // Validate account number length and format
                    if (/^\d{1,10}$/.test(accountNumber)) { // Check if it's numeric and up to 10 digits
                        // Initialize the user object if it doesn't exist
                        if (!users[chatId]) {
                            users[chatId] = {};
                        }
                        users[chatId].wallet = { accountNumber: accountNumber };
                        bot.sendMessage(chatId, 'DROP YOUR ACCOUNT NAME:');

                        // Use a one-time listener for the account name
                        bot.once('message', (msg) => {
                            const accountName = msg.text.trim();
                            users[chatId].wallet.accountName = accountName; // Store account name
                            bot.sendMessage(chatId, 'Your wallet has been set successfully!');
                        });
                    } else {
                        bot.sendMessage(chatId, 'Account number must be numeric and not more than 10 digits. Please try again.');
                    }
                });
            }
        } catch (error) {
            console.error('Error handling message:', error);
            bot.sendMessage(chatId, 'An error occurred while processing your request. Please try again later.');
        }
    });
};