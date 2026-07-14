# Disallow invalid and missing test names (`qunit/no-invalid-names`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

QUnit tests can be difficult to debug without useful module and test names. The purpose
of this rule is to ensure that module and test names are present and valid.

## Rule Details

The following patterns are considered warnings:

```js
// Missing names
module(function () {});
test(function () {});

// Empty or space-only names
module("", function () {});
test("", function () {});
module("   ", function () {});
test("   ", function () {});

// Leading and trailing spaces
module(' Foo Bar unit  ', function () {});
test(' it does foo ', function () {});

// Non-string names
module(["foo"], function () {});
test(["foo"], function () {});
module(1, function () {});
test(1, function () {});

// Names starting or ending with QUnit delimiters (>, :)
module('>Foo Bar unit', function () {});
test('>it does foo', function () {});
module('Foo Bar unit>', function () {});
test('it does foo>', function () {});
module(':Foo Bar unit', function () {});
test(':it does foo', function () {});
module('Foo Bar unit:', function () {});
test('it does foo:', function () {});
```

The following patterns are not considered warnings:

```js
// Valid strings
module("Foo Bar", function () {});
test("Foo Bar", function () {});

// Templates are okay since those are strings
module(`Foo Bar ${foo}`, function () {});
test(`Foo Bar ${foo}`, function () {});

// Can't check variables
module(foo, function () {});
test(foo, function () {});
```

## When Not to Use It

This rule is mostly stylistic, but can cause problems in the case of QUnit delimiters
at the start and end of test names.
