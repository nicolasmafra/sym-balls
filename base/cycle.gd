extends Object

class_name Cycle

static func perm_to_cycles(perm: Dictionary) -> Array[Array]:
	var cycles: Array[Array] = []
	var keys = perm.keys()
	keys.sort()
	for key in keys:
		if _any_cycle_contains_key(cycles, key):
			continue
		var cycle = _get_cycle_with_key(perm, key)
		cycles.append(cycle)
	return cycles

static func _any_cycle_contains_key(cycles: Array[Array], key_to_find) -> bool:
	for cycle in cycles:
		for key in cycle:
			if key == key_to_find:
				return true
	return false

static func _get_cycle_with_key(perm: Dictionary, key) -> Array:
	var cycle = []
	var key0 = key
	while true:
		cycle.append(key)
		var value = perm[key]
		if value == key0:
			break
		else:
			key = value
	return cycle
