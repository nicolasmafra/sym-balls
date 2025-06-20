extends Area2D
class_name Bag

const INFINITY = -1
@export var count: int = INFINITY
var last_item: DragMerge
const label_ball_radius := 10.0


func _ready():
	$Item.active = false
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
	item.queue_free()
	if count != INFINITY:
		count += 1
		queue_redraw()
