# Measuring Segments

## What this route covers

This is the practice treatment. One pipe run is set up below and every family measures something on it, so a wrong length is a wrong cut rather than a wrong mark. Commit to an answer before opening each reply. The replies name the error, and two of the errors here are ones that produce a plausible-looking number rather than an obvious absurdity.

If a ruling surprises you, the [curriculum reference](/foundations/concepts/measuring-segments/approach-1/) states it as a rule, and the [written guide](/foundations/reading/geometry/measuring-segments/) explains it at length.

## The one pipe run used throughout

A straight pipe is marked in metres from a zero chosen at the pump. Four weld stations sit on it.

| Station | Coordinate |
| --- | --- |
| `P` | `-9` |
| `Q` | `-3` |
| `R` | `4` |
| `S` | `7` |

The zero was chosen. Putting it at `P` instead would change every number in this table and move no weld.

## Family 1 · Distance across a negative coordinate

### Decide: find `PQ`

Show the subtraction before taking the absolute value.

### Then decide: find `QR`, and confirm `PS = PQ + QR + RS`

:::answer The lengths, and the subtraction that goes wrong
`PQ = |-9 - (-3)| = |-9 + 3| = |-6| = 6` metres. Subtracting a negative adds, and this is the step that produces `-12` if the double sign is mishandled.

`QR = |-3 - 4| = |-7| = 7` metres. Here the tempting slip is `-3 - 4 = -1`, giving a length of `1` — a number small enough to look like a short weld gap and wrong by six metres.

`RS = |4 - 7| = 3`. And `PS = |-9 - 7| = 16`, while `6 + 7 + 3 = 16`. They agree, which confirms the stations lie in the order `P`, `Q`, `R`, `S` along the run.

The error worth naming: taking the absolute value before finishing the subtraction, or reading `-3 - 4` as a difference of digits. Do the arithmetic first and the bars last.
:::

## Family 2 · The figure and the number

### Decide: which of these is correct?

`segment PQ = 6 m` · `PQ = 6 m` · `segment PQ lies on line PQ`

More than one may be correct.

:::answer Which statements type-check
`PQ = 6 m` is correct: `PQ` written without the word "segment" denotes a **number**, the length.

`segment PQ lies on line PQ` is correct: both are **sets of points**, and one is a subset of the other.

`segment PQ = 6 m` is not correct. It equates a set of infinitely many points with a single number. The sentence is readable and everyone knows what was meant, which is exactly why the habit survives.

It matters later. Lengths are compared with `=` and figures with `≅`, and that distinction only makes sense if you already keep the set and the number apart.

The error worth naming: treating the notation as a spelling preference. It is a type distinction, and the next topic depends on it.
:::

## Family 3 · Betweenness is a test, not a glance

Three survey marks `D`, `E`, `F` were taken off the pipe run, in open ground.

| Measurement | Value |
| --- | --- |
| `DE` | `8 m` |
| `EF` | `5 m` |
| `DF` | `11 m` |

### Decide: is `E` between `D` and `F`?

### Then decide: what else does your test establish about the three marks?

:::answer The ruling, and the stronger conclusion most people stop short of
`8 + 5 = 13`, which is not `11`. So `E` is **not** between `D` and `F`.

The stronger conclusion: the three marks are **not collinear at all**. If they were on one line in any order, one of the three additions would have worked. Walking `13` metres to close a gap of `11` is what going round a corner looks like, so `D`, `E` and `F` form a triangle.

A sketch drawn to rough scale would have shown a very shallow bend and could easily have been called a straight line with measurement error.

The error worth naming: concluding only "`E` is not between them" and leaving the arrangement open. The failed addition rules out every arrangement on a line at once.
:::

## Family 4 · Solve for an unknown, then check it

A new run has stations `P`, `Q`, `R` in that order, with lengths given in terms of `x`.

| Length | Expression |
| --- | --- |
| `PQ` | `2x + 1` |
| `QR` | `x - 3` |
| `PR` | `25` |

### Decide: find `x`, then find `PQ` and `QR`

### Then decide: what does "in that order" contribute, and what if it were removed?

:::answer The value, the check, and the phrase doing the work
`(2x + 1) + (x - 3) = 25` gives `3x - 2 = 25`, so `x = 9`. Then `PQ = 19` and `QR = 6`, and `19 + 6 = 25` checks it. Substituting back costs one line and catches an arithmetic slip that would otherwise be invisible.

"In that order" is what licenses adding the two lengths. Remove it and `PQ + QR = PR` becomes a claim to be tested rather than a rule to apply — the three points might sit in a different order along the line, or not be collinear at all, as in family 3.

It is also worth checking that the answer makes physical sense: `QR = x - 3 = 6` is positive, so the expression describes a real length. Had `x` come out as `2`, the same algebra would give `QR = -1`, which is not a length, and the setup would have to be wrong.

The error worth naming: applying the addition rule without noticing that a phrase in the question supplied its precondition.
:::

## What to be able to do before moving on

1. Compute a distance across negative coordinates, taking the absolute value only at the end.
2. Say which of a figure and a length an expression denotes, and which may be set equal to a measurement.
3. Test betweenness by addition, and state the stronger conclusion a failure gives you.
4. Solve for an unknown length, check by substitution, and say which phrase in the question licensed the method.

## Move between routes

- [Curriculum reference](/foundations/concepts/measuring-segments/approach-1/) — the rules as lookup tables.
- [Written teaching guide](/foundations/reading/geometry/measuring-segments/) — the full explanation.
- [Concept hub](/foundations/concepts/measuring-segments/) — prerequisites and what follows.
