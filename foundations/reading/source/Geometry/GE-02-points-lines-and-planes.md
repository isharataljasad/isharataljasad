# Points, lines, and planes

**Geometry, episode 02 | Early reading edition**

## Start here and see the whole lesson

A point tells us **where**. A line gives a straight path. A plane gives a flat surface. Geometry begins by separating these ideal objects from the marks we draw to represent them. Once you can do that, a complicated diagram becomes a set of clear statements about what lies where.

You need no algebra for the main lesson. You only need to recognise a straight path and distinguish a location from a physical object. Allow about 25–35 minutes for the explanation and worked examples, then return to the questions when ready. The time is a guide, not a deadline.

This chapter covers the language of points, lines, segments, rays, planes, naming, collinearity, coplanarity, and intersections in ordinary three-dimensional Euclidean space. It does not teach angle measurement, distance formulas, constructions, or a full geometry course. Those are later steps.

**Reading route:** understand the objects → learn the naming rules → reason about shared points → follow a complete example → try the different question types. The explanations do not depend on completing a quiz.

## 1. An exact location is not an ink dot

A mathematical **point** is an exact location. It has no length, width, or thickness. We draw a visible dot and label it with a capital letter, such as A, because an actual zero-size location would be invisible on the page.

An ideal **line** is straight, has no thickness, and continues without end in both directions. It is one-dimensional: you can move along it in one independent direction, forward or backward. Two opposite senses of travel do not make two dimensions.

An ideal **plane** is perfectly flat, has no thickness, and extends without end in every direction within its surface. It is two-dimensional: two independent directions are enough to locate any point on it. A plane can be tilted or vertical; “flat” does not mean “horizontal.”

| Object | What it represents | What the drawing cannot literally show |
| --- | --- | --- |
| Point A | A location; zero dimensions | A visible dot has size. The point does not. |
| Line g | A straight path; one dimension | Only a finite portion fits on the page. Arrows mean continuation. |
| Plane M | A flat surface; two dimensions | A slanted patch has drawn edges. The ideal plane has none. |

Point, line, and plane are often called **undefined terms**. This does not mean they are mysterious or arbitrary. A formal geometry system takes them as starting objects, explains their intended meaning, and gives rules about their relationships. Defining every word using earlier words would never supply a starting point.

A tabletop models part of a plane, a stretched thread models part of a line, and a survey mark models a point. Real objects have thickness, extent, and imperfections. We use the ideal model only for the relationships it represents well.

## 2. A line, a segment, and a ray are different sets

Imagine two distinct points A and B on a straight path. **Distinct** means they are different locations, not two labels attached to one location.

The **segment AB** contains A, B, and every point between them. It stops at its two endpoints. The **ray AB** starts at A, passes through B, and continues without end beyond B. The **line AB** continues without end past both A and B.

In conventional notation, a bar above AB means a segment, one arrow above AB means a ray, and a two-headed arrow above AB means a line. This chapter also writes the words explicitly so that a missing or tiny arrow cannot change the meaning silently. Plain AB commonly means the numerical length of segment AB when the context is measurement.

| Object | Does reversing A and B change the object? | Reason |
| --- | --- | --- |
| Segment AB | No: segment BA is the same set. | The two endpoints and everything between remain the same. |
| Line AB | No: line BA is the same set. | Both extend forever in both directions. |
| Ray AB | Yes: ray BA is a different set. | The first letter is the endpoint. Direction matters. |

### Worked example: three ordered points

Suppose A, B, D lie on one line **in that order**. Ray AB and ray AD are the same ray: both start at A and continue toward D. Ray BA and ray BD are **opposite rays**: they share endpoint B and go in opposite directions along the same line. Together those opposite rays form the whole line.

Segment AB is only part of segment AD. A line is not “a very long segment”: however long a segment is, it still has endpoints. An ideal line does not have a finite total length.

## 3. Name an object using enough information

Use this one configuration throughout the next examples: **A, B, D are on line g in that order; g lies in plane M; C lies in M but off g; E is outside M.** The statements establish the relationships; the sketch helps you keep track of them.

A point is named by its label. A line can be named by a lowercase letter such as g, or by **any two distinct points on it**. Thus line AB, line AD, line BD, and line g all name the same line. Line AC is a different line because C is not on g.

A plane can be named by a plane label such as M, or by **three noncollinear points in it**. Collinear points lie on one line. Noncollinear points do not all lie on one line. Therefore plane ABC, plane ACD, and plane BCD name M. Order does not matter: plane CBA is also M.

