extends Node2D
class_name TextVisual

@onready var font := preload("res://fonts/NotoSans-Regular.ttf") as FontFile
var presentation: Array[SinglePresentation]

func _ready():
	queue_redraw()


func draw(item: PermutationItem):
	var collision = item.get_node("CollisionShape2D")
	if collision == null:
		return
	var item_radius = collision.shape.radius
	
	var item_presentation := _get_permutation_presentation(item.permutation.dict)
	var text := str(item_presentation.data)
	var font_size = 24
	var alignment = HORIZONTAL_ALIGNMENT_CENTER
	var width = 2*item_radius
	var size := font.get_string_size(text, alignment, width, font_size)
	var pos := Vector2(-width/2.0, 0.2*size.y)
	item.draw_string(font, pos, text, alignment, width, font_size, Color.WHITE)
	

func _get_permutation_presentation(item_dict) -> SinglePresentation:
	for single in presentation:
		if single.dict == item_dict:
			return single
	return null
