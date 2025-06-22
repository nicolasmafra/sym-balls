extends Control

func _ready():
	_load_values()

func _load_values():
	$VBoxContainer/ItemSize/ItemSizeSlider.value = GlobalVars.item_radius

func _on_item_size_slider_value_changed(value: float) -> void:
	GlobalVars.item_radius = value


func _on_reset_button_pressed() -> void:
	GlobalVars.reset_values()
	_load_values()


func _on_reset_progress_button_pressed() -> void:
	GlobalVars.course_progress.reset()
	$AcceptDialog.dialog_text = "Progress reseted."
	$AcceptDialog.popup_centered()
