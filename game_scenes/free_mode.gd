extends Node2D

const item_margin_ratio = 2/3.0
const item_y_margin = 16.0

func _process(delta):
	var screen_size = get_viewport_rect().size
	$BottomControls.position.y = screen_size.y
	var offset = (item_margin_ratio + 1)*GlobalVars.item_radius
	for i in range($BottomControls.get_child_count()):
		var child = $BottomControls.get_children()[i]
		child.position.x = offset + (item_margin_ratio + 2)*i*GlobalVars.item_radius
		if child is Bag:
			child.position.y = -GlobalVars.item_radius - item_y_margin
