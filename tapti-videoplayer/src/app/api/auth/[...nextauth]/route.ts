// import NextAuth from "next-auth";
// import authOptions from "@/auth"; // Adjust the path if your auth file is elsewhere

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };



import { handlers } from "@/auth"
export const { GET, POST } = handlers
