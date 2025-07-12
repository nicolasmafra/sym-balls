extends Node2D

const fixed_item_margin_top := 180.0
const text_margin := 125.0

var item_scene := PermutationItem.load_scene()
var data := CourseData.new(GlobalVars.course_level_info)
var pod_uses = 0

func _ready() -> void:
	var screen_size = get_viewport().get_visible_rect().size
	_update_controls_position()
	if data.hint != null:
		var label = $Label
		label.size.x = screen_size.x - 2*text_margin
		label.position.x = text_margin
		label.text = data.hint
	_load_pod_items()
	_load_objective()
	$Pod.bag_used.connect(_on_bag_used)


func _process(_delta):
	_update_controls_position()


func _update_controls_position():
	var screen_size = get_viewport_rect().size
	$Pod.position.y = screen_size.y


func _load_pod_items():
	var permutations = data.pod
	for perm in permutations:
		var item : PermutationItem = item_scene.instantiate()
		item.set_permutation_dict(perm)
		item.queue_redraw()
		$Pod/AllItemsContainer.add_child(item)
	$Pod.update_items()


func _load_objective():
	for perm in data.to_solve:
		var item = _add_item(perm)
		item.eliminated.connect(_success)
	for perm in data.to_make:
		var item = _add_item(perm)
		item.active = false
		item.queue_redraw()
		EventBus.item_changed.connect(_on_item_changed)
	_update_item_positions()


func _add_item(permutation) -> PermutationItem:
	var item = item_scene.instantiate()
	item.set_permutation_dict(permutation)
	item.move_disabled = true
	item.queue_redraw()
	$ObjectiveItems.add_child(item)
	return item


func _update_item_positions():
	var screen_size = get_viewport().get_visible_rect().size
	var children = $ObjectiveItems.get_children()
	var count = len(children)
	var offset = (count - 1) * GlobalVars.item_radius
	for i in range(count):
		var item = children[i]
		item.position.y = fixed_item_margin_top + GlobalVars.item_radius
		item.position.x = screen_size.x/2 - offset + i * 2 * GlobalVars.item_radius


func _check_make_all_objective(permutations_to_make):
	var existing_permutations = []
	for child in get_children():
		if child is PermutationItem:
			existing_permutations.append(child.permutation.dict)
	for to_make in permutations_to_make:
		var found = false
		for existing in existing_permutations:
			if to_make == existing:
				found = true
				break
		if not found:
			return false
	return true


func _success():
	var screen_size = get_viewport().get_visible_rect().size
	$DimBackground.size = screen_size
	$DimBackground.visible = true
	move_child($DimBackground, get_child_count() - 1)
	$AcceptDialog.dialog_text = "You did it!"
	$AcceptDialog.popup_centered()
	
	GlobalVars.winning_stats = {
		"passed": true,
		"star": false,
	}
	if pod_uses <= data.star_moves:
		GlobalVars.winning_stats.star = true
	else:
		print("Pod uses: ", pod_uses)
		print("Star moves: ", data.star_moves)


func _on_accept_dialog_confirmed() -> void:
	BackButton.do_back(get_tree())


func _on_accept_dialog_canceled() -> void:
	BackButton.do_back(get_tree())


func _on_reload_button_pressed() -> void:
	get_tree().reload_current_scene()


func _on_item_changed(item) -> void:
	var permutations = data.to_make
	if len(permutations) == 1:
		if item.permutation.dict == permutations[0]:
			_success()
	elif _check_make_all_objective(permutations):
		_success()


func _on_bag_used(bag: Bag):
	pod_uses += 1
