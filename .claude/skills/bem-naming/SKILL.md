---
name: bem-naming
description: BEM (Block Element Modifier) methodology and naming conventions used in fundamental-styles with real examples
metadata:
  tags: ['bem', 'naming', 'conventions', 'methodology', 'css', 'classes']
  keywords:
    [
      'bem',
      'block-element-modifier',
      'naming-convention',
      'css-classes',
      'ndl-prefix',
      'modifier',
      'element',
      'double-underscore',
      'double-hyphen',
      'class-names',
    ]
---

# BEM Naming in Fundamental Styles

This skill explains the BEM (Block Element Modifier) methodology used in fundamental-styles and provides naming patterns with real examples.

## When to Use This Skill

Use this skill when:

- The user asks "How do I name CSS classes in fundamental-styles?"
- The user asks about BEM methodology
- The user wants to understand class naming patterns
- The user asks "What does `ndl-button--emphasized` mean?"
- The user needs to create custom variants or understand modifier classes
- The user asks about the `ndl-` prefix

---

## What is BEM?

**BEM** stands for **Block Element Modifier** - a naming convention for CSS classes that makes code more readable, maintainable, and predictable.

### BEM Structure

```
.block { }
.block__element { }
.block--modifier { }
.block__element--modifier { }
```

### BEM in Fundamental Styles

All fundamental-styles components use the `ndl-` prefix and follow strict BEM conventions:

```
.ndl-{block}
.ndl-{block}__{element}
.ndl-{block}--{modifier}
.ndl-{block}__{element}--{modifier}
```

---

## The Three Parts of BEM

### 1. Block (Component)

The **block** is the top-level component - a standalone, meaningful entity.

**Pattern:** `.ndl-{block-name}`

**Examples:**

- `.ndl-button` - Button component
- `.ndl-input` - Input component
- `.ndl-card` - Card component
- `.ndl-table` - Table component
- `.ndl-dialog` - Dialog component

**Rules:**

- ✅ Use lowercase
- ✅ Use hyphens for multi-word blocks: `.ndl-message-strip`
- ✅ Always prefix with `ndl-`
- ❌ Don't nest block classes (`.ndl-button .ndl-icon` is two blocks, not nested)

---

### 2. Element (Sub-component)

An **element** is a part of a block that has no meaning outside its parent block. Uses double underscores `__`.

**Pattern:** `.ndl-{block}__{element-name}`

**Examples:**

- `.ndl-button__text` - Text inside a button
- `.ndl-table__cell` - Cell inside a table
- `.ndl-table__row` - Row inside a table
- `.ndl-dialog__header` - Header inside a dialog
- `.ndl-dialog__body` - Body inside a dialog
- `.ndl-dialog__footer` - Footer inside a dialog
- `.ndl-card__header` - Header inside a card
- `.ndl-input__addon` - Addon inside an input group

**Rules:**

- ✅ Elements belong to their block: `.ndl-button__text` only exists inside `.ndl-button`
- ✅ Use double underscores `__` to separate block and element
- ✅ Elements can have multiple words: `.ndl-button__text-content`
- ❌ Don't create grandchild elements: `.ndl-block__element__subelement` - flatten instead

---

### 3. Modifier (Variation)

A **modifier** defines the appearance, state, or behavior of a block or element. Uses double hyphens `--`.

**Pattern:**

- `.ndl-{block}--{modifier-name}` (block modifier)
- `.ndl-{block}__{element}--{modifier-name}` (element modifier)

**Examples - Block Modifiers:**

- `.ndl-button--emphasized` - Primary/emphasized button style
- `.ndl-button--positive` - Positive semantic button (green)
- `.ndl-button--negative` - Negative semantic button (red)
- `.ndl-button--transparent` - Transparent button style
- `.ndl-button--compact` - Compact size button
- `.ndl-input--compact` - Compact size input
- `.ndl-table--compact` - Compact size table

**Examples - Element Modifiers:**

- `.ndl-table__cell--status` - Status cell variant
- `.ndl-table__row--activable` - Row that can be activated
- `.ndl-list__item--link` - List item styled as link

