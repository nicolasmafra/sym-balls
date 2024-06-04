let dragTarget = null;

function onDragStart() {
  if (this.item.locked) return;

  dragTarget = this;
  this.alpha = 0.7;
  this.parent.addChild(this);
}

function onDragMove(event) {
  if (!dragTarget) return;
  
  dragTarget.parent.toLocal(event.global, null, dragTarget.position);
}

function onDragEnd(event) {
  if (!dragTarget) return;

  board.children.find(child => {
    if (child != dragTarget
      && checkCollision(child, dragTarget)) {
        
      mergeBubbles(dragTarget, child);
      return true;
    }
  })

  dragTarget.alpha = 1;
  dragTarget = null;
}
