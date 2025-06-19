extends Item

class_name Eraser

func _item_move():
	emit_signal("invalid_merge", self)
		
func _do_merging(area: DragMerge):
	area.queue_free()
	queue_free()
