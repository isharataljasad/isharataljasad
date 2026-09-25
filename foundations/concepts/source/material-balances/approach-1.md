# A First Material Balance

## What this route covers

This is the reference treatment: the general balance, the conditions that reduce it to the familiar short form, and the quantity distinction that causes most first-year errors. It assumes you have met the idea before. If you have not, read the [starter lesson](/program/lessons/material-balances/) and return here to settle a ruling.

Covered: the system boundary, the five terms and when each vanishes, mass against mass flow rate, steady state, mass fraction, and the two-column method for a mixer. Not covered: reacting systems in any detail, recycle and purge, unsteady operation, and energy balances.

## Where the idea sits

- **Assumed before it:** translating a described quantity into symbols, from [expressions and variables](/foundations/concepts/expressions-and-variables/) and [variables and expressions](/foundations/concepts/variables-and-expressions/).
- **Established here:** that an accounting statement, not a formula, is what solves these problems, and that the boundary is a choice you make before any arithmetic.
- **Depends on it afterwards:** every unit-operation calculation in chemical engineering, and the concentration work in [properties of solutions](/semester-1/chemistry/solutions/).

## The general balance

For one chosen species inside one chosen boundary:

`accumulation = input - output + generation - consumption`

| Term | Means | Vanishes when |
| --- | --- | --- |
| accumulation | change of inventory inside the boundary | steady state |
| input | crosses the boundary inward | there is no feed |
| output | crosses the boundary outward | there is no product |
| generation | created by reaction | no reaction produces this species |
| consumption | destroyed by reaction | no reaction consumes this species |

Every term must share one unit, such as `kg/h`. Total mass is conserved in ordinary chemical processes, so when all species are counted together the reaction terms cancel; for a non-reacting process they are zero species by species as well.

With steady state and no reaction, and only then, the balance becomes **input = output**.

## Mass and mass flow rate are different quantities

| Quantity | Unit | Describes | Example |
| --- | --- | --- | --- |
| mass | `kg` | inventory held inside the boundary | `50 kg` of liquid in the tank |
| mass flow rate | `kg/h` | movement across the boundary per unit time | `50 kg/h` entering through a pipe |

A vessel holds a mass. A stream carries a rate. Writing `20 kg/h` inside a tank, or `20 kg` on an arrow, is not a unit slip to be tidied later — it is a claim about a different quantity, and the balance built on it will be wrong.

## Steady state

Steady state means the inventory inside the boundary is not changing with time.

It does **not** mean the tank is empty, that nothing is flowing, or that nothing is happening. A mixer running steadily at `150 kg/h` is at steady state with a full tank and continuous flow.

| Situation | Accumulation | Balance |
| --- | --- | --- |
| in `10 kg/h`, out `10 kg/h` | `0` | input = output |
| in `10 kg/h`, out `7 kg/h` | `+3 kg/h` | input = output would erase the gain |
| in `7 kg/h`, out `10 kg/h` | `-3 kg/h` | inventory is being drawn down |

Check the situation before simplifying the balance. The short form is a conclusion, not a starting point.

## Mass fraction

A stream at `20%` solute **by mass** has mass fraction `0.20`: every `1 kg` of mixture carries `0.20 kg` of solute and `0.80 kg` of solvent.

`component flow = total flow × mass fraction`, so `100 kg/h × 0.20 = 20 kg/h` of solute.

A mole percentage or a volume percentage is a different basis and cannot be substituted silently. State the basis whenever you write a percentage.

## The two-column method

Keep total flow and component flow in separate columns, and balance each column on its own.

| Stream | Total, `kg/h` | Solute, `kg/h` |
| --- | --- | --- |
| A | `100` | `100 × 0.20 = 20` |
| B | `50` | `0` |
| outlet | `150` | `20` |

Outlet fraction `= 20/150 = 0.1333`, or `13.33%` by mass.

Two balances, written separately, are what make the answer available. The solute was diluted, not destroyed: its flow is unchanged at `20 kg/h` while the total it sits in grew.

## Boundary checks

- **`input = output` is conditional.** It requires steady state and, for a species balance, no net generation or consumption of that species.
- **The basis of a percentage is part of its meaning.** Mass, mole and volume percentages are not interchangeable.
- **A mass fraction is not conserved; a component flow is.** Mixing two streams does not average their fractions unless the flows are equal.
- **The boundary is a choice, and it must be stated.** Different boundaries give different correct balances for the same equipment.
- **Nothing here covers reaction.** With reaction, the generation and consumption terms return, and a species balance alone no longer closes the problem.

## Five checks after the reference

1. Write the general balance, and name the two conditions that reduce it to `input = output`.
2. A tank receives `10 kg/h` and discharges `7 kg/h`. State the accumulation, and say why `input = output` is unavailable.
3. Feed A is `100 kg/h` at `20%` solute by mass; feed B is `50 kg/h` of pure water. They mix at steady state with no reaction. Find the outlet flow, the outlet solute flow, and the outlet mass fraction.
4. A beaker is labelled `20 kg/h` of salt. State what is wrong with the label.
5. Feed A is `80 kg/h` at `15%` solute; feed B is `70 kg/h` of pure water. Find the outlet fraction, and say why `7.5%` is wrong.

:::answer Check your rulings
1. `accumulation = input - output + generation - consumption`. It reduces to `input = output` under steady state **and** no net generation or consumption of the species being balanced.
2. Accumulation is `+3 kg/h`; the tank is filling. Setting input equal to output would erase exactly the quantity the question is about.
3. Total: `100 + 50 = 150 kg/h`. Solute: `20 + 0 = 20 kg/h`. Fraction: `20/150 = 0.1333`, so `13.33%` by mass. The solute flow did not change; the total it sits in did.
4. A beaker holds inventory, which is a mass in `kg`. A rate in `kg/h` describes material crossing a boundary per unit time, which is what a pipe carries, not what a vessel contains.
5. Solute in: `80 × 0.15 = 12 kg/h`. Total out: `150 kg/h`. Fraction: `12/150 = 0.08`, so `8.00%`. The value `7.5%` is the unweighted average of `15%` and `0%`, which would be right only if the two flows were equal. They are `80` and `70`, so the richer stream carries slightly more weight.
:::

## Move between routes

- [Guided practice](/foundations/concepts/material-balances/approach-2/) — decide these yourself, with replies that name the error.
- [Starter lesson](/program/lessons/material-balances/) — the full explanation, with a worked mixer and an interactive explorer.
- [Concept hub](/foundations/concepts/material-balances/) — prerequisites and what follows.
