import { signIn } from "@/auth";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-300">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h1>
        <form
          action={async (formData) => {
            "use server";
            const name = formData.get("name") as string;
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            if ( email && password && name) {
                // Implement custom sign-in logic here
                // console.log({ email, password });
              //   await signIn("credentials", { email, password });
                
  
                  try {
                    const NEXT_PUBLIC_WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;
                    
                      const response = await fetch(`${NEXT_PUBLIC_WEBSITE_URL}/api/user`, {
                          method: "POST",
                          headers: {
                          "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ email, password, name }),
                      });
                    //   const data = await response.json()
                      
  
                      if (!response.ok) {
                        //   const errormessage = data.message
                          throw new Error(`Error: ${response.statusText}`);
                      }
                  } catch (error) {
                      console.error("Error during Login:", error);
                  } 
  
              }
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center">
          
        <div className="pt-4 text-xs flex justify-center font-semibold" >Already have an account? 
                                <Link href="/profile" className="text-blue-600 font-semibold ml-1">Sign In
                                </Link>
        </div>
          <form
            action={async () => {
              "use server";
              await signIn("google");

            // const session = await auth(); // Re-fetch session after signing in
            // const user = session?.user;


            // if ( user) {
            //   const email = user.email;
            //   const name = user.name; 
              

            //     try {
            //         const response = await fetch("http://localhost:3000/api/user", {
            //             method: "POST",
            //             headers: {
            //             "Content-Type": "application/json",
            //             },
            //             body: JSON.stringify({ email, name }),
            //         });
            //         const data = await response.json()
            //         console.log("bhai dekho data aagya hai balle balle: --------------------------------------", user);
                    

            //         if (!response.ok) {
            //             const errormessage = data.message
            //             throw new Error(`Error: ${response.statusText}`);
            //         }
            //     } catch (error) {
            //         console.error("Error during Login:", error);
            //     } 

            // }



            }}
            className="mt-4"
          >
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
            >
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
