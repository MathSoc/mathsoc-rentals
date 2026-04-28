"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Backdrop } from "../components/backdrop/backdrop";
import { Button } from "../components/button/button.client";
import "./login.scss";

export default function AuthDebug() {
  const { data: session } = useSession();

  // can't sign in if signed in already
  if (session) {
    redirect("/");
  }

  return (
    <main id="login-page">
      <Backdrop className="sign-in-container">
        <div className="logo-container">
          <Image
            src="/img/icons/vertical-logo.svg"
            alt=""
            fill
            className="logo"
            style={{ objectFit: "contain" }}
          />
        </div>
        <Button onClick={() => signIn("google")}>sign in</Button>
      </Backdrop>
    </main>
  );
}
