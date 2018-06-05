
function onError(e) {
	console.log(e);
}


function saveOptions(e) {
	e.preventDefault();
	var input_color = document.querySelector("input#color");
	if (typeof browser === 'undefined')
		chrome.storage.sync.set({ color: input_color.value });
	else
		browser.storage.sync.set({ color: input_color.value });

	restoreOptions();
}

function clearOptions() {
	if (typeof browser === 'undefined')
		chrome.storage.sync.clear()
	else
		browser.storage.sync.clear();
}

function restoreOptions() {

	function setCurrentChoice(result) {
		var input_color = document.querySelector("input#color");
		input_color.value = result.color || "red";
		input_color.style["border"] = "1px solid " + result.color || "red";
	}

	function onError(error) {
		console.log(`Error: ${error}`);
	}

	if (typeof browser === 'undefined')
		chrome.storage.sync.get("color", setCurrentChoice)
	else
	{
		var getting = browser.storage.sync.get("color");
		getting.then(setCurrentChoice, onError);
	}

	function onGetVisited(item) {
		var visited = item['visited'];
		if (!visited)
			return;

		var cache_div = document.querySelector("#cache");
		var html = ""
		visited.forEach(function(v) {
			html += v + "\n";
		});
		cache_div.innerHTML = '<textarea rows="10" cols="45" name="text" readonly>' + html + '</textarea>';
	}

	// TODO: allow to edit stored data
	if (typeof browser === 'undefined')
		chrome.storage.sync.get("visited", onGetVisited)
	else
	{
		var getting = browser.storage.sync.get("visited");
		getting.then(onGetVisited, onError);
	}
}
  
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#save").addEventListener("submit", saveOptions);
document.querySelector("#clear").addEventListener("submit", clearOptions);
