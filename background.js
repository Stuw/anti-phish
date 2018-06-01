/*
Log that we received the message.
Then display a notification. The notification contains the URL,
which we read from the message.
*/
function notify(message) {
    console.log("background script received message");
    var title = browser.i18n.getMessage("notificationTitle");
    var content = browser.i18n.getMessage("notificationContent", message.url);
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("icons/icons8-phishing-50-red.png"),
      "title": title,
      "message": content
    });
  }
  
  /*
  Assign `notify()` as a listener to messages from the content script.
  */
  browser.runtime.onMessage.addListener(notify);