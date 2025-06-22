extends Area2D
class_name DragMerge

@export var active := true
@export var move_disabled := false
@export var merge_disabled := false
var dragging := false
var initial_position: Vector2

signal invalid_merge(item: DragMerge)
signal applied(item: DragMerge)
signal moved(item: DragMerge)

func _input_event(viewport, event: InputEvent, shape_idx):
	if move_disabled or not active:
		return
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				dragging = true
				get_parent().move_child(self, get_parent().get_child_count() - 1)
				initial_position = global_position

func _input(event: InputEvent):
	if move_disabled or not active or not dragging:
		dragging = false
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
		if another.active and not another.merge_disabled:
			_do_merging(another)
			emit_signal("applied", self)
		else:
			global_position = initial_position
			emit_signal("invalid_merge", self)
	else:
		_item_move()
		emit_signal("moved", self)
		
func _do_merging(area: DragMerge):
	pass

func receive_merging(area: DragMerge):
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

func clone():
	return self.duplicate()

func clone_to(target) -> DragMerge:
	var item:DragMerge = clone()
	item.active = true
	item.merge_disabled = false
	item.move_disabled = false
	item.dragging = true
	item.initial_position = target.global_position
	item.global_position = target.global_position
	if target.has_method("_on_invalid_merge") and "invalid_merge" in item:
		item.invalid_merge.connect(target._on_invalid_merge)
	
	target.get_tree().current_scene.call_deferred("add_child", item)
	item.queue_redraw()
	return item
