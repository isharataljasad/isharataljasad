# Lesson feedback: how it works, how to set it up, how to read it

Every lesson ends with a collapsed, optional block, “Share feedback on this lesson”.
A learner chooses a category and writes a comment of up to 1000 characters, in
English or Arabic. The lesson and subject are filled in automatically, and the
part of the lesson is optional. There are no name, email or phone fields, and the
form asks learners not to include personal information. Nothing is marked, and
reading never depends on the form.

The page posts to the same-origin endpoint `/api/feedback` (`api/feedback.js`). It
says “received” only after the storage service confirms the record was written.
On any failure it says the comment was **not** sent and leaves the text in the
box. Hosting providers keep operational request logs, so do not promise complete
anonymity.

## What is stored

One key per comment: `feedback:<environment>:<id>`. `<environment>` is `production`,
`preview` or `development`, taken from Vercel's `VERCEL_ENV`, so preview tests never
mix with real comments. The value is JSON:

```json
{"id":"mg4x…","receivedAt":"2026-09-28T10:00:00.000Z","subject":"physics","lesson":"motion","section":"examples","category":"Possible error","comment":"…"}
```

No IP address, cookie, user agent or account is stored. Short-lived helper keys
also exist and expire by themselves:

- `…:rate:<minute>`, which caps comments at 30 a minute for the whole site;
- `…:recent:v2:<hash>`, a 10-minute reservation for the complete submission
  (subject, lesson, section, category and comment). It carries the proposed record
  and id so a retry can finish an interrupted write. A reservation alone never
  counts as received: success requires an acknowledged durable record write or
  a read-back of that exact record. Changing section or category is a new submission.

There is no endpoint that lists or reads feedback. `GET /api/feedback` returns 405.

## Storage status

Connected on 28 September 2026 by the owner: Upstash for Redis database
`bayt-alfuad-feedback` (Free plan, eviction disabled, region iad1), created through
Vercel and connected to the **isharataljasad** project for both Preview and
Production (prefix `KV`, so `KV_REST_API_URL` / `KV_REST_API_TOKEN`, marked
Sensitive). Records stay apart by key prefix: `feedback:preview:` and
`feedback:production:`.

Owner-observed evidence: after a fresh preview redeploy of `f718b1b`, a marked test
note sent from English → *Build a complete sentence* showed “Thank you. Your
feedback was received.” The durable record `feedback:preview:mukh04b0-4da67561`
(subject `english`, lesson `build-a-complete-sentence`, category `Other`, no TTL)
was then read back in the Upstash Data Browser. Production persistence is
checked separately after release.

If the database is ever disconnected, the endpoint answers “Feedback storage is
not set up yet”, and the form says the comment was not sent. To reconnect, add
Upstash for Redis to the project again under **Storage**, connect it to Preview and
Production, and redeploy; a deployment built before the variables existed does not
have them. Never paste the token into the repository, a chat or a handoff file.

## Reading and deleting feedback (owner only)

Use the Upstash console. It is behind your Upstash or Vercel login, and learners
have no access to it.

1. Vercel dashboard → project → **Storage** → the Redis database → **Open in
   Upstash**. Or go to console.upstash.com directly.
2. Open **Data Browser** and search for `feedback:production:*`. Skip helper keys
   containing `:rate:` or `:recent:`; these are counters/reservations, not confirmed
   submissions. Open the remaining record keys to read the JSON. Use `receivedAt`
   inside each record for its receipt time.
3. To remove a comment, delete its key there. To export, copy the values, or use the
   console's CLI tab with `KEYS feedback:production:*` and `GET <key>`.

## Verifying after setup

Send one clearly marked note from a lesson, find its exact key in the Data Browser
(`feedback:preview:<id>` or `feedback:production:<id>`), then delete only that key.
Never flush the database or delete a whole namespace.
`node test/browser.mjs` runs the same flow locally against an in-memory stand-in
for the storage API. That stand-in is a test double, not a destination.
