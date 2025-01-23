function onError(error) {
    console.log(`Error: ${error}`);
}

function saveOptions(e) {
    e.preventDefault();
    let data = {
        hostname_filter: document.querySelector("#filter-hostname").value.split('\n').filter(l => l !== ""),
        delay: document.querySelector("#delay").value,
        reload_after_filter: document.querySelector("#reloadAfterFilter").checked
    }
    browser.storage.sync.set(data);
}

function restoreOptions() {
    browser.storage.sync.get().then((value) => {
        if (Object.keys(value).length === 0){
            value = {
                hostname_filter: [],
                delay: 50,
                reload_after_filter: false,
            }
            browser.storage.sync.set(value);
        }

        document.querySelector("#delay").value = value.delay;
        document.querySelector("#reloadAfterFilter").checked = value.reload_after_filter;

        let lines = value.hostname_filter;
        let content = "";
        for (let i = 0; i < lines.length; i++) {
            content = content + lines[i] + "\n";
        }
        document.querySelector("#filter-hostname").value = content;
    }, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#filter-hostname").addEventListener("focusout", saveOptions);
document.querySelector("#delay").addEventListener("change", saveOptions);
document.querySelector("#reloadAfterFilter").addEventListener("change", saveOptions);