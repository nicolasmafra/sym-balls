extends DragMerge

class_name InvertItem

func _item_move():
	emit_signal("invalid_merge", self)
		
func _do_merging(drag_merge: DragMerge):
	var item := drag_merge as Permutation
	var new_permutation := {}
	for key in item.permutation.keys():
		key = int(key)
		var value = int(item.permutation[key])
		new_permutation[value] = key
	item.permutation = new_permutation
	item.queue_redraw()
	queue_free()
