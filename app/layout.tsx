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
  title: {
    default: "GJU Smart Connect - Student & Teacher Portal",
    template: "%s | GJU Smart Connect",
  },

  description:
    "GJU Smart Connect is a modern academic platform for Guru Jambheshwar University students and teachers. Access attendance, assignments, marks, announcements, timetable, results, academic calendar and university resources in one secure platform.",

  applicationName: "GJU Smart Connect",

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

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },

  metadataBase: new URL("https://gjusmartconnect.online"),

  openGraph: {
    title: "GJU Smart Connect",
    description:
      "A modern digital academic platform connecting Students, Teachers and Administration.",
    url: "https://gjusmartconnect.online",
    siteName: "GJU Smart Connect",
    locale: "en_IN",
    type: "website",
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
  },

  robots: {
    index: true,
    follow: true,
  },

  creator: "Manish Kushwaha",
  publisher: "GJU Smart Connect",
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