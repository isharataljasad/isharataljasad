# Exponents

## What this route covers

This is the practice treatment. One object is set up below — a square tile — and every family returns to it, so the quantity stays familiar while the decision changes. Commit to an answer before opening each reply. The replies say which base you must have used to get the tempting wrong answer, because on this topic the wrong answer almost always comes from raising the wrong thing.

If a ruling surprises you, the [curriculum reference](/foundations/concepts/exponents/approach-1/) states it as a rule, and the [written guide](/foundations/reading/basic-math/exponents/) explains it at length.

## The one object used throughout

A square ceramic tile.

| Symbol | Means | Value used below |
| --- | --- | --- |
| `s` | length of one side | `3 cm` |
| `n` | number of tiles along one edge of a square floor | `4` |
| `k` | a scaling factor applied to a side | `3` |

Everything below is about this tile, its area, and what happens when a side is scaled.

## Family 1 · Which number is repeated?

### Decide: the tile's area is `s²`. At `s = 3 cm`, what is it, with its unit?

Commit to a number and a unit before reading on.

### Then decide: is `s²` at `s = 3` equal to `s × 2`?

:::answer The value, the unit, and the confusion behind the wrong one
`s² = (3 cm)² = 9 cm²`. Both the number and the unit are squared, because the bracket puts the whole quantity — three and its centimetres — inside the base. That is what makes the answer an area rather than a length.

`s × 2 = 6 cm`, which is a length. The exponent counts copies of the base being multiplied; it is not a factor itself. `3² = 3 × 3 = 9`, not `3 × 2 = 6`. The two happen to be close for small numbers, which is exactly why the habit survives: at `s = 10` they are `100` and `20`.

The error worth naming: reading the exponent as a multiplier. Check the unit — if your answer to an area question came out in `cm`, the exponent was treated as a factor.
:::

## Family 2 · Where the coefficient sits

### Decide: a side is tripled. Is the new area `3s²` or `(3s)²`?

Decide from the situation, not from the symbols, then check what each expression means.

### Then decide: evaluate both at `s = 3 cm`

:::answer Only one of these describes the tripled tile
Tripling the side gives a new side `3s`, and the new area is `(3s)²`. At `s = 3 cm` that is `(9 cm)² = 81 cm²`.

`3s²` is three times the *original* area: `3 × 9 cm² = 27 cm²`. It describes three tiles, not one larger tile.

So the bracket is not notation-keeping; the two expressions describe different physical objects. And note the ratio: tripling a length multiplies area by nine, not by three. Areas scale by the square of the scale factor, which is why `(3s)² = 9s²`.

The error worth naming: attaching the coefficient to the base by habit. In `3s²` only `s` is squared; the `3` sits outside and is untouched by the exponent.
:::

## Family 3 · Signs, and what the bracket encloses

The tile is behind us for this family; the rule is the same one, stated on numbers.

### Decide: give `(-3)²` and `-3²`

Name the base in each before giving the value.

### Then decide: evaluate `2x³` at `x = -2`

Write the substituted line first.

:::answer Two bases, and why the exponent's parity matters
`(-3)² = 9`; the base is `-3` and two negative factors give a positive product. `-3² = -9`; the base is `3`, and the minus is applied after the power. One bracket moved the sign into the base and changed the answer by 18.

`2x³` at `x = -2` is `2(-2)³ = 2(-8) = -16`. Three negative factors leave one negative sign, so an odd exponent keeps the sign and an even exponent removes it.

That parity is the reason this slip is dangerous rather than merely wrong: at an odd exponent, dropping the bracket often gives the right answer anyway, so the habit is never corrected — and then it silently fails the first time the exponent is even.

The error worth naming: deciding the sign by looking at the minus instead of by counting the negative factors.
:::

## Family 4 · The two edge exponents

### Decide: how many tiles are on a floor `n` tiles wide and `n` tiles deep, when `n = 1`?

Then say what `n²` and `n⁰` give at `n = 1`, and whether either matches the floor.

### Then decide: is `12⁰ = 1` a definition or a consequence?

:::answer What the zero exponent is for
At `n = 1` the floor is one tile, and `n² = 1`. That agrees, but it agrees for every rule at `n = 1`, so it settles nothing — a useful thing to notice about test cases.

`n⁰ = 1` for any non-zero `n`. It is a consequence, not an arbitrary definition. Dividing a power by its base steps the exponent down by one: `a³ ÷ a = a²`, then `a² ÷ a = a¹`, then `a¹ ÷ a = a⁰`. Since `a¹ ÷ a = 1`, the pattern forces `a⁰ = 1`.

The argument divides by the base, so it says nothing at all when the base is zero. That is why `0⁰` is left unassigned here rather than given a value.

The error worth naming: reading `a⁰` as "no copies, so nothing". The zero exponent is chosen to keep division consistent, and consistency is what it buys.
:::

## What to be able to do before moving on

1. Square a measured quantity and report the unit that results, distinguishing an area from a length.
2. Decide whether a coefficient is inside or outside the base, and say which physical situation each expression describes.
3. Keep a negative sign inside a base through a substitution, and predict the sign from the parity of the exponent.
4. State `a¹` and `a⁰`, give the reason `a⁰ = 1`, and say why that reason excludes `a = 0`.

## Move between routes

- [Curriculum reference](/foundations/concepts/exponents/approach-1/) — the rules as lookup tables.
- [Written teaching guide](/foundations/reading/basic-math/exponents/) — the full explanation.
- [Concept hub](/foundations/concepts/exponents/) — prerequisites and what follows.
