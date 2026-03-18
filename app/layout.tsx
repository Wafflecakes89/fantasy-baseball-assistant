import "./globals.css";

export const metadata = {
  title: "Fantasy Baseball AI Draft Assistant",
  description: "Draft helper for Yahoo categories leagues",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
