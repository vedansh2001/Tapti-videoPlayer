// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google"



// import GoogleProvider from "next-auth/providers/google";
// console.log("this is ID:",process.env.AUTH_GOOGLE_ID, "This is secret:", process.env.AUTH_GOOGLE_SECRET);

// export default NextAuth({
    // const authOptions = {
    //     providers: [
    //       GoogleProvider({
    //         clientId: process.env.AUTH_GOOGLE_ID as string,
    //         clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    //       }),
    //     ],
    //   };
      
    //   export default authOptions;
// export const { handlers, signIn, signOut, auth } = NextAuth({
//     providers: [Google],
//   })


import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      try {
        // Save user to the database
        const NEXT_PUBLIC_WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;
        
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
        return true; // Proceed with sign-in
      } catch (error) {
        console.error("Error during sign-in callback:", error);
        return false; // Reject sign-in
      }
    },
  },
})