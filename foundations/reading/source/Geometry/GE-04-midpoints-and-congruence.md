# Midpoints and segment congruence

**Geometry, episode 04 | Early reading edition**

## What this lesson will settle

[Measuring segments](GE-03-measuring-segments.md) gave every segment a length. This lesson uses those lengths to cut a segment exactly in half, and introduces the symbol geometry uses to say two figures have the same size.

You will locate a midpoint from coordinates, work backwards from a midpoint to a missing endpoint, name the things that can bisect a segment, and use `≅` and `=` for the jobs they each do.

Assumed before this: distance as `|a − b|`, the segment addition postulate, and [the coordinate plane](GE-01-coordinate-plane.md) for the two-dimensional case. Not covered here: perpendicularity, which needs angle measure from episode 05, and proofs about congruent figures, which come later in the reasoning unit.

## 1. A midpoint is a point, defined by two equal lengths

The **midpoint** of segment `AB` is the point `M` on segment `AB` for which

`AM = MB`

Both conditions matter. `M` must be **on the segment**, and the two pieces must be **equal**. Dropping the first condition would admit points off the segment that happen to be equidistant from `A` and `B`; there are infinitely many of those in a plane, and none of them is the midpoint.

A midpoint is a **point**, not a length and not a number. "The midpoint is 4" is a sentence about a coordinate, and only makes sense once a number line is in place.

Because `AM = MB` and `AM + MB = AB`, each half is exactly `AB / 2`.

## 2. Finding a midpoint from coordinates

**On a line.** If `A` has coordinate `a` and `B` has coordinate `b`, the midpoint has coordinate

`(a + b) / 2`

This is an average, not a difference. Averaging finds the value halfway between two values; subtracting finds how far apart they are. Confusing the two is the single most common error in this lesson.

| Task | Operation | Example with `a = −3`, `b = 9` |
| --- | --- | --- |
| How far apart? | `|a − b|` | `|−3 − 9| = 12` |
| What is halfway? | `(a + b) / 2` | `(−3 + 9) / 2 = 3` |

Check the result against the picture the numbers describe: `3` is `6` from `−3` and `6` from `9`, and `6` is half of `12`. A midpoint answer that is not the same distance from both endpoints is wrong.

**In the plane.** With `A = (x₁, y₁)` and `B = (x₂, y₂)`, the midpoint is

`((x₁ + x₂) / 2, (y₁ + y₂) / 2)`

Each coordinate is averaged separately, because moving halfway along the segment means going halfway across and halfway up. The answer is an ordered pair, since a point in the plane needs two numbers.

For `A = (−2, 5)` and `B = (6, 1)`: the midpoint is `((−2 + 6)/2, (5 + 1)/2) = (2, 3)`.

## 3. Working backwards to a missing endpoint

This is a genuinely different problem, and it is not solved by the same substitution.

`M = (2, 3)` is the midpoint of segment `AB`, and `A = (−2, 5)`. Find `B`.

Do not divide anything. Use the definition one coordinate at a time. The `x` of the midpoint is the average of the two `x` values, so

`(−2 + x₂) / 2 = 2`, giving `−2 + x₂ = 4` and `x₂ = 6`.

`(5 + y₂) / 2 = 3`, giving `5 + y₂ = 6` and `y₂ = 1`.

So `B = (6, 1)`.

There is a quicker way to see it. Going from `A` to `M` you move `+4` across and `−2` up. To reach `B` you repeat exactly the same move: `(2 + 4, 3 − 2) = (6, 1)`. The midpoint is halfway, so the second half of the journey matches the first.

Both methods agree. The first is safer when the numbers are awkward; the second is a good check.

## 4. What can bisect a segment

A **segment bisector** is any object that intersects a segment at its midpoint. It does not have to be a line.

| Bisector | Why it qualifies |
| --- | --- |
| A point | The midpoint itself bisects the segment. |
| A line | It may cross the segment at the midpoint. |
| A ray | Its endpoint may sit elsewhere; only the crossing point matters. |
| A plane | In three dimensions a plane can cut the segment at its midpoint. |

