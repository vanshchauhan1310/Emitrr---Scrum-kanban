import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provide";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  title: "Scrum Board",
  description: "Streamline sprints, track backlogs, and visualize workflows with ScrumBoard—the intuitive Agile tool for dev teams.",
};

const modernDarkTheme = {
  baseTheme: dark,
  variables: {
    colorPrimary: '#007AFF',
    colorPrimaryHover: '#0056CC',
    colorDanger: '#FF4757',
    colorSuccess: '#2ED573',
    colorWarning: '#FFA502',
    colorBackground: '#0F0F0F',
    colorInputBackground: 'rgba(255, 255, 255, 0.05)',
    colorInputText: '#FFFFFF',
    colorText: '#FFFFFF',
    colorTextSecondary: '#A0A0A0',
    colorTextOnPrimaryBackground: '#FFFFFF',
    colorInputBorder: 'rgba(255, 255, 255, 0.1)',
    colorInputBorderFocused: '#007AFF',
    borderRadius: '12px',
  },
  elements: {
    card: {
      background: 'rgba(15, 15, 15, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      padding: '2rem',
    },
    formButtonPrimary: {
      backgroundColor: '#007AFF',
      '&:hover': {
        backgroundColor: '#0056CC',
      },
    },
    socialButtonsBlockButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      appearance={{
        ...modernDarkTheme,
        variables: {
          ...modernDarkTheme.variables,
          colorBackground: '#0F0F0F',
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">          
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}