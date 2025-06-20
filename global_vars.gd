extends Node

var scene_stack := []

const default_item_radius := 50.0
var item_radius := default_item_radius
var course_world_index := 1
var course_level_index := -1
var course_level_info: Dictionary

func reset_values():
	item_radius = default_item_radius
