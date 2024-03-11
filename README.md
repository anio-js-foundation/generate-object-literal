# @anio-js-foundation/generate-object-literal

Create an object literal string.

```js
import generateObjectLiteral from "@anio-js-foundation/generate-object-literal"

//
// Returns:
//
//    import {
//        someFunction as someFunctionAlias,
//        /* A comment */
//        someVariable
//    } from "module"
//
let str = generateObjectLiteral([
	{
		key: "someFunction",
		value: "someFunctionAlias"
	},
	"A comment",
	{key: "someVariable"}
], {
	prefix: "import ",
	suffix: " from \"module\"",
	key_delimiter: " as ",
	pad_to_longest_key: true,
	indentation: 4
})

console.log(str)
```
