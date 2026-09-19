# Functions and Allowed Inputs

## The short model before practice

A function allows one output for each input. Two different inputs may lead to the same output. In a table, compare the input column; on a graph, imagine one vertical line at a time. For a formula, find the allowed inputs before substituting: a real square root cannot contain a negative number, and a denominator cannot be zero.

For example, `{(-3, 2), (0, 2), (4, 7)}` is a function even though output `2` appears twice. Every input occurs with just one output. No video is needed to make that decision.

## One optional visual link

[Watch a five-minute visual explanation of relations and functions](https://www.pearson.com/channels/calculus/learn/patrick/00-functions/introduction-to-functions#assetId=3e52649e) **only if** it is hard to see why two graph points directly above one another represent the same input with two outputs. The text above and the correction below remain sufficient without opening it. This video targets the function decision; it is not a substitute for learning algebraic domain restrictions.

## Choose a decision, then try one changed case

**Clue:** A table or set of ordered pairs asks whether it is a function. **First move:** scan inputs, not outputs. Consider `{(-2, 5), (1, 6), (1, 9)}`. Input `1` leads to both `6` and `9`, so the relation is not a function.

Now decide for `{(-2, 5), (1, 6), (3, 6)}`. It **is** a function: the outputs `6` repeat, but the inputs do not conflict.

| If your reasoning is... | Step to revisit | Repair and new case |
| --- | --- | --- |
| “Repeated six means it is not a function.” | Compared outputs rather than inputs. | Point to the input column, then decide for `{(0, 4), (2, 4)}`. It is a function. |
| “The first set is a function because it has three pairs.” | Counted records rather than checking a single input. | Compare the two pairs beginning with `1`, then decide for `{(4, 2), (4, 8)}`. It is not a function. |
| “I cannot decide from a curve.” | Has not connected graph position to input equality. | Draw a vertical line at the contested input; use the optional visual explanation if that representation is still unclear. |

Once you can explain the function rule, consider a different decision: which inputs are allowed? For `h(x)=√(x+1)/(x−3)`, the square root requires `x≥−1` and the denominator requires `x≠3`. Together these give `[-1,3)∪(3,∞)`. The input `−1` is allowed: its square root is zero and its denominator is negative four. The input `3` is forbidden because its denominator is zero.

Now change the expression to `k(x)=√(5−x)/(x+2)`. Work out the restrictions before reading the answer: the root requires `x≤5`; the denominator excludes `−2`. The domain is `(-∞,−2)∪(−2,5]`. Substituting five gives a zero numerator and a nonzero denominator, so five stays. If interval notation is unfamiliar, [read its explanation in Foundation 3](/foundations/models/functions-and-domain/foundation-3/#5-decide-which-inputs-a-formula-permits).

## What to know before moving on

Explain why repeated **outputs** can be allowed, then classify a relation whose pairs have changed. On another day, explain the same rule from a graph. If you need the answer or a hint, revisit that particular step; one correct click or one watched video is not evidence of lasting mastery.
