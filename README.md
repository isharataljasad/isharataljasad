# Science project platform

The domain owner authorized replacing the retired Quran application on 14 September 2026; that project has moved elsewhere. The original commit is 0442e18b2ea4f7eb74293e1f3dcfa7ce8d34670f and a full Git bundle was saved outside this checkout before changes.

Three independent tracks: Cengage/Pearson books, Educator, Pearson+. No content merge. Initial state records audit limits and pending student/parent acceptance. Pearson inventory is metadata and publisher links, not hosted video or textbook copies.

Existing server-side access gate is preserved, including existing environment variable names and cookie format, to preserve private access. Old user browser storage is not read or deleted. New project state uses science-project-v1. Browser state is device-local, not cloud-synchronized or connected automatically to AI conversations. JSON export/import transfers state; Markdown export is an agent handoff. IndexedDB attachments are local and excluded from JSON exports. Original attachments must be kept separately.

Static site, no build. npm ci; npm test. Vercel middleware enforces the gate. Deploy the existing Git-connected project; do not touch masarcare-health or the current Bayt Al Fuad site.