**Rules:**

- ✅ Use double hyphens `--` to separate block/element and modifier
- ✅ Add modifier to the base class: `class="ndl-button ndl-button--emphasized"`
- ✅ Modifiers can be combined: `class="ndl-button ndl-button--emphasized ndl-button--compact"`
- ❌ Never use modifier alone: ❌ `class="ndl-button--emphasized"` without `.ndl-button`

---

## Real Example: Button Component

### Block (Base Button)

```html
<button class="ndl-button">Default Button</button>
```

**Class:** `.ndl-button`
**What it is:** The block - represents the button component itself

---

### Element (Button Text)

```html
<button class="ndl-button">
  <i class="sap-icon--accept"></i>
  <span class="ndl-button__text">Accept</span>
</button>
```

**Class:** `.ndl-button__text`
**What it is:** An element - the text portion inside the button
**Why:** Allows styling the text separately from icons

---

### Modifiers (Button Variants)

#### Visual Style Modifiers

```html
<!-- Emphasized (Primary) -->
<button class="ndl-button ndl-button--emphasized">Save</button>

<!-- Transparent (Ghost) -->
<button class="ndl-button ndl-button--transparent">Cancel</button>
```

**Classes:** `.ndl-button--emphasized`, `.ndl-button--transparent`
**What they are:** Modifiers that change button appearance

---

#### Semantic Modifiers

```html
<!-- Positive (Success/Approve) -->
<button class="ndl-button ndl-button--positive">Approve</button>

<!-- Negative (Danger/Reject) -->
<button class="ndl-button ndl-button--negative">Reject</button>

<!-- Critical (Warning) -->
<button class="ndl-button ndl-button--attention">Warning</button>
```

**Classes:** `.ndl-button--positive`, `.ndl-button--negative`, `.ndl-button--attention`
**What they are:** Semantic modifiers with color meaning

---

#### Size Modifiers

```html
<!-- Compact size -->
<button class="ndl-button ndl-button--compact">Compact</button>
```

**Class:** `.ndl-button--compact`
**What it is:** Size modifier for dense layouts

---

### Combining Modifiers

Multiple modifiers can be combined on the same element:

```html
<button class="ndl-button ndl-button--emphasized ndl-button--compact">Save</button>
```

**Result:** A button that is both emphasized (primary style) and compact (smaller size)

**Pattern:**

```
class="ndl-button ndl-button--{modifier1} ndl-button--{modifier2}"
```

---

## Common Patterns Across Components

### Size Modifiers

Most components support `--compact` for dense layouts:

```html
<button class="ndl-button ndl-button--compact">Button</button>
<input class="ndl-input ndl-input--compact" />
<table class="ndl-table ndl-table--compact">
  ...
</table>
```

---

### Semantic State Modifiers

Many components use semantic colors:

```html
<!-- Positive (green/success) -->
<span class="ndl-object-status ndl-object-status--positive">Active</span>
<button class="ndl-button ndl-button--positive">Approve</button>

<!-- Negative (red/error) -->
<span class="ndl-object-status ndl-object-status--negative">Error</span>
<button class="ndl-button ndl-button--negative">Reject</button>

<!-- Critical (orange/warning) -->
<span class="ndl-object-status ndl-object-status--critical">Warning</span>
<div class="ndl-message-strip ndl-message-strip--warning">...</div>

<!-- Informative (blue/info) -->
<span class="ndl-object-status ndl-object-status--informative">Info</span>
<div class="ndl-message-strip ndl-message-strip--information">...</div>
```

**Semantic states:** `--positive`, `--negative`, `--critical`, `--informative`

---

### State Classes

Fundamental styles also uses state classes with `is-` prefix for dynamic states:

```html
<!-- Error state -->
<input class="ndl-input is-error" />

<!-- Success state -->
<input class="ndl-input is-success" />

<!-- Disabled state -->
<button class="ndl-button" disabled aria-disabled="true">Disabled</button>

<!-- Selected state -->
<tr class="ndl-table__row is-selected">
  ...
</tr>

<!-- Active state -->
<div class="ndl-list__item is-active">...</div>
```

