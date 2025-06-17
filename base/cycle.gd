extends Object

class_name Cycle

static func perm_to_cycles(perm: Dictionary) -> Array[Dictionary]:
	var cycles: Array[Dictionary] = []
	var keys = perm.keys()
	keys.sort()
	for key in keys:
		if _any_cycle_contains_key(cycles, key):
			continue
		var cycle = _get_cycle_with_key(perm, key)
		cycles.append(cycle)
	return cycles

static func _any_cycle_contains_key(cycles: Array[Dictionary], key_to_find) -> bool:
	for cycle in cycles:
		for key in cycle.keys():
			if key == key_to_find:
				return true
	return false

static func _get_cycle_with_key(perm: Dictionary, key) -> Dictionary:
	var cycle = {}
	var key0 = key
	while true:
		var value = perm[key]
		cycle[key] = value
		if value == key0:
			break
		else:
			key = value
	return cycle
