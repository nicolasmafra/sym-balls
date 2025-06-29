extends Item
class_name ChromaItem

@onready var sprite := Sprite2D.new()


func _do_merging(drag_merge: DragMerge):
	var item := drag_merge as PermutationItem
	var new_permutation_dict := {}
	for key in item.permutation.dict.keys():
		var value = item.permutation.dict[key]
		new_permutation_dict[_change_value(key)] = _change_value(value)
	item.set_permutation_dict(new_permutation_dict)
	item.queue_redraw()
	queue_free()

func _change_value(value):
	return str(int(value) + 1)

func _ready():
	super._ready()
	var radius: float = $CollisionShape2D.shape.radius
	var size := 2 * radius
	var image := Image.create(size, size, false, Image.FORMAT_RGBA8)

	for y in size:
		for x in size:
			var dx = x - radius
			var dy = y - radius
			var dist = sqrt(dx * dx + dy * dy)
			if dist <= radius:
				var angle = atan2(dy, dx)
				var hue = (angle + PI) / (PI * 2.0)
				var color = Color.from_hsv(hue, 1.0, 1.0)
				image.set_pixel(x, y, color)
			else:
				image.set_pixel(x, y, Color(0, 0, 0, 0))  # transparente fora do círculo

	image.generate_mipmaps()
	var texture := ImageTexture.create_from_image(image)

	sprite.texture = texture
	add_child(sprite)
	sprite.position = Vector2.ZERO