A, B, and D really do lie in M, but **plane ABD does not uniquely name M**. Their collinearity makes that three-point name insufficient. Do not change this into the false statement “A, B, D cannot be in a plane.” They can be in many planes.

**Coplanar** means contained in one plane. All the points A, B, C, D are coplanar. E is not in that particular plane M. Every set of three points is coplanar, but three collinear points do not determine which plane. Four points may or may not be coplanar.

## 4. Why two points fix a line but three fix a plane

In Euclidean geometry, exactly one line passes through any two distinct points. One point is insufficient: many different straight lines can pass through it. Repeating the same point twice adds no new information.

Three noncollinear points fix exactly one plane. To picture why the noncollinear condition matters, imagine several pages of an open book rotating about their common spine. The spine models a line. Every page-plane contains all points on that spine. Three points on the spine therefore cannot select one page-plane.

Now add a point off the spine. Only one plane through the spine also contains that extra point. This gives another useful rule: **a line and a point not on it determine one plane**. Two distinct intersecting lines determine one plane too: choose two points on one line and a point on the other that is not their intersection.

These pictures explain the conditions. The statements about unique lines and planes are basic geometric rules, not conclusions proved by the apparent accuracy of one drawing.

### Worked example: count without counting names twice

In our configuration, how many different lines do the four points A, B, C, D determine? The six point-pairs are AB, AC, AD, BC, BD, CD. AB, AD, and BD name just one line, g. The others are AC, BC, and CD. There are **four distinct lines**, not six. Counting pairs and counting geometric objects are different tasks.

How many planes do those same four points determine? The noncollinear triples ABC, ACD, BCD all name **one plane**, M. ABD does not select another plane; it fails to select a unique one.

## 5. An intersection contains every shared point

The **intersection** of two objects is the complete set of points belonging to both. Imagine making one list of all points on the first object and another list for the second. Their intersection keeps exactly the points on both lists. It is not necessarily a single point.

We can write “line g ∩ plane M” and read the symbol ∩ as “intersect.” If no points are shared, the intersection is the **empty set**, written ∅. A shared endpoint still counts as an intersection.

If two distinct lines meet at T, their intersection is {T}. They cannot meet at two different points without being the same line: the two points would already determine a unique line. If line AB and line BA are the two names in the question, their intersection is the entire line, because those names describe one object.

### Worked example: finite objects change the answer

With A, B, D in that order, segment AB and segment BD share only B. Segment AD and segment BD share the entire segment BD. Ray AB and ray BA share segment AB: points beyond B are missing from ray BA, and points beyond A are missing from ray AB. Read the object words before deciding what is shared.

## 6. A line can lie in, pierce, or miss a plane

For a line and a plane in three-dimensional space, there are exactly three possibilities.

| Relationship | Complete intersection | What to look for |
| --- | --- | --- |
| The line lies in the plane. | The entire line: infinitely many points. | Two distinct points of the line are known to lie in the plane. |
| The line pierces the plane. | One point. | It crosses the plane and is not contained in it. |
| The line is parallel to and outside the plane. | No points. | It never reaches the plane, even beyond the drawn patch. |

**Why are two shared points enough?** A plane contains the whole line through any two of its distinct points. If P and Q are on line h and in M, then h lies in M. There cannot be exactly two, three, or ten shared points between a whole line and a plane.

One shared point alone does **not** establish piercing. A line lying in M also contains that point. You need the added fact that the line is not contained in M. Similarly, “not contained” alone leaves two possibilities: piercing or parallel outside.

In this chapter, “a line parallel to a plane” means the line is outside it and shares no points with it. This makes the three cases separate. Some later conventions allow a direction parallel to a plane even when a line lies within it; always read the definition in use.

A pencil through a sheet models piercing. A pencil lying along the sheet models containment. In either case, the sheet's physical edge is not the edge of the ideal plane. Do not claim that a line misses a plane merely because it misses the drawn patch.

## 7. Space allows skew lines and intersecting planes

Two **distinct coplanar lines** either intersect once or are parallel. Two distinct lines in three-dimensional space have a third possibility: **skew lines**. They do not intersect and are not in a common plane. Thus “they never meet” alone does not prove that two lines are parallel.

Picture a room. Extend a front floor edge as a whole line. Extend the back-right vertical corner as another whole line. They do not meet, and their directions differ. These model skew lines. Extending the drawn marks does not make them intersect.

| Two whole lines | Shared points | In one plane? |
| --- | --- | --- |
| Distinct intersecting lines | One point | Yes |
| Distinct parallel lines | None | Yes |
| Skew lines | None | No |
| Coincident lines: two names for one line | The whole line | Yes, in many possible planes |

