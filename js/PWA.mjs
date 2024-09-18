let deferredPrompt;

export default {

    prepare(element) {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('./sw.js')
                .then(() => { console.log('No-Op Service Worker Registered'); })
                .catch(e => { console.log('Error whilst registering service worker'); });
        }
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            deferredPrompt = e;
            element.style.display = "block";
        });
    },

    install(element) {
        element.style.display = "none";

        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("User accepted the A2HS prompt");
            } else {
                console.log("User dismissed the A2HS prompt");
            }
            deferredPrompt = null;
        });
    }
}
