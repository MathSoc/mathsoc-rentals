import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Automatically authorize all requests in development
    // authorized: ({ token }) => process.env.DISABLE_AUTH === "true" || !!token,
  },
});

export const config = {
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico|img).*)"],
};
