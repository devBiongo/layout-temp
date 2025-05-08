/**
 * Check if a route is dynamic.
 *
 * @param route - The route to check.
 * @param strict - Whether to use strict mode which prohibits segments with prefixes/suffixes (default: true).
 * @returns Whether the route is dynamic.
 */
export function isDynamicRoute(route: string, strict: boolean = true): boolean {
  route = ensureLeadingSlash(route)

  // Identify /.*[param].*/ in route string
  const TEST_ROUTE = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/

  // Identify /[param]/ in route string
  const TEST_STRICT_ROUTE = /\/\[[^/]+\](?=\/|$)/

  if (strict) {
    return TEST_STRICT_ROUTE.test(route)
  }

  return TEST_ROUTE.test(route)
}

function removeExtension(filePath: string): string {
  return filePath.replace(/\.[^/.]+$/, '');
}

function ensureLeadingSlash(path: string) {
  return path.startsWith('/') ? path : `/${path}`
}

export function isGroupSegment(segment: string) {
  // Use array[0] for performant purpose
  return segment[0] === '(' && segment.endsWith(')')
}

/**
 * Normalizes an app route so it represents the actual request path. Essentially
 * performing the following transformations:
 *
 * - `/(dashboard)/user/[id]/page` to `/user/[id]`
 * - `/(dashboard)/account/page` to `/account`
 * - `/user/[id]/page` to `/user/[id]`
 * - `/account/page` to `/account`
 * - `/page` to `/`
 * - `/(dashboard)/user/[id]/route` to `/user/[id]`
 * - `/(dashboard)/account/route` to `/account`
 * - `/user/[id]/route` to `/user/[id]`
 * - `/account/route` to `/account`
 * - `/route` to `/`
 * - `/` to `/`
 *
 * @param route the app route to normalize
 * @returns the normalized pathname
 */
export function normalizeAppPath(route: string) {
  return ensureLeadingSlash(
    route.split('/').reduce((pathname, segment, index, segments) => {
      // Empty segments are ignored.
      if (!segment) {
        return pathname
      }

      // Groups are ignored.
      if (isGroupSegment(segment)) {
        return pathname
      }

      if (isDynamicRoute(ensureLeadingSlash(segment))) {
        return `${pathname}/${segment.replace(/\[(\w+)\]/g, ":$1")}`
      }

      // The last segment (if it's a leaf) should be ignored.
      if (index === segments.length - 1 && removeExtension(segment) === 'page') {
        return pathname
      }

      return `${pathname}/${segment}`
    }, '')
  )
}

// function addMethod(object,name,fn){
//   const old = object[name]
//   object[name] = function (...args){
//     if(args.length===fn.length){
//       return fn.applu(this.args)
//     }else if(typeof old==="function"){
//       return old.apply(this,args)
//     }
//   }
// }