# Exponents

## What this route covers

This is the reference treatment: what a power commits you to, stated as rules with tables to check an answer against. It assumes you have met powers before. If you have not, read the [full written guide](/foundations/reading/basic-math/exponents/) and return here to settle a reading.

Covered: naming the base and the exponent, expansion, the difference a coefficient makes, what a bracket puts inside the base, the exponents one and zero, and what happens to a unit when a quantity is squared. Not covered: the laws for combining powers, negative and fractional exponents, scientific notation, and where a power sits inside a longer calculation — that last is [order of operations](/foundations/concepts/order-of-operations/).

## Where the idea sits

- **Assumed before it:** multiplication, and reading an expression as an instruction, from [expressions and variables](/foundations/concepts/expressions-and-variables/).
- **Established here:** the base is the thing repeated and the exponent is the count of repetitions, and which symbols decide each.
- **Depends on it afterwards:** order of operations, scientific notation, areas and volumes, unit algebra in physics and chemistry, and every polynomial.

## What the two numbers do

| In `6³` | Name | Role |
| --- | --- | --- |
| `6` | base | the factor that is repeated |
| `3` | exponent | how many copies are multiplied |

`6³ = 6 × 6 × 6 = 216`. The exponent counts factors; it is not itself a factor. So `6³` is not `6 × 3 = 18`, and the gap between those two grows fast.

| Power | Expanded | Value |
| --- | --- | --- |
| `3⁴` | `3 × 3 × 3 × 3` | `81` |
| `4⁵` | `4 × 4 × 4 × 4 × 4` | `1024` |
| `x⁴` | `x × x × x × x` | a valid description before `x` has a value |

A size check before arithmetic: for a base above one, each extra step multiplies by the base again, so `4⁵` must be four times `4⁴`. Any answer near `20` has confused the exponent with a factor.

## What the bracket puts inside the base

This table is the whole topic's error surface.

| Written | Base | Means | Value at `x = 2` |
| --- | --- | --- | --- |
| `3x⁴` | `x` | `3 × x × x × x × x` | `48` |
| `(3x)⁴` | `3x` | `(3x)(3x)(3x)(3x) = 81x⁴` | `1296` |
| `-2⁴` | `2` | `-(2 × 2 × 2 × 2)` | `-16` |
| `(-2)⁴` | `-2` | four negative factors | `16` |
| `(-2)³` | `-2` | three negative factors | `-8` |

An odd count of negative factors leaves the result negative; an even count does not. That is why `(-2)³` and `(-2)⁴` differ in sign while `-2³` and `-2⁴` do not — in the second pair the sign was never inside the base at all.

When you substitute a negative value, write the bracket as you substitute: at `x = -2`, `2x³` becomes `2(-2)³ = 2(-8) = -16`.

## Reversing the question

Evaluating and recovering are different tasks.

| Given | Asked | Method |
| --- | --- | --- |
| `5³` | its value | multiply three fives: `125` |
| `125`, base `5` | the exponent | build up: `5¹ = 5`, `5² = 25`, `5³ = 125` |
| `7 × 7 × 7 × 7` | as one power | repeated factor is the base, count is the exponent: `7⁴` |
| `7 × 7 × 5` | as one power | not possible; write `7² × 5` |

A value can have more than one power description: `81 = 3⁴ = 9²`. The question has one answer only when it names the base.

## The two edge exponents

| Rule | Condition | Why it is not arbitrary |
| --- | --- | --- |
| `a¹ = a` | none | one copy of the base is the base |
| `a⁰ = 1` | `a ≠ 0` | it continues the pattern `a³ ÷ a = a²`, `a² ÷ a = a¹`, `a¹ ÷ a = a⁰` |
| `0⁰` | — | left unassigned here; it needs a separate convention |

`a⁰ = 1` is not the claim that multiplying no copies gives nothing. It is the only value that keeps division by the base consistent, and the argument needs `a ≠ 0` because that division would otherwise be by zero.

## Boundary checks: where a power stops behaving simply

- **The unit is raised too.** A square of side `3 cm` has area `(3 cm)² = 9 cm²`. Writing `3² cm = 9 cm` gives a length, not an area. Which one you wrote is decided by the bracket.
- **A coefficient is not part of the base** unless a bracket says so, and this is the most expensive single error in the topic.
- **Expansion is a description, not a calculation.** `x⁴` is fully meaningful before `x` has a value; nothing is pending.
- **These rules cover positive whole-number exponents.** Negative and fractional exponents are defined by extending the pattern, not by counting copies, and are a separate topic.
- **Recovering an exponent needs a stated base.** Without one the question is under-specified, and two different correct answers exist.

## Five checks after the reference

1. In `8³`, name the base and the exponent, then write the expanded product and its value.
2. Write `6 × 6 × 6 × 2` using a power. Say why it is not `6⁴`.
3. Give both `(-3)²` and `-3²`, and name the base in each.
4. Evaluate `2x³` at `x = -2`, showing the substituted line.
5. State `12⁰` and `(4 m)²`, and say why the rule for `a⁰` does not settle `0⁰`.

:::answer Check your rulings
1. Base `8`, exponent `3`. `8 × 8 × 8 = 512`.
2. `6³ × 2`. It is not `6⁴` because the fourth factor is `2`, not `6`; a power records one repeated factor only.
3. `(-3)² = 9` with base `-3`; `-3² = -9` with base `3`. The bracket is the only difference, and it moves the sign into the base.
4. `2(-2)³ = 2(-8) = -16`. Without the bracket the line reads `2 × -2³`, which is `-16` as well here — but at an even exponent the same slip flips the sign, so the bracket is worth writing every time.
5. `12⁰ = 1`. `(4 m)² = 16 m²`, an area. The pattern argument for `a⁰` divides by the base, so it says nothing when the base is `0`; `0⁰` is left unassigned here.
:::

## Move between routes

- [Guided practice](/foundations/concepts/exponents/approach-2/) — decide these cases yourself, with replies that name the misreading.
- [Written teaching guide](/foundations/reading/basic-math/exponents/) — the full explanation.
- [Concept hub](/foundations/concepts/exponents/) — prerequisites and what follows.
