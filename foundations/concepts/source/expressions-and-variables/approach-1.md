# Expressions and Variables

## What this route covers

This is the reference treatment: the four decisions this topic asks of you, each stated as a rule you can check an answer against, with tables to look up rather than prose to read through. It assumes you have met the ideas before. If you have not, read the [full written guide](/foundations/reading/basic-math/expressions-and-variables/) first, then return here when you want to confirm a ruling rather than learn one.

Covered: what a letter stands for, the three written forms and the question each admits, the three verbs that are not synonyms, how adjacency and exponents are read, what grouping changes, and the one input a quotient forbids. Not covered: solving equations, rearranging formulas, functions and their domains, or nested verbal phrasing. Those continue in [variables and expressions in algebra](/foundations/reading/algebra/variables-and-expressions/) and [functions and allowed inputs](/foundations/models/functions-and-domain/).

## Where the idea sits

- **Assumed before it:** arithmetic with whole numbers and the four operations.
- **Established here:** the notation contract — what a written string of symbols commits you to before any number is supplied.
- **Depends on it afterwards:** order of operations, integer arithmetic, exponent rules, every formula in physics and chemistry, and the idea of a function.

## Four decisions, stated exactly

Each row is a separate decision. Getting one right does not settle the others.

| Decision | The question it answers | Wrong move it rules out |
| --- | --- | --- |
| Classify | Is this an expression, an equation or an inequality? | Trying to "solve" something that has no equals sign |
| Translate | Which symbols carry this phrase? | Attaching an operation to one term when the phrase covers both |
| Evaluate | What number does it give for these inputs? | Calculating before substituting |
| Interpret | What quantity, with what unit, is the result? | Reporting a bare number for a physical quantity |

## The three written forms

| Form | Example | Contains | The only question it admits |
| --- | --- | --- | --- |
| Numerical expression | `12 + 5` | numbers only | What is its value? |
| Algebraic expression | `3V + 2` | at least one letter | What is its value once each letter is assigned? |
| Equation | `3V + 2 = 20` | an equals sign | Which assignments make it true? |
| Inequality | `3V + 2 > 20` | a comparison sign | Which assignments satisfy it? |

An expression *has* a value. An equation *claims* something. The claim can be false; a value cannot.

## Three verbs that are not synonyms

| Verb | What you do | What you end with |
| --- | --- | --- |
| Evaluate | replace each letter with its assigned number, then compute | one number |
| Simplify | rewrite the expression without changing any of its values | another expression |
| Solve | find the assignments that make a statement true | a set of numbers, possibly empty |

`3V + 2` can be evaluated and simplified. It cannot be solved, because it asserts nothing.

## Reading the notation

| Written | Reads as | Not | Because |
| --- | --- | --- | --- |
| `4x` | `4 × x` | the digits 4 and x side by side | adjacency is multiplication |
| `ab` | `a × b` | a two-letter name | the same rule, with two letters |
| `x²` | `x × x` | `2 × x` | the exponent counts factors, not copies added |
| `2x` | `x + x` | `x²` | the coefficient counts copies added |
| `3(x + 2)` | `3x + 6` | `3x + 2` | the bracket puts both terms inside the multiplication |
| `-2²` | `-(2²) = -4` | `(-2)² = 4` | the exponent binds tighter than the sign |
| `a/b` | `a ÷ b`, requiring `b ≠ 0` | always defined | division by zero has no value |

The last two rows are where most marks are lost. Both are decided by precedence, not by how the symbols look on the page.

## Boundary checks: where these rules stop

- **A letter carries no meaning until you state one.** `V` is not "volume" by shape; it is volume because the problem said so. Two problems may use `V` for different quantities, and nothing in the symbol warns you.
- **A letter does not tell you whether it varies.** Fixed constants and varying quantities are written identically. Only the problem's definition separates them.
- **A formula can be written correctly and still fail on some inputs.** `a/b` is well formed for every `b`, and undefined for one of them. Domain restrictions are not visible in the notation.
- **Units are not carried by the arithmetic.** `pq + d` adds correctly only if `pq` and `d` are the same kind of quantity. The symbols will not object if they are not.
- **A letter can collide with a unit symbol.** In `m = 3 m` the first `m` is a mass and the second is a metre, and only position distinguishes them. This is common in physics and chemistry formulas, and the notation gives you no warning at all.
- **A correct value can answer the wrong question.** Evaluating when you were asked to solve produces a number that is not wrong in itself and not what was asked.

## Four checks after the reference

1. `5n - 1 = 14` and `5n - 1`: name each form, and state the one question each admits.
2. Write "four times the sum of `r` and three" in symbols, then say what `4r + 3` describes instead.
3. Evaluate `2a² + b` at `a = -3`, `b = 5`, showing the substitution before the arithmetic.
4. A concentration `c` is in `mol/L` and a volume `V` in `L`. State the quantity `cV` represents and its unit, and say why multiplication rather than addition is the operation that fits.

:::answer Check your rulings
1. `5n - 1 = 14` is an equation and admits "which `n` make this true?". `5n - 1` is an expression and admits "what value for a given `n`?". Removing the equals sign removes the claim, not the meaning.
2. `4(r + 3)`. The bracket places both `r` and `3` inside the multiplication. `4r + 3` multiplies only `r` by four and then adds three, which is a different rule for every `r` except `r = 3`.
3. `2(-3)² + 5 = 2(9) + 5 = 23`. The bracket around `-3` is what makes the square positive; `-3²` would read as `-(3²) = -9`.
4. `cV` is an amount of substance in `mol`, because `(mol/L) × L = mol`. Addition would require both quantities to be the same kind, and a concentration and a volume are not.
:::

## Move between routes

- [Guided practice](/foundations/concepts/expressions-and-variables/approach-2/) — decide these cases yourself, with a reply that names the error behind each wrong reading.
- [Written teaching guide](/foundations/reading/basic-math/expressions-and-variables/) — the full explanation this reference compresses.
- [Concept hub](/foundations/concepts/expressions-and-variables/) — where this sits among its prerequisites and what follows it.
