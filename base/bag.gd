extends Area2D
class_name Bag

const INFINITY = -1
const label_ball_radius := 10.0


@export var count: int = INFINITY
@export var can_drop := true
var last_item: Item


signal used(bag: Bag)


func _ready():
	$Item.move_disabled = true
	$Item.merge_disabled = true
	queue_redraw()


func _draw():
	var radius = $Item/CollisionShape2D.shape.radius + 4
	draw_arc(
		Vector2.ZERO, # center
		radius, # radius
		0, TAU, 64, # start_angle, end_angle, point_count
		Color.BLACK, # color
		2.0, # width
		true # antialiased
	)
	
	var pos = (radius+label_ball_radius)*0.7
	draw_circle(Vector2(pos, pos), label_ball_radius, Color.BLACK)
	$Label.position.x = pos - 11.0
	$Label.position.y = pos - 12.0
	if count == INFINITY:
		$Label.text = str("∞")
	else:
		$Label.text = str(count)
	$Item.queue_redraw()
	$Label.queue_redraw()


func _input_event(_viewport, event, _shape_idx):
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed and (count > 0 or count == INFINITY):
				_pick()


func _pick():
	var item = $Item as Item
	last_item = item.clone_to(self)
	last_item.invalid_merge.connect(_on_invalid_merge)
	last_item.applied.connect(_on_applied)
	if can_drop:
		last_item.moved.connect(_on_moved)
	else:
		last_item.moved.connect(_on_invalid_merge)
	
	if count != INFINITY:
		count = count - 1
		queue_redraw()


func _remove_signal_handlers(item):
	item.invalid_merge.disconnect(_on_invalid_merge)
	item.applied.disconnect(_on_applied)
	item.moved.disconnect(_on_moved)
	last_item = null


func _on_invalid_merge(item: DragMerge):
	_remove_signal_handlers(item)
	item.queue_free()
	if count != INFINITY:
		count += 1
		queue_redraw()


func _on_applied(item: DragMerge):
	emit_signal("used", self)
	_remove_signal_handlers(item)
	if count == 0:
		queue_free()


func _on_moved(item: DragMerge):
	emit_signal("used", self)
	_remove_signal_handlers(item)
	if count == 0:
		queue_free()
