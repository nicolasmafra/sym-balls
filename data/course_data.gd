extends Node
class_name CourseData


var info: Dictionary
var hint: String
var star_moves: int
var to_solve: Array
var to_make: Array
var pod: Array

func _init(course_level_info):
	info = course_level_info
	_load_data()


func _load_data():
	var raw_data = _load_raw_data()
	hint = raw_data.get("hint")
	to_solve = _ensure_array(raw_data.get("to_solve"))
	to_make = _ensure_array(raw_data.get("to_make"))
	pod = _ensure_array(raw_data.get("pod"))


func _load_raw_data() -> Dictionary:
	var file_path = "res://data/courses/" + info.code + ".json"
	var file = FileAccess.open(file_path, FileAccess.READ)
	var content = file.get_as_text()
	file.close()
	
	return JSON.parse_string(content)


static func _ensure_array(x):
	return [] if x == null else x if x is Array else [x]
