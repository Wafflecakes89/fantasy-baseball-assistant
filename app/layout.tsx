
import "./globals.css";
import React from "react";

export const metadata = {
  title: "Fantasy Baseball AI Draft Assistant",
  description: "Built from your cheat sheet and expanded to 350 players.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}