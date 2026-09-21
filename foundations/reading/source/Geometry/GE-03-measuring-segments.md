# Measuring segments

**Geometry, episode 03 | Early reading edition**

## What this lesson will settle

[Points, lines and planes](GE-02-points-lines-and-planes.md) named the objects. This lesson gives them a size. You will attach a number to every point on a line, compute the distance between two points as a difference, decide when one point lies between two others, and keep the distinction between a segment and its length.

Assumed before this: the objects and naming rules from episode 02, and [integers and the number line](../Basic%20Math/BM-04-01-integers-and-the-number-line.md), especially absolute value as a distance. Not covered here: midpoints and congruence, which are episode 04, and angle measure, which is episode 05. Coordinates in two dimensions belong to [the coordinate plane](GE-01-coordinate-plane.md); everything here happens along a single line.

## 1. Every point on a line gets a number

Choose any line. Pick one point to be `0` and choose a unit length. Every point of the line then corresponds to exactly one real number, and every real number to exactly one point. That number is the point's **coordinate**.

This pairing is an assumption we make about lines, not something proved from anything earlier. It is usually called the **Ruler Postulate**: a line can be marked like a ruler.

Two consequences matter immediately:

- A line has no gaps. Between any two points there is another, because between any two real numbers there is another.
- The choice of zero and of unit is ours. Moving the zero or changing from centimetres to inches changes every coordinate, but it does not move any point.

## 2. Distance is a difference, made positive

If `A` has coordinate `a` and `B` has coordinate `b`, the **distance** between them is

`AB = |a − b|`

The absolute value is not decoration. Distance answers "how far apart", which has no direction, so it must not depend on which point you name first. Since `|a − b| = |b − a|`, we get `AB = BA` automatically.

| `a` | `b` | `a − b` | `AB = |a − b|` |
| --- | --- | --- | --- |
| `2` | `7` | `−5` | `5` |
| `7` | `2` | `5` | `5` |
| `−3` | `4` | `−7` | `7` |
| `−9` | `−2` | `−7` | `7` |

Notice the last two rows. Subtracting a negative coordinate is where sign errors appear: `−3 − 4 = −7`, not `−1`, and `−9 − (−2) = −9 + 2 = −7`. Work the subtraction first and take the absolute value at the end.

A distance is never negative. If your working produces `AB = −5`, you have reported a difference, not a distance.

### Notation: the segment and its length are different things

`AB` written on its own means a **number**: the length. **Segment `AB`** means a **set of points**. You can say segment `AB` is a subset of line `AB`, and you can say `AB = 5 cm`, but "segment `AB` = 5 cm" confuses a set with a number.

The same split appears with the equals sign later: lengths are compared with `=`, and figures with `≅`. Episode 04 makes that precise.

## 3. Betweenness is a measured fact, not a picture

`B` is **between** `A` and `C` when the three are distinct points and

`AB + BC = AC`

That single equation is the definition, and it is called the **Segment Addition Postulate** when used in the forward direction: if `B` is between `A` and `C`, the two short lengths add to the long one.

It also works backwards. If `AB + BC = AC`, then `B` must lie on segment `AC`. Any point off that segment forces a detour, and a detour makes `AB + BC` strictly greater than `AC`. So the equation holding is enough to place `B` between the other two — and it tells you the three points are collinear without your having to assume it.

This matters because a drawing can lie. Three points sketched in a row may not satisfy the equation, and three points that do satisfy it are in a row whatever the sketch looks like. Check the arithmetic, not the picture.

### The most common error

A student writes `AB + BC = AC` for any three labelled points. The equation holds **only when the middle letter names the middle point**. With `A`, `B`, `C` in that order, `AB + BC = AC` is true, but `AB + AC = BC` is false, and `BA + AC = BC` is false as well.

Read the equation as a journey: start at the first letter, stop at the shared middle letter, continue to the last. If the letters do not chain like that, the equation is not the addition postulate.

## 4. Using the postulate in both directions

**Find a length.** `A`, `B`, `C` lie in that order with `AB = 12 mm` and `BC = 7 mm`. Then `AC = 12 + 7 = 19 mm`.

