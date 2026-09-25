# Integers and the Number Line

## What this route covers

This is the reference treatment: what belongs to the integers, the single rule that decides every comparison, and the three notations that cause trouble. It assumes you have met signed numbers before. If you have not, read the [full written guide](/foundations/reading/basic-math/integers-and-the-number-line/) and return here to settle a ruling.

Covered: membership, the two jobs of the minus sign, order by position, opposites and the double sign, absolute value as a distance, and how to fix a sign convention. Not covered: adding, subtracting, multiplying or dividing integers, which follow this; rational and real numbers; and inequalities with variables.

## Where the idea sits

- **Assumed before it:** whole numbers, and reading an expression from [expressions and variables](/foundations/concepts/expressions-and-variables/).
- **Established here:** that order is position, not digit size, and that a sign can name a number or command an operation.
- **Depends on it afterwards:** the [coordinate plane](/foundations/concepts/coordinate-plane/), signed arithmetic, [measuring segments](/foundations/reading/geometry/measuring-segments/) through absolute value, and every signed quantity in physics.

## What is and is not an integer

| Value | Integer? | Reason |
| --- | --- | --- |
| `7`, `+7` | yes | the same integer; an unsigned number is positive |
| `-7` | yes | negative whole number |
| `0` | yes | neither positive nor negative |
| `2.5` | no | lies between consecutive whole numbers |
| `-1/2` | no | same reason, on the other side of zero |

The integers run without end in both directions. There is no largest and no smallest.

## The minus sign does two jobs

| Written | The sign is | Reads as |
| --- | --- | --- |
| `-7` | part of the number's name | negative seven |
| `12 - 7` | an operation | twelve subtract seven |
| `12 + (-7)` | both, kept apart by the bracket | twelve plus negative seven |
| `-(-3)` | the outer one is "the opposite of" | the opposite of negative three, which is `3` |

Position usually decides: a sign with nothing to its left names a number; a sign between two numbers commands a subtraction. The bracket exists for the cases where both readings would otherwise fit.

## Order is position, and nothing else

**Of any two integers, the one further right on the line is the larger.** That is the definition, not a fact to be memorised alongside others, and it has no exceptions.

| Comparison | True? | Decided by |
| --- | --- | --- |
| `3 > -8` | yes | `3` lies right of `-8` |
| `-3 > -8` | yes | `-3` lies right of `-8` |
| `-8 > -3` | no | comparing the digits `8` and `3` instead of the positions |
| `-8 < 0` | yes | every negative lies left of zero |

Every negative integer is smaller than zero and smaller than every positive integer. Once both numbers are negative, the one with the larger digit is the *smaller* number, because it sits further left.

## Opposites and absolute value

| Term | Definition | Examples |
| --- | --- | --- |
| opposite | same distance from `0`, other side | opposite of `5` is `-5`; opposite of `0` is `0` |
| absolute value | distance from `0`, written with vertical bars | `|5| = 5`, `|-5| = 5`, `|0| = 0` |

A pair of opposites sums to zero: `5 + (-5) = 0`. That is what "same distance, other side" means.

Absolute value is a **distance**, so it is never negative. Describing the bars as "remove the minus sign" gives the right answer for `|-5|` and a wrong idea everywhere after: in `|x - 3|` there is no sign to remove, only a distance to measure.

**Absolute value does not order the integers.** `|-8| > |-3|`, and yet `-8 < -3`. The bars discard exactly the information — which side of zero — that the comparison needs.

## Choosing a sign convention

| Situation | Natural zero | Usual choice |
| --- | --- | --- |
| temperature in °C | freezing point of water | above zero positive |
| elevation | sea level | above sea level positive |
| account balance | owing nothing | held positive, owed negative |
| time about an event | the event | after positive, before negative |

The choice is a convention, not a fact. If you decide depth below the surface counts as positive, then `30` means thirty metres down, and that meaning has to hold for the whole problem. Writing the convention down before calculating removes most sign errors in engineering work.

## Boundary checks: where care is needed

- **Order and magnitude disagree for negatives.** Any reasoning that compares digits will invert every negative comparison it touches.
- **"Below a limit" means further left, not larger in digits.** A store required to stay below `-20 °C` is not satisfied by `-18 °C`, although `18` is the smaller digit.
- **A double sign is an instruction, not a typing error.** `-(-3)` is the opposite of the opposite, which returns to `3`.
- **Absolute value loses the side.** Two different integers can share one absolute value, so `|a| = |b|` does not give `a = b`.
- **A convention that changes mid-problem invalidates it.** Nothing in the arithmetic will warn you; only the stated convention can.

## Five checks after the reference

1. From `-4`, `0`, `2.5`, `7`, `-1/2`, name the integers, and say why each excluded value fails.
2. Arrange `-7`, `3`, `0`, `-2`, `6` from least to greatest, and name the rule that settled the pair `-7` and `-2`.
3. Write the opposite of `-12`, then evaluate `-(-12)`, and say why they agree.
4. Compare `|-9|` with `|4|`, then compare `-9` with `4`, and explain why the two comparisons point opposite ways.
5. A store must stay below `-18 °C`. A reading of `-15 °C` is logged. Is it within limit? Justify by position.

:::answer Check your rulings
1. Integers: `-4`, `0`, `7`. `2.5` and `-1/2` lie between consecutive whole numbers, and the integers contain no such values.
2. `-7 < -2 < 0 < 3 < 6`. For `-7` and `-2`: both are negative, and `-7` lies further left, so it is smaller — although `7` is the larger digit.
3. Both are `12`. Writing a minus sign in front means "the opposite of", so `-(-12)` asks for the opposite of negative twelve, which is where you started on the positive side.
4. `|-9| = 9 > 4 = |4|`, but `-9 < 4`. The bars report distance from zero and discard the side, and the side is precisely what decides order.
5. No. `-15` lies to the **right** of `-18`, so it is warmer, not colder. "Below `-18`" requires a position further left, such as `-20`. This is the comparison error with a physical consequence.
:::

## Move between routes

- [Guided practice](/foundations/concepts/integers-and-the-number-line/approach-2/) — decide these cases yourself, with replies that name the misreading.
- [Written teaching guide](/foundations/reading/basic-math/integers-and-the-number-line/) — the full explanation.
- [Concept hub](/foundations/concepts/integers-and-the-number-line/) — prerequisites and what follows.
