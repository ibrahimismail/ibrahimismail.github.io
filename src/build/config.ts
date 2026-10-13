/**
 * The master switch for the build sequence (REDESIGN-PLAN.md §5 act 0).
 *
 * The inline head script reads it: while it is false, `html.js-build` is never set, the reveal
 * styles never bite, and the overlay never renders — the site is simply the document. Nothing
 * else needs changing to turn the show off, which matters because the reveal styles leave every
 * section at opacity 0 if they are ever armed without a driver to undo them.
 */
export const BUILD_SEQUENCE_ENABLED = true;
