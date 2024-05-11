function createArrowPart(color, dest, radius) {
    let arrowPart = new PIXI.Graphics();
    arrowPart.width = 2*radius;
    arrowPart.height = 2*radius;

    arrowPart
        .moveTo(0, 0)
        .arc(0, 0, radius, -Math.PI/4, Math.PI/4, dest)
        .lineTo(0, 0)
        .fill({ color: color })
        .stroke({ color: 0x888888, alpha: 0.5 });
    return arrowPart;
}

function calcCenter(curveAngle) {
    return curveAngle == 0 ? 0 : (1 / Math.tan(curveAngle));
}

class Arrow {

    partRadius = 10;
    
    constructor(colorOrigin, colorDestination, curveAngle=0) {
        this.curveAngle = curveAngle;
        this.centerDist = this.partRadius * calcCenter(curveAngle);

        this.gfx = new PIXI.Container();
        this.gfx.scale.x = 2;
        this.gfx.scale.y = 2;
    
        this.origin = createArrowPart(colorOrigin, false, this.partRadius);
        this.origin.x = -10;
        this.origin.y = -this.centerDist;
        this.origin.rotation = -curveAngle;
        this.gfx.addChild(this.origin);
    
        this.destination = createArrowPart(colorDestination, true, this.partRadius);
        this.destination.x = 10;
        this.destination.y = -this.centerDist;
        this.destination.rotation = curveAngle;
        this.gfx.addChild(this.destination);
    }
}

class ArrowGroup {

    arrows = [];
    
    constructor(colors) {
        this.colors = colors;
        this.gfx = new PIXI.Container();
        let curveAngle = Math.PI / colors.length;
        for (let i = 0; i < colors.length; i++) {
            let color1 = colors[i];
            let color2 = colors[(i + 1) % colors.length];
            let arrow = new Arrow(color1, color2, curveAngle);
            arrow.gfx.rotation = 2 * curveAngle * i;
            this.arrows.push(arrow);
            this.gfx.addChild(arrow.gfx);
        }
    }
}
