# Programme expansion verification · 19 September 2026

## What was tested

- All 17 repository test scripts passed. This includes the 42 password-gate checks, existing course collections, the 297-record Foundation inventory, and the new programme tests.
- Registry: 50 unique course records, 46 required courses, four elective choices, eight semester credit totals and 128 reference-plan credits. New build validation rejects duplicate IDs, unknown semesters, unsupported availability and missing source evidence.
- Every generated programme page has one primary heading, valid local destinations and no inline script or event handler that conflicts with the site's policy.
- All 26 current science topic pages put their explanation before the preserved diagnostic and transfer questions.
- Material balance calculations: constant solute flow under dilution, endpoint water flows, unequal streams, invalid fractions, zero total flow, and percentage versus fraction feedback.
- Functions: repeated outputs, conflicting inputs, identical repeated pairs, and zero/one/two intersections with a circle.

## Browser walkthrough on local preview

- Programme search `CE 205` returned one matching course. The course opened correctly and saved to the browser study list; it appeared on returning to the programme map.
- A nonexistent query showed a useful empty state. Jumping to Semester 7 cleared the conflicting search and showed its four required courses plus the note about two elective slots.
- On a phone-sized viewport, course and mixer pages had no horizontal page overflow. The initial functions graph labels were too small; the graphs were changed to stack on narrow screens and visually rechecked.
- Mixer slider at 100 kg/h water showed 200 kg/h total, 20 kg/h solute and 10% concentration. Answer 7.5 received the unequal-flow correction; answer 8 received the correct total and component balance explanation.
- Functions feedback identified the repeated-output misconception. The correct reason revealed a changed case. The graph slider's two endpoints reported one circle intersection at that input while explaining why the circle still fails globally.
- No browser warnings or errors were captured on the checked programme and mixer views.

## Limits

This is an agent walkthrough with calculation and interface checks. It is not a real-student learning experiment, a formal accessibility certification, a complete security audit, or a proof that the whole curriculum has been written. The fresh production browser session was password gated before deployment; production status is checked separately. College PDFs were read from the previously saved local copies because current remote downloads were unavailable.
