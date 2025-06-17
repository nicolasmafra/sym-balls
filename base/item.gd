extends DragMerge
class_name Item

@export var permutation := {
	1: 2,
	2: 1,
	3: 4,
	4: 5,
	5: 3,
}

func _draw():
	var radius: float = $CollisionShape2D.shape.radius
	draw_arc(
		Vector2.ZERO, # center
		radius, # radius
		0, TAU, 64, # start_angle, end_angle, point_count
		Color.GRAY, # color
		1.0, # width
		true # antialiased
	)
	var visual = _get_visual()
	visual.draw(self)
	
func _ready():
	queue_redraw()

func _do_merging(drag_merge: DragMerge):
	if drag_merge._apply_item != null:
		drag_merge._apply_item(self)
	queue_free()

func _apply_item(item: Item):
	var new_permutation := _compose(item)
	_remove_trivial(new_permutation)
	
	permutation = new_permutation
	queue_redraw()

func _compose(item: Item) -> Dictionary:
	var new_permutation := _merge_keys(item)
	for key in new_permutation.keys():
		key = int(key)
		if not permutation.has(key):
			new_permutation[key] = item.permutation[key]
		else:
			var value = int(permutation[key])
			if not item.permutation.has(value):
				new_permutation[key] = value
			else:
				new_permutation[key] = item.permutation[value]
	return new_permutation
	
func _merge_keys(item: Item) -> Dictionary:
	var new_permutation = {}
	for k in permutation.keys():
		new_permutation[k] = true
	for k in item.permutation.keys():
		new_permutation[k] = true
	return new_permutation

func _remove_trivial(new_permutation: Dictionary):
	for key in new_permutation.keys().duplicate():
		if new_permutation[key] == key:
			new_permutation.erase(key)

func clone() -> Item:
	var item := self.duplicate()
	item.active = active
	item.permutation = permutation.duplicate()
	return item

func _get_visual():
	if $Visual != null:
		return $Visual
	else:
		return get_tree().get_root().get_children()[0].get_node("Visual")
