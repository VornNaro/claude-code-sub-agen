import Link from "next/link";

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Authentication is not configured yet.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-primary underline"
        >
          Go back home
        </Link>
      </div>
    );
  }

  // Dynamic import so Clerk is only loaded when keys exist
  const { SignIn } = require("@clerk/nextjs");
  return <SignIn />;
}
