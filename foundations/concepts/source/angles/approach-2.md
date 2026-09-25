# Angles and Radian Measure

## What this route covers

This is the practice treatment. One rotating antenna is set up below and every family asks about the same turn, so the conversions and the quadrant decisions all describe one physical motion. Commit to an answer before opening each reply. The replies name the error, and two of these errors produce numbers that a glance at the situation would reject.

If a ruling surprises you, the [curriculum reference](/foundations/concepts/angles/approach-1/) states it as a rule, and the [written guide](/foundations/reading/trigonometry/angles/) explains it at length.

## The one antenna used throughout

A radar dish turns about a vertical mast. A marker is painted on the rim.

| Quantity | Value |
| --- | --- |
| radius to the marker, `r` | `2.5 m` |
| initial ray | along the positive x-axis, pointing due east |
| positive direction | counterclockwise, seen from above |

The dish is in standard position: vertex at the mast, initial ray east.

## Family 1 · Convert, and check the size

### Decide: the dish turns `225°`. Express that in radians, exactly.

### Then decide: a logged turn reads `11π/6` radians. Express it in degrees.

:::answer Both conversions, and the factor that catches a reversal
`225° = 225 × π/180 = 5π/4` radians, which is about `3.93`.

`11π/6 = (11π/6) × 180/π = 330°`.

The two factors are reciprocals, and using the wrong one is wrong by `(180/π)²`, about `3283`. So `225°` handled backwards gives roughly `12 892` rather than `3.93`.

That is why a size check is worth a second here: a turn of `225°` is more than half a revolution and less than a full one, so in radians it must lie between `π ≈ 3.14` and `2π ≈ 6.28`. `3.93` passes; `12 892` does not need checking further.

The error worth naming: choosing the conversion factor by which one you wrote down last. Choose it by which unit must cancel, then confirm the answer sits in the expected range.
:::

## Family 2 · Arc length, and what the formula assumes

### Decide: the dish turns `60°`. How far does the rim marker travel?

Use `s = rθ` with `r = 2.5 m`.

:::answer The distance, and the substitution that is off by a factor of 57
Convert first: `60° = π/3 ≈ 1.047` radians. Then `s = 2.5 × 1.047 ≈ 2.62 m`.

Substituting `60` directly gives `s = 2.5 × 60 = 150 m`. That is an arc sixty times the radius of the circle it lies on, for a turn of one sixth of a revolution — physically impossible, and visible as such without any checking.

The formula `s = rθ` carries no conversion factor precisely **because** `θ` is a pure ratio. A radian is an arc divided by a radius, so `rθ` returns an arc. Feed it degrees and the identity it relies on is simply not there.

A quick sanity check for any arc: the full circumference here is `2π(2.5) ≈ 15.7 m`, and a sixth of that is about `2.6 m`. That agrees.

The error worth naming: treating "convert to radians" as a formatting preference. It is the condition that makes the formula true.
:::

## Family 3 · Same direction, different rotation

The log records three separate movements of the dish: `-30°`, `330°`, and `690°`.

### Decide: do the three end with the marker pointing the same way?

### Then decide: did the dish do the same amount of work in each case?

:::answer What coterminal shares, and what it does not
Yes to the first: all three are coterminal. They differ by whole revolutions — `330 = -30 + 360` and `690 = -30 + 720` — so the marker finishes in the same direction every time.

No to the second. The three record rotations of thirty degrees clockwise, three hundred and thirty counterclockwise, and almost two full revolutions counterclockwise. A motor driving the third turned nearly twenty-three times as far as one driving the first, and in the opposite direction.

So coterminal means *the terminal rays coincide*, not *the angles are interchangeable*. Reduce by whole turns when the question is about direction — which quadrant, which trigonometric value. Keep the original measure when the question is about the turning itself — how long the motor ran, how far the marker travelled, how much cable wound onto the mast.

The error worth naming: reducing an angle by whole turns out of habit, in a question that was asking about the rotation.
:::

## Family 4 · Where does it finish?

### Decide: the dish turns `-450°` from its initial position. In which quadrant does the marker finish?

Reduce first, then answer.

### Then decide: how far has the marker travelled along its circular path during that turn?

:::answer The direction, and why the quadrant question has no answer
`-450° + 720° = 270°`. A turn of `270°` in standard position ends on the **negative y-axis**, which is a boundary direction and therefore **in no quadrant**. Answering "quadrant IV" treats `270°` as though it were inside the interval from `270°` to `360°` rather than at its edge.

Seen from above with east as the initial ray, the marker finishes pointing due south.

The distance travelled uses the original measure, not the reduced one. `450° = 450 × π/180 = 5π/2 ≈ 7.854` radians, so `s = 2.5 × 7.854 ≈ 19.6 m`. The sign records the clockwise direction; the distance travelled is a length and is positive.

Note the two answers came from different measures of the same movement: the reduced `270°` gave the direction, and the full `450°` gave the distance. That is family 3's distinction, now doing real work in one question.

The error worth naming: using the reduced angle for everything once you have reduced it. Reduce for direction, keep the original for amount.
:::

## What to be able to do before moving on

1. Convert in both directions, and use a range check to catch a reversed factor.
2. Apply `s = rθ` after converting, and say why the formula needs radians rather than merely preferring them.
3. Decide whether a question is about terminal direction or about amount of rotation, and choose the measure accordingly.
4. Reduce a negative or large angle by whole turns, and recognise a boundary direction that belongs to no quadrant.

## Move between routes

- [Curriculum reference](/foundations/concepts/angles/approach-1/) — the rules as lookup tables.
- [Written teaching guide](/foundations/reading/trigonometry/angles/) — the full explanation.
- [Concept hub](/foundations/concepts/angles/) — prerequisites and what follows.
