import "./globals.css";
import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
   metadataBase: new URL("https://gjusmartconnect.online"),

  title: {
    default: "GJU Smart Connect - Student & Teacher Portal",
    template: "%s | GJU Smart Connect",
  },

  description:
    "GJU Smart Connect is a modern academic platform for Guru Jambheshwar University students and teachers. Access attendance, assignments, marks, announcements, timetable, results, academic calendar and university resources in one secure platform.",

  applicationName: "GJU Smart Connect",

  manifest: "/manifest.webmanifest",

  keywords: [
    "GJU Smart Connect",
    "Guru Jambheshwar University",
    "Guru Jambheshwar University of Science and Technology",
    "GJUST",
    "GJU",
    "GJU Hisar",
    "GJUST Hisar",
    "GJU Student Portal",
    "GJU Teacher Portal",
    "GJU Login",
    "GJU Online",
    "GJU Admission",
    "GJU Registration",
    "GJU Re Registration",
    "GJU Re Form",
    "GJU Exam Form",
    "GJU Results",
    "GJU Result",
    "GJU Time Table",
    "GJU Date Sheet",
    "GJU Academic Calendar",
    "GJU Syllabus",
    "GJU Notifications",
    "Attendance Management",
    "Assignment Portal",
    "University Management System",
    "Academic Dashboard",
    "Student Portal",
    "Teacher Portal",
    "Education Platform",
  ],

  authors: [
    {
      name: "Manish Kushwaha",
    },
  ],

  creator: "Manish Kushwaha",

  publisher: "GJU Smart Connect",

  category: "Education",

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gjusmartconnect.online",
    siteName: "GJU Smart Connect",
    title: "GJU Smart Connect",
    description:
      "Student & Teacher Academic Portal for Guru Jambheshwar University.",

    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "GJU Smart Connect",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "GJU Smart Connect",
    description:
      "Student & Teacher Academic Portal for Guru Jambheshwar University.",
    images: ["/icon.png"],
    creator: "@gjusmartconnect",
  },

  alternates: {
    canonical: "https://gjusmartconnect.online",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playfair.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}