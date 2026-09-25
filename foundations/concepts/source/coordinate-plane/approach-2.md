# The Coordinate Plane

## What this route covers

This is the practice treatment. One survey is set up below and every family asks a question about the same pegs, so the decisions accumulate rather than restart. Commit to an answer before opening each reply. The replies name the misreading behind the tempting wrong answer, and several of these wrong answers are ones a drawing actively encourages.

If a ruling surprises you, the [curriculum reference](/foundations/concepts/coordinate-plane/approach-1/) states it as a rule, and the [written guide](/foundations/reading/geometry/coordinate-plane/) explains it at length.

## The one survey used throughout

A site is surveyed from a chosen origin, with coordinates in metres.

| Peg | Coordinates |
| --- | --- |
| `A` | `(1, -2)` |
| `B` | `(3, 2)` |
| `C` | `(4, 4)` |
| `D` | `(4, 3)` |
| `R` | `(0, -7)` |
| `S` | `(5, 1)` |
| `T` | `(5, 7)` |

The origin was chosen by the surveyor. Moving it would change every pair in this table without moving a single peg.

## Family 1 · Reading a pair

### Decide: peg `B` is at `(3, 2)`. Describe the movement that reaches it from the origin.

### Then decide: is a peg at `(2, 3)` the same place as `B`?

:::answer What the order is carrying
`B` is reached by moving three metres in the positive x-direction, then two metres in the positive y-direction. Horizontal first, vertical second.

`(2, 3)` is a different peg: two across and three up. The order is not a convention to be recalled; it is half the information in the pair. The two coincide only on the line `y = x`, and neither of these is on it.

The error worth naming: treating `(x, y)` as an unordered pair of two numbers that happen to be written in some sequence. Swapping them moves the peg.
:::

## Family 2 · Quadrant, or neither?

### Decide: which quadrant is peg `A` in?

### Then decide: peg `R` is at `(0, -7)`. Is it in quadrant III or IV?

Answer the second question exactly as it is asked.

:::answer One of these questions has no correct option
`A(1, -2)` has positive `x` and negative `y`, so it is in **quadrant IV**.

`R(0, -7)` is in **neither**. Its `x` is zero, so it sits on the y-axis, and the quadrants are the open regions **between** the axes. A point on a boundary is in no region.

The second question offers two options and both are wrong. That is deliberate: a question can be badly posed, and the right response is to say so rather than to pick the closer-looking option. `R` is below the origin, which makes "III or IV" feel reasonable, and it is still on the axis.

The error worth naming: answering the question that was asked instead of checking whether it admits an answer. A zero coordinate always puts a point on an axis.
:::

## Family 3 · Collinear, decided by substitution

### Decide: find the line through `A(1, -2)` and `B(3, 2)`

Give the slope and the equation.

### Then decide: which of `C(4, 4)` and `D(4, 3)` lies on it?

Test both before reading on.

:::answer The test, and what a drawing would have told you
Rise `= 2 - (-2) = 4`, run `= 3 - 1 = 2`, so the slope is `2` and the line is `y = 2x - 4`.

Testing `C(4, 4)`: `2(4) - 4 = 4`, which matches its `y`. `C` is on the line.

Testing `D(4, 3)`: `2(4) - 4 = 4`, but `D` has `y = 3`. `D` is **not** on the line, and misses it by one metre.

On a sketch of this site, `C` and `D` are one metre apart at the far end of a line running several metres. `D` would look as though it lies on the line, or close enough to call it so. Substitution is the only thing that separates them, and on a real site that metre is a wall in the wrong place.

The error worth naming: using the drawing as evidence. The drawing is a record of the answer, never the test for it.
:::

## Family 4 · The vertical case the slope test cannot reach

### Decide: what is the slope of the line through `S(5, 1)` and `T(5, 7)`?

### Then decide: how would you test whether a peg at `(5, 4)` lies on that line?

:::answer Why the answer is not a number, and what replaces it
Run `= 5 - 5 = 0`. Dividing the rise by zero is not permitted, so the slope is **undefined**. It is not zero, and it is not "very large": those are answers to different questions. A horizontal line has slope zero; this line has none.

So the equation `y = mx + c` cannot describe it at all. The line is `x = 5`, and the test for any third peg is whether its `x` equals `5`. Peg `(5, 4)` passes, and so would `(5, 1000)`.

The error worth naming: reporting a slope of zero for a vertical line. Zero slope means "no rise per unit of run", which describes a flat line. Undefined slope means there is no run to divide by at all — the opposite situation, and one that needs a different form of equation.
:::

## What to be able to do before moving on

1. Convert between a pair and a movement, and say why swapping the entries moves the point.
2. Name a quadrant from the signs, and recognise a point that is in none of them.
3. Find the line through two pegs and test a third by substitution, rather than by how the sketch looks.
4. Recognise a vertical line, say why its slope is undefined rather than zero, and give the test that replaces the slope.

## Move between routes

- [Curriculum reference](/foundations/concepts/coordinate-plane/approach-1/) — the rules as lookup tables.
- [Written teaching guide](/foundations/reading/geometry/coordinate-plane/) — the full explanation.
- [Concept hub](/foundations/concepts/coordinate-plane/) — prerequisites and what follows.
