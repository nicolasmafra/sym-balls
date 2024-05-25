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

function inradius(vertexAngle) {
    return 1 / Math.tan(vertexAngle);
}

function circumradius(vertexAngle) {
    return 1 / Math.sin(vertexAngle);
}

function lerp(start, end, progress) {
    return start + (end - start) * progress;
}

class Arrow {

    ballRotation = 0;
    targetBallRotation = 0;
    ballY = 0;
    targetBallY = 0;
    
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

    setBallY(ballY) {
        this.ballY = ballY;
        this.orig.y = -ballY;
        this.dest.y = -ballY;
    }
}

class ArrowGroup {

    ballRadius = 10;
    bubbleScale = 2;
    lineScale = 1.5;
    arrows = [];
    animationProgress = 1;
    animationDuration = 100;
    
    constructor(colors, mapping) {
        this.mapping = mapping;
        this.gfx = new PIXI.Container();
        for (let i = 0; i < mapping.length; i++) {
            let color1 = colors[i];
            let color2 = colors[mapping[i]];
            let arrow = new Arrow(color1, color2, this.ballRadius);
            this.arrows.push(arrow);
            this.gfx.addChild(arrow.gfx);
        }
        this.calcCicles();
        this.toBubbles();
        this.update();
    }

    calcCicles() {
        this.cicles = [
            [ 0, 1, 2 ],
            [ 3, 4 ]
        ]
    }

    toBubbles() {
        let yOffset = 0;
        for (let c = 0; c < this.cicles.length; c++) {
            let cicle = this.cicles[c];

            let vertexAngle = Math.PI / cicle.length;
            let ballY = this.ballRadius * inradius(vertexAngle);
            let bubbleRadius = this.bubbleScale * this.ballRadius * (1 + circumradius(vertexAngle));
            let y = yOffset + bubbleRadius;
            for (let i = 0; i < cicle.length; i++) {
                let index = cicle[i];
                let arrow = this.arrows[index];
                
                arrow.targetY = y;
                arrow.targetScale = this.bubbleScale;
                arrow.targetRotation = 2 * vertexAngle * i;
                arrow.targetBallRotation = vertexAngle;
                arrow.targetBallY = ballY;
            }
            yOffset += 2 * bubbleRadius;
        }
        this.arrows.forEach(a => a.targetY -= yOffset/2)
    }

    resetAnimation() {
        this.animationProgress = 0;
    }

    animateToLine() {
        this.resetAnimation();

        let spacing = 2 * this.ballRadius * this.lineScale;
        let offsetY = -spacing * (this.arrows.length-1)/2;
        for (let i = 0; i < this.arrows.length; i++) {
            let arrow = this.arrows[i];
            
            arrow.targetY = offsetY + spacing * i;
            arrow.targetScale = this.lineScale;
            arrow.targetRotation = 0;
            arrow.targetBallRotation = 0;
            arrow.targetBallY = 0;
        }
    }

    animateToBubbles() {
        this.resetAnimation();
        this.toBubbles();
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
            arrow.setBallY(this.lerp(arrow.ballY, arrow.targetBallY));
        });
    }
}
