extends Item

class_name CloneItem
		
func _do_merging(drag_merge: DragMerge):
	drag_merge.clone_to(self)
	queue_free()
