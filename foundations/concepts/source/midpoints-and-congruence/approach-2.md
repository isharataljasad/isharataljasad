# Midpoints and Segment Congruence

## What this route covers

This is the practice treatment. One steel beam is set up below and every family asks where to drill it or how to describe it, so a wrong midpoint is a hole in the wrong place. Commit to an answer before opening each reply. The replies name the error, and the first of them is the single most common mistake in this topic.

If a ruling surprises you, the [curriculum reference](/foundations/concepts/midpoints-and-congruence/approach-1/) states it as a rule, and the [written guide](/foundations/reading/geometry/midpoints-and-congruence/) explains it at length.

## The one beam used throughout

A steel beam is to be lifted by a single sling at its centre. The fabrication drawing gives its ends on a site grid, in metres.

| End | Coordinates |
| --- | --- |
| `A` | `(-2, 5)` |
| `B` | `(6, 1)` |

A second, simpler case is a straight rail marked at `-3` and `9` metres, used where only one coordinate is needed.

## Family 1 · Average, or difference?

### Decide: on the rail, how far apart are the marks at `-3` and `9`?

### Then decide: on the rail, what coordinate is halfway between them?

Give both, and name the operation you used for each.

:::answer Two questions, two operations, and the one that gets substituted for the other
How far apart: `|-3 - 9| = |-12| = 12` metres — an absolute **difference**.

Halfway: `(-3 + 9)/2 = 6/2 = 3` — an **average**.

The common error is to produce `12` and then halve it to `6`, reporting `6` as the midpoint. That is the right length for each half, but it is not a coordinate on this rail: `6` is nine metres from `-3` and three from `9`, so it is not halfway at all.

The check that catches it takes one subtraction: a midpoint must be the same distance from both ends. `3` is six from each. `6` is not.

The error worth naming: answering "how long is half" when the question was "where is the middle". Both involve the number `12`, and only one of them is a position.
:::

## Family 2 · The midpoint of the beam

### Decide: where should the sling be attached?

Give the coordinates of the midpoint of `AB`.

:::answer The point, and why each coordinate is averaged on its own
`((-2 + 6)/2, (5 + 1)/2) = (4/2, 6/2) = (2, 3)`.

The two coordinates are averaged separately because moving halfway along the beam means going halfway across **and** halfway up. There is no single number that could express it: a point in the plane needs an ordered pair.

Check it as before: from `A(-2, 5)` to `M(2, 3)` is four across and two down; from `M(2, 3)` to `B(6, 1)` is four across and two down. Identical steps, so `M` is genuinely central.

The error worth naming: averaging the `x` values and then reusing that single number, or reporting one number for a point in the plane. The answer to "where" in a plane is always two numbers.
:::

## Family 3 · The reverse problem

The drawing is damaged. Only the sling point `M(2, 3)` and one end `A(-2, 5)` are legible.

### Decide: where is the other end `B`?

Resist substituting into the midpoint formula; decide what equation each coordinate satisfies.

:::answer Why nothing is halved here
Let `B = (x, y)`. The midpoint's `x` is the average of the two `x` values, so `(-2 + x)/2 = 2`, giving `-2 + x = 4` and `x = 6`. Likewise `(5 + y)/2 = 3` gives `y = 1`. So `B = (6, 1)`.

Nothing was divided by two at the end. The forward problem averages; the reverse problem solves an equation in which an average appears. They use the same relationship in opposite directions.

A quicker route, once you trust it: `M` is four across and two down from `A`, so `B` is four across and two down from `M`, which is `(6, 1)`. The displacement from end to middle repeats from middle to end — that is what "midpoint" means.

The error worth naming: halving `M`'s coordinates, or averaging `M` with `A`. Averaging `M` and `A` gives `(0, 4)`, which is the quarter point of the beam — a real point on the drawing, and the wrong one.
:::

## Family 4 · Congruent, or equal?

The workshop cuts a second beam `CD` to the same length.

### Decide: which of these sentences are correctly written?

`AB = CD` · `segment AB ≅ segment CD` · `segment AB = 8.94 m` · `AB ≅ 8.94 m`

:::answer Which sentences type-check, and why the distinction survives
`AB = CD` is correct: both denote **numbers**, the two lengths, and `=` compares numbers.

`segment AB ≅ segment CD` is correct: both denote **figures**, and `≅` compares figures.

`segment AB = 8.94 m` is not correct: it equates a set of points with a number.

`AB ≅ 8.94 m` is not correct either: `≅` compares figures, and a measurement is not a figure.

For segments the two correct sentences always travel together — congruent segments have equal lengths and equal lengths give congruent segments — so the distinction can look like fussiness. It is not. `≅` says the figures can be laid on one another; `=` says two numbers agree. Keeping them apart is what makes congruence statements about triangles mean something later.

The error worth naming: choosing the symbol by what looks more mathematical. Choose it by what sits on either side of it.
:::

## What to be able to do before moving on

1. Give both the distance and the halfway coordinate for two marks, and say which is an average and which a difference.
2. Find a midpoint in the plane, and verify it by stepping from each end.
3. Recover a missing endpoint by solving one equation per coordinate, without halving anything.
4. Choose between `=` and `≅` by looking at what stands on either side.

## Move between routes

- [Curriculum reference](/foundations/concepts/midpoints-and-congruence/approach-1/) — the rules as lookup tables.
- [Written teaching guide](/foundations/reading/geometry/midpoints-and-congruence/) — the full explanation.
- [Concept hub](/foundations/concepts/midpoints-and-congruence/) — prerequisites and what follows.
