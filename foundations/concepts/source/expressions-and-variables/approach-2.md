# Expressions and Variables

## What this route covers

This is the practice treatment. One situation is set up below and every question returns to it, so that what changes between questions is the decision being asked of you and not the story. Each prompt asks you to commit to an answer before opening the reply, and each reply names the specific misreading behind the tempting wrong answer rather than only marking it.

Work through the families in order. If a ruling surprises you, the [curriculum reference](/foundations/concepts/expressions-and-variables/approach-1/) states it as a rule, and the [written guide](/foundations/reading/basic-math/expressions-and-variables/) explains it at length.

## The one situation used throughout

A teaching lab orders a reagent.

| Symbol | Means | Unit |
| --- | --- | --- |
| `p` | price of one bottle | riyals per bottle |
| `q` | number of bottles ordered | bottles |
| `d` | fixed delivery charge for the order | riyals |
| `V` | volume of solution in one bottle | litres |
| `c` | concentration of that solution | moles per litre |

For the numeric parts, take `p = 7`, `q = 4`, `d = 3`, `V = 2`, `c = 0.5`.

Nothing else is given. In particular, no letter here means what its shape suggests; each means what this table says.

## Family 1 · Classify: what kind of object is written?

The first decision is never arithmetic. It is deciding what sort of thing you are looking at, because that fixes which question is even askable.

### Decide: is `pq + d` an expression or an equation?

Commit before reading on. Then say which of these two questions it admits: "what is its value?" or "which values make it true?"

### Then decide: what changes when it becomes `pq + d = 31`?

:::answer Both rulings, and the error each one blocks
`pq + d` is an **expression**. It has a value once the letters are assigned, and it claims nothing, so "solve it" is not a question it admits. The tempting move is to hunt for an answer by setting it to zero out of habit; there is nothing to set it equal to.

`pq + d = 31` is an **equation**. It claims the two sides agree, and that claim can be true or false depending on the assignment. With the values above it happens to be true, but it would still be an equation if it were false.

The error worth naming: treating the equals sign as the thing that "makes it maths". The expression is already complete mathematics. The equals sign adds a claim, not legitimacy.
:::

## Family 2 · Translate: where does the bracket go?

Every question in this family has the same shape: a phrase covers either one term or two, and the symbols must say which.

### Decide: "twice the total of the item cost and the delivery" — in symbols?

Write it before reading on. Then decide whether `2pq + d` says the same thing.

### Then decide: "the price of four bottles, plus delivery" — is that `p(q + d)`?

:::answer Where each phrase puts its multiplication
The first is `2(pq + d)`. The words "the total of ... and ..." name a single quantity, and "twice" applies to that whole quantity. So the bracket is not decoration; it is the translation of the word "total".

`2pq + d` doubles only the item cost and leaves the delivery charge single. With the given numbers, `2(28 + 3) = 62` while `2(28) + 3 = 59`. The two agree only when `d = 0`.

The second is `pq + d`, not `p(q + d)`. Writing `p(q + d)` multiplies the price by a sum of bottles and riyals — quantities that cannot be added at all. This is the useful check: if a bracket forces you to add two different kinds of thing, the bracket is in the wrong place.

The error worth naming: translating word by word in order. "Price of four bottles plus delivery" has its grouping carried by what the words mean, not by the order they arrive in.
:::

## Family 3 · Evaluate: substitute first, then compute

### Decide: what is `pq + d` for the values given?

Show the substituted line before the arithmetic.

### Then decide: evaluate `2a² + b` at `a = -3`, `b = 5`

The letters change, the rule does not. Commit to a number.

### Careful: what does `-3²` mean on its own?

This is the case that separates a substitution slip from an arithmetic slip.

:::answer The two numbers, and the sign rule behind the second
`pq + d = (7)(4) + 3 = 28 + 3 = 31` riyals. Estimating first is worth the second it costs: four bottles at about seven riyals is about twenty-eight, so thirty-one is plausible and `62` would not have been.

`2a² + b = 2(-3)² + 5 = 2(9) + 5 = 23`. The bracket you write around `-3` during substitution is doing real work: it says the whole of `-3` is being squared.

`-3²` on its own reads as `-(3²) = -9`, because the exponent binds more tightly than the minus sign. So `(-3)² = 9` and `-3² = -9` are different numbers, and which one you meant is decided by a bracket you either wrote or did not.

The error worth naming: dropping the bracket at substitution and then blaming the arithmetic. The arithmetic was correct for what was actually written.
:::

## Family 4 · Interpret: what quantity came out, and in what unit?

A number with no unit answers no physical question. This family checks that the operation you chose matches the quantity you wanted.

### Decide: what does `cV` represent, and what is its unit?

### Then decide: would `c + V` mean anything?

:::answer Why one of these is a quantity and the other is not
`cV = (0.5 mol/L)(2 L) = 1 mol`. The litres cancel, leaving moles, so `cV` is an **amount of substance**. The unit cancellation is not a check performed afterwards — it is the reason multiplication is the right operation here.

`c + V` has no meaning. Adding `0.5 mol/L` to `2 L` is adding a concentration to a volume, and addition requires both terms to be the same kind of quantity. The arithmetic would produce `2.5` without complaint, which is exactly why the unit check matters: the symbols do not object, so you have to.

The error worth naming: treating the unit as a label attached at the end. The unit travels through the operation, and it is what tells you whether the operation was allowed.
:::

## What to be able to do before moving on

1. Say, for any written string, whether it admits "what value?" or "which values make it true?".
2. Translate a phrase whose grouping is carried by a word like "total", "sum" or "the whole of".
3. Substitute a negative value with the bracket that keeps its sign attached.
4. Multiply two quantities and report the unit that survives, and refuse an addition whose units disagree.

If any of these is still uncertain, the reference route lists the governing rule in one line; the written guide gives the reasoning behind it.

## Move between routes

- [Curriculum reference](/foundations/concepts/expressions-and-variables/approach-1/) — the rules behind these decisions, as lookup tables.
- [Written teaching guide](/foundations/reading/basic-math/expressions-and-variables/) — the full explanation, worked slowly.
- [Concept hub](/foundations/concepts/expressions-and-variables/) — prerequisites and what this leads to.
