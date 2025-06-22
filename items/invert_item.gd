extends Item

class_name InvertItem
		
func _do_merging(drag_merge: DragMerge):
	var item := drag_merge as Permutation
	var new_permutation := {}
	for key in item.permutation.keys():
		var value = item.permutation[key]
		new_permutation[value] = key
	item.set_permutation(new_permutation)
	item.queue_redraw()
	queue_free()
