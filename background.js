var br = (typeof browser === 'undefined') ? chrome : browser;

/*
Log that we received the message.
Then display a notification. The notification contains the URL,
which we read from the message.
*/
function notify(message) {
    console.log("background script received message");
    var title = br.i18n.getMessage("notificationTitle");
    var content = br.i18n.getMessage("notificationContent", message.url);

    br.notifications.create({
      "type": "basic",
      "iconUrl": br.extension.getURL("icons/icons8-phishing-50-red.png"),
      "title": title,
      "message": content
    });
}

/*
Assign `notify()` as a listener to messages from the content script.
*/
br.runtime.onMessage.addListener(notify);
