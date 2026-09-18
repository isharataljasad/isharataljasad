# The coordinate plane

**Geometry, episode 01 | Early reading edition**

## What this lesson will settle

A coordinate plane lets us describe a location with numbers instead of pointing at a drawing. This lesson covers the axes, origin, ordered pairs, quadrants, points on axes, plotting, and a reliable test for whether points share a line.

## 1. Two number lines make one plane

The horizontal **x-axis** and vertical **y-axis** cross at the **origin** `(0,0)`. Positive `x` goes right, negative `x` goes left; positive `y` goes up, negative `y` goes down. A point `(x,y)` gives the horizontal coordinate first and the vertical coordinate second. The order is part of the information: `(2,5)` and `(5,2)` are usually different points.

The axes divide the plane into four open regions, called quadrants. Their numbering starts in the upper right and moves counterclockwise:

| Quadrant | Signs of `(x,y)` | Example |
| --- | --- | --- |
| I | `(+,+)` | `(3,2)` |
| II | `(-,+)` | `(-3,2)` |
| III | `(-,-)` | `(-3,-2)` |
| IV | `(+,-)` | `(3,-2)` |

A point with `x = 0` sits on the y-axis. A point with `y = 0` sits on the x-axis. **Neither is in a quadrant**, because the quadrants are the regions between the axes. The origin belongs to both axes.

## 2. Plot a point by a repeatable movement

To plot `P(-4,3)`, begin at the origin, move four units left along the x-direction, then three units up parallel to the y-axis. Mark the intersection and label it `P`. To read a plotted point, reverse that path: find its horizontal coordinate, then its vertical coordinate. Use the printed tick marks rather than guessing from the visual spacing.

Coordinates can also carry physical units. If `x` and `y` measure metres, the coordinate `(-4,3)` means four metres in the negative x-direction and three metres in the positive y-direction from the chosen origin. The origin and axes are a **chosen frame**, not properties of the point itself.

## 3. Collinear means one whole line contains the points

Any two distinct points determine a line, so “are these two points collinear?” is not a useful test by itself. The meaningful question is whether a **third or later** point lies on the same line.

Take `A(1,-2)` and `B(3,2)`. The rise is `2 - (-2) = 4`, and the run is `3 - 1 = 2`, so the slope is `4/2 = 2`. The line through them is `y = 2x - 4`. To test `C(4,4)`, substitute both coordinates: `4 = 2(4) - 4`, which is true. Thus `A`, `B`, and `C` are collinear. For `D(4,3)`, the test is `3 = 2(4) - 4`, which is false, so `D` is off that line.

Substitution avoids trusting an imprecise sketch. The slope test works too when the line is not vertical; for a vertical line, all its points have the same `x` value, and its slope is undefined. This boundary case is easy to miss if every example is slanted.

## Coverage before questions

You have covered x/y axes, origin, ordered pairs and their order, plotting and reading points, four sign patterns, points on the axes, collinearity, equation testing, and the vertical-line exception. Questions begin now.

## Six question fingerprints

1. **Read/plot:** Describe how to plot `Q(2,-5)`, and state its quadrant.
2. **Axis boundary:** Where is `R(0,-7)`? Is it in quadrant III or IV?
3. **Order error:** A student plots `(5,-2)` by moving left two and up five. Which point did the student actually plot?
4. **Line membership:** Does `E(-1,-6)` lie on `y = 2x - 4`? Show the substitution.
5. **Collinearity:** Are `A(0,1)`, `B(2,5)`, and `C(4,9)` collinear? Explain with a relation rather than appearance.
6. **Vertical exception:** Are `(3,-4)`, `(3,2)`, and `(3,10)` collinear even though the slope formula has a zero denominator?

## Answers with reasons

1. Start at `(0,0)`, move two right and five down. The signs `(+,-)` put `Q` in quadrant IV.
2. `R` is on the negative y-axis, not in either neighboring quadrant; its `x` coordinate is zero.
3. The movement “left two, up five” plots `(-2,5)`. The coordinates were swapped and their directions changed.
4. Yes: `2(-1)-4 = -6`, matching the point's y-coordinate.
5. Yes. The line through the first two points has slope `(5-1)/(2-0)=2` and equation `y=2x+1`; at `x=4` it gives `y=9`.
6. Yes. All three share `x=3`, so they lie on the vertical line `x=3`. Undefined slope does not mean no line exists.

**Next connection:** [Points, lines, and planes](GE-02-points-lines-and-planes.md) gives the geometric language behind the plotted points and lines.
