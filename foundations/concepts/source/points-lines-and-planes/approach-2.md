# Points, Lines and Planes

## What this route covers

This is the practice treatment. Each section states one **decision you have to make**, shows the move that settles it, then names the specific wrong reasoning that produces each wrong answer and gives you a changed case to retry. The explanations here are short on purpose: they assume you have read either the [full written guide](/foundations/reading/geometry/points-lines-and-planes/) or the [reference route](/foundations/concepts/points-lines-and-planes/approach-1/).

Four problem families appear below, and they need genuinely different reasoning: naming, determination, intersection, and reading a drawing. Getting one right does not mean the others will follow.

## The one configuration used throughout

Fix this picture and reuse it, so the practice tests your reasoning and not your ability to hold a new diagram in mind each time.

> Plane `M` contains line `g`. Points `A`, `B` and `D` lie on `g`, in that order. Point `C` lies in `M` but not on `g`. Point `E` is not in `M` at all.

Everything below refers to that configuration.

## Family 1 · Naming: is this name legal?

**The decision:** does the name you were given pick out exactly one object?

**The move:** count what the name supplies, then check it against the determination rule. Two distinct points fix a line. Three *noncollinear* points fix a plane.

### Decide: is `plane ABD` a valid name?

It is **not**. `A`, `B` and `D` all lie on `g`, so they are collinear, and infinitely many planes contain one line.

| If you reasoned... | What went wrong | Repair, then try this |
| --- | --- | --- |
| "Three points are given, so it names a plane." | You used the count and skipped the condition. The rule needs three **noncollinear** points. | Check whether the three share a line first. Now decide `plane ABC`. Valid: `C` is off `g`. |
| "It is invalid because `D` is far from `A`." | Distance never appears in the rule. Only collinearity does. | Ignore apparent spacing. Now decide `plane ABE`. It is a valid name, because `E` is off `g`, so the three are noncollinear — but read the next row before assuming which plane it names. |
| "`plane ABE` must be another name for `M`." | A valid name still names *its own* plane. `E` is not in `M` at all, so `ABE` names a different plane that happens to share line `g` with `M`. | A three-letter name is legal when the points are noncollinear, and it names the one plane containing **those** points. Now name `M` itself three ways: `ABC`, `ACD`, `BCD` all work, because each uses points that are all in `M`. |
| "Any plane name needs a single capital like `M`." | A plane can be named either way. Both `plane M` and `plane ABC` are legal here. | Now give two more valid three-letter names for `M`. `ACD` and `BCD` both work. |

### Then decide: is `ray DA` the same as `ray AD`?

They are **different**, but not in the way most people first guess. `ray AD` starts at `A` and runs through `D` and onwards; `ray DA` starts at `D` and runs through `A` and onwards. They face opposite ways, yet they **overlap** on everything between their endpoints.

`B` lies between `A` and `D`, so `B` belongs to **both** rays. Every point of segment `AD` does. What separates the two rays is what lies *beyond* each endpoint: a point past `D` is on `ray AD` only, and a point past `A` is on `ray DA` only.

Their intersection is exactly **segment `AD`**, and their union is the whole line.

### Careful: these are not opposite rays

Facing opposite ways is not enough. **Opposite rays share one endpoint** and run in opposite directions from it, so they meet at that single point. `ray AD` and `ray DA` have *different* endpoints, which is precisely why they share a whole segment rather than one point.

In this configuration the genuine pair is `ray BA` and `ray BD`: both start at `B`, they run opposite ways along `g`, they share only `B`, and together they form the whole line.

| Pair | Endpoints | They share |
| --- | --- | --- |
| `ray AD` and `ray DA` | different: `A` and `D` | segment `AD` |
| `ray BA` and `ray BD` | the same: `B` | the single point `B` |

:::answer Check yourself: which of segment, ray and line change when you swap the letters?
Only the ray. Segment `AD` and segment `DA` are the same set, and line `AD` and line `DA` are the same set. For a ray the first letter is the endpoint, so swapping moves the endpoint and reverses the direction.

Be careful about what "different" means here. `B` lies between `A` and `D`, so `B` is on segment `AD`, on line `AD`, **and on both rays**. These two rays with different endpoints share every point between those endpoints: `ray AD ∩ ray DA = segment AD`. To find a point in one ray and not the other you must go past an endpoint — beyond `D` for `ray AD`, beyond `A` for `ray DA`.
:::

## Family 2 · Determination: is one object pinned down?

**The decision:** does the given information force exactly one object, or leave a choice?

**The move:** ask what would have to change for a second object to fit. If nothing can change, it is determined.

### Decide: do `g` and point `C` determine exactly one plane?

**Yes.** A line and a point not on that line determine exactly one plane, and `C` is not on `g`. That plane is `M`.

