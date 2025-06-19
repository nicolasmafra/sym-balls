extends Button


func _on_pressed() -> void:
	_go_to_main_menu()


func _input(event):
	if Input.is_action_pressed("ui_cancel"):
		_go_to_main_menu()


func _go_to_main_menu():
	get_tree().change_scene_to_file("res://game_scenes/main_menu.tscn")


func _on_item_size_slider_value_changed(value: float) -> void:
	pass # Replace with function body.
