# Relations, Functions and Allowed Inputs

## What you will understand before any questions

You will be able to read a relation as pairs, a table, or points on a graph; find its domain and range; decide whether it is a function; explain the vertical-line test; evaluate function notation; and identify inputs excluded by a formula. Each decision is explained below before the question families appear.

Start with reading a number line and substituting numbers into a simple expression. If either is unfamiliar, open [the coordinate plane](/foundations/reading/geometry/coordinate-plane/) or [variables and expressions](/foundations/reading/algebra/variables-and-expressions/), then return here. New notation is explained below when it is needed.

## 1. Start with an input and an output

An ordered pair `(x, y)` tells us that input `x` is associated with output `y`. A **relation** is a collection of these pairs. A table with one column for `x` and one for `y` is another view of the same information; a plotted point is a third. The order matters: `(2, 7)` means input two, output seven, while `(7, 2)` reverses their jobs.

Suppose a small relation has pairs `{(-1, 4), (0, 2), (3, 4)}`. The table would have rows `-1 → 4`, `0 → 2`, and `3 → 4`. Its graph consists of precisely three plotted points. Do not join them with a line unless a rule or context supplies all the values between the listed inputs. A connected line would invent infinitely many additional pairs.

The **domain** is the set of inputs: `{−1, 0, 3}`. The **range** is the set of outputs: `{2, 4}`. Output four appears in two pairs, but a set lists it once. Domain and range are sets of values, not counts of table rows.

## 2. A function is a relation with a dependable output

For a relation to be a **function**, each input in its domain must have exactly one output. In the previous relation, the three inputs each have one output, so it is a function. There is no problem with inputs `−1` and `3` both leading to `4`. A function can be many-to-one.

Now compare `{(-1, 4), (0, 2), (0, 5)}`. Input zero would lead to both two and five. The same input cannot give two different outputs under one function rule, so this relation is not a function. Scanning only the output column would miss the actual conflict.

Why do we care? If a chemistry formula is said to give concentration from a chosen time, that time must give one concentration within the model. Otherwise the instruction “evaluate at this time” would have no single answer. A measured data set can have noise, but a mathematical function models a particular output rule and must state how it handles such data.

## 3. Translate the function rule into a graph decision

All graph points with input `x = 2` lie directly above or below one another on the vertical line through two. If that line meets the graph at two distinct included points, one input has two outputs and the graph fails the function rule. This is the **vertical-line test**. To pass, every vertical line may meet the graph at at most one included point.

A circle fails: many vertical lines through it touch an upper and a lower point. The upper semicircle by itself can pass. A horizontal line through two points is not a failure: it says two inputs share an output, which is allowed. On a graph with open circles, an open endpoint is excluded and should not be counted as an included point. Check the actual graph rather than an imagined line through isolated plotted pairs.

## 4. Read function notation as an instruction

`f(x)` means “the output of the function named `f` at input `x`.” It is not multiplication of `f` by `x`. If `f(x) = 2x − 7`, then `f(2) = 2(2) − 7 = −3`. The input two goes into every occurrence of `x`.

Parentheses distinguish two different requests: `f(2) + 7 = −3 + 7 = 4`, while `f(2 + 7) = f(9) = 18 − 7 = 11`. In the first, add after evaluating at two; in the second, add inside the input before evaluating. If the input is negative, substitute with parentheses: for `g(x)=x²+1`, `g(−2)=(−2)²+1=5`.

## 5. Decide which inputs a formula permits

For a finite list of pairs, only the listed inputs are in the domain. When no domain is stated for a formula, introductory real-number work usually asks for its largest allowed real domain. Its operations may exclude some inputs. A square root `√u` requires `u≥0`: no real number squared is negative. A denominator must be nonzero: dividing by zero would ask for a number that, when multiplied by zero, could give a nonzero numerator. Even 0/0 is undefined: every number multiplied by zero gives zero, so there is no unique quotient. A zero numerator divided by a nonzero denominator is allowed. Apply all restrictions together.