Two **distinct planes** are either parallel with no shared points, or intersect in an entire line. Two coincident planes are the same plane and share all their points. Distinct planes cannot intersect at just one point.

### Worked example: two named points are not the whole intersection

Distinct planes M and N both contain distinct points P and Q. Each plane contains line PQ. Since the planes are distinct and share points, their intersection is **line PQ**. “P and Q” lists two shared points, but misses infinitely many others. A wall meeting a floor models a common line; the finite room corner shows only a piece of it.

## 8. Read statements before trusting a picture

A perspective drawing compresses three-dimensional space onto a flat page. A drawn crossing may represent a true intersection, or one object may lie behind another. Dashes can suggest hidden parts, but the stated relationships control the interpretation.

Do not infer equal lengths, midpoint positions, perpendicularity, parallelism, or coplanarity merely from appearance. Use a stated fact or a conventional mark whose meaning has been supplied. In particular, B being between A and D does not make B the midpoint.

### One complete worked reading

Given our configuration, let line h pass through C and E, where E is outside M. Find the intersection of h and M, and decide whether h meets g.

**Step 1 — collect the facts.** C lies in M, E does not, and h contains both C and E. Therefore h is not contained in M.

**Step 2 — use the line-plane cases.** Since h has point C in common with M and is not contained, its intersection with M is exactly {C}.

**Step 3 — check the second question.** Line g lies wholly in M, but C is off g. If h met g somewhere, that point would be another shared point of h and M. That contradicts step 2. Therefore h and g do not meet. They are skew: if they were in a common plane, that plane would contain g and C, so would be M, forcing E into M.

**Step 4 — say what is unknown.** Nothing states the angle at which h crosses M. Calling it perpendicular would add an unsupported assumption.

## 9. Turn a sentence into a usable sketch

To sketch “A, B, C are collinear in plane R; D is in R but off their line; k pierces R at D,” follow this construction.

1. Draw a slanted patch and label the plane R. It represents an endless flat plane.
2. Draw a straight line with arrowheads through the patch. Place A, B, C on it; no order or equal spacing was specified.
3. Place D elsewhere on the patch, off that line.
4. Draw k passing through D and away from the plane. Use a dashed portion behind the plane if helpful.
5. Read the sentence back against the sketch. Plane ABD is a valid name; ABC alone does not uniquely identify a plane. Line k shares only D with R.

Your sketch need not be artistic. It must preserve the stated relationships. When a statement is impossible, do not force a picture: a whole line cannot share exactly two points with a plane without lying entirely in it.

## 10. Use the model in engineering

A flat inspection surface can be modeled as part of a plane. A straight probe's centreline can be modeled as part of a line. Their intersection helps distinguish a probe running along the surface, crossing it once, or passing above it. A pipe has radius; its centreline does not. A vessel wall may be curved, so one plane is not an exact model of the entire wall.

The habit matters more than the vocabulary: **choose the object, state the assumptions, and identify the full shared set**. Later, a cross-section of equipment uses a cutting plane; line and plane reasoning supports vectors, force diagrams, and three-dimensional coordinates. This lesson does not yet calculate intersection angles or locations numerically.

## Coverage before questions

| You should now be able to explain | Where to return if unsure |
| --- | --- |
| Ideal object versus physical model; dimension | Sections 1 and 2 |
| Segment, line, ray and endpoint order | Section 2 |
| Valid names, collinear and coplanar | Section 3 |
| Unique determination and counting objects | Section 4 |
| Complete intersections, including finite objects | Section 5 |
| All three line-plane cases and insufficient evidence | Section 6 |
| Parallel, skew, coincident; plane-plane intersections | Section 7 |
| Deductions, unknowns and drawing from statements | Sections 8 and 9 |
| What an engineering model includes and leaves out | Section 10 |

A **question fingerprint** is the decision a problem requires. Changing the letters or rotating a diagram does not necessarily create a new type. The twelve types below cover the decisions taught here; they are not a claim to list every possible geometry question. Read each answer's reason even when your result agrees.

## Twelve question fingerprints

