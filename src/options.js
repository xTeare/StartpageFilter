function onError(error) {
  console.log(`Error: ${error}`);
}

function saveOptions(e) {
  e.preventDefault();
  var lines = document.querySelector("#filter-hostname").value.split('\n');
  lines = lines.filter(l => l !== "");
  browser.storage.sync.set({
    hostname_filter: lines
  });
}

function restoreOptions() {
  browser.storage.sync.get().then((value) => {
    if (value.hostname_filter === null)
      return;

    let lines = value.hostname_filter;
    let content = "";
    for (let i = 0; i < lines.length; i++) {
      content = content + lines[i] + "\n";
    }
    document.querySelector("#filter-hostname").value = content;
  }, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#save").addEventListener("click", saveOptions);
document.querySelector("#filter-hostname").addEventListener("focusout", saveOptions);
