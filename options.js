
function saveOptions(e) {
	e.preventDefault();
	if (typeof browser === 'undefined')
		chrome.storage.sync.set({ color: document.querySelector("#color").value });
	else
		browser.storage.sync.set({ color: document.querySelector("#color").value });
}

function clearOptions() {
	if (typeof browser === 'undefined')
		chrome.storage.sync.clear()
	else
		browser.storage.local.clear();
}

function restoreOptions() {

	function setCurrentChoice(result) {
		document.querySelector("#color").value = result.color || "blue";
	}

	function onError(error) {
		console.log(`Error: ${error}`);
	}

	if (typeof browser === 'undefined')
		chrome.storage.sync.get("color", setCurrentChoice)
	else
	{
		var getting = browser.storage.local.get("color");
		getting.then(setCurrentChoice, onError);
	}

	// TODO: show stored data and allow to edit it
}
  
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#save").addEventListener("submit", saveOptions);
document.querySelector("#clear").addEventListener("submit", clearOptions);
