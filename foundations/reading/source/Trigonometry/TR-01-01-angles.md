# Angles: degrees, radians, and terminal position

**Trigonometry, episode 1.1 | Early reading edition**

## What this lesson will settle

An angle records a **rotation**, not only the gap between two rays. We need to measure that rotation in degrees or radians, move between the units, recognize angles with the same terminal direction, and locate the terminal ray. Those decisions come before sine and cosine.

## 1. An angle is a directed turn

Draw an initial ray from a vertex. Rotate it to a terminal ray. A counterclockwise turn is positive; a clockwise turn is negative. In **standard position**, the vertex is the origin and the initial ray points along the positive x-axis. The terminal ray may point into a quadrant or lie exactly on an axis.

One complete positive revolution is `360°`. A half revolution is `180°`; a quarter is `90°`. Because the turn has direction and can continue beyond one revolution, `450°` and `90°` reach the same terminal direction but record different amounts of rotation.

## 2. Radians connect angle to arc length

Imagine a circle of radius `r` centered at the angle's vertex. An angle of **one radian** cuts an arc of length `r`. More generally, if the arc length is `s`, then its angle measure in radians is `θ = s/r`. Both lengths use the same unit, so radians are dimensionless ratios.

The whole circumference is `2πr`. Dividing by `r` shows that a full turn is `2π` radians. Therefore `180° = π` radians, `90° = π/2`, `45° = π/4`, and `30° = π/6`. One radian is about `57.3°`, which is a useful size estimate, not an exact conversion.

| To convert | Multiply by | Example |
| --- | --- | --- |
| Degrees to radians | `π/180` | `225° × π/180 = 5π/4` |
| Radians to degrees | `180/π` | `(11π/6) × 180/π = 330°` |

Keep the unit with the number while converting. The useful arc formula `s = rθ` expects `θ` **in radians**. Inserting `60` for a `60°` angle without first converting gives the wrong arc length.

## 3. Coterminal angles share a terminal ray

Adding or subtracting a whole turn does not change the terminal direction. In degrees, angles `θ + 360°k` are coterminal with `θ`; in radians, use `θ + 2πk`, where `k` is any integer. For example, `-30°`, `330°`, and `690°` end on the same ray, but they describe different turns. Reduce an angle by whole turns when you need to classify its terminal direction; retain the original measure when the amount of rotation matters.

## 4. Decide quadrant only after checking the axes

In standard position, terminal rays between `0°` and `90°` lie in quadrant I; between `90°` and `180°` in II; between `180°` and `270°` in III; and between `270°` and `360°` in IV. The boundary directions `0°`, `90°`, `180°`, and `270°` are **on axes, not in quadrants**. The radian boundaries are `0`, `π/2`, `π`, and `3π/2`.

For a negative or large angle, add or subtract whole turns first. `-450° + 720° = 270°`, so the terminal ray lies on the negative y-axis. Calling it quadrant IV would miss the boundary. A diagram can help, but the interval test makes the decision exact.

## Coverage before questions

This explanation has covered initial and terminal rays, signed turns, standard position, degrees, radian meaning through arc length, conversion, benchmark angles, coterminal angles, quadrant intervals, and axis boundaries. It does not yet cover the trigonometric ratios; they belong in later lessons.

## Six question fingerprints

1. **Meaning:** Why does one radian have the same numerical measure on circles of different sizes?
2. **Convert:** Express `150°` in radians, and `7π/4` radians in degrees.
3. **Arc transfer:** A circle has radius `5 cm`. What arc length corresponds to `π/3` radians?
4. **Coterminal:** Find a coterminal angle with `-75°` between `0°` and `360°`.
5. **Boundary:** Which quadrant contains the terminal ray of `-3π/2`? Explain the correct classification.
6. **Error:** A student uses `s = rθ` with `r = 2 m` and `θ = 90°`, obtaining `180 m`. Locate and repair the error.

## Answers with reasons

1. Radians compare arc length with radius. If both lengths scale together, `s/r` stays the same.
2. `150° × π/180 = 5π/6`; `(7π/4) × 180/π = 315°`.
3. `s = rθ = 5(π/3) = 5π/3 cm`; the angle is already in radians.
4. Add one turn: `-75° + 360° = 285°`.
5. None. `-3π/2 + 2π = π/2`, which is the positive y-axis, not inside a quadrant.
6. Convert `90°` to `π/2` radians first. Then `s = 2(π/2) = π m`. The original answer treated degrees as radians.

**Earlier connection:** [The coordinate plane](../Geometry/GE-01-coordinate-plane.md) defines axes and quadrants used to locate terminal rays.
