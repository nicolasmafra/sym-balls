export default {

    game: null,

    create() {
        document.body.innerHTML = `
        <div class="menu">
            <input type="checkbox" id="menu-toggle">
            <label for="menu-toggle">
                <div class="bar bar1"></div>
                <div class="bar bar2"></div>
                <div class="bar bar3"></div>
            </label>
            <div class="menu-content">
                <ul>
                    <li id="resetButton">Reset</li>
                </ul>
            </div>
        </div>
        `;

        document.getElementById("resetButton").addEventListener("click", () => this.reset());
    },

    reset() {
        this.game.reset();
    },
}