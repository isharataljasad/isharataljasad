# HUMAN DEVICE-TEST SCRIPT — run AFTER deploying to the preview URL
Four devices minimum: Chrome desktop, Edge desktop, Android Chrome, iPhone Safari.
One tester per device. ~12 minutes each. Record PASS / FAIL / NOTE for every line.
A FAIL on any line marked [BLOCKER] stops promotion to production.

TESTER ______________  DEVICE/OS/BROWSER ______________  DATE ______________

## A · Typography and the ayah                                      [BLOCKER: A1]
A1  The ayah renders in a Quranic naskh face with tashkil correctly placed —
    NOT the phone's default sans. Compare against the reference screenshot.
A2  No visible font swap flash on a hard reload (Ctrl/Cmd+Shift+R).
A3  Tadabbur text is comfortable at arm's length without zooming.
A4  Nothing is clipped at the widest ayah (open card 4 of H01).

## B · Layout and RTL
B1  Text flows right-to-left everywhere; no stray Latin-first alignment.
B2  Rotate to landscape: nothing overlaps the notch or the home indicator.
B3  Pinch-zoom to 200%: no horizontal scrolling of the page body.
B4  iOS only: scroll down then up — the sticky header does not jump or leave a gap.

## C · Writing and autosave                                          [BLOCKER: C3]
C1  Type an observation. Wait 1s. The line "محفوظ في هذا الجهاز" appears.
C2  Press "البطاقة التالية" mid-sentence WITHOUT saving, then come back.
    → the text is still there.
C3  Type ~15 words, then kill the browser/app from the task switcher (do NOT close
    the tab politely). Reopen. → the text is still there.
C4  Edit a saved observation. Save. Menu → "تصدير نسخة من سجلي".
    → the JSON contains BOTH an OBSERVATION_CREATED with the old text and an
      OBSERVATION_REVISED with the new one.
C5  Type continuously for 30s on the Android device. → no stutter or dropped keys.

## D · Progressive disclosure and the bridge
D1  On a fresh card, before typing: no category chips are visible anywhere.
D2  After the first character: chips appear.
D3  Select two chips. → both stay selected.
D4  Select "غير متأكد". → the other chips clear.
D5  The bridge question appears only after an observation exists.
D6  Answer "بقي في القراءة". → "انتهى اللقاء. هذا لقاء كامل." No further prompt,
    no dimming, nothing that reads as a wrong answer.
D7  Answer "مسّ شيئًا" → write a direction → the tools panel appears and is
    VISUALLY DISTINCT from the ayah panel (dashed frame, different background).
D8  Choose "لستُ متأكدًا أني أريد هذا". → NO plan fields appear.

## E · Keyboard (desktop only)                                       [BLOCKER: E1,E4]
E1  Tab from the top: the skip link appears first and works.
E2  Every focused control has a clearly visible outline — including chips
    and the buttons inside the dark ayah panel.
E3  Tab order follows reading order; focus never lands on something off-screen.
E4  Press a category chip with the keyboard. → focus stays on that chip after
    the page updates; it does not jump to the top.
E5  Open "تحتاج مساعدة الآن؟" with the keyboard. Tab. → focus stays inside the
    dialog. Press Esc. → it closes and focus returns to the button that opened it.

## F · Mobile drawer                                                 [BLOCKER: F2]
F1  Tap ☰. → the menu slides in and the first item receives focus.
F2  With the menu CLOSED, swipe through with a screen reader (or Tab on a
    connected keyboard). → the menu items are NOT reachable.
F3  Press Esc / back-swipe with the menu open. → it closes.
F4  Rotate to a wide layout with the menu open. → no ghost drawer remains.

## G · Offline and recovery
G1  Load once online. Enable airplane mode. Reload.
    → cards still render and "نسخة محفوظة على جهازك" appears.
G2  Airplane mode from a cold start (never loaded before) → the browser's own
    offline page. EXPECTED: there is no service worker. Record, do not fix.
G3  Turn network back on, reload. → normal load, no duplicate data.

## H · Screen reader (one device is enough — VoiceOver or TalkBack)
H1  The ayah panel is announced with its surah and ayah reference.
H2  Every text box announces its own label ("ملاحظتي", "متى؟", …).
H3  Chips announce a pressed/unpressed state.
H4  After saving, the status line is announced once — not repeatedly while typing.
H5  The safety dialog announces its title on open.

## I · Reduced motion and dark mode
I1  Enable "Reduce Motion" in the OS. → no smooth scrolling; nothing animates.
I2  Switch the OS to dark mode. → all text remains readable; specifically check
    the tools panel, the privacy note, and the menu items.

## J · Safety surface                                                [BLOCKER: J1]
J1  "تحتاج مساعدة الآن؟" is reachable from every screen.
J2  Both phone numbers dial correctly from the phone.
J3  It NEVER appears on its own — write distressing words in an observation and
    confirm nothing is triggered, scanned, or surfaced.

## K · Boundary spot-check (do this last, deliberately)
K1  Anywhere in the product, is there a score, percentage, streak, badge,
    day-count, or progress bar? → there must be none.
K2  In the "عدتُ بعد تعثر" flow, is there any word of religious judgement
    (ذنب / توبة / تقصير / فشل)? → there must be none.
K3  Does anything anywhere claim the app heals, treats, or diagnoses? → no.
