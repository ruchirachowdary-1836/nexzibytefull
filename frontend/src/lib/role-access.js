export function roleHomePath(role) {
  if (role === "admin") return "/admin";
  if (role === "staff") return "/staff/dashboard";
  if (role === "user") return "/dashboard";
  return "/login";
}

export function roleCanAccess(role, allowedRoles) {
  return typeof role === "string" && allowedRoles.includes(role);
}

export function roleRouteRedirect(role, allowedRoles) {
  return roleCanAccess(role, allowedRoles) ? null : roleHomePath(role);
}
