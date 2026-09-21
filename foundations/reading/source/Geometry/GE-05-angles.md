# Angles

**Geometry, episode 05 | Early reading edition**

## What this lesson will settle

Segments measure how far apart two points are. An angle measures how far one direction has turned from another. This lesson defines the object, names it without ambiguity, measures it, adds measures, and classifies the result.

You will also meet the idea that decides most early mistakes: **the drawn length of the arms has nothing to do with the size of the angle**.

Assumed before this: rays and their endpoints from [points, lines and planes](GE-02-points-lines-and-planes.md), and the `=` against `≅` distinction from [midpoints and segment congruence](GE-04-midpoints-and-congruence.md). Not covered here: angle pairs such as complementary, supplementary and vertical angles, and parallel-line angle relationships, which follow in the reasoning and parallel-lines units. Radian measure belongs to [trigonometry](../Trigonometry/TR-01-01-angles.md); this chapter uses degrees.

## 1. An angle is two rays from one point

An **angle** is the union of two rays that share an endpoint. The shared endpoint is the **vertex**, and the two rays are the **sides** or **arms**.

Because an angle is built from rays, the arms continue without end. A drawing shows short arms only because paper is finite. Lengthening an arm on the page changes the picture and changes nothing about the angle.

That is worth stating as a rule, because it contradicts what a diagram suggests:

> The measure of an angle depends only on the turn between its arms, never on how far the arms are drawn.

Two angles drawn at very different scales can be equal. Two angles with identical arm lengths can be very different.

## 2. Naming an angle without ambiguity

| Name | When it is allowed |
| --- | --- |
| `∠B` | Only when exactly one angle has vertex `B`. |
| `∠ABC` | Always. The middle letter is the vertex; the outer letters name a point on each arm. |
| `∠1` | When the diagram labels the angle with that number. |

The middle letter rule is the one to hold on to: in `∠ABC`, the vertex is `B`. Reversing the outer letters changes nothing, so `∠ABC` and `∠CBA` are the same angle. Moving the vertex letter does change things: `∠BAC` is a different angle, with vertex `A`.

When several angles share a vertex, the single-letter name becomes ambiguous and is not allowed. If rays `BA`, `BD` and `BC` all start at `B`, then `∠B` could mean `∠ABD`, `∠DBC` or `∠ABC`, so every one of them must be named with three letters.

## 3. Measuring in degrees

A full turn is `360°`, so one degree is `1/360` of a full turn. Every angle in this chapter is assigned a real number of **degrees** greater than `0` and at most `180`. Turns beyond `180°` — reflex angles — and directed angles that count which way you turned both need conventions this chapter does not set up; [trigonometry](../Trigonometry/TR-01-01-angles.md) introduces them.

Write `m∠ABC = 50°` for the measure. As with segments, the figure and its measure are different things: `∠ABC` is a set of points, `m∠ABC` is a number. Angles are **congruent** when their measures are equal:

`∠ABC ≅ ∠DEF` exactly when `m∠ABC = m∠DEF`

In a diagram, congruent angles are marked with matching arcs, in the same way congruent segments are marked with ticks. An arc is a statement you may use; angles that merely look equal are not.

## 4. Classifying by measure

| Name | Measure |
| --- | --- |
| Acute | greater than `0°` and less than `90°` |
| Right | exactly `90°` |
| Obtuse | greater than `90°` and less than `180°` |
| Straight | exactly `180°` |

A right angle is marked with a small square at the vertex. That mark is a statement. **An angle that looks like `90°` is not a right angle unless the square is drawn or the measure is stated** — the same rule that applies to equal-looking lengths.

A straight angle has its two arms pointing in opposite directions, so together they form a line. Those two arms are opposite rays.

## 5. Adding angle measures

If point `D` lies in the interior of `∠ABC`, then

`m∠ABD + m∠DBC = m∠ABC`

This is the **Angle Addition Postulate**, and it chains letters exactly like the segment version: start at the first outer letter, pass through the shared middle ray, finish at the last. The vertex `B` stays in the middle of every name.

"In the interior" is the condition that does the work. If ray `BD` falls outside `∠ABC`, the sum overshoots and the equation fails. A drawing can make an exterior ray look interior, so rely on what is stated.

**Find a whole.** `m∠ABD = 35°` and `m∠DBC = 40°`, with `D` interior. Then `m∠ABC = 75°`.

**Find a part.** `m∠ABC = 118°` and `m∠ABD = 47°`, with `D` interior. Then `m∠DBC = 118 − 47 = 71°`.

**Find an unknown.** Ray `BD` is interior to `∠ABC`, with `m∠ABD = 4x + 5`, `m∠DBC = 2x − 11` and `m∠ABC = 90°`. Then

