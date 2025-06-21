extends Control

var data := _load_data()
var list: GridContainer

func _ready() -> void:
	list = $Control/CenterContainer/List
	$BackButton.interceptor = _on_back_button_pressed
	if GlobalVars.course_world_index < 0:
		_load_world_list()
	else:
		_load_level_list()


func _load_world_list():
	$Control/Label.text = "Subjects"
	_clear_list()
	for i in range(len(data.worlds)):
		var world = data.worlds[i]
		_add_button(world.name, func(): _select_world(i))
	_update_list()


func _select_world(index):
	$Control/Label.text = data.worlds[index].name + " - Lessons"
	GlobalVars.course_world_index = index
	_load_level_list()


func _load_level_list():
	_clear_list()
	var levels = data.worlds[GlobalVars.course_world_index].levels
	for i in range(len(levels)):
		var level = levels[i]
		_add_button(level.name, func(): _select_level(i))
	_update_list()


func _select_level(index):
	GlobalVars.course_level_index = index
	GlobalVars.course_level_info = data.worlds[GlobalVars.course_world_index].levels[index]
	get_tree().change_scene_to_file("res://game_scenes/course_mode.tscn")


func _clear_list():
	for child in list.get_children().duplicate():
		list.remove_child(child)
		child.queue_free()


func _add_button(name, callable):
	var button: Button = $ButtonTemplate.duplicate()
	button.visible = true
	button.text = name
	button.pressed.connect(callable)
	list.add_child(button)


func _update_list():
	var count = list.get_child_count()
	list.columns = ceil(count/3.0)


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
