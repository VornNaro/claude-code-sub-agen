"use client";

import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function ClerkActions() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline" size="sm" className="ml-2">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="ml-2">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </>
  );
}