For `h(x)=√(x+4)/(x−2)`, the root needs `x+4≥0`, which gives `x≥−4`. The denominator needs `x−2≠0`, which excludes `2`. Thus the domain is `[-4,2)∪(2,∞)`. At `−4`, the root is zero and the denominator is `−6`, so the endpoint belongs. At `2`, the denominator is zero, so no value exists. A sketch alone is not needed to reach this decision.

Read that interval notation in pieces. `[-4,2)` means every real number from negative four up to two: the square bracket includes negative four, and the round bracket excludes two. `(2,∞)` means every real number greater than two; infinity is not an endpoint that can be reached. The union sign `∪` joins the two sets. Together they say: start at negative four, continue to the right, and leave a hole at two.

Later, logarithms add another restriction. `ln u` asks for the exponent that gives `u` when the positive number `e` is raised to that exponent. Such outputs are always positive, so a real logarithm requires `u>0`. You do not need logarithms to solve the square-root examples in this lesson.

The modeled domain can be smaller. If `x` represents elapsed time, negative inputs are not part of the physical situation even when the algebraic formula would accept them. State the mathematical restrictions and the contextual restrictions separately, then intersect them.

## 6. A complete worked walk-through

Consider the table below. Read it as four discrete pairs. The first column gives the domain, the second gives the range. Then check whether any repeated input has conflicting outputs.

| Input `x` | Output `y` |
| --- | --- |
| `−2` | `5` |
| `0` | `1` |
| `2` | `5` |
| `4` | `7` |

The relation is `{(−2,5),(0,1),(2,5),(4,7)}`. Its domain is `{−2,0,2,4}` and range is `{1,5,7}`. It **is** a function because each input has one output. The repeated output five is harmless. Plot only these four points if this table is all we know. If the row `(2,9)` were added, it would cease to be a function because input two would then have outputs five and nine.

## Coverage before questions

We have explained how a pair becomes a table row and plotted point; why a list of points should not automatically become a continuous line; how domain and range are collected; what repeated inputs and outputs mean; why the vertical-line test works; how to read `f(x)`; and how operations and context restrict a formula's inputs. Return to the named section for any step you cannot yet explain.

## Question fingerprints

1. **Represent:** Convert `{(−3,2),(1,4),(5,2)}` into a table. State its domain and range without repeating a set value.
2. **Classify:** Is `{(−1,3),(2,3),(4,7)}` a function? Is `{(−1,3),(2,3),(2,7)}`? Name the decisive input.
3. **Explain a graph:** Why does a vertical line meeting a curve twice disqualify it, while a horizontal line meeting it twice may not?
4. **Read notation:** For `f(x)=3x−5`, calculate `f(2)+4` and `f(2+4)`. Explain the difference in words.
5. **Find valid inputs:** Determine the domain of `q(x)=√(6−x)/(x+1)`. Check `x=6` and `x=−1` directly.
6. **Transfer:** If `q(x)` from question five models a quantity at time `x≥0`, what modeled domain remains? Which restriction came from the situation?

## Answers with reasons

1. Rows are `−3 → 2`, `1 → 4`, and `5 → 2`. Domain `{−3,1,5}`; range `{2,4}`. Two inputs can share output two.
2. The first is a function: inputs `−1`, `2`, and `4` each have one output. The second is not: input `2` has both `3` and `7`.
3. A vertical line fixes one input and would reveal two outputs. A horizontal line fixes one output and may meet two different inputs, which is allowed.
4. `f(2)=1`, so `f(2)+4=5`. But `f(2+4)=f(6)=13`. The first adds to an output; the second changes the input.
5. `6−x≥0` gives `x≤6`; `x+1≠0` excludes `−1`. Domain `(-∞,−1)∪(−1,6]`. At six the numerator is zero and the denominator is seven; at negative one the denominator is zero.
6. Intersect with `x≥0`: `[0,6]`. The excluded input `−1` is already outside that interval. The nonnegative time condition came from the situation.
