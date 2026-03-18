import "./globals.css";

export const metadata = { title: "Fantasy Baseball AI Draft Assistant", description: "Built from uploaded cheat sheet" };

export default function RootLayout({ children }: { children: React.ReactNode }) { return (<html lang="en"><body>{children}</body></html>); }
