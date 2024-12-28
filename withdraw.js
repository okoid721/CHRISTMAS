module.exports = (bot, users) => {
    // Replace with your group chat ID or username
    const groupChatId = '@vawulites04'; // or use the numeric chat ID

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;

        if (msg.text === 'Withdraw') {
            bot.sendMessage(chatId, 'DROP THE AMOUNT YOU WANT TO WITHDRAW:');
            
            bot.once('message', (msg) => {
                const amount = parseFloat(msg.text.trim());

                // Check if the amount is a valid number
                if (isNaN(amount)) {
                    return bot.sendMessage(chatId, 'Please enter a valid amount to withdraw.');
                }

                // Check if the amount is less than 1000
                if (amount < 1000) {
                    return bot.sendMessage(chatId, 'The minimum withdrawal amount is 1000₦. Please enter a valid amount to withdraw.');
                }

                // Check if the user exists and has enough balance
                if (users[chatId] && users[chatId].balance >= amount) {
                    // Deduct the amount from user's balance
                    users[chatId].balance -= amount;

                    // Send withdrawal request details to the group
                    const user = users[chatId];
                    const withdrawalMessage = `
                    💰 Withdrawal Request
                    -----------------------
                    User ID: ${chatId}
                    Amount: ${amount}₦
                    Account Number: ${user.wallet?.accountNumber || 'Not set'}
                    Account Name: ${user.wallet?.accountName || 'Not set'}
                    Total Referrals: ${user.referrals}
                    `;

                    bot.sendMessage(groupChatId, withdrawalMessage);

                    // Notify the user about the successful withdrawal request
                    bot.sendMessage(chatId, `You have successfully withdrawn ${amount}₦!`);
                } else {
                    // Notify the user about insufficient balance
                    bot.sendMessage(chatId, `Insufficient balance. Your current balance is ${users[chatId]?.balance || 0}₦.`);
                }
            });
        }
    });
};