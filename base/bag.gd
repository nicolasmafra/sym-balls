extends Area2D
class_name Bag

const INFINITY = -1
@export var count: int = INFINITY
var last_item: DragMerge

func _draw():
	var radius = $Item.get_node("CollisionShape2D").shape.radius
	draw_arc(
		Vector2.ZERO, # center
		radius + 4.0, # radius
		0, TAU, 64, # start_angle, end_angle, point_count
		Color.BLACK, # color
		2.0, # width
		true # antialiased
	)
	var pos = radius
	draw_circle(Vector2(pos, pos), 10, Color.BLACK)
	if count == INFINITY:
		$Label.text = str("∞")
	else:
		$Label.text = str(count)
	$Item.queue_redraw()
	$Label.queue_redraw()

func _ready():
	$Item.active = false
	queue_redraw()

func _input_event(viewport, event, shape_idx):
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				_pick()

func _input(event):
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if not event.pressed and last_item != null:
				last_item.invalid_merge.disconnect(_on_invalid_merge)
				last_item = null

func _pick():
	last_item = DragMerge.clone_item($Item, self)
	
	if count == INFINITY:
		return
	count = count - 1
	if count == 0:
		queue_free()
	else:
		queue_redraw()

func _on_invalid_merge(item: DragMerge):
	print('invalid merge. item:', item)
	item.queue_free()
	if count != INFINITY:
		count += 1
		queue_redraw()
	print('count:', count)
