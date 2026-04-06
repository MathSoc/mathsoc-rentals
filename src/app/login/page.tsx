"use client";

import { redirect } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import "./login.scss";
import { Button } from "../components/button/button.client";
import Image from "next/image";

export default function AuthDebug() {
  const { data: session } = useSession();

  // can't sign in if signed in already
  if (session) {
    redirect("/");
  }

  return (
    <main>
      <div className="sign-in-container">
        <div style={{ width: "300px" }}>
          <Image
            src="/img/icons/vertical-logo.svg"
            alt=""
            fill
            className="logo"
            style={{ objectFit: "contain" }}
          />
        </div>
        <Button onClick={() => signIn("google")} variant="pink">
          sign in
        </Button>
      </div>
    </main>
  );
}
