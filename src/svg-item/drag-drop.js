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
        element.style.setProperty('--x', '0px');
        element.style.setProperty('--y', '0px');
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
                if (rect1.left < rect2.right &&
                    rect1.right > rect2.left &&
                    rect1.top < rect2.bottom &&
                    rect1.bottom > rect2.top) {
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

    //dragDrop.addDraggable(document.getElementById('item1'));
});