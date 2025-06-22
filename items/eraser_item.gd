extends Item

class_name Eraser
		
func _do_merging(area: DragMerge):
	area.queue_free()
	queue_free()

func receive_merging(area: DragMerge):
	area.queue_free()
