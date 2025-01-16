
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      try {
        const NEXT_PUBLIC_WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

        // Save user to the database
        const response = await fetch(`${NEXT_PUBLIC_WEBSITE_URL}/api/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save user to the database");
        }

        // Redirect after successful sign-in
        return `${NEXT_PUBLIC_WEBSITE_URL}`; // Redirect to the homepage or specified URL
      } catch (error) {
        console.error("Error during sign-in callback:", error);
        return false; // Reject sign-in
      }
    },
  },
});