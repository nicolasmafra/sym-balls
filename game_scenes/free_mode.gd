extends Node2D

func _process(delta):
	var screen_size = get_viewport_rect().size
	$BottomControls.position.y = screen_size.y


func _on_back_button_pressed() -> void:
	get_tree().change_scene_to_file("res://game_scenes/main_menu.tscn")


func _input(event):
	if Input.is_action_pressed("ui_cancel"):
		_on_back_button_pressed()
