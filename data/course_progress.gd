extends Node
class_name CourseProgress

const file_path = "user://course_progress.dat"

var saved_data: Dictionary


func load():
	if FileAccess.file_exists(file_path):
		var file = FileAccess.open(file_path, FileAccess.READ)
		saved_data = file.get_var()
		file.close()
	else:
		saved_data = default_saved_data()


func save():
	var file = FileAccess.open(file_path, FileAccess.WRITE)
	file.store_var(saved_data)
	file.close()


func default_saved_data():
	return {
		"worlds": {},
		"levels": {},
	}


func get_world_progress(world_code):
	return _get_progress('worlds', world_code)


func get_level_progress(level_code):
	return _get_progress('levels', level_code)


func _get_progress(type, code):
	if saved_data[type].has(code):
		return saved_data[type][code]
	else:
		return {
		"passed": false,
		"star": false,
	}


func save_progress(world_code, level_code, winning_stats, course_data):
	var level_progress = get_level_progress(level_code)
	level_progress.passed = true
	if winning_stats.star:
		level_progress.star = true
	saved_data.levels[level_code] = level_progress

	var world = _get_world_with_code(course_data, world_code)
	var world_progress = get_world_progress(world_code)
	world_progress.passed = _all_level_in_world(world, "passed")
	if winning_stats.star:
		world_progress.star = _all_level_in_world(world, "star")
	saved_data.worlds[world_code] = world_progress
	
	save()

func reset():
	saved_data = default_saved_data()
	save()


func _get_world_with_code(course_data, world_code):
	for world in course_data.worlds:
		if world.code == world_code:
			return world
	return null


func _all_level_in_world(world, stat):
	for level in world.levels:
		if _check_level_stats(level.code, stat) == false:
			return false
	return true


func _check_level_stats(level_code, stat):
	var progress = get_level_progress(level_code)
	return progress[stat]
	
