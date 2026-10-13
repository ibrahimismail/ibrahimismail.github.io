/**
 * The build sequence (REDESIGN-PLAN.md §5 act 0) is phase 3. Until its driver exists there is
 * nothing to add `.built` to the sections, so arming the reveal styles would leave every one of
 * them at opacity 0 — a blank page for anyone with JavaScript on.
 *
 * The inline head script reads this: while it is false, `html.js-build` is never set and the
 * reveal styles never bite. Flip it in phase 3, with the driver.
 */
export const BUILD_SEQUENCE_ENABLED = false;
