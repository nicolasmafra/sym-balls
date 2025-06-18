extends Node2D
class_name CycleVisual

var cycle_margin_ratio := 0.3
var cycle_angle_offset := PI
var ball_angle_offset := PI/2
var ball_angle_direction := 1


func _ready():
	queue_redraw()

func draw(item):
	var collision = item.get_node("CollisionShape2D")
	if collision == null:
		return
	var item_radius = collision.shape.radius
	
	var cycle_margin = cycle_margin_ratio * item_radius
	var permutation: Dictionary = item.permutation
	var cycles := Cycle.perm_to_cycles(permutation)
	
	var cycle_count = len(cycles)
	var cycle_radius = _minor_circle_radius(cycle_count, item_radius)
	var cycle_distance = item_radius - cycle_radius
	var angle_step = TAU/cycle_count
	for i in range(cycle_count):
		var angle = cycle_angle_offset + i * angle_step
		var cx = cycle_distance * cos(angle)
		var cy = cycle_distance * sin(angle)
		var cycle := cycles[i]
		_draw_cycle(item, cycle, cx, cy, cycle_radius - cycle_margin)

func _draw_cycle(item, cycle: Array, cx, cy, cycle_radius):
	var ball_count = len(cycle)
	var ball_radius = _minor_circle_radius(ball_count, cycle_radius)
	var ball_distance = cycle_radius - ball_radius
	var angle_step = TAU/ball_count
	for i in range(ball_count):
		var angle = ball_angle_offset + ball_angle_direction * i * angle_step
		var bx = cx + ball_distance * cos(angle)
		var by = cy + ball_distance * sin(angle)
		var value = cycle[i]
		_draw_ball(item, bx, by, ball_radius, value)


func _draw_ball(item, x: float, y: float, ball_radius: float, value):
	var color := Chroma.value_to_color(value)
	item.draw_circle(Vector2(x, y), ball_radius, color)


func _minor_circle_radius(n, R):
	return R / (1 + _polygon_ray(n, 2))


func _polygon_ray(n, s):
	if n < 2:
		return 0
	return s / (2 * sin(PI/n))
