/* Imported first by every earlier builder. Those builders wrote the old mixed
 * dashboard, planner and quiz pages over the paths that now hold the focused
 * Semester 1 library. They are kept as preserved source, but they refuse to run
 * unless explicitly allowed, so a routine rebuild cannot restore the old interface.
 * The student pages are built only by tools/build-study.mjs (npm run build:study). */
if (process.env.ALLOW_LEGACY_BUILD !== '1') {
  console.error('This is a preserved legacy builder. It would overwrite the Semester 1 study library.\nUse `npm run build:study`. (Set ALLOW_LEGACY_BUILD=1 only to regenerate archived material in a separate checkout.)');
  process.exit(1);
}
