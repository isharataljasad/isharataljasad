# Order of operations

**Episode 01.3 | Basic Math | Early reading edition**

## What this lesson will settle

An expression can contain several operations but must still name one value. This lesson explains how grouping, powers, multiplication and division, then addition and subtraction determine that value. It also explains a point often lost in the memory phrase “Please Excuse My Dear Aunt Sally”: multiplication and division share a level, as do addition and subtraction. Within either level, work from left to right.

## 1. The written structure tells you what belongs together

Compare `2 + 3 × 5` with `(2 + 3) × 5`. The first says add two to the product of three and five: `2 + 15 = 17`. The second says multiply the whole sum by five: `5 × 5 = 25`. Parentheses are a way to make an intended group explicit; they are not decoration.

Nested groups are resolved from the inside outward. For example, `2[3 + (7 - 4)] = 2[3 + 3] = 2 × 6 = 12`. Square brackets are another grouping mark. A fraction bar groups its entire numerator and denominator: `(8 + 4)/(2 + 1) = 12/3 = 4`. Writing `8 + 4/2 + 1` would describe a different calculation.

## 2. A four-level reading rule

Use this table after identifying the groups. Complete one level before moving to the next, rewriting the untouched parts of the expression each time.

| Level | Action | Key detail |
| --- | --- | --- |
| 1 | Evaluate inside grouping marks | Work from inner groups outward; a fraction bar groups top and bottom. |
| 2 | Evaluate powers | The exponent applies to its base, including any parentheses around the base. |
| 3 | Multiply and divide | They have equal priority; follow their order from left to right. |
| 4 | Add and subtract | They have equal priority; follow their order from left to right. |

The familiar initials PEMDAS can help recall the four levels, but the letters M and D do not mean “all multiplication before all division.” Likewise, A does not outrank S. It is more accurate to think `P → E → (M and D) → (A and S)`.

## 3. Equal priority means left to right

For `18 ÷ 3 × 2`, division appears first, so `(18 ÷ 3) × 2 = 6 × 2 = 12`. Doing multiplication first would turn it into `18 ÷ 6 = 3`, which changes the expression. If the intended answer were three, the writer should use `18 ÷ (3 × 2)`.

For `9 - 4 + 2`, subtraction appears first, so `(9 - 4) + 2 = 7`. Adding four and two first would produce three, but that requires `9 - (4 + 2)`. Read each chain at its own level from left to right.

## 4. Follow one expression through every level

Consider `6 × (5 - 2)² ÷ 9`. The group gives `5 - 2 = 3`, so the expression becomes `6 × 3² ÷ 9`. The exponent gives `3² = 9`, so it becomes `6 × 9 ÷ 9`. Multiplication and division then run left to right: `54 ÷ 9 = 6`. Rewriting at each step prevents an operation from being silently dropped.

As a second example, `9 - 2² = 9 - 4 = 5`. Subtracting first would treat `9 - 2` as a group that was never written. To request that calculation, write `(9 - 2)² = 49`.

## 5. Signs, variables, and ambiguous writing

A leading minus is outside a power unless parentheses place it inside the base. Thus `-2² = -(2²) = -4`, while `(-2)² = 4`. If a variable has a negative value, write parentheses during substitution. For `x = -2`, the expression `3 + x²` becomes `3 + (-2)² = 7`.

Multiplication written by adjacency still belongs to the multiplication and division level. Some shorthand such as `8 ÷ 2(2 + 2)` is read differently by different people after the parentheses are evaluated. A carefully written expression removes the dispute: `(8 ÷ 2)(2 + 2) = 16` or `8/[2(2 + 2)] = 1`. In study, calculations, and code, make the grouping visible when a denominator or product could be misread.

## Coverage before questions

The rule now has a reason and a procedure: grouping defines subexpressions, powers act on their bases, multiplication and division share a level, addition and subtraction share a level, and equal-priority operations run left to right. You have also seen fraction bars, nested groups, negative bases, substitution, and how to rewrite ambiguous notation.

## Eight question fingerprints

1. **Choose the next step:** In `4 + 2 × 5`, which operation is first, and what is the value?
2. **Change the structure:** Add parentheses to `4 + 2 × 5` so that addition happens first. Evaluate the result.
3. **Resolve equal priority:** Evaluate `24 ÷ 6 × 3` and explain why the first two numbers are combined first.
4. **Resolve a second tie:** Evaluate `15 - 7 + 2`.
5. **Follow all levels:** Evaluate `4 × (7 - 3)² ÷ 8` with one rewritten expression per level.
6. **Read a fraction bar:** Evaluate `(10 + 2)/(5 - 2)` and state which quantities are grouped.
7. **Diagnose a sign:** Explain why `-3²` and `(-3)²` have different values.
8. **Substitute and decide:** If `x = -2`, evaluate `5 - x²`. Show the substitution before calculating.

## Answers with reasons

1. Multiplication comes before addition: `4 + 2 × 5 = 4 + 10 = 14`.
2. `(4 + 2) × 5 = 6 × 5 = 30`. The parentheses make the sum one factor.
3. `24 ÷ 6 × 3 = 4 × 3 = 12`. Division and multiplication share a level, so left to right decides.
4. `15 - 7 + 2 = 8 + 2 = 10`. Addition and subtraction also share a level.
5. `4 × (7 - 3)² ÷ 8 = 4 × 4² ÷ 8 = 4 × 16 ÷ 8 = 64 ÷ 8 = 8`.
6. The whole numerator is `10 + 2`, and the whole denominator is `5 - 2`; `12/3 = 4`.
7. `-3² = -(3 × 3) = -9`; `(-3)² = (-3)(-3) = 9`. The base is different.
8. `5 - (-2)² = 5 - 4 = 1`. The square is evaluated before the subtraction.

**Earlier connection:** [Exponents](BM-01-02-exponents.md) explains what a power means and why its base must be identified before this order rule is applied.
