extends DragMerge
class_name ChromaItem

@onready var sprite := Sprite2D.new()

func _item_move():
	emit_signal("invalid_merge", self)

func _do_merging(drag_merge: DragMerge):
	var item := drag_merge as Item
	var new_permutation := {}
	for key in drag_merge.permutation.keys():
		key = int(key)
		var value = int(drag_merge.permutation[key])
		new_permutation[_change_value(key)] = _change_value(value)
	item.permutation = new_permutation
	item.queue_redraw()
	queue_free()

func _change_value(value):
	return value + 1

func _ready():
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

func clone():
	return self.duplicate()
