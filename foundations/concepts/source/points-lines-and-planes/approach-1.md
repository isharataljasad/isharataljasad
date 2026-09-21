# Points, Lines and Planes

## What this route covers

This is the reference treatment: the definitions, the conditions that make each statement true, and compact tables you can check an answer against. It assumes you have already met the ideas somewhere. If you have not, start with the [full written guide](/foundations/reading/geometry/points-lines-and-planes/) and come back here to revise.

Covered: undefined terms, dimension, collinear and coplanar, segments and rays, naming rules, what determines a line or a plane, and the intersection cases listed below. Not covered: distance, angle measure, congruence, proof technique. Continue with [measuring segments](/foundations/reading/geometry/measuring-segments/), [midpoints and congruence](/foundations/reading/geometry/midpoints-and-congruence/), [angles](/foundations/reading/geometry/angles/), and later reasoning chapters.

## Where the idea sits

- **Assumed before it:** reading an ordered pair, and the idea that a drawing stands for something it is not.
- **Established here:** the vocabulary and the incidence rules that every later geometry argument quotes.
- **Depends on it afterwards:** segment and angle measure, postulates and proof, parallel and perpendicular lines, and every solid-geometry argument about how faces meet.

## Definitions, stated exactly

**Point**, **line** and **plane** are *undefined terms*. They are not built from anything simpler; they are described by the rules they obey. Everything else in this list is defined from them.

| Term | Definition | Dimension |
| --- | --- | --- |
| Point | A location. No length, width or thickness. | 0 |
| Line | A straight set of points extending without end in both directions. | 1 |
| Plane | A flat set of points extending without end in every direction within itself. | 2 |
| Segment `AB` | The two points `A` and `B` together with every point of line `AB` between them. | 1 |
| Ray `AB` | Point `A`, together with every point of line `AB` on the `B` side of `A`. | 1 |
| Collinear | A set of points that all lie on one line. | — |
| Coplanar | A set of points that all lie in one plane. | — |
| Skew lines | Two lines that are not coplanar. | — |

A mark on paper is a **model** of one of these objects, never the object. The dot has width, the drawn line stops, and the plane is drawn as a slanted patch whose edges are not part of it.

## Notation that carries meaning

| Written | Means | Reversing the letters |
| --- | --- | --- |
| line `AB` | the whole line through `A` and `B` | same object: line `AB` = line `BA` |
| segment `AB` | the piece from `A` to `B` inclusive | same object: segment `AB` = segment `BA` |
| ray `AB` | starts at `A`, runs through `B`, never stops | **different object**: ray `BA` starts at `B` |
| plane `ABC` | the plane containing `A`, `B` and `C` | same object, any order |
| plane `M` | a plane given a single name | — |

Ray is the one case where letter order changes the set. The first letter is the endpoint. That single rule accounts for most naming errors in this unit.

**Different is not the same as disjoint.** `ray AB` and `ray BA` are different sets, but they are not separate: both contain every point between `A` and `B`. Precisely,

`ray AB ∩ ray BA = segment AB`, and `ray AB ∪ ray BA = line AB`.

A point tells the two apart only if it lies *beyond* an endpoint: past `B` it is on `ray AB` alone, past `A` on `ray BA` alone.

**`ray AB` and `ray BA` are not opposite rays.** Opposite rays must share one endpoint and go in opposite directions from it; these two have *different* endpoints, `A` and `B`, which is exactly why they overlap on the whole of segment `AB` instead of meeting at a single point. For a genuine pair, take a third point: if `A`, `B` and `D` lie in that order, then `ray BA` and `ray BD` are opposite rays — both start at `B`, they run opposite ways, they share only `B`, and together they form line `AD`.

## What determines a unique object

"Determines" means *exactly one exists*. Each row is a condition; drop the condition and the conclusion fails.

