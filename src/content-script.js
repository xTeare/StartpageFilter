function onError(error) {
    console.log(`Error: ${error}`);
}

window.addEventListener("load", (event) => {
    loaded();
});

function addHostFilter(host) {
    browser.storage.sync.get().then((settings) => {

        if (Object.keys(settings).length === 0){
            settings = {
                hostname_filter: [],
                delay: 50,
                reload_after_filter: false,
            }
        }

        if(settings.hostname_filter.includes(host))
            return;

        settings.hostname_filter.push(host);
        browser.storage.sync.set(settings).then(() => {
            if (settings.reload_after_filter)
                window.location.reload();
            // browser.runtime.sendMessage({ command: "reload" });
        })
    })
}

function loaded() {
    browser.storage.sync.get().then((settings) => {

        if (Object.keys(settings).length === 0){
            settings = {
                hostname_filter: [],
                delay: 50,
                reload_after_filter: false,
            }
            browser.storage.sync.set(settings);
        }

        setTimeout(function () {
            document.body.style.border = "5px solid red";

            let anonLinks = document.getElementsByClassName("anonymous-view-link");

            for (let i = 0; i < anonLinks.length; i++) {
                anonLinks[i].style.display = "none";
            }

            if (settings.hostname_filter === null)
                return;

            let hiddenHosts = {};

            let results = document.getElementsByClassName("result");

            for (let i = 0; i < results.length; i++) {
                let result = results[i];
                let childs = result.getElementsByClassName("upper");

                if (childs.length < 1)
                    continue;

                let upper = childs[0];
                let links = upper.getElementsByTagName("a");

                if (links.length < 1)
                    continue;

                let link = links[0];

                if (link.href === undefined)
                    continue;

                for (let j = 0; j < settings.hostname_filter.length; j++) {
                    let filter = settings.hostname_filter[j];
                    if (link.href.includes(filter)) {
                        result.style.display = "none";

                        if (filter in hiddenHosts) 
                            hiddenHosts[filter] = hiddenHosts[filter] + 1;
                        else 
                            hiddenHosts[filter] = 1;
                        
                        break;
                    }
                }
                let url = new URL(link.href);
                let host = url.hostname.replace("www.", "");
                let blockLink = document.createElement("a");
                blockLink.innerText = "Block " + host;
                blockLink.style.color = "#A7B1FC";
                blockLink.style.textDecoration = "none";
                blockLink.style.fontSize = "14px";
                blockLink.style.lineHeight = "16px";
                blockLink.style.cursor = "pointer";

                blockLink.addEventListener("click", () => {
                    addHostFilter(host);
                });

                result.appendChild(blockLink);
            }

            if (Object.keys(hiddenHosts).length !== 0) {
                let mainElement = document.getElementById("main");
                let hiddenHostsInfo = document.createElement("span");

                let text = "";

                for (let key in hiddenHosts)
                    text = text + hiddenHosts[key] + "x " + key + " ";
                
                text = text.trimEnd()
                hiddenHostsInfo.innerText = " removed: " + text;
                hiddenHostsInfo.toolTip = text;
                hiddenHostsInfo.style.color = "rgb(178, 180, 197)";
                hiddenHostsInfo.style.fontSize = "14px";
                hiddenHostsInfo.style.lineHeight = "16px";
                hiddenHostsInfo.style.overflow = "hidden";
                mainElement.insertBefore(hiddenHostsInfo, mainElement.firstChild);

            }
        }, settings.delay);

    });

}
