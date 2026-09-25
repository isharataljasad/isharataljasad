# A First Material Balance

## What this route covers

This is the practice treatment. One mixer is set up below and every family asks a different question about it, so the boundary, the units and the balances all refer to one piece of equipment. Commit to an answer before opening each reply. The replies name the error, and the last of them is the mistake that survives longest because its answer always looks reasonable.

If a ruling surprises you, the [curriculum reference](/foundations/concepts/material-balances/approach-1/) states it as a rule, and the [starter lesson](/program/lessons/material-balances/) explains it with a worked mixer.

## The one mixer used throughout

A continuous mixer has two inlet pipes and one outlet. It runs at steady state, with no reaction and no loss.

| Stream | Total flow | Solute |
| --- | --- | --- |
| feed A | `100 kg/h` | `20%` by mass |
| feed B | `50 kg/h` | pure water |
| outlet | to be found | to be found |

The tank itself holds roughly `200 kg` of liquid while running. That number is inventory, and it is deliberately included: one family below asks whether it belongs in the balance.

## Family 1 · The boundary, and which numbers are what

### Decide: which of the four numbers above is a mass, and which are mass flow rates?

### Then decide: does the `200 kg` inventory enter the balance?

:::answer Two quantities, and why the inventory drops out
`100 kg/h`, `50 kg/h` and the outlet flow are **mass flow rates**: material crossing the boundary per unit time, which is what a pipe carries. The `200 kg` in the tank is a **mass**: inventory held inside the boundary, which is what a vessel contains.

The inventory does not enter this balance — not because it is irrelevant, but because the mixer is at **steady state**, so the accumulation term is zero. The tank stays at about `200 kg` and that quantity is not changing. Were the mixer filling or draining, the same `200 kg` would matter a great deal.

So "steady state" is doing the work here, and it does not mean the tank is empty or that nothing is happening. It means the inventory is constant while flow continues.

The error worth naming: adding the inventory to the inlet flows. The units alone forbid it — `kg` and `kg/h` cannot be added — and that is the quickest way to catch it.
:::

## Family 2 · Is `input = output` available?

### Decide: for this mixer, may you write input = output?

### Then decide: a different tank receives `10 kg/h` and discharges `7 kg/h`. May you write it there?

:::answer When the short form is a conclusion and when it is an error
For the mixer, yes. It is at steady state and there is no reaction, so accumulation, generation and consumption are all zero, and the general balance collapses to input = output.

For the second tank, no. It gains `10 - 7 = 3 kg/h`, and that is precisely the accumulation term. Writing input = output there sets the answer to zero before the question is asked.

The full statement is `accumulation = input - output + generation - consumption`. The short form is what remains after two conditions are checked, not a rule you may start from. Checking them takes one sentence: is the inventory changing, and does a reaction make or destroy this species?

The error worth naming: treating input = output as the definition of a material balance. It is one case of it, and a question that gives you a filling tank is usually testing exactly this.
:::

## Family 3 · Balance the total and the component separately

### Decide: find the outlet total flow, the outlet solute flow, and the outlet mass fraction

Keep two columns. Commit to all three before reading on.

:::answer The three numbers, and what did not change
Total: `100 + 50 = 150 kg/h`.

Solute: feed A carries `100 × 0.20 = 20 kg/h`; feed B carries `0`. So the outlet carries `20 kg/h`.

Fraction: `20/150 = 0.1333`, or `13.33%` by mass.

The solute flow is unchanged at `20 kg/h`. Nothing was destroyed or created — the same solute now travels in a larger total, so its fraction fell from `20%` to `13.33%`. Dilution moves the fraction and leaves the component flow alone, and seeing that clearly is most of what this topic is for.

Two separate balances made this available. One balance on the total gives `150`; one on the solute gives `20`; the fraction is a consequence of both.

The error worth naming: balancing the percentages. Percentages are not conserved quantities. Flows are.
:::

## Family 4 · Why the average of the two percentages is wrong

Now change the feeds: feed A is `80 kg/h` at `15%` solute, feed B is `70 kg/h` of pure water.

### Decide: find the outlet mass fraction

### Then decide: someone answers `7.5%`. Where did that come from, and when would it have been right?

:::answer The correct fraction, and the reasoning behind the plausible wrong one
Solute in: `80 × 0.15 = 12 kg/h`. Total out: `80 + 70 = 150 kg/h`. Fraction: `12/150 = 0.08`, so `8.00%` by mass.

`7.5%` is the **unweighted average** of `15%` and `0%`. It is a natural move and it gives an answer of about the right size, which is what makes it durable: it does not look wrong.

It would have been right only if the two flows were equal. They are `80` and `70`, so the richer stream contributes more than half the total and pulls the result above the midpoint — to `8.00%` rather than `7.50%`.

The general point: a mass fraction is an intensive property and does not mix by averaging. What mixes additively is the **component flow**, `12 kg/h`, and the **total flow**, `150 kg/h`. Divide the one by the other and the weighting takes care of itself.

The error worth naming: averaging intensive quantities. The same mistake appears whenever concentrations, densities or temperatures are combined without weighting by the amount carrying them.
:::

## What to be able to do before moving on

1. Sort the given numbers into masses and mass flow rates, and say why inventory drops out at steady state.
2. State the general balance and check the two conditions before reducing it to input = output.
3. Balance total and component in separate columns, and say which quantity changed and which did not.
4. Explain why averaging two mass fractions is wrong, and name the condition under which it happens to work.

## Move between routes

- [Curriculum reference](/foundations/concepts/material-balances/approach-1/) — the balance and its conditions as lookup tables.
- [Starter lesson](/program/lessons/material-balances/) — the full explanation with a worked mixer and an explorer.
- [Concept hub](/foundations/concepts/material-balances/) — prerequisites and what follows.
