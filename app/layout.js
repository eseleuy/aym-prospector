import "./globals.css";

export const metadata = {
  title: "AyM Prospector",
  description: "Herramienta comercial de AyM Comunicacion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-950 text-white min-h-screen">{children}</body>
    </html>
  );
}
