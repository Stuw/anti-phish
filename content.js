// Icon: https://icons8.com/icon/68759/phishing

console.log('AntiPhish: started, doc state = ', window.document.readyState);

window.addEventListener("load", function load(event){
	window.removeEventListener("load", load, false); //remove listener, no longer needed

	setupEventHandlers();
}, false);


var br = (typeof browser === 'undefined') ? chrome : browser

var base_uri = getBaseUrl();
var handling = false;
var triggered = false;
var stored = false;
var visited = []
var color = "red";


storage_get("color", onGotColor, onErrorColor);
storage_get("visited", onGotUri, onErrorUri);

//

function getBaseUrl()
{
	var l = window.top.location;
	var base_uri = l.protocol + '//' + l.host;
	if (l.port)
		base_uri += ':' + l.port;
	return base_uri;
}


function storage_get(name, func_ok, func_err = null)
{
	if (typeof browser === 'undefined')
		chrome.storage.sync.get(name, func_ok);
	else
	{	// Firefox
		var getting = browser.storage.sync.get(name);
		getting.then(func_ok, func_err);
	}
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

	if (window.document.readyState == 'complete')
		setupEventHandlers();
}


function visualMark(mark) {
	var password = $('input');
	var form = $('form');
	var button = $('button');

	console.log('AntiPhish: visualMark', mark);

	if (mark) {
		password.addClass('anti_phish');
		button.addClass('anti_phish');
	} else {
		password.removeClass('anti_phish');
		button.removeClass('anti_phish');
	}
}


function setupEventHandlers() {
	if (handling)
		return;

	console.log("AntiPhish: setupEventHandlers");

	if (visited.includes(base_uri))
	{
		console.log("AntiPhish: base_uri in visited");
		return;
	}

	//var password = $('input[type="password"]');
	var password = $('input');
	var form = $('form');
	var button = $('button');

	//console.log('AntiPhish: setupEventHandlers password', password);
	//console.log('AntiPhish: setupEventHandlers form', form);
	//console.log('AntiPhish: setupEventHandlers button', button);

	password.on( "change", inputHandler );
	password.on( "click", inputHandler );

	form.on( "submit", submitHandler );
	password.on( "keypress", keyHandler );
	password.on( "keydown", keyHandler );
	button.on( "button", submitHandler );

	visualMark(true);

	handling = true;
}


function inputHandler(e) {
	if (triggered)
	{
		console.log('AntiPhish: inputHandler: already triggered', base_uri, e.target.type);
		return;
	}
	console.log('AntiPhish: inputHandler');

	notifyExtension(base_uri)

	visited.push(base_uri);

	triggered = true;

	console.log('AntiPhish: handler complete ', base_uri);
}


function keyHandler(e) {
	if (e.which == 13 || e.keyCode == 13) {
		console.log('AntiPhish: keyHandler', e);
		submitHandler();
	}

	return true;
}


function submitHandler() {
	console.log('AntiPhish: submitHandler');
	if (!triggered)
		notifyExtension(base_uri);

	if (stored) {
		console.log("AntiPhish: already stored", base_uri);
		return;
	}

	br.storage.sync.set({ 'visited': visited });

	stored = true;
	visualMark(false);

	console.log('AntiPhish: submitHandler complete, mark visited', base_uri);
}


function notifyExtension(uri) {
	console.log("AntiPhish: content script sending message");
	if (typeof browser === 'undefined')
		chrome.runtime.sendMessage({"url": uri});
	else
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
