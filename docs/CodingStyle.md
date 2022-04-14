# CORTX-Management-Portal Coding Style Guide

The CORTX-Management-Portal is a UI-based application that is built on front-end.

We've listed the coding style that is specific to any submissions made to the cortx-management-portal repository.

## Typescript

<details>
<summary>Click to expand!</summary>
<p>

- File-name should be in kebab-case. 

  **Example:** **single-file**.

- Every file should have a Header with Author and other details.
- Components
  - 1 file per logical component (e.g. parser, scanner, emitter, checker).
  - Use PascalCase for type names/Component Name.
  - Use CapitalCASE for enum values.
  - Use camelCase for function names.
  - Use camelCase for property names and local variables.
  - Use whole words in names when possible.
  - Add a Comment for functions which are performing complex logic
  - Variable names should be meaningful
  - Single line code should not have more than 80 chars. If required break line.
- Types
  - Do not export types/functions unless you need to share it across multiple components.
  - Do not introduce new types/values to the global namespace.
  - Within a file, type definitions should come first.
- Use undefined. Do not use null.
- Comments
  - Every function which has complex logic or initiates business logic should have detailed comment
  - Use JSDoc style comments for functions, interfaces, enums, and classes.
- Style
  - Use arrow functions over anonymous function expressions.
  - Only surround arrow function parameters when necessary.
    - Example: Instead of `(x) => x + x`, you can use: 
      - `x => x + x`
      - `(x,y) => x + y`
      - `<T>(x: T, y: T) => x === y`

  - Always surround loop and conditional bodies with curly braces. Statements on the same line are allowed to omit braces.
  - Open curly braces always go on the same line as whatever necessitates them.
  - Parenthesized constructs should have no surrounding empty space. A single space follows commas, colons, and semicolons in those constructs. 
    
    **Example:**
    
    ```javascript
    for (var i = 0, n = str.length; i < 10; i++) { }
    if (x < 10) { }
    function f(x: number, y: string): void { }
    ```
   
  - Use a single declaration per variable statement. Use `var x = 1; var y = 2; over var x = 1, y = 2;`.
  - `else` goes on a separate line from the closing curly brace.
  - Use 4 spaces per indentation.

  </p>
  </details>

## Vue.JS

This style guide is based on [Vue.js style guide](https://vuejs.org/v2/style-guide/#Single-file-component-filename-casing-strongly-recommended). We've listed the specific coding style that applies to the cortx-management-portal repository.

<details>
<summary>Click to expand!</summary>
<p>

- Components that should only ever have a single active instance should begin with `The` prefix. 
- Child components that are tightly coupled with their parent should include the parent component name as a prefix. In general, we should avoid such instances.
- Component names should always be PascalCase in single-file components and string templates - but kebab-case in DOM templates.
- Elements with multiple attributes should span multiple lines, with one attribute per line.

  ```javascript
  <MyComponent
  foo="a"
  bar="b"
  baz="c"
  />
  ```
- Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods.
- Complex computed properties should be split into as many simpler properties as possible.
- Use Single Quotes for String.
- Directive shorthands `:` for `v-bind:`, `@` for `v-on:` and `#` for `v-slot` can be used always or never.

</p>
</details>

## HTML

Refer to the [Google HTML Coding Style Guide](https://google.github.io/styleguide/htmlcssguide.html)
