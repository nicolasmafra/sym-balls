extends Control


func _ready() -> void:
	if OS.get_name() == "Web":
		$VBoxContainer/ExitButton.queue_free()

func _on_course_mode_button_pressed() -> void:
	GlobalVars.course_world_index = -1
	GlobalVars.course_level_index = -1
	get_tree().change_scene_to_file("res://menu_scenes/course_menu.tscn")

func _on_free_mode_button_pressed() -> void:
	get_tree().change_scene_to_file("res://game_scenes/free_mode.tscn")

func _on_settings_button_pressed() -> void:
	get_tree().change_scene_to_file("res://menu_scenes/settings.tscn")

func _on_exit_button_pressed() -> void:
	get_tree().quit()
