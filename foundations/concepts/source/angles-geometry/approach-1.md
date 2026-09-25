# Angles

## What this route covers

This is the reference treatment: what an angle is made of, the naming rules and when each is allowed, the measure classification, and the standing rule about what a diagram does and does not assert. It assumes you have met angles before. If you have not, read the [full written guide](/foundations/reading/geometry/angles/) and return here to settle a ruling.

Covered: vertex and arms, why arm length is irrelevant, the three naming forms, degrees, the figure against its measure, classification, angle addition, and diagram marks. Not covered: reflex and directed angles, radian measure, and the trigonometric ratios — those continue in [angles and radian measure](/foundations/concepts/angles/).

## Where the idea sits

- **Assumed before it:** rays and their naming from [points, lines and planes](/foundations/concepts/points-lines-and-planes/), and the figure-against-measure split from [midpoints and segment congruence](/foundations/concepts/midpoints-and-congruence/).
- **Established here:** that an angle records a turn and nothing else, and that a diagram's marks are the only claims you may use.
- **Depends on it afterwards:** radian measure, triangle results, parallel-line arguments, and every resolved force in mechanics.

## What an angle is made of

An angle is the union of two rays sharing an endpoint. The shared endpoint is the **vertex**; the rays are the **arms**.

Because the arms are rays, they continue without end. A drawing shows short arms because paper is finite.

**The measure depends only on the turn between the arms, never on how far they are drawn.** Two angles drawn at very different scales may be equal; two angles with identical arm lengths may differ. This contradicts what a diagram suggests, which is why it is stated as a rule rather than left to intuition.

## Naming

| Name | Allowed when | Note |
| --- | --- | --- |
| `∠B` | exactly one angle has vertex `B` | forbidden as soon as a second ray starts at `B` |
| `∠ABC` | always | middle letter is the vertex |
| `∠1` | the diagram labels it so | a label, not a description |

The middle letter carries the vertex. Reversing the outer letters changes nothing, so `∠ABC` and `∠CBA` are one angle. Moving the vertex letter changes everything: `∠BAC` has vertex `A` and is a different angle.

With rays `BA`, `BD` and `BC` all from `B`, the name `∠B` could mean `∠ABD`, `∠DBC` or `∠ABC`, so all three need three letters.

## Measure, and the figure it belongs to

A full turn is `360°`, so one degree is `1/360` of a turn. In this route every angle measures more than `0°` and at most `180°`.

| Written | Is | Example |
| --- | --- | --- |
| `∠ABC` | a set of points, a figure | `∠ABC ≅ ∠DEF` |
| `m∠ABC` | a number, its measure | `m∠ABC = 50°` |

Angles are congruent exactly when their measures are equal: `∠ABC ≅ ∠DEF` precisely when `m∠ABC = m∠DEF`.

## Classification

| Name | Measure |
| --- | --- |
| acute | more than `0°`, less than `90°` |
| right | exactly `90°` |
| obtuse | more than `90°`, less than `180°` |
| straight | exactly `180°` |

A straight angle's arms point in opposite directions and together form a line; those arms are opposite rays.

## Adding measures

When `D` lies in the interior of `∠ABC`:

`m∠ABD + m∠DBC = m∠ABC`

This is the angle counterpart of segment addition, and it carries the same precondition. "In the interior" is a given, not something to be read off a sketch. If the addition fails, the interior assumption was wrong.

## What a diagram asserts

| Mark | Asserts | Without the mark |
| --- | --- | --- |
| small square at a vertex | that angle is exactly `90°` | it merely looks like a right angle |
| matching arcs | those angles are congruent | they merely look equal |
| matching ticks on segments | those segments are congruent | they merely look equal |
| stated measure | that value | nothing |

**An angle that looks like `90°` is not a right angle unless the square is drawn or the measure is stated.** This is the same rule that governs equal-looking lengths, and it is the rule that makes a diagram usable as evidence at all: what is marked may be used, and what is not marked may not.

## Boundary checks

- **Arm length is not evidence of anything.** Redrawing an arm longer changes the picture and no measurement.
- **A single-letter name is illegal the moment a second ray joins the vertex**, even if the diagram was unambiguous when it was drawn.
- **Angle addition needs the interior condition**, which a sketch cannot supply.
- **Reflex angles are outside this route.** Beyond `180°` the classification above stops, and directed angles need a sign convention that is set up in trigonometry.
- **Congruence and equality apply to different objects**: `≅` to the angles, `=` to their measures.

## Five checks after the reference

1. Rays `BA`, `BD` and `BC` all start at `B`. Is `∠B` a legal name? Name all three angles legally.
2. `∠ABC` is drawn, then arm `BA` is redrawn twice as long. What happens to `m∠ABC`?
3. `m∠ABD = 35°` and `m∠DBC = 55°`, with `D` in the interior of `∠ABC`. Find `m∠ABC` and classify it.
4. In a diagram, an angle looks like a right angle but carries no square and no stated measure. May you use `90°` in a calculation?
5. Write, in symbols, "these two angles are congruent" and "these two measures are equal".

:::answer Check your rulings
1. No. With three rays from `B` the name `∠B` is ambiguous. The three angles are `∠ABD`, `∠DBC` and `∠ABC`.
2. Nothing. The measure records the turn between the arms, and the arms are rays that were already endless. Only the drawing changed.
3. `35° + 55° = 90°`, so `m∠ABC = 90°` and it is a right angle. Note that this is a right angle because the arithmetic says so, not because the sketch looks square.
4. No. An unmarked angle asserts nothing, however convincing it looks. You may use only what is marked or stated.
5. `∠ABC ≅ ∠DEF` for the figures; `m∠ABC = m∠DEF` for the measures.
:::

## Move between routes

- [Guided practice](/foundations/concepts/angles-geometry/approach-2/) — decide these yourself, with replies that name the error.
- [Written teaching guide](/foundations/reading/geometry/angles/) — the full explanation.
- [Concept hub](/foundations/concepts/angles-geometry/) — prerequisites and what follows.
