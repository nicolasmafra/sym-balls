extends Object

class_name Chroma

static var alpha := 1.0

# hue vars
static var direction := 1
static var offset := 1.0/80
static var colors := [
	Color.WHITE,
	Color.BLACK,
]

static func value_to_color(value) -> Color:
	value = int(value)
	value -= 1
	var i := len(colors)
	while value >= i:
		var hue := _int_to_hue(i - 2)
		var lightness := _int_to_lightness(i - 2);
		var v = 2*lightness if lightness <= 0.5 else 1.0
		var saturation = 1.0 if lightness <= 0.5 else 1 - (lightness - 0.5)
		var color := Color.from_hsv(hue, saturation, v, alpha)
		colors.append(color)
		i += 1
	return colors[value]

static func _frac_bit_reversal(n: int, b0: int) -> float:
	var result := 0.0
	var divisor := 1
	var base := b0

	while n > 0:
		var digit := n % base
		divisor *= base
		result += float(digit) / float(divisor)
		n /= base
		base = 2
	return result

static func _int_to_hue(n: int) -> float:
	var result := _frac_bit_reversal(n, 3)
	var hue := offset + direction * result
	if hue > 1:
		hue -= 1
	elif hue < 0:
		hue += 1
	return hue

static func _int_to_lightness(n: int) -> float:
	n = (n/6) + 2
	var layer:float = floor(log(n) / log(2)) if n >= 4 else 1
	return 1 - _frac_bit_reversal(layer, 2)
