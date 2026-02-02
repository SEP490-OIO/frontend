/**
 * Responsive breakpoints for the Bid System.
 * Use these values in media queries for consistent responsive behaviour.
 * Mobile-first: design for mobile first, then enhance for larger screens.
 */
export const breakpoints = {
  /** 640px - Large phones, small tablets */
  sm: 640,
  /** 768px - Tablets */
  md: 768,
  /** 1024px - Laptops */
  lg: 1024,
  /** 1280px - Desktops */
  xl: 1280,
  /** 1536px - Large desktops */
  '2xl': 1536,
} as const

/**
 * Media query strings for use in CSS-in-JS or style objects.
 * Example: @media (min-width: ${breakpointsPx.md}px)
 */
export const breakpointsPx = {
  sm: `${breakpoints.sm}px`,
  md: `${breakpoints.md}px`,
  lg: `${breakpoints.lg}px`,
  xl: `${breakpoints.xl}px`,
  '2xl': `${breakpoints['2xl']}px`,
} as const
