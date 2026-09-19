# Functions and Allowed Inputs

## Place in the curriculum

Before this lesson: ordered pairs, the coordinate plane, intervals, square roots, and division by a nonzero number. Here: relations, functions, domain, and range. After it: reading graphs, piecewise functions, transformations, composition, and then limits. Each later topic depends on knowing which inputs actually have an output.

This page is one example of a larger curriculum map. Each subject needs the same clear placement and an explicit record of missing steps. The full four-area coverage review is still in progress.

## Principle and why it works

A **relation** is a collection of input and output pairs. A **function** is a relation in which each input has exactly one output within the relation. Different inputs may share an output: `(-2, 4)` and `(2, 4)` do not conflict. But `(2, 4)` and `(2, 7)` assign two outputs to the same input and therefore fail the function rule.

The **domain** is the set of allowed inputs, and the **range** is the set of resulting outputs. A list of discrete pairs gives only the listed inputs; plotting four points does not license a continuous line between them. For a formula, the rule and any stated context determine the domain. A square root of a real quantity needs a nonnegative radicand; a denominator must not be zero; a logarithm needs a positive argument. A physical model may restrict the input further than the formula does.

On a graph, all points with the same input lie on one vertical line. Thus the vertical-line test is a picture of the definition: a vertical line crossing the relation twice reveals one input with two outputs. A horizontal line crossing twice is allowed for a function and instead concerns whether an inverse relation can itself be a function.

## Worked application

Consider `f(x) = √(x + 4)/(x − 2)`. First require `x + 4 ≥ 0`, so `x ≥ −4`. Then require `x − 2 ≠ 0`, so `x ≠ 2`. The domain is `[-4, 2) ∪ (2, ∞)`. The endpoint `−4` is included because its square root is zero and the denominator is `−6`; `2` is excluded because division by zero has no value.

If the formula represents a quantity measured only for time `x ≥ 0`, its modeled domain becomes `[0, 2) ∪ (2, ∞)` unless another physical limit is supplied. Mathematical and contextual restrictions must both be checked; a formally valid negative time may be meaningless in that experiment.

## Compact reference

| Representation | First decision | Boundary check |
| --- | --- | --- |
| Pairs or a table | Does one input lead to two distinct outputs? | Repeated outputs are permitted; repeated inputs with conflicting outputs are not. |
| Graph | Can a vertical line meet two included points? | Open endpoints are not part of the relation. |
| Formula | Which operations restrict the input? | Radical: `≥ 0`; denominator: `≠ 0`; logarithm: `> 0`. |
| Physical model | What inputs exist in the situation? | Intersect the mathematical domain with the stated context. |

## Distinct checks after the explanation

1. The pairs `{(-1, 3), (1, 3), (2, 5)}` define a function. Explain why the repeated output is harmless.
2. The pairs `{(-1, 3), (-1, 5), (2, 5)}` are not a function. Identify the single conflicting input.
3. Find the domain of `g(x) = √(7 − x)/(x + 1)` and test both boundary candidates `7` and `−1` in the original expression.

**Answers:** (1) Each input has only one output. (2) Input `−1` has outputs `3` and `5`. (3) `x ≤ 7` and `x ≠ −1`, so `(-∞, −1) ∪ (−1, 7]`; at `7` the numerator is zero and the denominator is eight, whereas `−1` makes the denominator zero.
