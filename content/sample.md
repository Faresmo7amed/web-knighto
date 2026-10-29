## What a closure is

A closure is a function bundled together with the variables from the scope where it was created. When the function runs later, it can still read and change those variables, even if the outer function has already returned.

Every function in JavaScript is a closure. The behavior only becomes visible when you return a function, or pass it somewhere that outlives the scope it came from. You can write **bold**, *italic*, `inline code`, and [an outside link](https://developer.mozilla.org) or [an inside link](/frontend/javascript).

```js
function makeCounter() {
    let count = 0
    return () => {
        count += 1
        return count
    }
}

const next = makeCounter()
next()
next()
```

Each call to `makeCounter` creates a new `count`. Two counters made from two calls never share state.

> [!TIP]
> Closures capture variables, not their values at that moment.

## Why it matters

Closures let you keep private state without a class, build functions that remember their configuration, and write event handlers that know which item they belong to.

> [!QUOTE] Kent Beck
> Make it work, make it right, make it fast.

### Private state

Nothing outside `makeCounter` can reach `count`. The only way to change it is through the returned function. This is the simplest form of encapsulation in JavaScript, and it needs no special syntax.

### Configuration

A function can be created with some values already fixed. The inner function remembers them, so callers only pass what changes between calls.

> A plain blockquote is for text you are citing from somewhere else, without a callout style.

## A common mistake

> [!WARNING]
> With `var` in a loop, every callback shares one variable. Use `let` to get a fresh one per iteration.

Before you ship a closure, check:

- [x] It captures only what it needs
- [x] It has a clear name
- [ ] It removes its event listeners
- [ ] It is covered by a test

## Memory and cleanup

A closure keeps its variables alive for as long as the closure itself is reachable. To avoid leaks:

1. Release references you no longer need.
2. Remove event listeners when the element goes away.
3. Avoid capturing large objects in long-lived callbacks.

> [!NOTE] Good to know
> Most engines free a variable as soon as no closure uses it.

<details>
<summary>Why can a long-lived closure be a problem?</summary>

It keeps everything it captured alive, including large objects you may have forgotten about.

</details>

> [!DANGER]
> Never store secrets in a variable that a long-lived closure captures on the client.

> [!INFO]
> Closures work the same in every current browser and in Node.js.

## Comparing scopes

| Keyword | Scope | Can be re-declared |
| --- | --- | --- |
| `var` | Function | Yes |
| `let` | Block | No |
| `const` | Block | No |

## Seeing it

![Nested scopes](/sample-image.svg "Figure 1. Each function sees its own scope and every scope around it.")

The inner function can read every scope around it.[^1]

## Project layout

```tree
app/
├─ layout.tsx
├─ page.tsx
└─ docs/
   └─ [slug]/page.tsx
```

## Shortcuts

Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search the whole site.

## Code blocks

A file name, a highlighted line and line numbers:

```js title="counter.js" {3} ln
function makeCounter() {
    let count = 0
    return () => ++count
}
```

A diff:

```js title="export.js" diff
const name = 'closure'
- module.exports = name
+ export default name
```

A terminal session. The prompt cannot be selected or copied:

```bash
$ npm install next
added 1 package in 2s
warn deprecated left-pad@1.3.0
$ git commit -m "add closures" --no-verify
error: pathspec 'closures' did not match
```

JSX with props and a template literal:

```tsx title="Button.tsx"
export function Button({ label }: { label: string }) {
    return <button className="btn" onClick={() => alert(`Hi ${label}`)}>{label}</button>
}
```

CSS:

```css
.card > a:hover {
    padding: 12px 1rem;
    color: #2f6fcb;
}
```

A long block collapses after 20 lines:

```js title="steps.js"
const steps = [
    'declare the outer function',
    'declare a variable inside it',
    'return an inner function',
    'let the inner function read the variable',
    'call the outer function once',
    'keep the returned function',
    'call it again later',
    'notice the variable survived',
    'change the variable through it',
    'create a second counter',
    'see that it has its own variable',
    'pass a closure as a callback',
    'use one inside a loop',
    'compare var and let',
    'log the values',
    'remove the listener',
    'release large objects',
    'check memory in DevTools',
    'write a test',
    'document the behavior',
]
```
## Installing

```bash
npm install next
```

```bash
npm install -D typescript @types/node
npm run dev
npx create-next-app@latest
```

A block with other commands stays a normal terminal block:

```bash
$ git status
$ npm install next
```

## Summary

A closure is a function plus the scope it was born in. Use it to keep state private, to remember configuration, and to write callbacks that know their context.

[^1]: In the language specification this is called a lexical environment.