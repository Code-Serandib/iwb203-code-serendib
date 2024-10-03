"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import baseRoute from "@/lib/baseRoute";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import Image from "next/image"
import Link from "next/link"

export default function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSignUpRedirect = () => {
    router.push("/sign-up")
  }

  // const handleHomeRedirect = () => {
  //   router.push("/home")
  // }

  async function handleOAuthLogin(provider: string) {
    window.location.href = `http://localhost:9090/auth/${provider}Login`;
      // try {
      //   setIsLoading(true);
      //   const response = await baseRoute.get(`/auth/googleLogin`, {
      //     headers: {
      //       'Access-Control-Allow-Origin': '*',
      //       'Access-Control-Allow-Credentials': true,
      //     },
      //     withCredentials: true
      //   });
      //   if (response.status === 200 || response.status === 201) {
      //     // window.location.href = response.data.redirectUrl;
      //     console.log("reponse.data :"+response.data);
      //   }
      // } catch (error) {
      //   console.error("OAuth login failed:", error);
      // } finally {
      //   setIsLoading(false);
      // }
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    
    console.log("Form submitted");

    try {
      // Use Axios to send the request
      const response = await baseRoute.post("/auth/signIn", { email, password });
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      // const response = await axios.get("http://localhost:9090/auth/protected-route", { headers });

      if (response.status === 200 || response.status === 201) {
        console.log("Login successful:", response.data);
        localStorage.setItem("token", response.data.token);
        console.log("Headers :", headers);
        router.push("/home");
      } else {
        console.error("Login failed! :", response.status);
        console.error("Login failed!", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side - Sign In Form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <Card className="w-full max-w-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Social Sign-In Buttons */}
            <div className="grid grid-cols-2 gap-6">
              <Button variant="outline" onClick={() => handleOAuthLogin('github')}>
                <Icons.gitHub className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" onClick={() => handleOAuthLogin('google')}>
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-2 my-2">
                <Label htmlFor="email-address">Email address</Label>
                <Input id="email-address" name="email" type="email" onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="Email address" required />
              </div>
              <div className="grid gap-2 my-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="Password" required />
              </div>
              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </Label>
                </div>
                <div className="text-sm">
                  <Link href="/forgot-password" className="underline hover:text-primary">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              {/* Submit Button */}
              <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </form>
            {/* Sign Up Button */}
            <Button variant="secondary" className="w-full" onClick={handleSignUpRedirect} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Don't have an account?
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Image and Description */}
      <div
        className="w-full md:w-1/2 bg-gray-100 p-8 flex flex-col items-center justify-center"
        style={{
          backgroundImage: "url('https://fastly.picsum.photos/id/51/5000/3333.jpg?hmac=9dZb89mIRt-mPQpI_ScJAxVsNI82SFCGOuiKsvGSchY')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-md text-center">
          <Image
            src="https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg"
            alt="Sign In"
            width={200}
            height={200}
            className="mx-auto mb-8 rounded-full"
          />
          <h2 className="text-2xl font-bold text-gray-200 mb-4">Welcome Back!</h2>
          <p className="text-white">
            Sign in to access your account and enjoy our services. We're glad to have you back!
          </p>
        </div>
      </div>

    </div>
  )
}
