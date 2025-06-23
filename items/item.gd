extends DragMerge

class_name Item


func _ready():
	$CollisionShape2D.shape.radius = GlobalVars.item_radius
	if $Label != null:
		var label := $Label as Label
		var ratio = GlobalVars.item_radius/30
		label.scale.x = ratio
		label.scale.y = ratio
	queue_redraw()
