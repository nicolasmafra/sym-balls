extends DragMerge
class_name Permutation

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
	var item := drag_merge as Permutation
	var new_permutation := _compose(self.permutation, item.permutation)
	_remove_trivial(new_permutation)
	item.permutation = new_permutation
	item.queue_redraw()
	queue_free()

static func _compose(composerPermutation: Dictionary, targetPermutation: Dictionary) -> Dictionary:
	var new_permutation := _merge_keys(targetPermutation, composerPermutation)
	for key in new_permutation.keys():
		key = int(key)
		if not targetPermutation.has(key):
			new_permutation[key] = composerPermutation[key]
		else:
			var value = int(targetPermutation[key])
			if not composerPermutation.has(value):
				new_permutation[key] = value
			else:
				new_permutation[key] = composerPermutation[value]
	return new_permutation
	
static func _merge_keys(perm1: Dictionary, perm2: Dictionary) -> Dictionary:
	var new_permutation := {}
	for k in perm1.keys():
		new_permutation[k] = true
	for k in perm2.keys():
		new_permutation[k] = true
	return new_permutation

func _remove_trivial(new_permutation: Dictionary):
	for key in new_permutation.keys().duplicate():
		if new_permutation[key] == key:
			new_permutation.erase(key)

func clone() -> Permutation:
	var item := self.duplicate()
	item.active = active
	item.permutation = permutation.duplicate()
	return item

func _get_visual():
	if $Visual != null:
		return $Visual
	else:
		return get_tree().get_root().get_children()[0].get_node("Visual")
