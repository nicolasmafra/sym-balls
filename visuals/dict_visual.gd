extends Node2D
class_name DictVisual

func _ready():
	queue_redraw()

func draw(item):
	var collision = item.get_node("CollisionShape2D")
	if collision == null:
		return
	var radius: float = collision.shape.radius
	
	var permutation: Dictionary = item.permutation
	var step := 2.0 * radius / (permutation.size() + 1)
	var ball_radius := step / 2.0
	var x0 := -step * (permutation.size() - 1) / 2.0
	var index := 0
	var keys := permutation.keys()
	keys.sort()
	for key in keys:
		var value = permutation[key]
		var x := x0 + index*step
		_draw_ball(item, x, -ball_radius, ball_radius, key)
		_draw_ball(item, x, ball_radius, ball_radius, value)
		index += 1

func _draw_ball(item, x: float, y: float, ball_radius: float, value):
	var color := Chroma.value_to_color(value)
	item.draw_circle(Vector2(x, y), ball_radius, color)
