# Order of Operations

## What this route covers

This is the practice treatment. One expression is set up below and every family changes exactly one thing about it, so you can see which change moves the answer and which does not. Commit to a value before opening each reply. The replies name the specific misreading that produces the tempting wrong answer, because on this topic almost every wrong answer is the correct value of a slightly different expression.

If a ruling surprises you, the [curriculum reference](/foundations/concepts/order-of-operations/approach-1/) states it in one line, and the [written guide](/foundations/reading/basic-math/order-of-operations/) gives the reasoning.

## The one expression used throughout

Start from this, and keep it in view:

`6 × (5 - 2)² ÷ 9`

| Part | Level it belongs to | Settled when |
| --- | --- | --- |
| `(5 - 2)` | 1, grouping | first |
| `( )²` | 2, power | after its group is a single number |
| `6 × …` and `… ÷ 9` | 3, tied | left to right, after the power |
| — | 4 | nothing at this level here |

Each family below alters one mark and asks what that alteration costs.

## Family 1 · Which level acts first?

### Decide: evaluate the expression above, writing one line per level

Do not collapse two levels into one line. Commit to a final value.

### Then decide: what does `6 × 5 - 2² ÷ 9` give?

Same digits, no brackets. Before computing, predict whether it is larger or smaller.

:::answer Both values, and what the brackets were doing
The first: `6 × (5 - 2)² ÷ 9` → `6 × 3² ÷ 9` → `6 × 9 ÷ 9` → `54 ÷ 9` → **6**.

The second: `6 × 5 - 2² ÷ 9` has no group, so level 2 acts on `2` alone: `6 × 5 - 4 ÷ 9` → `30 - 0.444…` → **about 29.6**.

The brackets were not making the expression tidier. They were placing `5 - 2` at level 1 so that the subtraction happened before everything, and placing the result inside the base of the power. Removing them moves the subtraction to level 4, which is last.

The error worth naming: treating brackets as emphasis. They are the only way to promote an operation to level 1, and removing them demotes it to last.
:::

## Family 2 · Equal priority: the tie-break

### Decide: `54 ÷ 9 × 2`

Commit before reading on.

### Then decide: `9 - 4 + 2`

Same question, different level.

:::answer Why both tempting answers are values of unwritten expressions
`54 ÷ 9 × 2 = 6 × 2 = 12`. Division and multiplication are tied at level 3, so the one written first goes first. Answering `3` means you evaluated `54 ÷ (9 × 2)` — a correct value for an expression nobody wrote.

`9 - 4 + 2 = 5 + 2 = 7`. Addition and subtraction are tied at level 4, same tie-break. Answering `3` means you evaluated `9 - (4 + 2)`.

Both wrong answers come from the same belief: that the mnemonic's letter order ranks `M` above `D` and `A` above `S`. It does not. There are four levels, and two of them contain two operations each.

The error worth naming: reading `PEMDAS` as six ranks instead of four.
:::

## Family 3 · What is the base?

### Decide: `-4²` and `(-4)²` — give both values

### Then decide: substitute `x = -2` into `5 - x²`

Write the substituted line before any arithmetic.

:::answer Where the sign goes, and what it costs
`-4² = -(4²) = -16`. The power binds more tightly than the leading minus, so the base is `4` and the sign is applied to the result. `(-4)² = 16`, because the bracket puts the sign inside the base.

`5 - x²` at `x = -2` is `5 - (-2)² = 5 - 4 = 1`. If the bracket is dropped at substitution, the line reads `5 - -2²`, and reading `-2²` as `-4` gives `5 + 4 = 9`. One missing bracket, and the answer moves from `1` to `9`.

The error worth naming: writing the substitution without the bracket and then blaming the arithmetic. The arithmetic was right for what ended up on the page.
:::

## Family 4 · Grouping that is never written down

### Decide: is `(10 + 2)/(5 - 2)` the same as `10 + 2/5 - 2` ?

### Then decide: how should `8 ÷ 2(2 + 2)` be read?

This last one is deliberately chosen. Decide, then check whether the reference agrees with you.

:::answer One of these has an answer; the other has a diagnosis
`(10 + 2)/(5 - 2) = 12/3 = 4`. A fraction bar groups its whole numerator and its whole denominator without writing a single bracket. Typed onto one line as `10 + 2/5 - 2`, the implied grouping vanishes and the value becomes `10 + 0.4 - 2 = 8.4`. Nothing was rearranged; the grouping simply stopped being implied.

`8 ÷ 2(2 + 2)` has no single correct answer. Competent readers and calculators disagree over whether adjacency binds more tightly than `÷`. Reading left to right at level 3 gives `(8 ÷ 2)(4) = 16`; treating `2(2 + 2)` as one denominator gives `8/8 = 1`. The convention does not settle it, so the expression is defective, not difficult.

The error worth naming: expecting the rule to rescue any string of symbols. Its job is to make well-written expressions unambiguous. When you are the writer, add the bracket; when you are the reader, ask.
:::

## What to be able to do before moving on

1. Evaluate a four-level expression writing one full line per level, with nothing dropped.
2. Break a tie at level 3 or level 4 by position, and recognise the unwritten bracket implied by the wrong answer.
3. Identify the base of a power, and keep a negative sign inside it through a substitution.
4. Read a fraction bar as a group, and recognise a written form that convention cannot disambiguate.

## Move between routes

- [Curriculum reference](/foundations/concepts/order-of-operations/approach-1/) — the levels and tie-breaks as lookup tables.
- [Written teaching guide](/foundations/reading/basic-math/order-of-operations/) — the full explanation.
- [Concept hub](/foundations/concepts/order-of-operations/) — prerequisites and what follows.
