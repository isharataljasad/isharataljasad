# Angles and Radian Measure

## What this route covers

This is the reference treatment: the directed-turn picture, radians defined from arc length, the conversions, and the interval tests for terminal direction. It assumes you have met radians before. If you have not, read the [full written guide](/foundations/reading/trigonometry/angles/) and return here to settle a ruling.

Covered: standard position and sign, the radian as a ratio, conversion in both directions, coterminal angles, quadrant decisions including the axis boundaries, and the arc-length formula. Not covered: the trigonometric ratios themselves, the unit circle values, and graphing.

This is the trigonometry treatment. The geometry route [angles](/foundations/concepts/angles-geometry/) settles naming, degrees between `0°` and `180°`, and classification. This route lifts both restrictions: turns may exceed a revolution and may be negative.

## Where the idea sits

- **Assumed before it:** angle measure in degrees from [angles](/foundations/concepts/angles-geometry/), and quadrants from [the coordinate plane](/foundations/concepts/coordinate-plane/).
- **Established here:** that an angle records an amount and a direction of rotation, and that radians make arc length a multiplication.
- **Depends on it afterwards:** the trigonometric functions, angular velocity, rotational mechanics, and every oscillation in physics.

## Standard position and sign

| Element | Convention |
| --- | --- |
| vertex | at the origin |
| initial ray | along the positive x-axis |
| terminal ray | wherever the rotation ends |
| counterclockwise | positive |
| clockwise | negative |

Because the turn is directed and may continue past one revolution, `450°` and `90°` finish on the same ray while recording different rotations. Which of those two facts matters depends on the question.

## The radian

Place a circle of radius `r` at the vertex. An angle of **one radian** cuts an arc of length `r`. In general, for arc length `s`,

`θ = s / r`

Both lengths are in the same unit, so the ratio has no unit: a radian is a pure number. That is why `s = rθ` needs no conversion factor, and why "rad" may be dropped without ambiguity.

The whole circumference is `2πr`, so a full turn is `2π` radians.

| Turn | Degrees | Radians |
| --- | --- | --- |
| full | `360°` | `2π` |
| half | `180°` | `π` |
| quarter | `90°` | `π/2` |
| eighth | `45°` | `π/4` |
| twelfth | `30°` | `π/6` |

One radian is about `57.3°` — useful for sizing an answer, not for converting one.

## Converting

| Direction | Multiply by | Example |
| --- | --- | --- |
| degrees to radians | `π / 180` | `225 × π/180 = 5π/4` |
| radians to degrees | `180 / π` | `(11π/6) × 180/π = 330°` |

The two factors are reciprocals, so choosing the wrong one gives an answer wrong by a factor of about `3283`. An answer that is wildly too large or too small has usually been multiplied the wrong way.

## Coterminal angles

Adding or removing whole turns leaves the terminal ray unmoved.

| In | Coterminal set |
| --- | --- |
| degrees | `θ + 360k` for integer `k` |
| radians | `θ + 2πk` for integer `k` |

`-30°`, `330°` and `690°` all end on the same ray and describe three different rotations. Reduce by whole turns when you need the direction; keep the original when the amount of rotation is what matters — a motor that has turned `690°` has not done the same work as one that turned `-30°`.

## Terminal direction: check the axes first

| Interval (degrees) | Interval (radians) | Terminal ray |
| --- | --- | --- |
| `0` | `0` | positive x-axis |
| `0` to `90` | `0` to `π/2` | quadrant I |
| `90` | `π/2` | positive y-axis |
| `90` to `180` | `π/2` to `π` | quadrant II |
| `180` | `π` | negative x-axis |
| `180` to `270` | `π` to `3π/2` | quadrant III |
| `270` | `3π/2` | negative y-axis |
| `270` to `360` | `3π/2` to `2π` | quadrant IV |

The four boundary directions are **on axes and in no quadrant**. For a negative or large angle, reduce by whole turns before applying the table.

## Boundary checks

- **`s = rθ` requires radians.** Substituting `60` for a `60°` angle does not give a slightly wrong arc; it gives one about `57` times too long.
- **Coterminal is not equal.** Two coterminal angles share a direction and differ in rotation, and some questions are about the rotation.
- **A boundary angle has no quadrant**, exactly as a point on an axis has none.
- **Radians are dimensionless**, so an arc length comes out in the unit of `r`, and an angular speed in `rad/s` has the dimensions of `1/s`.
- **A calculator has a mode.** Every conversion rule here is defeated by evaluating in the wrong one, and the symptom is a plausible-looking wrong number.

## Five checks after the reference

1. Convert `225°` to radians, exactly.
2. Convert `11π/6` to degrees.
3. A circle has radius `2.5 m`. Find the arc cut by a `60°` angle, and state what you must do before using `s = rθ`.
4. Give two angles coterminal with `-30°`, one positive and one beyond a full turn, and say what all three share and what they do not.
5. Where does the terminal ray of `-450°` lie? Name the quadrant, or say why there is none.

:::answer Check your rulings
1. `225 × π/180 = 5π/4` radians.
2. `(11π/6) × 180/π = 330°`.
3. Convert first: `60° = π/3`. Then `s = 2.5 × π/3 ≈ 2.62 m`. Substituting `60` unconverted would give `150 m`, an arc sixty times the circle's own radius — an answer that fails a glance before it fails a check.
4. `330°` and `690°`. All three end on the same terminal ray; they record rotations of `-30°`, `330°` and `690°`, which are three different amounts of turning.
5. `-450° + 720° = 270°`, which is the negative y-axis. It is a boundary direction, so it lies in **no quadrant**; answering "quadrant IV" misses the boundary.
:::

## Move between routes

- [Guided practice](/foundations/concepts/angles/approach-2/) — decide these yourself, with replies that name the error.
- [Written teaching guide](/foundations/reading/trigonometry/angles/) — the full explanation.
- [Concept hub](/foundations/concepts/angles/) — prerequisites and what follows.
