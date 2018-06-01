// Icon: https://icons8.com/icon/68759/phishing

console.log('AntiPhish: started');

var base_uri = getBaseUrl();
var triggered = false;
var stored = false;
var visited = []
var color = "red";
//var password = $('input[type="password"]');
var password = $('input');
var form = $('form');


var getting = browser.storage.local.get("color");
getting.then(onGotColor, onErrorColor);

var getting = browser.storage.local.get('visited');
getting.then(onGotUri, onErrorUri);

//

function getBaseUrl()
{
	var l = window.top.location;
	var base_uri = l.protocol + '//' + l.host;
	if (l.port)
		base_uri += ':' + l.port;
	return base_uri;
}


function onErrorUri(error) {
	console.log(`Error: ${error}`);
}


function onGotUri(item) {
	console.log("AntiPhish: onGotUri", item);

	visited = item['visited'];
	if (!visited)
	{
		visited = []
	}
	else if (visited.includes(base_uri))
	{
		console.log("AntiPhish: base_uri in visited");
		return;
	}

	setupEventHandlers();
}


function setupEventHandlers() {
	console.log("AntiPhish: setupEventHandlers");

	password.on( "change", inputHandler );
	password.on( "click", inputHandler );
	password.addClass('anti_phish');

	form.on( "submit", formHandler );
}


function inputHandler(e) {
	if (triggered)
	{
		console.log('AntiPhish: already triggered handler', base_uri, e.target.type);
		return;
	}

	notifyExtension(base_uri)

	visited.push(base_uri);

	triggered = true;

	console.log('AntiPhish: handler complete ', base_uri);
}

function formHandler() {
	if (!triggered)
		notifyExtension(base_uri);

	if (stored)
		return;

	browser.storage.local.set({
		'visited': visited
	});

	stored = true;

	console.log('AntiPhish: formHandler complete ', base_uri);
}


function notifyExtension(uri) {
	console.log("AntiPhish: content script sending message");
	browser.runtime.sendMessage({"url": uri});
}


function onErrorColor(error) {
	console.log(`Error: ${error}`);
}


function onGotColor(item) {
	console.log("AntiPhish: onGot color");
	
	if (item.color) {
		color = item.color;
	}
}


console.log('AntiPhish: BOTTOM');