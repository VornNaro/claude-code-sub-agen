import Link from "next/link";

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Sign Up</h1>
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

  const { SignUp } = require("@clerk/nextjs");
  return <SignUp />;
}