| If you reasoned... | What went wrong | Repair, then try this |
| --- | --- | --- |
| "No, because a plane needs three points." | It does — and you have them. The line supplies infinitely many, and `C` supplies the one that is off it. | Pick any two points of `g`, say `A` and `B`, and add `C`. Now decide: do `g` and point `B` determine one plane? **No** — `B` is on `g`, so nothing new is pinned down. |
| "Yes, because any line and any point do." | Only if the point is **off** the line. | Now decide the case with `A` instead of `C`. It fails for exactly that reason. |
| "Yes, and the plane is unique because `M` was named." | The name is not the reason. The determination rule is, and it would hold with no name given. | State the rule without using the letter `M`. |

### Then decide: do `g` and `E` determine a plane, and is it `M`?

They determine exactly one plane, because `E` is not on `g`. But it is **not** `M`: `E` is not in `M` at all. One line lies in infinitely many planes, and `E` selects a different one.

## Family 3 · Intersection: name the complete shared set

**The decision:** what is the *whole* set of shared points — not one point of it?

**The move:** classify the pair first, then read the case off.

For **two distinct lines, a line and a plane, or two distinct planes**, the possibilities are no points, one point, or a whole line, depending on the pair. The word **distinct** matters: two names for the same plane describe an intersection equal to that entire plane.

It does **not** extend to rays and segments. Those have endpoints, so they can also share a whole segment: `ray AD ∩ ray DA = segment AD`, as the previous section showed, and segment `AD ∩` segment `BD` `=` segment `BD`. Check which kind of object you were given before reaching for the short list.

### Decide: line `h` pierces `M` at `C`. What is the intersection of `h` and `M`?

Exactly the one point `C`.

| If you reasoned... | What went wrong | Repair, then try this |
| --- | --- | --- |
| "`C` and the points near it." | "Near" is not a set. Piercing means the line crosses out of the plane immediately; only the crossing point is shared. | Now state the intersection of `g` and `M`. It is **all of `g`**, because `g` lies in `M`. |
| "Nothing, because `h` is not in `M`." | Not lying *in* a plane and not *meeting* it are different. A line can meet a plane at one point without lying in it. | Now describe a line that really does share nothing with `M`: one parallel to `M` and outside it. |
| "A line, because planes always meet in lines." | That rule is for **two planes**. `h` is a line. | Say which rule applies to a line and a plane, then reapply it. |

### Then decide: distinct planes `M` and `N` both contain `A` and `B`. What do they share?

The **entire line `AB`**, not just those two points. `A` and `B` determine line `AB`; both planes contain both points, so both contain the whole line through them.

:::answer Why "only A and B" cannot be right
If `M` and `N` shared only `A` and `B`, then line `AB` would lie in `M` but not in `N`, even though `N` contains both of its determining points. Two distinct points fix one line, and any plane holding both points holds every point of that line. So the shared set includes all of line `AB`. Two distinct planes share either a whole line or nothing.
:::

## Family 4 · Reading a drawing: what may you assume?

**The decision:** is this fact given, or is it just how the picture looks?

**The move:** use the stated configuration and explicit markings. A crossing in a perspective drawing does not by itself establish that two objects meet in space. Apparent size, angle and the drawn edge of a plane are not geometric facts.

| The picture appears to show | May you use it? | Why |
| --- | --- | --- |
| `A`, `B`, `D` on one line, labelled that way | Yes | Stated in the configuration. |
| `AB` looks the same length as `BD` | No | Nothing stated lengths. Equal appearance is not a claim. |
| `g` looks perpendicular to another drawn line | No | Perpendicularity needs an explicit marking, a statement, or a deduction from given facts. |
| The plane patch ends at its drawn edge | No | The patch is a symbol. `M` continues without end. |
| `E` is drawn above the patch | Yes, as "not in `M`" | That is the stated fact the drawing encodes. |

| If you reasoned... | What went wrong | Repair, then try this |
| --- | --- | --- |
| "`C` is outside `M` because it is drawn near the edge." | The edge is not a boundary. `C` is in `M` by the statement. | Redraw with `C` near the middle. Nothing about the mathematics changes. |
| "`g` stops where the patch stops." | Both the line and the plane continue past the drawing. | State what the arrowheads on `g` are there to tell you. |

## What to be able to do before moving on

Explain, without looking: why `plane ABD` fails but `plane ABC` works; why swapping letters changes a ray but not a line; and why two distinct planes sharing two points must share a whole line. If any of those is shaky, the section above that covers it is the one to reread — not the whole page.

One correct decision is not mastery. Come back in a day and redo Family 3 from memory, since naming the *complete* shared set is the part that most often slips.

## Move between routes

The [reference route](/foundations/concepts/points-lines-and-planes/approach-1/) has the rules in table form. The [full written guide](/foundations/reading/geometry/points-lines-and-planes/) builds the whole idea from the beginning with diagrams.
