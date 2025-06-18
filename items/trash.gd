extends DragMerge

class_name Trash

func _item_move():
	emit_signal("invalid_merge", self)
		
func _do_merging(area: DragMerge):
	area.queue_free()
	queue_free()