**State classes:** `is-error`, `is-success`, `is-warning`, `is-disabled`, `is-selected`, `is-active`, `is-focus`

**Note:** State classes are NOT BEM modifiers - they're separate utility classes for dynamic states.

---

## More Complex Example: Table

```html
<table class="ndl-table ndl-table--compact">
  <thead class="ndl-table__header">
    <tr class="ndl-table__row">
      <th class="ndl-table__cell ndl-table__cell--checkbox">
        <input type="checkbox" class="ndl-checkbox" />
      </th>
      <th class="ndl-table__cell">Name</th>
      <th class="ndl-table__cell">Status</th>
    </tr>
  </thead>
  <tbody class="ndl-table__body">
    <tr class="ndl-table__row is-selected">
      <td class="ndl-table__cell ndl-table__cell--checkbox">
        <input type="checkbox" class="ndl-checkbox" checked />
      </td>
      <td class="ndl-table__cell">John Doe</td>
      <td class="ndl-table__cell">
        <span class="ndl-object-status ndl-object-status--positive">Active</span>
      </td>
    </tr>
  </tbody>
</table>
```

**BEM breakdown:**

- **Block:** `.ndl-table` (with modifier `--compact`)
- **Elements:** `.ndl-table__header`, `.ndl-table__body`, `.ndl-table__row`, `.ndl-table__cell`
- **Element Modifier:** `.ndl-table__cell--checkbox`
- **State Class:** `is-selected` on the row

---

## Why BEM?

### Benefits

1. **Clarity:** Class names explain their purpose
   - `.ndl-button__text` - clearly text inside a button
   - `.ndl-button--emphasized` - clearly a button variation

2. **No conflicts:** BEM prevents naming collisions
   - `.ndl-dialog__header` won't conflict with `.ndl-card__header`

3. **Predictability:** Easy to guess class names
   - If there's `.ndl-input`, there's probably `.ndl-input--compact`

4. **Maintainability:** Easy to find and update styles
   - All button variants start with `.ndl-button--`

5. **Scalability:** Works well in large codebases
   - Clear hierarchy and relationships

---

## Quick Reference

| Pattern                               | Example                      | Meaning                 |
| ------------------------------------- | ---------------------------- | ----------------------- |
| `.ndl-{block}`                        | `.ndl-button`                | Component itself        |
| `.ndl-{block}__{element}`             | `.ndl-button__text`          | Part of component       |
| `.ndl-{block}--{modifier}`            | `.ndl-button--emphasized`    | Variant of component    |
| `.ndl-{block}__{element}--{modifier}` | `.ndl-table__cell--checkbox` | Variant of element      |
| `is-{state}`                          | `is-selected`                | Dynamic state (NOT BEM) |

---

## Best Practices

✅ **Do:**

- Always include the base class: `class="ndl-button ndl-button--emphasized"`
- Use BEM for component structure: `.ndl-dialog__header`
- Use modifiers for variants: `.ndl-button--positive`
- Use state classes for dynamic states: `is-selected`
- Combine multiple modifiers: `ndl-button ndl-button--emphasized ndl-button--compact`

❌ **Don't:**

- Use modifier alone: ❌ `class="ndl-button--emphasized"` (missing `.ndl-button`)
- Create deep nesting: ❌ `.ndl-block__element__subelement`
- Mix BEM with other conventions: ❌ `.ndl-button.emphasized`
- Use camelCase: ❌ `.ndl-buttonText` (use `.ndl-button__text`)

---

## Summary

**BEM Formula:**

```
.ndl-{block}                              → Component
.ndl-{block}__{element}                   → Part of component
.ndl-{block}--{modifier}                  → Variant of component
.ndl-{block}__{element}--{modifier}       → Variant of element
```

**Remember:**

- `ndl-` = fundamental-styles prefix
- `__` = element separator (double underscore)
- `--` = modifier separator (double hyphen)
- Base class + modifiers: `ndl-button ndl-button--emphasized`
