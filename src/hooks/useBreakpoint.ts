/**
 * useBreakpoint — friendly wrapper around Ant Design's Grid.useBreakpoint().
 *
 * Ant Design's hook returns { xs, sm, md, lg, xl, xxl } where each is a boolean
 * indicating whether the viewport is AT LEAST that wide. This is useful but
 * verbose — most components just need to know "am I on mobile or desktop?"
 *
 * This hook simplifies that into a two-tier system:
 *   - isMobile:  viewport < 1200px  (phones + tablets)
 *   - isDesktop: viewport ≥ 1200px  (laptops and up)
 *
 * The 1200px threshold (Ant Design's `xl` breakpoint) was chosen because:
 * - All Edge DevTools tablet devices (iPad Mini 768px through iPad Pro 1024px)
 *   fall below 1200px and get the mobile experience
 * - The smallest common laptop resolution (1366x768) is above 1200px
 * - With the sidebar (240px), desktop content area is ≥960px — enough for tables
 *
 * It also passes through the raw Ant Design breakpoints for cases where
 * you need finer control (e.g., distinguishing xl from xxl).
 *
 * Why use Ant Design's hook instead of window.matchMedia directly?
 * → Ant Design already listens for resize events and uses the same breakpoints
 *   as its Grid/Row/Col components, so everything stays in sync.
 *
 * Usage:
 *   const { isMobile, isDesktop } = useBreakpoint();
 *   return isMobile ? <MobileNav /> : <DesktopNav />;
 */

import { Grid } from 'antd';

/** The shape returned by our useBreakpoint hook */
export interface BreakpointResult {
  /** True when viewport < 1200px (phones + tablets) */
  isMobile: boolean;
  /** True when viewport ≥ 1200px (laptops, desktops) */
  isDesktop: boolean;
  /** Raw Ant Design breakpoints for fine-grained control */
  screens: ReturnType<typeof Grid.useBreakpoint>;
}

export function useBreakpoint(): BreakpointResult {
  const screens = Grid.useBreakpoint();

  // Ant Design breakpoints are cumulative (min-width based):
  // xs: always true, sm: ≥576px, md: ≥768px, lg: ≥992px, xl: ≥1200px, xxl: ≥1600px
  //
  // Two-tier system at xl (1200px):
  // - Mobile: xl is NOT matched (viewport < 1200px) — phones + all tablets
  // - Desktop: xl matched (≥1200px) — laptops + monitors
  const isMobile = !screens.xl;
  const isDesktop = !!screens.xl;

  return { isMobile, isDesktop, screens };
}
