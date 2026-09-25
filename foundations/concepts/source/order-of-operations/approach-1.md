# Order of Operations

## What this route covers

This is the reference treatment: the precedence levels as a table you check against, the two places where the familiar mnemonic misleads, and the notations that group silently. It assumes you have met the rule before. If you have not, read the [full written guide](/foundations/reading/basic-math/order-of-operations/) first and return here to settle a disputed reading.

Covered: the four levels, what ties within a level, which marks create a group, how a power finds its base, and the written forms that two competent readers can read differently. Not covered: what a power means, which is [exponents](/foundations/reading/basic-math/exponents/); solving equations; and operator precedence in any particular programming language, which is similar but not identical.

## Where the idea sits

- **Assumed before it:** reading an expression as an instruction rather than a row of symbols, from [expressions and variables](/foundations/concepts/expressions-and-variables/).
- **Established here:** the guarantee that one written expression names exactly one value.
- **Depends on it afterwards:** every formula you evaluate, every substitution, every rearrangement in algebra, and every calculation entered into a calculator or a spreadsheet.

## The four levels

Settle one level completely, rewriting the whole expression, before starting the next.

| Level | Operation | What decides ties inside the level |
| --- | --- | --- |
| 1 | Anything inside a grouping mark | innermost group first |
| 2 | Powers | each power acts on its own base |
| 3 | Multiplication and division | left to right |
| 4 | Addition and subtraction | left to right |

## Where the mnemonic misleads

`PEMDAS` names the levels in order but suggests six of them. There are four.

| The letters suggest | The rule actually is | Worked contrast |
| --- | --- | --- |
| all multiplication before all division | they share level 3; left to right decides | `18 ÷ 3 × 2 = 6 × 2 = 12`, not `18 ÷ 6 = 3` |
| all addition before all subtraction | they share level 4; left to right decides | `9 - 4 + 2 = 5 + 2 = 7`, not `9 - 6 = 3` |

If a writer wanted `3` from the first line, the expression needed to be `18 ÷ (3 × 2)`. The notation, not the convention, is what has to change.

## Marks that create a group

| Mark | Groups | Note |
| --- | --- | --- |
| `( )` | everything between them | innermost pair resolves first |
| `[ ]` | the same | used to keep nested pairs readable |
| fraction bar | the entire numerator and the entire denominator | grouping is implied, never written |
| root sign | everything under the bar | same implied grouping |
| exponent position | the whole expression written in the raised position | `2^(n+1)` differs from `2^n + 1` |

A fraction bar is the common surprise: `(8 + 4)/(2 + 1) = 4`, while the same symbols typed in one line as `8 + 4/2 + 1` evaluate to `11`. Nothing was rearranged; the grouping simply stopped being implied.

## How a power finds its base

| Written | Base | Value | Why |
| --- | --- | --- | --- |
| `-2²` | `2` | `-4` | the power binds tighter than the leading sign |
| `(-2)²` | `-2` | `4` | the bracket puts the sign inside the base |
| `3x²` | `x` | `3 × x × x` | the coefficient is not part of the base |
| `(3x)²` | `3x` | `9x²` | now it is |

When substituting a negative value, write the bracket as you substitute. For `x = -2`, `3 + x²` becomes `3 + (-2)²= 7`. Dropping that bracket produces `3 - 4 = -1`, which is the correct value of a different expression.

## Boundary checks: where the rule stops deciding

- **Convention does not repair ambiguous writing.** `8 ÷ 2(2 + 2)` is read as `16` by some and `1` by others, because whether adjacency binds tighter than `÷` is not universally agreed. The rule cannot settle it; rewriting it as `(8 ÷ 2)(2 + 2)` or `8/[2(2 + 2)]` can.
- **Calculators and languages differ.** Some treat `-2²` as `4`. Precedence tables are conventions implemented by people, and implementations disagree at the edges.
- **The rule fixes the value, not the meaning.** It tells you what an expression evaluates to, never whether that is the quantity the problem wanted.
- **Left to right is a tie-break, not a reading order.** You do not read the whole expression left to right; you apply left-to-right only among operations already tied at one level.
- **Rewriting each level is a method, not a rule.** It is worth the extra line: dropped terms are the most common error, and they happen when several levels are collapsed in the head.
- **The `÷` sign mostly disappears after this level of study.** Later work writes division as a fraction bar instead, and this is not a change of taste. The bar groups its numerator and denominator explicitly, so the ambiguity in the row above cannot arise. When you meet `÷` in a formula, it is worth rewriting it as a fraction before you evaluate anything.

## Five checks after the reference

1. In `4 + 2 × 5`, name the operation at the highest level, and give the value.
2. Insert brackets into `4 + 2 × 5` so the addition happens first, then evaluate.
3. Evaluate `24 ÷ 6 × 3`, and state which rule decides the order of the two level-3 operations.
4. Evaluate `4 × (7 - 3)² ÷ 8`, writing one full expression per level.
5. Evaluate `5 - x²` at `x = -2`, showing the substituted line before any arithmetic.

:::answer Check your rulings
1. Multiplication is level 3 and addition level 4, so the product is formed first: `4 + 10 = 14`.
2. `(4 + 2) × 5 = 30`. The bracket makes the sum a single factor.
3. `24 ÷ 6 × 3 = 4 × 3 = 12`. Division and multiplication share level 3, so the tie is broken left to right; the division is written first.
4. `4 × (7 - 3)² ÷ 8` → `4 × 4² ÷ 8` → `4 × 16 ÷ 8` → `64 ÷ 8` → `8`.
5. `5 - (-2)² = 5 - 4 = 1`. The bracket is what keeps the minus sign inside the base. Drop it and you write `5 - -2²`; reading `-2²` as `-(2²) = -4` turns the line into `5 + 4 = 9`. So the bracket is not tidiness here — it is the difference between `1` and `9`.
:::

## Move between routes

- [Guided practice](/foundations/concepts/order-of-operations/approach-2/) — decide each case yourself, with replies that name the misreading.
- [Written teaching guide](/foundations/reading/basic-math/order-of-operations/) — the full explanation this compresses.
- [Concept hub](/foundations/concepts/order-of-operations/) — prerequisites and what follows.
