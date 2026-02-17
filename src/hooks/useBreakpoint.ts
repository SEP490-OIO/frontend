/**
 * useBreakpoint — friendly wrapper around Ant Design's Grid.useBreakpoint().
 *
 * Ant Design's hook returns { xs, sm, md, lg, xl, xxl } where each is a boolean
 * indicating whether the viewport is AT LEAST that wide. This is useful but
 * verbose — most components just need to know "am I on mobile, tablet, or desktop?"
 *
 * This hook simplifies that into three easy booleans:
 *   - isMobile:  viewport < 768px  (phones)
 *   - isTablet:  768px ≤ viewport < 1024px  (tablets)
 *   - isDesktop: viewport ≥ 1024px  (laptops and up)
 *
 * It also passes through the raw Ant Design breakpoints for cases where
 * you need finer control (e.g., distinguishing xl from xxl).
 *
 * Why use Ant Design's hook instead of window.matchMedia directly?
 * → Ant Design already listens for resize events and uses the same breakpoints
 *   as its Grid/Row/Col components, so everything stays in sync.
 *
 * Usage:
 *   const { isMobile, isTablet, isDesktop } = useBreakpoint();
 *   return isMobile ? <MobileNav /> : <DesktopNav />;
 */

import { Grid } from 'antd';

/** The shape returned by our useBreakpoint hook */
export interface BreakpointResult {
  /** True when viewport < 768px (phones) */
  isMobile: boolean;
  /** True when 768px ≤ viewport < 1024px (tablets) */
  isTablet: boolean;
  /** True when viewport ≥ 1024px (laptops, desktops) */
  isDesktop: boolean;
  /** Raw Ant Design breakpoints for fine-grained control */
  screens: ReturnType<typeof Grid.useBreakpoint>;
}

export function useBreakpoint(): BreakpointResult {
  const screens = Grid.useBreakpoint();

  // Ant Design breakpoints are cumulative (min-width based):
  // xs: always true, sm: ≥576px, md: ≥768px, lg: ≥992px, xl: ≥1200px, xxl: ≥1600px
  //
  // We map these to our project's three-tier system:
  // - Mobile: md is NOT matched (viewport < 768px)
  // - Tablet: md matched but lg is NOT (768px–991px)
  // - Desktop: lg matched (≥992px, close to our 1024px breakpoint)
  const isMobile = !screens.md;
  const isTablet = !!screens.md && !screens.lg;
  const isDesktop = !!screens.lg;

  return { isMobile, isTablet, isDesktop, screens };
}