| Given | Determines | Why the condition is needed |
| --- | --- | --- |
| 2 **distinct** points | exactly one line | One point alone lies on infinitely many lines. |
| 3 **noncollinear** points | exactly one plane | If the three are collinear, infinitely many planes contain them. |
| a line and a point **not on it** | exactly one plane | A point on the line adds nothing new; the plane is not pinned down. |
| 2 **distinct intersecting** lines | exactly one plane | They already share a point and two more directions. |
| 2 **distinct parallel** lines | exactly one plane | Parallel is defined only for coplanar lines. |

Skew lines determine no plane at all. That is what "not coplanar" means, and it is the reason skew lines are neither parallel nor intersecting.

## Intersection cases for lines, planes, rays and segments

An intersection is the **complete set of shared points**, not one convenient point of it.

For two distinct lines, a line and a plane, or two distinct planes, the possible shared sets are no points, one point, or a whole line, depending on the pair. If two names denote the **same plane**, the intersection is that entire plane. If two names denote the **same line**, it is that entire line. Rays and segments can also overlap in a segment or ray. Identify the objects and whether they are distinct before applying a rule.

| Two objects | Possible intersections |
| --- | --- |
| line and line (distinct) | one point · no points if parallel · no points if skew |
| line and plane | the whole line if the line lies in the plane · exactly one point if it pierces · no points if parallel and outside |
| plane and plane (distinct) | one whole line · no points if parallel |
| ray and ray, on different lines | one point if both contain the crossing point · otherwise no points |
| segment and segment, on different lines | one point if both contain the crossing point · otherwise no points |
| ray and ray, on one line | a segment if they face each other and overlap · one point if they are opposite rays · a whole ray if one contains the other · no points if they face apart |
| segment and segment, on one line | a segment where they overlap · one point if they meet only at an endpoint · no points if they are apart |

Two distinct lines cannot share two points: two distinct points already determine one line, so sharing two would make them the same line. Two distinct planes that share two points share the entire line through those points.

## Boundary checks

| Claim to test | Verdict | Reason |
| --- | --- | --- |
| "Three points always determine a plane." | False as stated | Only if they are noncollinear. |
| "Two planes always meet in a line." | False as stated | Only if they are distinct and not parallel. |
| "Lines that never meet are parallel." | False in space | Skew lines never meet and are not parallel. |
| "Ray `PQ` and ray `QP` are the same." | False | Different endpoints, so different sets — though they still share all of segment `PQ`. |
| "Ray `PQ` and ray `QP` have nothing in common." | False | Their intersection is segment `PQ`; only points beyond an endpoint lie in one and not the other. |
| "If `A` and `B` lie in planes `M` and `N`, the planes share only `A` and `B`." | False | They share the whole line `AB`. |

## Four checks after the reference

1. `P`, `Q`, `R` lie on line `k`; `S` is not on `k`. Which three-letter plane names are valid, and which are not?
2. Line `h` meets plane `M` at exactly one point. State the complete intersection, and say what would have to be true for the intersection to be all of `h`.
3. Lines `a` and `b` do not intersect. What two cases are possible, and what single fact separates them?
4. `X`, `Y` and `Z` lie on one line in that order. Name the intersection of `ray XZ` with `ray ZX`, and give one point that belongs to exactly one of them.

:::answer Answers with reasons
(1) Valid: `PQS`, `PRS`, `QRS` — each uses two points of `k` plus the off-line point `S`, so the three are noncollinear. Invalid: `PQR`, because those three are collinear and do not pin down one plane.

(2) The intersection is exactly that one point. For the intersection to be all of `h`, the line would have to lie in `M`, which requires every point of `h` to be in `M` — not just the one it currently shares.

(3) Either they are parallel, or they are skew. The separating fact is whether the two lines are coplanar: parallel lines lie in one plane, skew lines lie in none.

(4) `ray XZ ∩ ray ZX = segment XZ`. `Y` lies between `X` and `Z`, so `Y` is on **both** rays and does not separate them. A point beyond `Z` is on `ray XZ` only; a point beyond `X` is on `ray ZX` only.
:::

## Move between routes

Use the [guided practice route](/foundations/concepts/points-lines-and-planes/approach-2/) to test these rules against worked decisions, or the [full written guide](/foundations/reading/geometry/points-lines-and-planes/) for the complete explanation with diagrams.
