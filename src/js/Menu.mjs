export default {

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
                    <li>Reset</li>
                </ul>
            </div>
        </div>
        `;
    }
}