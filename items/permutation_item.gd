extends Item
class_name PermutationItem

@export var permutation := Permutation.new({
	"1": "2",
	"2": "1",
	"3": "4",
	"4": "5",
	"5": "3",
})
@export var remove_trivial := true


signal eliminated()


static func load_scene() -> PackedScene:
	return preload("res://items/permutation_item.tscn")


func _ready() -> void:
	super._ready()

func set_permutation_dict(dict: Dictionary):
	permutation = Permutation.new(dict)


func _draw():
	var radius: float = $CollisionShape2D.shape.radius
	var color: Color
	var width: float
	if not active:
		color = Color.from_rgba8(0, 0, 0, 127)
		width = -1.0
	elif move_disabled:
		color = Color.BLACK
		width = 2.0
	else:
		color = Color.GRAY
		width = 1.0

	draw_circle(
		Vector2.ZERO, # center
		radius, # radius
		color, # color
		(width <= 0), # filled
		width, # width
		true # antialiased
	)
	var visual = _get_visual()
	visual.draw(self)

func _do_merging(drag_merge: DragMerge):
	if not drag_merge is PermutationItem:
		drag_merge.receive_merging(self)
		return

	var item := drag_merge as PermutationItem
	item.permutation.receive(permutation)
	get_parent().remove_child(self)
	queue_free()
	if remove_trivial:
		item.permutation.remove_trivial()
	if remove_trivial and item.permutation.is_identity():
		item.emit_signal("eliminated")
		item.queue_free()
	else:
		item.queue_redraw()
		EventBus.emit_signal("item_changed", item)

func clone() -> PermutationItem:
	var item := self.duplicate()
	item.active = active
	item.permutation = permutation.clone()
	return item

func _get_visual():
	if $Visual != null:
		return $Visual
	else:
		return get_tree().current_scene.get_node("Visual")
