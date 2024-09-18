import Params from './Params.mjs';

const GUI = {

    modalMessageCallback: null,

    async configure() {
        GUI.configureModals();
    },

    configureModals() {
        document.querySelectorAll(".modal").forEach(modal => {
            modal.querySelector(".modal-content-close").onclick = () => {
                GUI.closeModal(modal);
            };
            modal.addEventListener("click", () => GUI.closeModal(modal));
        });
    },

    closeModal(modal) {
        modal.style.display = "none";
        if (modal.classList.contains("message-modal") && GUI.modalMessageCallback) {
            GUI.modalMessageCallback();
            GUI.modalMessageCallback = null;
        }
    },

    addButtons(menuObject) {
        GUI.prepareButtons(menuObject, ".menu-button");
        document.querySelectorAll(".menu-button")
            .forEach(button => GUI.addButtonListener(menuObject, button));
    },

    prepareButtons(menuObject, query) {
        document.querySelectorAll(query).forEach(button => {
            let prepareFunction = menuObject[button.dataset.action + 'Prepare'];
            if (prepareFunction) {
                prepareFunction(button);
            }
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

    showMessage(message, callback) {
        GUI.modalMessageCallback = callback;
        message = message.replace('\n', '<br>').replace('\\n', '<br>');
        let messageModal = document.querySelector('.message-modal');
        let messageTag = messageModal.querySelector('.message');
        messageTag.innerHTML = message;
        messageModal.style.display = "block";
    },
};

export default GUI;