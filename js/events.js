let pointerTarget = null;
let lastTarget = null;
let moveableTarget = null;
let lastPointerDownTime = 0;
const tapDuration = 200;
const doubleTapDuration = 400;
const longPressDuration = 600;
let clickCount = 0;
let timeoutId = null;

function initEvents(app) {
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerdown', onPointerDown);
  app.stage.on('pointermove', onPointerMove);
  app.stage.on('pointerup', onPointerUp);
  app.stage.on('pointerupoutside', onPointerUp);
}

function onPointerDown() {
  if (pointerTarget) return;

  console.log('pointerdown: ', this)
  let now = new Date().getTime();
  if (this != lastTarget || (now - lastPointerDownTime) > doubleTapDuration) {
    clickCount = 0;
  }
  lastPointerDownTime = now;

  cancelEventTimeout();
  timeoutId = setTimeout(onLongPress, longPressDuration);
  pointerTarget = this;
  lastTarget = this;
  if (this.moveable) moveableTarget = this;

  onPointerDownDo(this);
}

function onPointerMove(event) {
  cancelEventTimeout();
  if (!moveableTarget) return;
  
  onPointerMoveDo(moveableTarget, event);
}

function onPointerUp() {
  console.log('pointerup: ', pointerTarget)
  cancelEventTimeout();
  if (!pointerTarget) return;

  let now = new Date().getTime();
  if ((now - lastPointerDownTime) < tapDuration) {
    clickCount++;
    const obj = pointerTarget;
    if (clickCount == 1) {
      timeoutId = setTimeout(() => onTap(obj), doubleTapDuration);
    }
    if (clickCount == 2) {
      onDoubleTap(obj);
    }
  } else {
    clickCount = 0;
  }

  if (moveableTarget) {
    onPointerMoveEndDo(moveableTarget);
    board.children.find(child => {
      if (child != pointerTarget && checkCollision(child, pointerTarget)) {
        onCollisionDo(pointerTarget, child);
        return true;
      }
    })
  }
  onPointerUpDo(pointerTarget);
  pointerTarget = null;
  moveableTarget = null;
}

function cancelEventTimeout() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

function onLongPress() {
  if (!timeoutId) return;

  console.log('longpress: ', pointerTarget)
  cancelEventTimeout();

  if (moveableTarget) onPointerMoveEndDo(moveableTarget)
  onLongPressdo(pointerTarget);
  pointerTarget = null;
  moveableTarget = null;
}

function onTap(object) {
  console.log('tap: ', object)
  onTapDo(object)
}

function onDoubleTap(object) {
  console.log('double tap: ', object)
  onDoubleTapDo(object)
}

function checkCollision(b1, b2) {
  return b1.radius && b2.radius &&
    Math.hypot(b1.x - b2.x, b1.y - b2.y) <
    b1.radius + b2.radius;
}
