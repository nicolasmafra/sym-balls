extends Object

class_name Cycle

static func perm_to_cycles(perm: Dictionary) -> Array[Array]:
	var cycles: Array[Array] = []
	var keys = perm.keys()
	keys.sort()
	for key in keys:
		key = str(key)
		if _any_cycle_contains_key(cycles, key):
			continue
		var cycle = _get_cycle_with_key(perm, key)
		cycles.append(cycle)
	return cycles


static func cycles_to_perm(cycles: Array[Array]) -> Dictionary:
	var perm := {}
	for cycle in cycles:
		var n := cycle.size()
		for i in range(n):
			var current = str(cycle[i])
			var next = str(cycle[(i + 1) % n])
			perm[current] = next
	return perm


static func _any_cycle_contains_key(cycles: Array[Array], key_to_find: String) -> bool:
	for cycle in cycles:
		for key in cycle:
			key = str(key)
			if key == key_to_find:
				return true
	return false

static func _get_cycle_with_key(perm: Dictionary, key: String) -> Array:
	var cycle = []
	var key0 = key
	var i = 0
	var max = perm.size()
	while i <= max:
		i += 1
		cycle.append(key)
		var value = perm[key]
		if value == key0:
			break
		else:
			key = value
		if i == max:
			push_error("invalid permutation: ", perm)
	return cycle
