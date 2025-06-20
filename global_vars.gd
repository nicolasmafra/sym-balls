extends Node

var scene_stack := []

const default_item_radius := 30.0
var item_radius := default_item_radius
var course_world_index := 1
var course_level_index := -1
var course_level_data: Dictionary

func reset_values():
	item_radius = default_item_radius
