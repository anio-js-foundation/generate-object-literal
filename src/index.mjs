function validJavaScriptIdentifier(str) {
	return /^[A-Za-z0-9$_]*$/.test(str)
}

function startsWithDigit(str) {
	if (!str.length) return false

	let digits = [0,1,2,3,4,5,6,7,8,9].map(x => `${x}`)

	return digits.includes(str[0])
}

function escapeKey(key) {
	if (!validJavaScriptIdentifier(key) || startsWithDigit(key)) {
		return JSON.stringify(key)
	}

	return key
}

function mapEntriesToType(entries) {
	let ret = []

	for (const entry of entries) {
		if (Object.prototype.toString.call(entry) === `[object String]`) {
			ret.push({
				type: "comment",
				value: entry
			})
		} else {
			ret.push({
				type: "keypair",
				value: {
					...entry,
					key: escapeKey(entry.key)
				}
			})
		}
	}

	return ret
}

function getLongestKeyLength(entries) {
	let max_length = 0

	for (const entry of entries) {
		if (entry.type !== "keypair") continue

		if (entry.value.key.length > max_length) {
			max_length = entry.value.key.length
		}
	}

	return max_length
}

function objectLiteral(entries, options) {
	let lines = []

	entries = mapEntriesToType(entries)

	const longest_key_length = getLongestKeyLength(entries)

	const keypairAfterThisEntry = (index) => {
		for (let i = index + 1; i < entries.length; ++i) {
			if (entries[i].type !== "comment") return true
		}

		return false
	}

	for (let i = 0; i < entries.length; ++i) {
		const {type, value} = entries[i]

		if (type === "comment") {
			lines.push(`// ${value}`)
		} else {
			let comma = ",", key_padding = ""

			if (!keypairAfterThisEntry(i)) comma = ""

			if (options.pad_to_longest_key) {
				let delta = longest_key_length - value.key.length

				key_padding = " ".repeat(delta)
			}

			if ("value" in value) {
				lines.push(`${value.key}${key_padding}${options.key_delimiter}${value.value}${comma}`)
			} else {
				lines.push(`${value.key}${comma}`)
			}
		}
	}

	let extra_indentation = " ".repeat(options.indentation)

	let ret = `${extra_indentation}${options.prefix}{\n`

	ret += lines.map(line => `${extra_indentation}    ${line}`).join("\n")

	ret += `\n${extra_indentation}}${options.suffix}`

	return ret
}

export default function(entries, {
	prefix = "",
	pad_to_longest_key = false,
	key_delimiter = " : ",
	indentation = 0,
	suffix = ""
} = {}) {
	return objectLiteral(entries, {
		prefix,
		pad_to_longest_key,
		key_delimiter,
		indentation,
		suffix
	})
}
