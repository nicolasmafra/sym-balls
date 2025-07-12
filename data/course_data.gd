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
	to_solve = _parse_permutation_array(raw_data.get("to_solve"))
	to_make = _parse_permutation_array(raw_data.get("to_make"))
	pod = _parse_permutation_array(raw_data.get("pod"))
	star_moves = raw_data.get("star_moves")


func _load_raw_data() -> Dictionary:
	var file_path = "res://data/courses/" + info.code + ".json"
	var file = FileAccess.open(file_path, FileAccess.READ)
	var content = file.get_as_text()
	file.close()
	
	return JSON.parse_string(content)


static func _parse_permutation_array(value) -> Array:
	var array := _ensure_array(value)
	return array.map(func(x): return _parse_permutation(x))


static func _ensure_array(x) -> Array:
	return [] if x == null else x if x is Array else [x]


static func _parse_permutation(value) -> Dictionary:
	if value is String:
		var cycles := _from_cycle_notation(value)
		return Cycle.cycles_to_perm(cycles)
	else:
		return value


static func _from_cycle_notation(text: String) -> Array[Array]:
	var regex := RegEx.new()
	regex.compile(r"^(\(([0-9]+,?)+\))+$")
	if not regex.search(text):
		push_error("Invalid cycle notation text: " + text)
		return []

	var separator := "," if text.find(",") != -1 else ""
	var trimmed := text.substr(1, text.length() - 2)
	var parts := trimmed.split(")(")
	var result: Array[Array] = []
	for cycle_part in parts:
		var cycle = []
		for k in cycle_part.split(separator):
			cycle.append(k)
		result.append(cycle)
	return result
