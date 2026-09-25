# Variables and Expressions

## What this route covers

This is the practice treatment. One price list is set up below and every family translates a sentence about it, so a wrong translation has a visible consequence: the shop charges the wrong amount. Commit to an expression before opening each reply, and test it at one value. The replies name the structural error, not just the right answer, because on this topic a wrong expression is usually a correct translation of a different sentence.

If a ruling surprises you, the [curriculum reference](/foundations/concepts/variables-and-expressions/approach-1/) states it as a rule, and the [written guide](/foundations/reading/algebra/variables-and-expressions/) explains it at length.

## The one price list used throughout

A print shop quotes jobs from this list.

| Symbol | Means | Unit |
| --- | --- | --- |
| `n` | number of pages in the job | pages |
| `c` | cost of printing one page | riyals per page |
| `s` | setup charge, once per job | riyals |
| `d` | discount applied to the finished quote | riyals |

For testing, take `n = 10`, `c = 2`, `s = 15`, `d = 9`.

Every sentence below describes a charge built from these four.

## Family 1 · Find the outer operation

### Decide: "the setup charge plus the cost of all the pages" — in symbols?

### Then decide: "twice the total of the setup charge and the page cost"

The second is not the first doubled in one place. Decide where "twice" reaches.

:::answer Where each phrase's outermost operation sits
The first is `s + nc`. The outer operation is addition: one setup charge, plus however many pages cost. At the test values, `15 + 20 = 35` riyals.

The second is `2(s + nc)`. The words "the total of ... and ..." name one quantity, and "twice" applies to all of it: `2(35) = 70`.

Writing `2s + nc` doubles only the setup charge and gives `30 + 20 = 50`. Writing `s + 2nc` doubles only the pages and gives `55`. Three different quotes from one sentence, and only one of them is what was said.

The error worth naming: translating left to right in the order the words arrive. The outer operation is decided by what the words group, not by which appears first.
:::

## Family 2 · Word order that reverses

### Decide: "nine riyals less than the cost of the pages" — in symbols?

Test it at the values above before committing.

### Then decide: "the discount subtracted from the setup charge"

:::answer Why both tempting answers have the wrong sign
The first is `nc - 9`, which is `20 - 9 = 11` riyals. The tempting `9 - nc` gives `-11`: a negative charge, meaning the shop pays the customer. The test value exposes it immediately.

The second is `s - d`, which is `15 - 9 = 6`. Not `d - s`.

Both phrases — "less than" and "subtracted from" — name a reduction **from** the quantity mentioned second, so the symbols come out in the opposite order to the words. This is the one place in translation where following the sentence order is reliably wrong.

The error worth naming: writing symbols in the order the words were spoken. One substituted test value catches it every time, and costs a few seconds.
:::

## Family 3 · The bracket after a minus sign

### Decide: "the page cost, less nine riyals off the setup charge" — that is, `nc` minus the quantity `(s - 9)`

Write it with the bracket, then remove the bracket correctly.

### Then decide: is `nc - (s - 9)` the same as `nc - s - 9`?

:::answer What the minus sign does to everything inside
`nc - (s - 9) = nc - s + 9`. The minus sign in front of the bracket applies to **both** terms inside it, so the `-9` becomes `+9`.

At the test values: `20 - (15 - 9) = 20 - 6 = 14`. The careless removal gives `20 - 15 - 9 = -4`. The gap is 18 riyals on a 14-riyal job, and the sign is wrong as well.

So `nc - (s - 9)` and `nc - s - 9` are different expressions. They agree only when the discarded term is zero.

The error worth naming: treating a bracket as punctuation that can be deleted once you have read it. After a minus sign, the bracket is carrying a sign change for every term inside.
:::

## Family 4 · Read it backward, and say when it breaks

### Decide: what does `(s + nc)/n` mean in words, and what does it compute?

### Then decide: for what value of `n` is that expression undefined, and does that value make sense as a job?

:::answer The meaning, and the condition the sentence never mentions
`(s + nc)/n` is "the total charge divided by the number of pages" — the cost per page for that job, setup included. At the test values, `35/10 = 3.5` riyals per page, which is more than the `c = 2` printing cost because the setup is shared across the pages.

It is undefined at `n = 0`. And that is not a technicality here: a job with no pages still incurs the setup charge `s`, so the total is not zero, but "cost per page" has nothing to divide by. The mathematics and the situation agree that the question stops making sense.

Compare `s + nc/n`, which loses the bracket and simplifies to `s + c = 17` — a number that is not a cost per page at all.

The error worth naming: dropping the grouping that a spoken phrase marks only with a pause. Reading the symbols back in words is the check, and it takes one sentence.
:::

## What to be able to do before moving on

1. Find the outer operation in a phrase and bracket its parts before writing anything.
2. Translate "less than" and "subtracted from" in the reversed order, and confirm with one test value.
3. Remove a bracket that follows a minus sign, changing every sign inside it.
4. Read an expression back in words, and state the input it forbids and whether that input means anything in the situation.

## Move between routes

- [Curriculum reference](/foundations/concepts/variables-and-expressions/approach-1/) — the rules as lookup tables.
- [Written teaching guide](/foundations/reading/algebra/variables-and-expressions/) — the full explanation.
- [Concept hub](/foundations/concepts/variables-and-expressions/) — prerequisites and what follows.
