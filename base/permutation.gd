extends Node
class_name Permutation


static var EMPTY = new({})

var dict: Dictionary


func _init(dict: Dictionary):
	set_dict(dict)


func set_dict(dict: Dictionary):
	self.dict = _normalized_entries(dict)


func clone() -> Permutation:
	return Permutation.new(dict)


func receive(permutation: Permutation):
	dict = compose_dicts(permutation.dict, self.dict)


func apply(permutation: Permutation):
	dict = compose_dicts(self.dict, permutation.dict)


func remove_trivial():
	_remove_trivial_entries(dict)


func is_identity() -> bool:
	return len(dict) == 0


static func compose_dicts(composer_dict: Dictionary, target_dict: Dictionary) -> Dictionary:
	var new_dict := _merge_keys(target_dict, composer_dict)
	for key in new_dict.keys():
		if not target_dict.has(key):
			new_dict[key] = composer_dict[key]
		else:
			var value = target_dict[key]
			if not composer_dict.has(value):
				new_dict[key] = value
			else:
				new_dict[key] = composer_dict[value]
	return new_dict


static func _merge_keys(dict1: Dictionary, dict2: Dictionary) -> Dictionary:
	var new_dict := {}
	for k in dict1.keys():
		new_dict[k] = true
	for k in dict2.keys():
		new_dict[k] = true
	return new_dict

static func _remove_trivial_entries(dict: Dictionary):
	for key in dict.keys().duplicate():
		if dict[key] == key:
			dict.erase(key)

static func _normalized_entries(dict: Dictionary) -> Dictionary:
	var keys = dict.keys()
	keys.sort()
	var normalized_dict = {}
	for key in keys:
		normalized_dict[str(key)] = str(dict[key])
	return normalized_dict
