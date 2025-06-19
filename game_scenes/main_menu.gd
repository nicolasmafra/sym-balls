extends Control


func _on_free_mode_button_pressed() -> void:
	get_tree().change_scene_to_file("res://game_scenes/free_mode.tscn")


func _on_exit_button_pressed() -> void:
	get_tree().quit()


func _input(event):
	if Input.is_action_pressed("ui_cancel"):
		_on_exit_button_pressed()