Note what is **not** required: the bisector need not be perpendicular to the segment. A **perpendicular bisector** is the special case that also meets it at a right angle, and that idea needs episode 05 before it can be stated properly. Treating every bisector as perpendicular is a common and costly assumption.

A segment has exactly one midpoint, but infinitely many bisectors, because infinitely many lines pass through that one point.

## 5. Congruent figures and equal measures

Geometry keeps two symbols apart:

- `AB = CD` says two **numbers** are equal: the lengths match.
- `segment AB ≅ segment CD` says two **figures** are congruent: same size and shape.

For segments the two statements always travel together — segments are congruent exactly when their lengths are equal — so it can seem pedantic. It stops being pedantic with angles and triangles, where figures can have equal measures of one kind and still differ. Build the habit now: `=` between measures, `≅` between figures.

In a diagram, congruent segments are shown with matching **tick marks**: one tick on each of two segments means those two are congruent; two ticks mark a different congruent pair. Tick marks are a *statement*, so you may rely on them. Apparent equal length with no tick marks is *not* a statement, and you may not.

If `M` is the midpoint of `AB`, then `AM = MB` and `segment AM ≅ segment MB`. Both sentences are correct, and each uses its own symbol.

## Coverage before questions

The explanation has covered the midpoint definition and its two conditions, the average formula on a line and in the plane, why averaging differs from subtracting, the backwards problem of recovering an endpoint, the four kinds of segment bisector, why a bisector need not be perpendicular, and the split between `=` for measures and `≅` for figures, including what tick marks assert. The questions test different parts of that coverage.

## Six question fingerprints

1. **Midpoint on a line:** `P` has coordinate `−7` and `Q` has coordinate `11`. Find the coordinate of the midpoint, then verify it is equidistant from both.
2. **Choose the right operation:** For the same `P` and `Q`, find `PQ`. State in one sentence why this answer differs from question 1.
3. **Midpoint in the plane:** `C = (−5, 2)` and `D = (3, −6)`. Find the midpoint.
4. **Work backwards:** `M = (1, −1)` is the midpoint of segment `EF` and `E = (−4, 3)`. Find `F`, then check with the repeated-move method.
5. **Bisectors:** Segment `GH` has midpoint `N`. How many lines bisect `GH`? How many of them are perpendicular to it? Explain both counts.
6. **Symbols:** `M` is the midpoint of `AB`, with `AB = 18`. Write one correct statement using `=` and one using `≅`, and give the value of `AM`.

:::answer Answers with reasons
(1) `(−7 + 11) / 2 = 4 / 2 = 2`. Check: from `−7` to `2` is `9`, and from `2` to `11` is `9`. Equal distances, so `2` is the midpoint.

(2) `PQ = |−7 − 11| = |−18| = 18`. It differs because this question asks how far apart the points are, which is a difference, while question 1 asks what lies halfway, which is an average. Note `18` is twice the `9` found in the check above, as it must be.

(3) `((−5 + 3)/2, (2 + (−6))/2) = (−2/2, −4/2) = (−1, −2)`.

(4) `(−4 + x)/2 = 1` gives `x = 6`. `(3 + y)/2 = −1` gives `y = −5`. So `F = (6, −5)`. Check: from `E(−4, 3)` to `M(1, −1)` the move is `+5` across and `−4` up; repeating it from `M` gives `(6, −5)`. The two methods agree.

(5) Infinitely many lines bisect `GH`, because every line through `N` other than line `GH` itself crosses the segment at its midpoint. Exactly one of them is perpendicular to `GH` in a given plane: the perpendicular bisector. A bisector is not required to be perpendicular; only one happens to be.

(6) With `=`: `AM = MB`, or `AM = 9`. With `≅`: `segment AM ≅ segment MB`. `AM = 18 / 2 = 9`, because the midpoint makes each half exactly half the whole.
:::

**Related explanation:** [Measuring segments](GE-03-measuring-segments.md) supplies the lengths used here. [Angles](GE-05-angles.md) adds the measure needed before a bisector can be called perpendicular.
