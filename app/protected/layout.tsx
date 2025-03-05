'use client';
import { SessionProvider } from "next-auth/react";
import Protected from "../auth/Protected";

export default function ProtectedLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {    
    return (
      <SessionProvider>
        <Protected>
          {children}
        </Protected>
      </SessionProvider>
    );
  }
  