`(4x + 5) + (2x − 11) = 90`, so `6x − 6 = 90`, so `6x = 96` and `x = 16`.

Check: `m∠ABD = 69°` and `m∠DBC = 21°`, and `69 + 21 = 90`. Both parts are positive and each is under `180°`, so the answer survives. A value making either part negative would have to be rejected, exactly as with segment lengths.

**Bisect an angle.** A ray that divides an angle into two congruent angles is an **angle bisector**. If ray `BD` bisects `∠ABC` and `m∠ABC = 76°`, then `m∠ABD = m∠DBC = 38°`.

## 6. What a drawing may and may not tell you

This table is the angle version of the rule from episode 02, and it is where marks earn their keep.

| From the diagram | May you use it? |
| --- | --- |
| Which rays share a vertex | Yes — that is what is drawn. |
| The order of rays around the vertex, so which ray is interior | Yes. |
| A small square at the vertex | Yes: the angle is exactly `90°`. |
| Matching arcs on two angles | Yes: those angles are congruent. |
| An angle that "looks like" `90°` with no square | No. |
| Two angles that "look equal" with no arcs | No. |
| Arm length, or which arm is drawn longer | Never relevant to the measure. |

## Coverage before questions

The explanation has covered the angle as two rays from a vertex, why arm length is irrelevant, the three naming forms and when a single letter is ambiguous, degree measure and the split between `∠ABC` and `m∠ABC`, congruence and its arc notation, the four classifications and the right-angle square, the addition postulate with its interior condition, solving for an unknown with a rejection check, angle bisectors, and what a diagram may be trusted for. The questions test different parts of that coverage.

## Seven question fingerprints

1. **Naming:** Rays `BA`, `BD` and `BC` all have endpoint `B`, with `D` interior to `∠ABC`. Explain why `∠B` is not an acceptable name, and list the three angles present using three letters each.
2. **Same or different:** Are `∠PQR` and `∠RQP` the same angle? Are `∠PQR` and `∠QPR`? Justify each answer from the middle-letter rule.
3. **Arm length:** Angle 1 is drawn with arms 2 cm long; angle 2 is drawn with arms 8 cm long. Can angle 1 be larger than angle 2? Explain what actually determines the measure.
4. **Classify:** Classify `m∠A = 90°`, `m∠B = 147°`, `m∠C = 43°`, `m∠D = 180°`.
5. **Add:** `D` is interior to `∠ABC`, `m∠ABD = 28°` and `m∠ABC = 95°`. Find `m∠DBC`.
6. **Solve and check:** Ray `QS` is interior to `∠PQR`, with `m∠PQS = 5x − 3`, `m∠SQR = 3x + 7` and `m∠PQR = 132°`. Find `x` and verify both parts.
7. **Read a diagram:** A figure shows `∠XYZ` with no square and no arc, and it appears to be a right angle. May you write `m∠XYZ = 90°`? What would have to be present for you to do so?

:::answer Answers with reasons
(1) `∠B` is ambiguous because three rays share vertex `B`, so more than one angle has that vertex. The three angles are `∠ABD`, `∠DBC` and `∠ABC`.

(2) `∠PQR` and `∠RQP` are the same: both have vertex `Q` and the same two arms, and swapping the outer letters does not change the set. `∠PQR` and `∠QPR` are different: the second has vertex `P`, so it is a different angle entirely.

(3) Yes, angle 1 can easily be larger. The measure depends only on the turn between the arms. Arms are parts of rays and continue without end, so their drawn length is a property of the drawing, not of the angle.

(4) `∠A` is right, `∠B` is obtuse, `∠C` is acute, `∠D` is straight.

(5) `m∠DBC = 95 − 28 = 67°`, by rearranging the addition postulate. `D` is stated to be interior, so the postulate applies.

(6) `(5x − 3) + (3x + 7) = 132` gives `8x + 4 = 132`, so `8x = 128` and `x = 16`. Check: `m∠PQS = 77°` and `m∠SQR = 55°`, and `77 + 55 = 132`. Both are positive and below `180°`, so the value is acceptable.

(7) No. Appearance is not a statement. You could write it only if a small square were drawn at `Y`, or the measure were given in the text, or it followed from other stated facts. Until then the angle is simply an angle of unstated measure.
:::

**Related explanation:** [Midpoints and segment congruence](GE-04-midpoints-and-congruence.md) introduced the `=` against `≅` split used here, and mentioned the perpendicular bisector that this chapter's right angle finally makes precise. [Angles and radian measure](../Trigonometry/TR-01-01-angles.md) measures the same objects a second way.
