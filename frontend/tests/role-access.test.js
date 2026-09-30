import test from "node:test";
import assert from "node:assert/strict";
import { roleCanAccess, roleHomePath, roleRouteRedirect } from "../src/lib/role-access.js";

test("each role has its designated landing route", () => {
  assert.equal(roleHomePath("admin"), "/admin");
  assert.equal(roleHomePath("staff"), "/staff/dashboard");
  assert.equal(roleHomePath("user"), "/dashboard");
  assert.equal(roleHomePath(undefined), "/login");
});

test("dashboard route roles are isolated with admin inheriting staff access", () => {
  const userDashboard = ["user"];
  const staffDashboard = ["staff", "admin"];
  const adminDashboard = ["admin"];

  assert.equal(roleCanAccess("user", userDashboard), true);
  assert.equal(roleCanAccess("staff", userDashboard), false);
  assert.equal(roleCanAccess("admin", userDashboard), false);
  assert.equal(roleCanAccess("user", staffDashboard), false);
  assert.equal(roleCanAccess("staff", staffDashboard), true);
  assert.equal(roleCanAccess("admin", staffDashboard), true);
  assert.equal(roleCanAccess("user", adminDashboard), false);
  assert.equal(roleCanAccess("staff", adminDashboard), false);
  assert.equal(roleCanAccess("admin", adminDashboard), true);
});

test("bookmarked role dashboard routes redirect before protected content renders", () => {
  assert.equal(roleRouteRedirect("user", ["admin"]), "/dashboard");
  assert.equal(roleRouteRedirect("staff", ["admin"]), "/staff/dashboard");
  assert.equal(roleRouteRedirect("admin", ["user"]), "/admin");
  assert.equal(roleRouteRedirect("admin", ["staff", "admin"]), null);
});