1. **Choose the model.** A laser pointer makes a visible spot on a flat screen. Which ideal objects can model the spot location and the screen? What do those models leave out?
2. **Read endpoint order.** P, Q, R are collinear in that order. Are ray PQ and ray PR the same? Are ray QP and ray QR the same?
3. **Name one line in several ways.** Using the main A–B–D configuration, name g with all possible unordered point-pairs. Why is AC not one of them?
4. **Validate a plane name.** Are ABC, ABD, and BCD valid names for plane M? Explain each decision.
5. **Distinguish membership from determination.** Do three collinear points lie in a plane? Do they determine exactly one plane?
6. **Count objects rather than labels.** Four points lie in one plane and no three are collinear. How many different lines and planes do they determine? Compare with the main configuration.
7. **Intersect finite objects.** With P, Q, R in that order, find the intersections of segment PQ with segment QR, and ray PQ with ray QP.
8. **Use the whole-line rule.** Line k contains two distinct points in plane N. Could it contain a third point outside N? Explain.
9. **Recognise missing information.** You know only that line k contains point T in plane N. List the possible intersections of k with N. What extra fact would establish piercing?
10. **Find a counterexample.** Is “two lines that do not intersect are parallel” always true in three dimensions? What added condition makes it true for distinct lines?
11. **Find the complete plane intersection.** Distinct planes R and S contain distinct points U and V. State their intersection. Could distinct planes meet at only U?
12. **Draw and audit a configuration.** Sketch the statement in section 9. Give one valid three-point name for R, state k ∩ R, and identify one fact that the drawing does not establish.

## Answers with reasons

Open one explanation at a time. These are reasoning checks, not a mastery score.

:::answer 1. Model and limitations
The spot location is modeled by a point; the flat screen by part of a plane. A point omits the spot's visible area. A plane omits the screen's thickness and finite edges. If the screen is curved, a single plane is not an exact model of its whole surface.
:::

:::answer 2. Rays and order
Ray PQ equals ray PR because both start at P and continue in the same direction. Ray QP and ray QR are opposite rays: their common endpoint is Q, but they point in opposite directions. They share only Q and together form the whole line.
:::

:::answer 3. Multiple line names
AB, AD, and BD are the three unordered pairs. Reversed names also work but add no new line. AC does not name g because C is off g. The letters must refer to points on the object being named.
:::

:::answer 4. Plane names
ABC and BCD work: each includes C off line g and two distinct points on g. ABD fails to select one plane because all three points are collinear. Its failure as a unique name does not mean that A, B, D are outside M.
:::

:::answer 5. Existence and uniqueness
Yes, the three collinear points are coplanar. No, they do not determine a unique plane. Infinitely many planes can contain their common line, like page-planes through a book spine. Membership and unique determination answer different questions.
:::

:::answer 6. Counting without duplicates
The four points determine six lines: every pair gives a different line because no three are collinear. They determine one plane because all four were stated to be coplanar. In the main configuration there are only four lines, because AB, AD, and BD coincide; the number of determined planes is still one.
:::

:::answer 7. Shared subsets
Segment PQ and segment QR intersect at {Q}. Ray PQ and ray QP intersect in segment PQ, including both endpoints. Do not use the whole-line intersection rule for rays or segments: their extent changes the shared set.
:::

:::answer 8. Two points force containment
No. A plane contains the full line through any two of its distinct points. Therefore every point of k lies in N. A statement adding a point of k outside N would contradict the given facts.
:::

:::answer 9. What one point does and does not tell you
The intersection can be {T} or all of line k. It cannot be empty, since T is already shared. An extra fact such as “k contains a point outside N” establishes that k pierces N at T.
:::

:::answer 10. A counterexample in space
False in general: skew lines do not intersect but are not parallel. Add that the distinct lines are coplanar. Then nonintersection implies parallelism. This is why removing a condition from a familiar rule can make it false.
:::

:::answer 11. Planes share a line
The intersection is the entire line UV. Both planes contain that line, and their being distinct rules out sharing a whole plane. Distinct planes cannot intersect at just one point. Two named common points are evidence for the whole shared line, not the complete answer themselves.
:::

:::answer 12. Sketch with justified claims
Plane ABD or ACD names R because D is off the line containing A, B, C. The intersection k ∩ R is {D}. Neither a right angle at D nor equal spacing between A, B, C was given. Your sketch should not be used as proof of either. If it shows one accidentally, label it “not to scale” and rely on the original statement.
:::

## Explain it tomorrow

Without looking back, explain why “three points determine a plane” needs a condition, and why two planes sharing A and B share more than just A and B. Then invent one line-plane description with no shared points, one with one shared point, and one with infinitely many. If your explanation stalls, revisit that section before adding more exercises.

**Next connection:** [The coordinate plane](GE-01-coordinate-plane.md) places points and lines in a numerical frame. Keep the present lesson's vocabulary: a drawn grid still represents only part of an endless plane.
