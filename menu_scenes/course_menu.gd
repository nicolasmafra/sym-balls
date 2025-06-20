extends Control

var data := _load_data()


func _ready() -> void:
	$BackButton.interceptor = _on_back_button_pressed
	if GlobalVars.course_world_index < 0:
		_load_world_list()
	else:
		_load_level_list()


func _load_world_list():
	$Control/Label.text = "Select Subject"
	_clear_list()
	for i in range(len(data.worlds)):
		var world = data.worlds[i]
		_add_button(world.name, func(): _select_world(i))


func _select_world(index):
	$Control/Label.text = data.worlds[index].name + ": Select Lesson"
	GlobalVars.course_world_index = index
	_load_level_list()


func _load_level_list():
	_clear_list()
	var levels = data.worlds[GlobalVars.course_world_index].levels
	for i in range(len(levels)):
		var level = levels[i]
		_add_button(level.name, func(): _select_level(i))


func _select_level(index):
	GlobalVars.course_level_index = index
	GlobalVars.course_level_data = data.worlds[GlobalVars.course_world_index].levels[index]
	get_tree().change_scene_to_file("res://game_scenes/course_mode.tscn")


func _clear_list():
	for child in $Control/List.get_children().duplicate():
		$Control/List.remove_child(child)
		child.queue_free()


func _add_button(name, callable):
	var button: Button = $ButtonTemplate.duplicate()
	button.visible = true
	button.text = name
	button.pressed.connect(callable)
	$Control/List.add_child(button)


func _load_data() -> Dictionary:
	var file = FileAccess.open("res://data/courses.json", FileAccess.READ)
	var content = file.get_as_text()
	file.close()
	
	return JSON.parse_string(content) as Dictionary


func _on_back_button_pressed() -> bool:
	if GlobalVars.course_world_index < 0:
		return true
	else:
		GlobalVars.course_world_index = -1
		_load_world_list()
		return false
