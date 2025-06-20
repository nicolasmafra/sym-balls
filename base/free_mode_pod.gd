extends Pod

class_name FreeModePod

const item_scene: PackedScene = preload("res://base/permutation.tscn")

func update_items():
	_set_button_visibility($LeftButton, page > 0)

	_clear_page()
	
	var page_offset = page * page_size
	for i in range(page_size):
		var key = str(2 + page_offset + i)
		var value = "1" #str(1 + page_offset + i)
		var permutation = {
			value: key,
			key: value,
		}
		var item : Permutation = item_scene.instantiate()
		item.set_permutation(permutation)
		_add_page_item(item, i)
