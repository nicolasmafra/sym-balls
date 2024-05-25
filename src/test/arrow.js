function createBallSlice(color, dest, radius, x) {
    let gfx = new PIXI.Graphics();
    gfx.width = 2*radius;
    gfx.height = 2*radius;
    gfx.x = x;

    gfx.moveTo(0, 0)
        .arc(0, 0, radius, -Math.PI/4, Math.PI/4, dest)
        .lineTo(0, 0)
        .fill({ color: color })
        .stroke({ color: 0x000000, alpha: 0.25, width: 1.5 });
    return gfx;
}

function calcCenter(ballRotation) {
    return 1 / Math.tan(ballRotation);
}

function lerp(start, end, progress) {
    return start + (end - start) * progress;
}

class Arrow {

    ballRotation = 0;
    centerDist = 0;
    
    constructor(colorOrigin, colorDestination, ballRadius) {
        this.gfx = new PIXI.Container();
    
        this.gfx.addChild(
            this.orig = createBallSlice(colorOrigin, false, ballRadius, -10),
            this.dest = createBallSlice(colorDestination, true, ballRadius, 10),
        );
    }

    setBallRotation(ballRotation) {
        this.ballRotation = ballRotation;
        this.orig.rotation = -ballRotation;
        this.dest.rotation = ballRotation;
    }

    setCenterDist(centerDist) {
        this.centerDist = centerDist;
        this.orig.y = -centerDist;
        this.dest.y = -centerDist;
    }
}

class ArrowGroup {

    partRadius = 10;
    circleScale = 2;
    lineScale = 1.5;
    arrows = [];
    animationProgress = 1;
    animationDuration = 100;
    
    constructor(colors) {
        this.colors = colors;
        this.gfx = new PIXI.Container();
        for (let i = 0; i < colors.length; i++) {
            let color1 = colors[i];
            let color2 = colors[(i + 1) % colors.length];
            let arrow = new Arrow(color1, color2, this.partRadius);
            this.arrows.push(arrow);
            this.gfx.addChild(arrow.gfx);
        }
        this.toCircle();
        this.update();
    }

    toCircle() {
        let ballRotation = Math.PI / this.arrows.length;
        let centerDist = this.partRadius * calcCenter(ballRotation);
        for (let i = 0; i < this.arrows.length; i++) {
            let arrow = this.arrows[i];
            
            arrow.targetY = 0;
            arrow.targetScale = this.circleScale;
            arrow.targetRotation = 2 * ballRotation * i;
            arrow.targetBallRotation = ballRotation;
            arrow.targetCenterDist = centerDist;
        }
    }

    resetAnimation() {
        this.animationProgress = 0;
    }

    animateToLine() {
        this.resetAnimation();

        let spacing = 2 * this.partRadius * this.lineScale;
        let offsetY = -spacing * (this.arrows.length-1)/2;
        for (let i = 0; i < this.arrows.length; i++) {
            let arrow = this.arrows[i];
            
            arrow.targetY = offsetY + spacing * i;
            arrow.targetScale = this.lineScale;
            arrow.targetRotation = 0;
            arrow.targetBallRotation = 0;
            arrow.targetCenterDist = 0;
        }
    }

    animateToCircle() {
        this.resetAnimation();
        this.toCircle();
    }

    animate(deltaTime) {
        if (this.animationProgress == 1) return;

        this.animationProgress += deltaTime / this.animationDuration;
        if (this.animationProgress > 1) this.animationProgress = 1;

        this.update();
    }

    lerp(current, target) {
        return lerp(current, target, this.animationProgress);
    }

    update() {
        this.arrows.forEach(arrow => {
            arrow.gfx.y = this.lerp(arrow.gfx.y, arrow.targetY);
            arrow.gfx.scale.set(this.lerp(arrow.gfx.scale.x, arrow.targetScale));
            arrow.gfx.rotation = this.lerp(arrow.gfx.rotation, arrow.targetRotation);
            arrow.setBallRotation(this.lerp(arrow.ballRotation, arrow.targetBallRotation));
            arrow.setCenterDist(this.lerp(arrow.centerDist, arrow.targetCenterDist));
        });
    }
}
