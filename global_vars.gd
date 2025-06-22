extends Node

var scene_stack := []

const course_status_file_path = "user://course_status.dat"
const glyphs_to_export = "⮌⭯∞⮺⌫⑊«»0123456789abdcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ -_.,!?"
const default_item_radius := 45.0

var started := false
var item_radius := default_item_radius
var course_world_index := 1
var course_level_index := -1
var course_level_info: Dictionary
var course_progress := CourseProgress.new()
var winning_stats := {}


func reset_values():
	item_radius = default_item_radius
