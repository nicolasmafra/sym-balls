class DragDropContainer {
    constructor(container) {
        this.container = container;
        this.draggableElements = [];
        this.init();
    }

    init() {
        this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    addDraggable(element) {
        if (!element.style.getPropertyValue('--x')) {
            element.style.setProperty('--x', '0px');
        }
        if (!element.style.getPropertyValue('--y')) {
            element.style.setProperty('--y', '0px');
        }
        this.draggableElements.push(element);
    }

    onMouseDown(event) {
        const target = event.target.closest('svg');
        if (this.draggableElements.includes(target)) {
            this.activeElement = target;
            this.activeElement.classList.add('dragging');

            // Obtém os valores das variáveis CSS
            const computedStyle = getComputedStyle(this.activeElement);
            const x = parseFloat(computedStyle.getPropertyValue('--x').replace('px', '')) || 0;
            const y = parseFloat(computedStyle.getPropertyValue('--y').replace('px', '')) || 0;

            this.offsetX = event.clientX - x;
            this.offsetY = event.clientY - y;
        }
    }

    onMouseUp() {
        this.checkCollision(this.activeElement);
        this.activeElement.classList.remove('dragging');
        this.activeElement = null;
    }

    onMouseMove(event) {
        if (this.activeElement) {
            const x = event.clientX - this.offsetX;
            const y = event.clientY - this.offsetY;

            this.activeElement.style.setProperty('--x', `${x}px`);
            this.activeElement.style.setProperty('--y', `${y}px`);
        }
    }

    checkCollision(element) {
        const rect1 = element.getBoundingClientRect();
        this.draggableElements.forEach(otherElement => {
            if (otherElement !== element) {
                const rect2 = otherElement.getBoundingClientRect();
                const radius1 = Math.min(rect1.width, rect1.height) / 2;
                const radius2 = Math.min(rect2.width, rect2.height) / 2;
                const x1 = rect1.left + rect1.width / 2;
                const y1 = rect1.top + rect1.height / 2;
                const x2 = rect2.left + rect2.width / 2;
                const y2 = rect2.top + rect2.height / 2;
                const dx = x1 - x2;
                const dy = y1 - y2;
                if (Math.sqrt(dx * dx + dy * dy) < radius1 + radius2) {
                    console.log(`Collision detected between ${element.id} and ${otherElement.id}`);
                }
            }
        });
    }
}

// Usage example
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const dragDrop = new DragDropContainer(container);

    dragDrop.addDraggable(document.getElementById('item1'));
    dragDrop.addDraggable(document.getElementById('item2'));
});