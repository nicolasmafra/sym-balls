const board = new PIXI.Container();

function initGfx(app) {
  board.x = app.screen.width / 2;
  board.y = app.screen.height / 2;
}

const ballSpace = 10;
const bubbleMargin = 10;
const ballRadius = 4;

function createBubble(item) {
  let perm = item.perm;
  let bubble = new PIXI.Graphics();
  bubble.moveable = !item.locked;
  bubble.item = {
    ...level.board,
    ...item,
  };
  bubble.radius = perm.length * ballSpace / 2 + bubbleMargin;
  bubble.circle(0, 0, bubble.radius);
  if (item.locked) {
    bubble.fill(0x605040, 1);
  } else {
    bubble.fill(0xffffff, 0.2);
  }
  let yOffset = -(perm.length - 1) * ballSpace / 2;
  for (let i = 0; i < perm.length; i++) {
    let color1 = parsedColors[i];
    let color2 = parsedColors[perm[i]];
    let y = yOffset + i * ballSpace;
    let x = ballSpace / 2;
    bubble.circle(-x, y, ballRadius);
    bubble.fill(color1, 1);
    bubble.circle(+x, y, ballRadius);
    bubble.fill(color2, 1);
  }
  bubble.eventMode = 'static';
  bubble.on('pointerdown', onPointerDown, bubble);
  bubble.cursor = 'pointer';
  board.addChild(bubble);
  return bubble;
}

function checkCollision(b1, b2) {
  return b1.radius && b2.radius &&
    Math.hypot(b1.x - b2.x, b1.y - b2.y) <
    b1.radius + b2.radius;
}

function newBtn(i, text, fn) {
  const width = 400;
  const height = 40;
  const spacing = 10;
  let btn = new PIXI.Graphics();
  btn.roundRect(-width / 2, -height / 2, width, height, 5);
  btn.fill(0x888888);
  let btnText = new PIXI.Text({
    text,
    style: {
      align: 'center',
    }
  })
  btnText.anchor.x = 0.5;
  btnText.anchor.y = 0.5;
  btn.addChild(btnText);
  btn.eventMode = 'static';
  btn.on('pointerdown', fn);
  btn.cursor = 'pointer';
  btn.x = app.renderer.width / 2;
  btn.y = (spacing + height) * (0.5 + i);
  return btn;
}
