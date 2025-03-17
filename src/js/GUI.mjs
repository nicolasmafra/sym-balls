const GUI = {

    modal: null,
    modalMessageCallback: null,

    async configure() {
        GUI.configureModals();
    },

    configureModals() {
        GUI.modal = document.getElementById("main-dialog");
        GUI.modal.onclick = () => GUI.closeModal();
    },

    closeModal() {
        GUI.modal.close();
        if (GUI.modalMessageCallback) {
            GUI.modalMessageCallback();
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

    toggleFullScreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
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
        GUI.modal.querySelector('.message').innerHTML = message;
        GUI.modal.showModal();
    },
};

export default GUI;
