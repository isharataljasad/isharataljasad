# The Coordinate Plane

## What this route covers

This is the reference treatment: the naming rules, the sign pattern of each region, and the one reliable test for whether points lie on a common line. It assumes you have met coordinates before. If you have not, read the [full written guide](/foundations/reading/geometry/coordinate-plane/) and return here to check a ruling.

Covered: axes and origin, ordered pairs and why the order is information, the four quadrants, why points on an axis are in none of them, plotting as a repeatable movement, the collinearity test by substitution, and the vertical-line case that the slope test cannot handle. Not covered: distance and midpoint formulas, the equation of a line in its various forms, or graphing functions.

## Where the idea sits

- **Assumed before it:** signed numbers and order, from [integers and the number line](/foundations/concepts/integers-and-the-number-line/).
- **Established here:** that a location can be named by numbers relative to a chosen frame, and tested by substitution rather than by eye.
- **Depends on it afterwards:** [functions and allowed inputs](/foundations/models/functions-and-domain/), slope and linear equations, [measuring segments](/foundations/reading/geometry/measuring-segments/), vectors, and every graph in physics.

## The frame

| Element | Definition | Note |
| --- | --- | --- |
| x-axis | the horizontal number line | positive to the right |
| y-axis | the vertical number line | positive upward |
| origin | where the axes cross, `(0, 0)` | belongs to both axes |
| ordered pair `(x, y)` | horizontal coordinate first, vertical second | `(2, 5)` and `(5, 2)` are different points |

The axes and origin are a **chosen frame**, not a property of the points. Coordinates may carry units: with metres, `(-4, 3)` means four metres in the negative x-direction and three in the positive y-direction from whichever origin was chosen.

## The four quadrants, and what is in none of them

| Region | Signs of `(x, y)` | Example |
| --- | --- | --- |
| I | `(+, +)` | `(3, 2)` |
| II | `(-, +)` | `(-3, 2)` |
| III | `(-, -)` | `(-3, -2)` |
| IV | `(+, -)` | `(3, -2)` |

Numbering starts in the upper right and runs counterclockwise.

| Point | Where it is | Quadrant |
| --- | --- | --- |
| `(0, -7)` | on the y-axis | none |
| `(4, 0)` | on the x-axis | none |
| `(0, 0)` | the origin, on both axes | none |

A quadrant is an **open region between** the axes. A point with a zero coordinate lies on a boundary, and boundaries belong to no region. Asking whether `(0, -7)` is in quadrant III or IV is a question with no correct answer.

## Plotting as a movement

To plot `P(-4, 3)`: start at the origin, move four units along the negative x-direction, then three units parallel to the positive y-direction, and mark where you arrive. To read a plotted point, reverse the path. Use the printed tick marks; visual spacing on a sketch is not evidence.

## Testing whether points share a line

Any two distinct points determine a line, so asking whether two points are collinear settles nothing. The question only has content from the third point onward.

| Step | On `A(1, -2)` and `B(3, 2)` |
| --- | --- |
| rise | `2 - (-2) = 4` |
| run | `3 - 1 = 2` |
| slope | `4 / 2 = 2` |
| the line | `y = 2x - 4` |
| test `C(4, 4)` | `2(4) - 4 = 4`, matches, so `C` is on it |
| test `D(4, 3)` | `2(4) - 4 = 4 ≠ 3`, so `D` is not |

Substitution decides it. A sketch can place `D` convincingly close to the line and still be wrong.

## Boundary checks

- **The slope test fails on vertical lines.** All points on a vertical line share one `x`, the run is zero, and the slope is undefined rather than large. Test such a line by comparing `x` values, not by dividing.
- **Zero slope and undefined slope are different.** A horizontal line has slope `0`; a vertical line has no slope. They are not two names for one situation.
- **A quadrant answer for an axis point is always wrong**, however the question is phrased.
- **Order is information, not convention to be recalled.** `(5, 2)` is a different location from `(2, 5)` except on the line `y = x`.
- **A drawing is evidence of nothing.** Collinearity, and every claim in this topic, is settled by substitution.

## Five checks after the reference

1. Describe the movement that plots `Q(2, -5)`, and name its quadrant.
2. Where is `R(0, -7)`? Answer the question "quadrant III or IV?" as asked.
3. `A(1, -2)` and `B(3, 2)` are given. Find the line through them, then decide whether `C(4, 4)` lies on it.
4. Decide whether `D(4, 3)` lies on that same line, and say what a sketch would have suggested.
5. Two pegs are at `(5, 1)` and `(5, 7)`. Find the slope of the line through them, and state how to test a third peg `(5, 4)`.

:::answer Check your rulings
1. From the origin, two units right, then five units down. `x` is positive and `y` negative, so `Q` is in quadrant IV.
2. Neither. `R` has `x = 0`, so it lies on the y-axis, and the axes are not inside any quadrant. The question offers two options and the correct answer is that both are wrong.
3. Slope `= 4/2 = 2`, and the line is `y = 2x - 4`. Testing `C`: `2(4) - 4 = 4`, which matches its `y`, so `C` is on the line.
4. `2(4) - 4 = 4`, but `D` has `y = 3`, so `D` is not on the line. On a sketch `D` sits one unit below `C` and would look close enough to pass; substitution is what separates them.
5. The run is `5 - 5 = 0`, so the slope is **undefined** — not zero, and not a large number. The line is vertical, and the test for any third peg is simply whether its `x` equals `5`. Peg `(5, 4)` passes.
:::

## Move between routes

- [Guided practice](/foundations/concepts/coordinate-plane/approach-2/) — decide these yourself, with replies that name the misreading.
- [Written teaching guide](/foundations/reading/geometry/coordinate-plane/) — the full explanation.
- [Concept hub](/foundations/concepts/coordinate-plane/) — prerequisites and what follows.
