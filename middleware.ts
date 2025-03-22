import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/",
  "/home",
]);

const isPublicApiRoute = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware(async (auth, req) => {
  const authData = await auth();

  // In which url the user is currently present
  const currentURL = new URL(req.url);
  const isAccessingDashboard = currentURL.pathname === "/home";
  const isApiRequest = currentURL.pathname.startsWith("/api");

  // if user is logged in and accessing a public route, but not the dashboard, then redirect it to the dashboard
  if (authData.userId && isPublicRoute(req) && !isAccessingDashboard) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Not logged in
  if (!authData.userId) {
    // Trying to access the protected route, redirect to signin page
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("sign-in", req.url));
    }

    // trying to access protected API route, redirect to signin page
    if (isApiRequest && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("sign-in", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
