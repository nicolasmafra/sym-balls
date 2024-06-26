let level = {}


let parsedColors = [];

function restartLevel() {
  app.stage.removeChildren();
  board.removeChildren();
  app.stage.addChild(board);

  parsedColors = level.colors.map(color => new PIXI.Color(color));

  let n = Math.ceil(Math.sqrt(
    level.items.length));
  let m = Math.ceil(level.items.length / n)
  let size = 100;
  let x0 = -size * (n - 1) / 2;
  let y0 = -size * (m - 1) / 2;
  level.items.forEach((item, i) => {
    let row = Math.floor(i / n);
    let col = i - row * n;
    let x = x0 + col * size;
    let y = y0 + row * size;
    let bubble = createBubble(item);
    bubble.x = x;
    bubble.y = y;
  });
}

function mergePerms(first, second) {
  return first.map(b => second[b]);
}

function onPointerDownDo(object) {
  if (!object.item || object.item.locked) return;

  object.alpha = 0.7;
  object.parent.addChild(object); // bring to front
}

function onPointerMoveDo(object, event) {
  if (!object.item || object.item.locked) return;

  object.parent.toLocal(event.global, null, object.position);
}

function onPointerMoveEndDo(object, event) {
  if (!object.item || object.item.locked) return;

  object.alpha = 1;
  object = null;
}

function onPointerUpDo(object) {

}

function onTapDo(object) {
  if (!object.item) return;

  if (object.item.allowInvert) invertBubble(object);
}

function onDoubleTapDo(object) {
  if (!object.item) return;

  if (object.item.allowDuplicate) duplicateBubble(object);
}

function onLongPressdo(object) {
  if (!object.item) return;

  if (object.item.allowDelete) deleteBubble(object);
}

function onCollisionDo(top, bottom) {
  mergeBubbles(top, bottom);
}

function invertBubble(bubble) {
  let newPerm = inverseArray(bubble.item.perm);
  let newBubble = createBubble({
    ...bubble.item,
    perm: newPerm,
  });
  newBubble.position.copyFrom(bubble.position)
  board.removeChild(bubble);
}

function duplicateBubble(bubble) {
  let newBubble = createBubble({
    ...bubble.item,
  });
  newBubble.position.copyFrom(bubble.position)
  bubble.x -= bubble.radius*1.1;
  newBubble.x += bubble.radius*1.1;
}

function deleteBubble(bubble) {
  board.removeChild(bubble);
}

function mergeBubbles(top, bottom) {
  let perm = mergePerms(bottom.item.perm, top.item.perm);
  let newBubble = createBubble({
    ...bottom.item,
    perm,
  });
  newBubble.position.copyFrom(bottom.position)
  board.removeChild(top, bottom);

  checkWinning();
}

function checkWinning() {
  if (board.children.length != 1) return;

  let last = board.children[0];
  let equalsTarget = last.item.perm.every((value, index) => value === level
    .targetPerm[index]);
  setTimeout(() => {
    if (equalsTarget) {
      alert('You won!');
    } else {
      alert('You lost!');
    }
  }, 100);
}

function inverseArray(array) {
  let result = Array(array.length);
  for (let i = 0; i < array.length; i++) {
    const j = array[i];
    result[j] = i;
  }
  return result;
}