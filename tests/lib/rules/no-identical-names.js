"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-identical-names"),
    RuleTester = require("eslint").RuleTester,
    { outdent } = require("outdent");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-identical-names", rule, {
    valid: [
        outdent`
          module("module");
          test("test", function() {});
        `,
        outdent`
          module("module1");
          test("it1", function() {});
          test("it2", function() {});
        `,
        outdent`
          test("it1", function() {});
          test("it2", function() {});
        `,
        outdent`
          module("title", function() {});
          test("title", function() {});
        `,
        outdent`
          module("module1");
          test("it1", function() {});
          module("module2");
          test("it1", function() {});
        `,
        outdent`
          module('A');

          test('foo', function() {});
          test('bar', function() {});

          module('B');

          test('foo', function() {});
          test('bar', function() {});
        `,
        outdent`
          module('A', {}); // Object with no tests
          test('foo', function () {});
          module('B', function () {}); // Function with no tests
          test('foo', function () {});
        `,
        outdent`
          module("name1", function() {
              test('it1', function() {});
              module("name2", function() {});
              test('it1', function() {}); // Part of name2
          });
        `,
        outdent`
          module("module1");
          module("module2");
        `,
        outdent`
          test("test" + n, function() {});
          test("test" + n, function() {});
        `,
        outdent`
          module("module1", function() {
            test("it1", function() {});
            test("it2", function() {});
          });
          module("module2", function() {
            test("it1", function() {});
            test("it2", function() {});
          });
        `,
        outdent`
          test(\`it$\{n\}\`, function() {});
          test(\`it$\{n\}\`, function() {});
        `,

        // Tests with identical names are allowed if they are in different modules.
        outdent`
          test('it1', function (assert) {});
          module('module1', function () {
              module('module2', function () {
                  test('it1', function (assert) {});
              });
              test('it1', function (assert) {});
          });
        `,
        outdent`
          module('module1', function () {
              test('it1', function (assert) {});
              module('module2');
              test('it1', function (assert) {}); // Part of module2
          });
        `,
        outdent`
          test("it1", function() {});
          module("module1");
          test("it1", function() {}); // Part of module1.
        `,

        // Nested modules
        outdent`
          module("module1", function() {
              module("submodule1", function() {});
          });
          module("module2", function() {
              module("submodule1", function() {});
          });
        `,
        outdent`
          module("module1", function() {
              module("submodule1", function() {
                  module("subsubmodule1", function() {
                      test("it1", function() {})
                  });
              });
          });
          module("module2", function() {
              module("submodule1", function() {
                  module("subsubmodule1", function() {
                      test("it1", function() {})
                  });
              });
          });
        `,
    ],

    invalid: [
        {
            code: outdent`
              module("module1");
              test("it1", function() {});
              test("it1", function() {});
            `,
            errors: [
                {
                    messageId: "duplicateTest",
                    data: {
                        line: 2,
                    },
                    column: 6,
                    line: 3,
                },
            ],
        },
        {
            code: outdent`
              test("it1", function() {});
              test("it1", function() {});
            `,
            errors: [
                {
                    messageId: "duplicateTest",
                    data: {
                        line: 1,
                    },
                    column: 6,
                    line: 2,
                },
            ],
        },
        {
            code: outdent`
              module("module1", function() {
                test("it1", function() {});
                test("it1", function() {});
              });
            `,
            errors: [
                {
                    messageId: "duplicateTest",
                    data: {
                        line: 2,
                    },
                    column: 8,
                    line: 3,
                },
            ],
        },
        {
            code: outdent`
              module("module1");
              module("module1");
            `,
            errors: [
                {
                    messageId: "duplicateModule",
                    data: {
                        line: 1,
                    },
                    column: 8,
                    line: 2,
                },
            ],
        },
        {
            code: outdent`
              module("module1");
              test("it", function() {});
              module("module1");
            `,
            errors: [
                {
                    messageId: "duplicateModule",
                    data: {
                        line: 1,
                    },
                    column: 8,
                    line: 3,
                },
            ],
        },
        {
            code: outdent`
              module("module1", function() {
                  module("module2", function() {
                      test("it", function() {});
                      test("it", function() {});
                  });
              });
            `,
            errors: [
                {
                    messageId: "duplicateTest",
                    data: { line: 3 },
                    column: 14,
                    line: 4,
                },
            ],
        },
        {
            code: outdent`
              test("it", function() {});

              // Module with test deep inside it.
              module("module1", function() {
                  module("module2", function() {
                      test("it-deep", function() {});
                  });
              });

              test("it", function() {});
            `,
            errors: [
                {
                    messageId: "duplicateTest",
                    data: { line: 1 },
                    column: 6,
                    line: 10,
                },
            ],
        },
        {
            code: outdent`
              module("module1", function() {
                  module("submodule1", function() {});
                  module("submodule1", function() {});
              });
            `,
            errors: [
                {
                    messageId: "duplicateModule",
                    data: { line: 2 },
                    column: 12,
                    line: 3,
                },
            ],
        },
        {
            code: outdent`
              module("name1", function() {
                  module("name1", function() {});
              });
            `,
            errors: [
                {
                    messageId: "duplicateModuleAncestor",
                    data: { line: 1 },
                    column: 12,
                    line: 2,
                },
            ],
        },
    ],
});
