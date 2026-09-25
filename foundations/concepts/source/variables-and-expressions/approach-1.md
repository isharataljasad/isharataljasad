# Variables and Expressions

## What this route covers

This is the reference treatment: the anatomy of an algebraic expression, and the rules that decide how a written or spoken phrase becomes symbols without losing its order. It assumes you have met the ideas before. If you have not, read the [full written guide](/foundations/reading/algebra/variables-and-expressions/) and return here to settle a translation.

Covered: terms, coefficients and constants; finding the outer operation; the phrases whose word order reverses the symbols; grouping that must be written because the words carry it; the inputs a quotient forbids; and reading symbols back to check. Not covered: simplifying, expanding, factoring or solving.

This is the algebra treatment. The earlier [expressions and variables](/foundations/concepts/expressions-and-variables/) in Basic Math settles what a letter stands for and how to evaluate one. This route assumes that and asks a harder question: does your expression still say what the sentence said?

## Where the idea sits

- **Assumed before it:** [order of operations](/foundations/concepts/order-of-operations/), and evaluating an expression.
- **Established here:** that an expression is a record of structure, and that a translation can be arithmetically fine and structurally wrong.
- **Depends on it afterwards:** [functions and allowed inputs](/foundations/models/functions-and-domain/), equation solving, and [a first material balance](/foundations/reading/basic-math/expressions-and-variables/), where a mistranslated phrase becomes a wrong process model.

## Anatomy of an expression

In `5x² + 2x - 3`:

| Part | What it is | Note |
| --- | --- | --- |
| `x` | the variable | one letter, appearing in two terms |
| `5x²`, `2x`, `-3` | the terms | separated by `+` and `-` at the top level |
| `5`, `2` | coefficients | multiply their variable part |
| `-3` | the constant term | its sign belongs to it |
| `²` | the exponent | acts on `x` only, not on `5` |

An expression has no equals sign. `5x² + 2x - 3 = 0` is an equation, and asks a different question entirely.

Multiplication is written by juxtaposition: `7x` is `7 × x`, and `(a + b)(c + d)` multiplies two complete sums. The `×` sign is avoided in algebra because it is hard to distinguish from the variable `x`.

## Translate the outer operation first

The words "sum", "difference", "product" and "quotient" name an operation but do not by themselves say how much of the sentence each side of it covers. Find the outermost operation, then bracket its two parts.

| Phrase | Outer operation | Expression |
| --- | --- | --- |
| seven less than twice `y` | subtraction, from `2y` | `2y - 7` |
| four times the sum of `a` and `b` | multiplication, of a whole sum | `4(a + b)` |
| the sum of `3a` and `8`, divided by `2` | division, of a whole sum | `(3a + 8)/2` |
| the square of the sum of `r` and two | a power, of a whole sum | `(r + 2)²` |

## Phrases whose word order reverses

| Phrase | Correct | Tempting and wrong | Test value |
| --- | --- | --- | --- |
| seven less than `2y` | `2y - 7` | `7 - 2y` | `y = 10`: `13`, not `-13` |
| nine less than the product of four and `x` | `4x - 9` | `9 - 4x` | `x = 5`: `11`, not `-11` |
| five subtracted from `c` | `c - 5` | `5 - c` | `c = 8`: `3`, not `-3` |
| `c` less five | `c - 5` | — | same reading, different wording |

"Less than" and "subtracted from" both name a reduction **from** the quantity mentioned second, so the symbols arrive in the opposite order to the words. Substituting one easy number settles it in seconds, and is worth doing every time.

## Grouping the words carry but the symbols must state

| Phrase | Expression | Undefined when |
| --- | --- | --- |
| the quotient of `3p + 6` and `4q - 5` | `(3p + 6)/(4q - 5)` | `q = 5/4` |
| the difference of `4q` and five less than `c` | `4q - (c - 5) = 4q - c + 5` | never |
| the sum of `u` and two, divided by three | `(u + 2)/3` | never |
| `u` plus two thirds | `u + 2/3` | never |

The last two pairs differ by a bracket that the spoken phrase marks only with a pause. At `u = 1` they are `1` and `5/3`.

Row two is the expensive one: dropping the bracket after a minus sign changes every sign inside it. `4q - (c - 5)` is not `4q - c - 5`.

## Boundary checks

- **A correct value does not prove a correct translation.** Two different expressions can agree at one test value. Test two values when the stakes are high.
- **A bracket after a minus sign changes the signs inside it**, and this is the most common structural error in the topic.
- **A quotient carries a condition that the words never mention.** The phrase does not say "provided the denominator is not zero"; you have to supply it.
- **Terms are separated at the top level only.** In `3(x + 2) + 5` there are two terms, not three; `x` and `2` are inside one of them.
- **Reading backward checks structure, not intent.** It confirms your symbols match the sentence, not that the sentence described the situation correctly.

## Five checks after the reference

1. In `6t³ - 4t + 9`, name the variable, the coefficient of the cubic term, and the constant term.
2. Translate "nine less than the product of four and `x`", and say why `9 - 4x` is wrong.
3. Translate "twice the difference of `m` and five, divided by the sum of `n` and one", and state when it is undefined.
4. Put `3(a + b²)` into words, and say which part is squared.
5. A student writes "the square of the sum of `r` and two" as `r² + 2`. Correct it, and use `r = 1` to show the two differ.

:::answer Check your rulings
1. Variable `t`; coefficient of the cubic term `6`; constant term `9`. The sign of `-4` belongs to its term.
2. `4x - 9`. "Less than" reduces **from** the product, so the symbols reverse the word order. At `x = 5`, the phrase means `20 - 9 = 11`, while `9 - 4x` gives `-11`.
3. `2(m - 5)/(n + 1)`, undefined when `n = -1`. The word "twice" covers the whole difference, and "divided by" covers everything before it.
4. "Three times the sum of `a` and the square of `b`." Only `b` is squared; the bracket keeps `a` out of the power, and the `3` is outside the bracket entirely.
5. `(r + 2)²`. At `r = 1` the correct expression gives `9`, and `r² + 2` gives `3`. Squaring a sum is not squaring its parts.
:::

## Move between routes

- [Guided practice](/foundations/concepts/variables-and-expressions/approach-2/) — translate these yourself, with replies that name the structural error.
- [Written teaching guide](/foundations/reading/algebra/variables-and-expressions/) — the full explanation.
- [Concept hub](/foundations/concepts/variables-and-expressions/) — prerequisites and what follows.
