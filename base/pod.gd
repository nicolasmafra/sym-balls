extends Node2D
class_name Pod


const bag_scene: PackedScene = preload("res://base/bag.tscn")
const color := Color.BLACK
const border := 2.0
const item_radius_margin := 14.0


signal bag_used(bag: Bag)
signal bag_item_dropped(item: PermutationItem)


@export var page_size := 5

var item_radius := -1
var button_radius := -1
var width := -1
var page = 0

signal paged(page: int)


func _ready() -> void:
	item_radius = GlobalVars.item_radius + item_radius_margin
	button_radius = item_radius
	width = 2 * item_radius * page_size + 2 * button_radius
	$Page.position.x = button_radius
	$LeftButton.position.y = -button_radius - $LeftButton.size.y/2
	$RightButton.position.y = -button_radius - $RightButton.size.y/2
	$LeftButton.position.x = button_radius - $LeftButton.size.x
	$RightButton.position.x = width - button_radius
	update_items()


func _draw():
	draw_arc(
		Vector2(button_radius, -button_radius), # center
		button_radius/2, # radius
		PI/2, TAU-PI/2, 64, # start_angle, end_angle, point_count
		color, # color
		button_radius, # width
		true # antialiased
	)
	draw_arc(
		Vector2(width - button_radius, -button_radius), # center
		button_radius/2, # radius
		-PI/2, PI/2, 64, # start_angle, end_angle, point_count
		color, # color
		button_radius, # width
		true # antialiased
	)
	draw_line(
		Vector2(button_radius, -border/2), # from
		Vector2(width - button_radius, -border/2), # to
		color, # color
		border, # width
		true # antialiased
	)
	draw_line(
		Vector2(button_radius, -(2*button_radius - border/2)), # from
		Vector2(width - button_radius, -(2*button_radius - border/2)), # to
		color, # color
		border, # width
		true # antialiased
	)


func update_items():
	var all_children := $AllItemsContainer.get_children()
	var total_items = len(all_children)
	var total_pages = ceil(total_items / float(page_size))
	var is_last_page = (page >= total_pages - 1)
	
	_set_button_visibility($LeftButton, page > 0)
	_set_button_visibility($RightButton, not is_last_page)
	
	_clear_page()
	
	
	var page_offset = page_size * page
	var current_page_size = min(page_size, total_items - page_offset)
	for i in range(current_page_size):
		var original_item: Item = all_children[page_offset + i]
		var item = original_item.clone()
		item.set_permutation_dict(original_item.permutation.dict)
		_add_page_item(item, i)
	
	queue_redraw()


func _clear_page():
	var page_children = $Page.get_children()
	for page_child in page_children:
		page_child.free()
	

func _add_page_item(item, i):
		var bag : Bag = bag_scene.instantiate()
		item.name = "Item"
		bag.add_child(item)
		bag.position = Vector2(item_radius + i*2*item_radius, -item_radius)
		bag.used.connect(_on_bag_used)
		bag.dropped.connect(_on_bag_item_dropped)
		$Page.add_child(bag)


func _set_button_visibility(button: Button, visibility):
	button.visible = visibility


func _on_left_button_pressed() -> void:
	page -= 1
	update_items()


func _on_right_button_pressed() -> void:
	page += 1
	update_items()


func _on_bag_used(bag: Bag):
	emit_signal("bag_used", bag)

func _on_bag_item_dropped(item: PermutationItem):
	emit_signal("bag_item_dropped", item)
