import '../css/style.css';
import '../css/main-menu.css';
import '../css/modal-menu.css';
import '@fortawesome/fontawesome-free/js/fontawesome.js'
import '@fortawesome/fontawesome-free/js/solid.js'
import '@fortawesome/fontawesome-free/js/regular.js'
import '@fortawesome/fontawesome-free/js/brands.js'

import Params from './Params.mjs';

const GUI = {

    messageSources: {},

    async configure() {
        GUI.configureModals();
        await GUI.loadLanguage(Params.value.language);
        await GUI.loadLanguage(Params.fallbackLanguage);
        GUI.replaceMenuLabels();
    },

    configureModals() {
        document.querySelectorAll(".modal").forEach(modal => {
            modal.querySelector(".modal-content-close").onclick = () => {
                modal.style.display = "none";
            };
            modal.addEventListener("click", () => {modal.style.display = "none"});
        });
    },

    addButtons(menuObject) {
        document.querySelectorAll(".menu-button")
            .forEach(button => {
                if (menuObject[button.dataset.action + 'Prepare']) {
                    menuObject[button.dataset.action + 'Prepare'](button);
                }
                GUI.addButtonListener(menuObject, button);
            });
    },

    addButtonListener(menuObject, button) {
        let functionName = button.dataset.action;
        if (menuObject[functionName]) {
            button.addEventListener("click", event => menuObject[functionName](button, event))
        }
    },

    enterFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    },

    rotateToLandscape() {
        let orientation = screen.orientation.type;
        if (!orientation.startsWith("landscape")) {
            screen.orientation.lock("landscape");
        }
    },

    replaceMenuLabels() {
        let elements = document.querySelectorAll('[data-label]');
        elements.forEach(GUI.replaceMenuLabel)
    },

    replaceMenuLabel(element) {
        element.innerHTML = GUI.resolveMessage(element.dataset.label);
    },

    showMessage(messageCode) {
        let message = GUI.resolveMessage(messageCode);
        message = message.replace('\n', '<br>').replace('\\n', '<br>');
        let messageModal = document.querySelector('.message-modal');
        let messageTag = messageModal.querySelector('.message');
        messageTag.innerHTML = message;
        messageModal.style.display = "block";
    },

    resolveMessage(messageCode, fallbackMessage) {
        let message = GUI.getFromMessageSource(Params.value.language, messageCode);
        if (!message) message = GUI.getFromMessageSource(Params.fallbackLanguage, messageCode);
        if (!message) message = fallbackMessage ? fallbackMessage : messageCode;
        return message;
    },

    getFromMessageSource(language, messageCode) {
        let messageSource = GUI.messageSources[language];
        if (!messageSource) return undefined;
        return messageSource[messageCode];
    },

    async loadLanguage(language) {
        try {
            await GUI.loadMessagesSource(language);
        } catch (e) {
            console.error('Not found language=' + language);
            if (language.includes('-')) {
                try {
                    language = language.split('-')[0];
                    await GUI.loadMessagesSource(language);
                } catch (e) {
                    console.error('Not found language=' + language);
                }
            }
        }
    },

    async loadMessagesSource(suffix) {
        if (GUI.messageSources[suffix]) {
            return;
        }
        let propertiesPath = (await import(`../assets/messages-${suffix}.properties`)).default;
        let properties = await fetch(propertiesPath)
            .then(res => res.text());
        if (!properties) {
            throw new Error('Not found messages for suffix=' + suffix);
        }
        let messageSource = {};
        properties
            .split('\n')
            .filter(line => line.includes('='))
            .map(line => line.split('='))
            .forEach(parts => messageSource[parts[0]] = parts[1]);
        
        GUI.messageSources[suffix] = messageSource;
        return messageSource;
    },
};

export default GUI;