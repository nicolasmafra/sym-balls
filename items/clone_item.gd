extends Item

class_name CloneItem

func _item_move():
	emit_signal("invalid_merge", self)
		
func _do_merging(drag_merge: DragMerge):
	DragMerge.clone_item(drag_merge, self)
	queue_free()
