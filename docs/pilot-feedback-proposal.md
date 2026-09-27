# Pilot feedback: proposal (not implemented)

**Status: no feedback feature is included in this candidate.** Nothing in the
repository or in the Vercel configuration that can be inspected from here
provides a place where feedback could be received:

- no API route or serverless function other than the access gate (`middleware.js`);
- no database, form service, storage bucket or mailbox configured in the
  repository or the environment;
- the site's CSP allows network requests only to its own origin
  (`connect-src 'self'`) and forms to post only to its own origin
  (`form-action 'self'`).

A feedback control that shows "Thank you, sent" without a verified destination
would mislead students, so none was added. There is also no analytics, and
this candidate adds none.

## Proposed flow once a destination exists

1. At the end of each lesson, a collapsed, optional block: "Something unclear or
   wrong in this lesson? (optional)". It is never required, never scored and
   never blocks reading.
2. Fields: the lesson and section (filled in from the page, editable), a
   category (unclear explanation · possible error · missing topic · other) and a
   comment (plain text, up to about 1000 characters). No name, email or other
   contact field. A short note says not to include personal information.
3. On submit, the page posts to a same-origin endpoint (for example
   `/api/feedback`, a Vercel function behind the same password gate). The
   message "Received" is shown only after that endpoint returns success; on any
   failure the page says the comment was not sent and keeps the text so it can
   be copied.
4. The endpoint stores the record (lesson, section, category, comment, time) and
   nothing else: no IP address, cookie value or user agent. Submissions are
   never published on the site.

## Configuration that is missing

Someone with access to the Vercel project must choose and set up one of these,
then add its credentials as project environment variables (not in the
repository):

- a storage service the project can write to (for example a Vercel-integrated
  database or key–value store), or
- an existing mailbox or ticket system with an API, chosen by the owner.

After that, the endpoint, the page block, and tests are needed that prove a
submission is stored and that a failure is reported honestly. Until then, the
safest channel is the one the pilot group already uses to reach the owner.
