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
    return 1 / Math.tan(curveAngle);
}

function lerp(start, end, progress) {
    return start + (end - start) * progress;
}

class Arrow {
    
    constructor(colorOrigin, colorDestination, partRadius, curveAngle, centerDist) {
        this.gfx = new PIXI.Container();
        this.gfx.scale.x = 2;
        this.gfx.scale.y = 2;
    
        this.origin = createArrowPart(colorOrigin, false, partRadius);
        this.origin.x = -10;
        this.gfx.addChild(this.origin);
    
        this.destination = createArrowPart(colorDestination, true, partRadius);
        this.destination.x = 10;
        this.gfx.addChild(this.destination);

        this.setCurveAngle(curveAngle);
        this.setCenterDist(centerDist);
    }

    setCurveAngle(curveAngle) {
        this.curveAngle = curveAngle;
        this.origin.rotation = -curveAngle;
        this.destination.rotation = curveAngle;
    }

    setCenterDist(centerDist) {
        this.centerDist = centerDist;
        this.origin.y = -centerDist;
        this.destination.y = -centerDist;
    }
}

class ArrowGroup {

    partRadius = 10;
    arrows = [];
    animationProgress = 1;
    
    constructor(colors) {
        this.colors = colors;
        this.gfx = new PIXI.Container();
        let curveAngle = Math.PI / colors.length;
        let centerDist = this.partRadius * calcCenter(curveAngle);
        for (let i = 0; i < colors.length; i++) {
            let color1 = colors[i];
            let color2 = colors[(i + 1) % colors.length];
            let arrow = new Arrow(color1, color2, this.partRadius, curveAngle, centerDist);
            arrow.gfx.rotation = 2 * curveAngle * i;
            this.arrows.push(arrow);
            this.gfx.addChild(arrow.gfx);
        }
    }

    animate(duration) {
        this.animationProgress = 0;
        this.animationDuration = duration;
    }

    animateToLine(duration=1000) {
        this.animate(duration);

        let spacing = 4 * this.partRadius;
        let offsetY = -spacing * (this.arrows.length-1)/2;
        for (let i = 0; i < this.arrows.length; i++) {
            let arrow = this.arrows[i];
            
            arrow.targetY = offsetY + spacing * i;
            arrow.targetRotation = 0;
            arrow.targetCurveAngle = 0;
            arrow.targetCenterDist = 0;
        }
    }

    animateToCircle(duration=1000) {
        this.animate(duration);
        this.toCircle();
    }

    toCircle() {
        let curveAngle = Math.PI / this.arrows.length;
        let centerDist = this.partRadius * calcCenter(curveAngle);
        for (let i = 0; i < this.arrows.length; i++) {
            let arrow = this.arrows[i];
            
            arrow.targetY = 0;
            arrow.targetRotation = 2 * curveAngle * i;;
            arrow.targetCurveAngle = curveAngle;
            arrow.targetCenterDist = centerDist;
        }
    }

    update(deltaTime) {
        if (this.animationProgress == 1) return;

        this.animationProgress = Math.min(this.animationProgress + deltaTime / this.animationDuration, 1);
        
        this.arrows.forEach(arrow => {
            arrow.gfx.y = lerp(arrow.gfx.y, arrow.targetY, this.animationProgress);
            arrow.gfx.rotation = lerp(arrow.gfx.rotation, arrow.targetRotation, this.animationProgress);
            arrow.setCurveAngle(lerp(arrow.curveAngle, arrow.targetCurveAngle, this.animationProgress));
            arrow.setCenterDist(lerp(arrow.centerDist, arrow.targetCenterDist, this.animationProgress));
        });
    }
}
