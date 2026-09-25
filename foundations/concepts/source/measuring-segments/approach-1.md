# Measuring Segments

## What this route covers

This is the reference treatment: the postulate that lets a line be read like a ruler, the distance rule and the sign cases that trip it, the notation split between a figure and a number, and the arithmetic test for betweenness. It assumes you have met these before. If you have not, read the [full written guide](/foundations/reading/geometry/measuring-segments/) and return here to settle a ruling.

Covered: coordinates on a line, distance as an absolute difference, segment against length, the Segment Addition Postulate used in both directions, and what to conclude when the addition fails. Not covered: midpoints and congruence, which follow in [midpoints and segment congruence](/foundations/reading/geometry/midpoints-and-congruence/); distance in the plane; and proof technique.

## Where the idea sits

- **Assumed before it:** [points, lines and planes](/foundations/concepts/points-lines-and-planes/) for what a segment is, and absolute value from [integers and the number line](/foundations/concepts/integers-and-the-number-line/).
- **Established here:** that a length is a number obtained by subtraction, and that betweenness is something you test rather than something you see.
- **Depends on it afterwards:** midpoints, congruence, perimeter, coordinate distance, and any tolerance check on a built object.

## The Ruler Postulate

Choose a line, pick one point to be `0`, and choose a unit. Every point then has exactly one real number as its **coordinate**, and every real number has exactly one point.

| Consequence | Statement |
| --- | --- |
| no gaps | between any two points lies another, because between any two reals lies another |
| the frame is chosen | moving the zero, or changing the unit, changes every coordinate and moves no point |

This is assumed, not proved. It is what licenses measuring a line at all.

## Distance is an absolute difference

If `A` has coordinate `a` and `B` has coordinate `b`, then `AB = |a - b|`.

The bars are not decoration. "How far apart" has no direction, so the answer must not depend on which point you name first, and `|a - b| = |b - a|` delivers `AB = BA` automatically.

| `a` | `b` | `a - b` | `AB` |
| --- | --- | --- | --- |
| `2` | `7` | `-5` | `5` |
| `7` | `2` | `5` | `5` |
| `-3` | `4` | `-7` | `7` |
| `-9` | `-2` | `-7` | `7` |

The last two rows are where signs go wrong. `-3 - 4 = -7`, not `-1`; and `-9 - (-2) = -9 + 2 = -7`. Do the subtraction first, take the absolute value last.

**A distance is never negative.** A working that ends in `AB = -5` has produced a difference and called it a distance.

## The segment and its length are different objects

| Written | Is | Correct use |
| --- | --- | --- |
| segment `AB` | a set of points | "segment `AB` lies on line `AB`" |
| `AB` | a number, the length | "`AB = 5 cm`" |

"Segment `AB` = 5 cm" equates a set with a number. The distinction returns later as the split between `=` for lengths and `≅` for figures.

## Betweenness is measured, not seen

`B` is between `A` and `C` exactly when the three are collinear and

`AB + BC = AC`

| Given | Test | Conclusion |
| --- | --- | --- |
| `AB = 12`, `BC = 7` | `12 + 7 = 19` | `AC = 19` |
| `AC = 30`, `AB = 11` | `30 - 11` | `BC = 19`, the same rule rearranged |
| `DE = 8`, `EF = 5`, `DF = 11` | `8 + 5 = 13 ≠ 11` | `E` is not between; the points are not collinear |

Read the third row carefully. The failure does not merely deny betweenness — it denies collinearity. Travelling `13` to close a gap of `11` is what a bend looks like. Whenever the two shorter lengths exceed the longest, the three points form a triangle.

## Solving for an unknown

With `P`, `Q`, `R` in that order, `PQ = 2x + 1`, `QR = x - 3`, `PR = 25`:

`(2x + 1) + (x - 3) = 25`, so `3x - 2 = 25`, `x = 9`.

Then `PQ = 19` and `QR = 6`, and `19 + 6 = 25` confirms it. Substituting back is the check, and it costs one line.

## Boundary checks

- **The order in the statement is a given, not a deduction.** "In that order" is doing work; without it, `AB + BC = AC` is a claim to be tested rather than a rule to be applied.
- **Units travel with the number.** `AB = 12 mm` and `BC = 7 cm` cannot be added until one is converted. The symbols will not object.
- **A negative answer is a sign error, not a direction.** Length has no direction to record.
- **Absolute value does not order the points.** `|a - b|` tells you the gap and nothing about which point is further along the line.
- **The addition test detects non-collinearity, it does not locate the bend.** It tells you the three points are not on one line; it says nothing about where the corner is.

## Five checks after the reference

1. `A` has coordinate `-9` and `B` has coordinate `-2`. Find `AB`, showing the subtraction before the absolute value.
2. State the difference between "segment `AB`" and "`AB`", and say which one can equal `5 cm`.
3. `A`, `B`, `C` lie in that order with `AC = 30` and `AB = 11`. Find `BC`.
4. `D`, `E`, `F` have `DE = 8`, `EF = 5`, `DF = 11`. Is `E` between `D` and `F`? What else does your test establish?
5. `P`, `Q`, `R` lie in that order with `PQ = 2x + 1`, `QR = x - 3`, `PR = 25`. Find `x`, then check it.

:::answer Check your rulings
1. `-9 - (-2) = -9 + 2 = -7`, and `|-7| = 7`. So `AB = 7`. Subtracting a negative adds; this is the row where sign errors live.
2. Segment `AB` is a set of points; `AB` is a number. Only the number can equal `5 cm`.
3. `BC = AC - AB = 30 - 11 = 19`. The postulate rearranged, not a second rule.
4. No. `8 + 5 = 13`, which is not `11`. And the test establishes more than that: since the two shorter lengths exceed the longest, `D`, `E` and `F` are not collinear at all — they form a triangle.
5. `(2x + 1) + (x - 3) = 25` gives `3x - 2 = 25` and `x = 9`. Check: `PQ = 19`, `QR = 6`, and `19 + 6 = 25`.
:::

## Move between routes

- [Guided practice](/foundations/concepts/measuring-segments/approach-2/) — decide these yourself, with replies that name the error.
- [Written teaching guide](/foundations/reading/geometry/measuring-segments/) — the full explanation.
- [Concept hub](/foundations/concepts/measuring-segments/) — prerequisites and what follows.
