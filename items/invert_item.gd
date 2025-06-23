extends Item

class_name InvertItem
		
func _do_merging(drag_merge: DragMerge):
	var item := drag_merge as PermutationItem
	var new_permutation_dict := {}
	for key in item.permutation.dict.keys():
		var value = item.permutation.dict[key]
		new_permutation_dict[value] = key
	item.set_permutation_dict(new_permutation_dict)
	item.queue_redraw()
	queue_free()
