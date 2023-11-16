import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const [userDataResponse, rolesDataResponse] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('roles').select('*').single(),
  ]);

  const {
    data: { user },
  } = userDataResponse;

  const isLoggedIn = !!user;
  const currentPath = req.nextUrl.pathname;

  const defaultPath = '/';

  const { data: { role } } = rolesDataResponse;

  const redirectToRole = role.toLowerCase() === 'cliente' ? 'freelancer' : 'cliente';
  const dashboardPath = `/dashboard/${role.toLowerCase()}`;

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL(defaultPath, req.url));
  }

  if (currentPath.startsWith(`/dashboard/${redirectToRole}`)) {
    return NextResponse.redirect(new URL(dashboardPath, req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/cliente/:path*", "/dashboard/freelancer/:path*"],
};
