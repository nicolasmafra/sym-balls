extends Node2D

class_name Scroll

@export var count_shown := 5

const color := Color.DARK_SLATE_GRAY
const border := 2.0
const item_radius := 44.0
const button_radius := item_radius

var width := 2 * item_radius * count_shown + 2 * button_radius
var scroll_page = 0

const item_scene: PackedScene = preload("res://base/permutation.tscn")
const bag_scene: PackedScene = preload("res://base/bag.tscn")

func _ready() -> void:
	$ItemsContainer.position.x = button_radius
	$RightButton.position.x = width - 33 - 7
	_update_items()

func _draw():
	draw_arc(
		Vector2(button_radius, button_radius), # center
		button_radius/2, # radius
		PI/2, TAU-PI/2, 64, # start_angle, end_angle, point_count
		color, # color
		button_radius, # width
		true # antialiased
	)
	draw_arc(
		Vector2(width - button_radius, button_radius), # center
		button_radius/2, # radius
		-PI/2, PI/2, 64, # start_angle, end_angle, point_count
		color, # color
		button_radius, # width
		true # antialiased
	)
	draw_line(
		Vector2(button_radius, border/2), # from
		Vector2(width - button_radius, border/2), # to
		color, # color
		border, # width
		true # antialiased
	)
	draw_line(
		Vector2(button_radius, 2*button_radius - border/2), # from
		Vector2(width - button_radius, 2*button_radius - border/2), # to
		color, # color
		border, # width
		true # antialiased
	)

func _on_left_button_pressed() -> void:
	scroll_page -= 1
	if scroll_page == 0:
		$LeftButton.disabled = true
	_update_items()

func _on_right_button_pressed() -> void:
	scroll_page += 1
	$LeftButton.disabled = false
	_update_items()

func _update_items():
	var children = $ItemsContainer.get_children()
	for child in children:
		child.free()
	
	var n = scroll_page * count_shown
	for i in range(count_shown):
		var item : Permutation = item_scene.instantiate()
		item.permutation = {
			1: (2 + n + i),
			(2 + n + i): 1,
		}
		var bag : Bag = bag_scene.instantiate()
		item.name = "Item"
		bag.add_child(item)
		bag.position = Vector2(item_radius + i*2*item_radius, item_radius)
		$ItemsContainer.add_child(bag)
