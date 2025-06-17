extends Area2D
class_name DragMerge

@export var active := true
var dragging := false
var initial_position: Vector2

signal invalid_merge(item: DragMerge)

func _input_event(viewport, event: InputEvent, shape_idx):
	if not active:
		return
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				dragging = true
				initial_position = global_position

func _input(event: InputEvent):
	if not active or not dragging:
		return
	
	if event is InputEventMouseMotion:
		global_position += event.relative
		
	elif event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if not event.pressed:
				dragging = false
				_check_merge()

func _check_merge():
	var another = _get_nearest_drag_merge()
	if another:
		if another.active:
			_do_merging(another)
		else:
			global_position = initial_position
			emit_signal("invalid_merge", self)
	else:
		_item_move()
		
func _do_merging(area: DragMerge):
	pass

func _item_move():
	pass
	
func _get_nearest_drag_merge() -> DragMerge:
	var areas := get_overlapping_areas()
	if areas.size() == 0:
		return null
	
	var nearest: DragMerge
	var minimum := 0
	
	for area in areas:
		if not area is DragMerge:
			continue
		var dist = global_position.distance_to(area.global_position)
		if nearest == null or dist < minimum:
			nearest = area as DragMerge
			minimum = dist
	return nearest
