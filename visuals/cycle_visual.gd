extends Node2D
class_name CycleVisual

var item_padding_ratio := 0.1
var cycle_margin_ratio := 0.1
var cycle_angle_offset := PI/2
var cycle_angle_direction := 1
var ball_angle_offset := 3*PI/4
var ball_angle_direction := 1

var key_radius_ratio := 0.9
var value_radius_ratio := 0.0
var border_width_ratio := 0.1
var border_color := Color.from_rgba8(0, 0, 0, 127)

func _ready():
	queue_redraw()

func draw(item):
	var collision = item.get_node("CollisionShape2D")
	if collision == null:
		return
	var item_radius = collision.shape.radius
	
	var permutation: Dictionary = item.permutation.dict
	var cycles := Cycle.perm_to_cycles(permutation)
	
	var cycle_count = len(cycles)
	if len(cycles) >= 7:
		cycle_count -= 1 # cycle on center

	var item_effective_radius = (1 - item_padding_ratio) * item_radius
	var cycle_radius = _minor_circle_radius(cycle_count, item_effective_radius)
	var cycle_distance = item_effective_radius - cycle_radius
	var cycle_margin = cycle_margin_ratio * cycle_radius
	cycle_radius -= cycle_margin
	var angle_step = TAU/cycle_count
	var angle_offset = cycle_angle_offset + PI / cycle_count
	for i in range(cycle_count):
		var angle = angle_offset + cycle_angle_direction * i * angle_step
		var cx = cycle_distance * cos(angle)
		var cy = cycle_distance * sin(angle)
		var cycle := cycles[i]
		_draw_cycle(item, cycle, cx, cy, cycle_radius)
	if len(cycles) >= 7:
		var last_cycle = cycles[-1] # cycle on center
		_draw_cycle(item, last_cycle, 0, 0, cycle_radius)

func _draw_cycle(item, cycle: Array, cx, cy, cycle_radius):
	var ball_count = len(cycle)
	var ball_radius = _minor_circle_radius(ball_count, cycle_radius)
	var ball_distance = cycle_radius - ball_radius
	var angle_step = TAU/ball_count
	for i in range(ball_count):
		var angle = ball_angle_offset + ball_angle_direction * i * angle_step
		var bx = cx + ball_distance * cos(angle)
		var by = cy + ball_distance * sin(angle)
		var key = cycle[i]
		var value = cycle[(i + 1) % ball_count]
		_draw_pair(item, bx, by, ball_radius, key, value)


func _draw_pair(item, x: float, y: float, ball_radius: float, key, value):
	_draw_ball(item, x, y, key_radius_ratio*ball_radius, key)
	if value_radius_ratio > 0:
		_draw_ball(item, x, y, value_radius_ratio*ball_radius, value)

func _draw_ball(item: PermutationItem, x: float, y: float, ball_radius: float, ball_value):
	var color := Chroma.value_to_color(ball_value)
	item.draw_circle(Vector2(x, y), ball_radius, color, true, -1, true)
	var border_width = border_width_ratio * ball_radius
	item.draw_circle(Vector2(x, y), ball_radius, border_color, false, border_width, true)


func _minor_circle_radius(n, R):
	return R / (1 + _polygon_ray(n, 2))


func _polygon_ray(n, s):
	if n < 2:
		return 0
	return s / (2 * sin(PI/n))