**Find a missing part.** `A`, `B`, `C` lie in that order with `AC = 30 mm` and `AB = 11 mm`. Then `BC = 30 − 11 = 19 mm`. Here the postulate is rearranged, not replaced.

**Find an unknown coordinate.** `P`, `Q`, `R` lie in that order with `PQ = 2x + 1`, `QR = x − 3` and `PR = 25`. Then

`(2x + 1) + (x − 3) = 25`, so `3x − 2 = 25`, so `3x = 27`, so `x = 9`.

Check it: `PQ = 19`, `QR = 6`, and `19 + 6 = 25`. The check is not optional. A value of `x` that satisfies the equation but makes a length negative must be rejected, because a length cannot be negative.

**Test a claim.** `D`, `E`, `F` have `DE = 8`, `EF = 5`, `DF = 11`. Is `E` between `D` and `F`? `8 + 5 = 13`, which is not `11`, so no. The three points are not collinear at all: a detour of 13 to cover a gap of 11 is exactly what a bend looks like.

## 5. Units travel with the number

A length is a number *and* a unit. `AB = 19` is incomplete unless the unit is agreed in advance. Add lengths only when their units match: `12 mm + 1 cm` is `12 mm + 10 mm = 22 mm`, not `13` of anything.

In engineering work the unit is where most errors enter. State it once at the start, convert everything to it before calculating, and carry it through to the answer.

## Coverage before questions

The explanation has covered coordinates on a line, distance as the absolute value of a difference, why distance cannot be negative, the difference between a segment and its length, betweenness as a measured condition, the addition postulate in both directions, the letter-chaining rule, solving for an unknown with a rejection check, and units. The questions test different parts of that coverage.

## Six question fingerprints

1. **Compute a distance:** `M` has coordinate `−6` and `N` has coordinate `3`. Find `MN`. Then find `NM` and say why no new work is needed.
2. **Signs:** `P` has coordinate `−11` and `Q` has coordinate `−4`. Find `PQ`, showing the subtraction before the absolute value.
3. **Forward addition:** `R`, `S`, `T` lie in that order with `RS = 14` and `ST = 9`. Find `RT`.
4. **Rearranged addition:** `J`, `K`, `L` lie in that order with `JL = 41` and `KL = 17`. Find `JK`.
5. **Solve and check:** `W`, `X`, `Y` lie in that order with `WX = 3x − 4`, `XY = x + 2` and `WY = 30`. Find `x`, then verify both parts and confirm neither is negative.
6. **Test betweenness:** `G`, `H`, `I` have `GH = 6`, `HI = 10`, `GI = 16`. Is `H` between `G` and `I`? Now suppose instead `GI = 15`. Answer again and say what changed.

:::answer Answers with reasons
(1) `MN = |−6 − 3| = |−9| = 9`. `NM = |3 − (−6)| = |9| = 9`. No new work is needed because distance does not depend on the order of the letters: `|a − b| = |b − a|`.

(2) `−11 − (−4) = −11 + 4 = −7`, and `|−7| = 7`, so `PQ = 7`. Subtracting the negative coordinate is the step to slow down on.

(3) `RT = 14 + 9 = 23`. The middle letter `S` names the middle point, so the postulate applies directly.

(4) `JK = JL − KL = 41 − 17 = 24`. Same postulate, rearranged.

(5) `(3x − 4) + (x + 2) = 30` gives `4x − 2 = 30`, so `4x = 32` and `x = 8`. Check: `WX = 20`, `XY = 10`, and `20 + 10 = 30`. Both are positive, so the value is acceptable.

(6) First case: `6 + 10 = 16`, which equals `GI`, so `H` is between `G` and `I` and the three points are collinear. Second case: `6 + 10 = 16`, which is not `15`, so `H` is not between them; the points cannot be collinear in that arrangement. What changed is only the long measurement, and that alone decides betweenness — no picture was consulted either time.
:::

**Related explanation:** [Points, lines and planes](GE-02-points-lines-and-planes.md) defines the segment being measured here. [Midpoints and segment congruence](GE-04-midpoints-and-congruence.md) uses these lengths to divide a segment in half.
