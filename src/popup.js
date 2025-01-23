function onError(error) {
    console.log(`Error: ${error}`);
}

function saveOptions(e) {
    e.preventDefault();
    var lines = document.querySelector("#filter-hostname").value.split('\n');
    lines = lines.filter(l => l !== "");
    let data = {
        hostname_filter: lines,
        delay: document.querySelector("#delay").value,
        reload_after_filter: document.querySelector("#reloadAfterFilter").checked
    }
    console.log(data);
    browser.storage.sync.set(data);
}

function restoreOptions() {
    browser.storage.sync.get().then((value) => {
        if (value.delay !== null) {
            document.querySelector("#delay").value = value.delay;
        }
        let reloadAfterFilter = document.querySelector("#reloadAfterFilter");

        if (value.reload_after_filter !== null) {
            reloadAfterFilter.checked = value.reload_after_filter;
        }
        else {
            reloadAfterFilter.checked = false;
        }

        if (value.hostname_filter !== null) {
            let lines = value.hostname_filter;
            let content = "";
            for (let i = 0; i < lines.length; i++) {
                content = content + lines[i] + "\n";
            }
            document.querySelector("#filter-hostname").value = content;
        }

    }, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#filter-hostname").addEventListener("focusout", saveOptions);
document.querySelector("#delay").addEventListener("focusout", saveOptions);
document.querySelector("#reloadAfterFilter").addEventListener("change", saveOptions);