extends Node2D

const fixed_item_margin_top := 100.0
const item_scene: PackedScene = preload("res://base/permutation.tscn")

var data = GlobalVars.course_level_data

func _ready() -> void:
	$AcceptDialog.connect("confirmed", _on_success_confirmed)
	var screen_size = get_viewport().get_visible_rect().size
	_update_controls_position()
	if data.has("hint"):
		var label = $Label
		label.size.x = screen_size.x
		label.text = data.hint
	_load_pod_items()
	_load_objective()


func _process(delta):
	_update_controls_position()


func _update_controls_position():
	var screen_size = get_viewport_rect().size
	$Pod.position.y = screen_size.y


func _load_pod_items():
	var permutations = data.pod
	for perm in permutations:
		var item : Permutation = item_scene.instantiate()
		item.set_permutation(perm)
		item.queue_redraw()
		$Pod/AllItemsContainer.add_child(item)
	$Pod.update_items()


func _load_objective():
	var screen_size = get_viewport().get_visible_rect().size
	if data.to_resolve:
		var item = item_scene.instantiate()
		item.set_permutation(data.to_resolve)
		item.queue_redraw()
		item.move_disabled = true
		item.eliminated.connect(_success)
		item.position.y = fixed_item_margin_top + GlobalVars.item_radius
		item.position.x = screen_size.x/2
		add_child(item)


func _success(item):
	var screen_size = get_viewport().get_visible_rect().size
	$DimBackground.size = screen_size
	$DimBackground.visible = true
	$AcceptDialog.dialog_text = "You did it!"
	$AcceptDialog.popup_centered()


func _on_success_confirmed():
	BackButton.do_back(get_tree())
