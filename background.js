// background.js

// Example: Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'doSomething') {
        // Perform some action in response to a message
    }
});

// Example: Periodic task
setInterval(function () {
    // Perform a task at regular intervals
}, 5 * 60 * 1000); // Run every 5 minutes
