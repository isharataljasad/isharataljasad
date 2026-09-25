# Midpoints and Segment Congruence

## What this route covers

This is the reference treatment: the two conditions a midpoint must satisfy, the operation that finds one and the operation people reach for instead, the reverse problem, and the notation that separates a figure from its measure. It assumes you have met these before. If you have not, read the [full written guide](/foundations/reading/geometry/midpoints-and-congruence/) and return here to settle a ruling.

Covered: the definition, midpoints on a line and in the plane, recovering a missing endpoint, what may bisect a segment, and `≅` against `=`. Not covered: perpendicular bisectors as loci, proof technique, and midpoints of arcs or angles.

## Where the idea sits

- **Assumed before it:** distance as an absolute difference, from [measuring segments](/foundations/concepts/measuring-segments/), and coordinates from [the coordinate plane](/foundations/concepts/coordinate-plane/).
- **Established here:** that halving a segment is an averaging operation, and that congruence is a claim about figures while equality is a claim about numbers.
- **Depends on it afterwards:** perpendicular bisectors, triangle centres, coordinate proof, and any symmetry argument.

## The definition, with both conditions

The midpoint of segment `AB` is the point `M` such that

- `M` lies **on segment `AB`**, and
- `AM = MB`.

| Drop this condition | What gets admitted |
| --- | --- |
| `M` on the segment | every point equidistant from `A` and `B` — infinitely many in the plane, none of them the midpoint |
| `AM = MB` | every point of the segment |

A midpoint is a **point**, not a length. "The midpoint is `4`" is a statement about a coordinate and needs a number line in place before it means anything.

Since `AM = MB` and `AM + MB = AB`, each half is `AB / 2`.

## Average, not difference

| Question | Operation | With `a = -3`, `b = 9` |
| --- | --- | --- |
| how far apart? | `|a - b|` | `|-3 - 9| = 12` |
| what is halfway? | `(a + b) / 2` | `(-3 + 9) / 2 = 3` |

These answer different questions and are the most confused pair in the topic. Check the result against the numbers: `3` is `6` from `-3` and `6` from `9`, and `6` is half of `12`. **A midpoint that is not equidistant from both endpoints is wrong**, and that check costs one subtraction.

## The formulas

| Setting | Midpoint | Why |
| --- | --- | --- |
| on a line | `(a + b) / 2` | one coordinate to average |
| in the plane | `((x₁ + x₂)/2, (y₁ + y₂)/2)` | halfway along means halfway across and halfway up |

For `A = (-2, 5)` and `B = (6, 1)`: `((-2 + 6)/2, (5 + 1)/2) = (2, 3)`. The answer is an ordered pair, because a point in the plane needs two numbers.

## Recovering a missing endpoint

This is a different problem and is not solved by substituting into the formula.

Given `M = (2, 3)` is the midpoint of `AB` and `A = (-2, 5)`, find `B = (x, y)`.

| Coordinate | Equation | Solution |
| --- | --- | --- |
| `x` | `(-2 + x)/2 = 2` | `x = 6` |
| `y` | `(5 + y)/2 = 3` | `y = 1` |

So `B = (6, 1)`. Work one coordinate at a time and solve; nothing is divided by two at the end.

## What may bisect a segment

| Object | May bisect a segment? |
| --- | --- |
| a line, ray or segment through the midpoint | yes |
| a plane through the midpoint | yes |
| a point | only the midpoint itself, and it does not "bisect" — it *is* the division |

A bisector must meet the segment at its midpoint. Any number of different lines may bisect one segment; exactly one of them is perpendicular to it.

## Congruent figures, equal measures

| Written | Applies to | Reads as |
| --- | --- | --- |
| `AB = CD` | numbers | the two lengths are equal |
| segment `AB ≅` segment `CD` | figures | the two segments are congruent |

Congruent segments have equal lengths, and segments of equal length are congruent, so the two statements always travel together for segments. They are still different sentences: one compares measures, the other compares figures. Writing `segment AB = 5 cm` equates a set of points with a number.

## Boundary checks

- **Equidistant is not the same as midpoint.** In the plane, the equidistant points form a whole line; only one of them is on the segment.
- **Averaging is not subtracting.** If the answer does not sit between the endpoints, an average was not taken.
- **The reverse problem is not the forward one.** Recovering an endpoint solves an equation; it does not halve anything.
- **Congruence of segments coincides with equality of lengths, and this does not generalise.** For angles it also holds; for figures in general, equal measures do not imply congruence.
- **A midpoint needs a segment.** A line and a ray have no midpoint, because there is no second endpoint to average with.

## Five checks after the reference

1. A rail is marked at `-3` and at `9`. Give both the distance between the marks and the coordinate halfway between them, and name the operation used for each.
2. `A = (-2, 5)` and `B = (6, 1)`. Find the midpoint of `AB`.
3. `M = (2, 3)` is the midpoint of `AB` and `A = (-2, 5)`. Find `B`.
4. State the two conditions a point must meet to be the midpoint of `AB`, and say what dropping the first would admit.
5. Write the statement "these two segments are congruent" in symbols, and the statement "these two lengths are equal" in symbols.

:::answer Check your rulings
1. Distance `= |-3 - 9| = 12`, by absolute difference. Halfway `= (-3 + 9)/2 = 3`, by averaging. Check: `3` is six from each mark, and six is half of twelve.
2. `((-2 + 6)/2, (5 + 1)/2) = (2, 3)`.
3. `(-2 + x)/2 = 2` gives `x = 6`; `(5 + y)/2 = 3` gives `y = 1`. So `B = (6, 1)`. Nothing was halved — two equations were solved.
4. `M` must lie on segment `AB`, and `AM = MB`. Dropping the first admits every point equidistant from `A` and `B`, which in the plane is an entire line.
5. `segment AB ≅ segment CD` for the figures; `AB = CD` for the lengths.
:::

## Move between routes

- [Guided practice](/foundations/concepts/midpoints-and-congruence/approach-2/) — decide these yourself, with replies that name the error.
- [Written teaching guide](/foundations/reading/geometry/midpoints-and-congruence/) — the full explanation.
- [Concept hub](/foundations/concepts/midpoints-and-congruence/) — prerequisites and what follows.
