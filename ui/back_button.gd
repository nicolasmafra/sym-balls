extends Button
class_name BackButton

var interceptor: Callable


func _ready() -> void:
	var current_scene = get_tree().current_scene.scene_file_path
	if len(GlobalVars.scene_stack) == 0 or current_scene != GlobalVars.scene_stack[-1]:
		GlobalVars.scene_stack.append(current_scene)


static func do_back(tree):
	GlobalVars.scene_stack.pop_back() # pop current scene
	var scene_path = GlobalVars.scene_stack.pop_back()
	if scene_path:
		tree.change_scene_to_file(scene_path)
	else:
		tree.quit()


func _do_back():
	if interceptor:
		var result = interceptor.call()
		if not result:
			return
	do_back(get_tree())


func _input(event):
	if Input.is_action_pressed("ui_cancel"):
		_do_back()


func _on_pressed() -> void:
	_do_back()
