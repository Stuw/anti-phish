function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
      color: document.querySelector("#color").value
    });
}

function clearOptions() {
    browser.storage.local.clear();
}

function restoreOptions() {
  
    function setCurrentChoice(result) {
      document.querySelector("#color").value = result.color || "blue";
    }
  
    function onError(error) {
      console.log(`Error: ${error}`);
    }
  
    var getting = browser.storage.local.get("color");
    getting.then(setCurrentChoice, onError);

    // TODO: show stored data and allow to edit it
}
  
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#save").addEventListener("submit", saveOptions);
document.querySelector("#clear").addEventListener("submit", clearOptions);
