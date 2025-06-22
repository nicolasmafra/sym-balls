extends Control

var data := _load_data()
var list: GridContainer
var gray_label_settings

func _ready() -> void:
	GlobalVars.course_progress.load()
	_check_winning()
	gray_label_settings = $ButtonTemplate/Check.label_settings.duplicate()
	gray_label_settings.font_color = Color.from_rgba8(0, 0, 0, 63)
	list = $Control/CenterContainer/List
	$BackButton.interceptor = _on_back_button_pressed
	if GlobalVars.course_world_index < 0:
		_load_world_list()
	else:
		_load_level_list()


func _check_winning():
	if GlobalVars.winning_stats == {}:
		return
	var world = data.worlds[GlobalVars.course_world_index]
	var level = world.levels[GlobalVars.course_level_index]
	GlobalVars.course_progress.save_progress(world.code, level.code, GlobalVars.winning_stats, data)
	GlobalVars.winning_stats = {}


func _load_world_list():
	$Control/Label.text = "Subjects"
	_clear_list()
	for i in range(len(data.worlds)):
		var world = data.worlds[i]
		var stats = GlobalVars.course_progress.get_world_progress(world.code)
		_add_button(world.name, func(): _select_world(i), stats)
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
		var stats = GlobalVars.course_progress.get_level_progress(level.code)
		_add_button(level.name, func(): _select_level(i), stats)
	_update_list()


func _select_level(index):
	GlobalVars.course_level_index = index
	GlobalVars.course_level_info = data.worlds[GlobalVars.course_world_index].levels[index]
	get_tree().change_scene_to_file("res://game_scenes/course_mode.tscn")


func _clear_list():
	for child in list.get_children().duplicate():
		list.remove_child(child)
		child.queue_free()


func _add_button(text, callable, stats):
	var button: Button = $ButtonTemplate.duplicate()
	button.visible = true
	button.text = text
	button.pressed.connect(callable)
	var check: Label = button.get_node("Check")
	var star: Label = button.get_node("Star")
	if not stats.passed:
		check.label_settings = gray_label_settings
		star.visible = false
	elif not stats.star:
		star.text = "☆"
		star.label_settings = gray_label_settings
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
