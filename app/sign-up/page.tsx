"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

export default function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleSignInRedirect = () => {
    router.push("/sign-in")
  }

  const goToNextStep = () => setStep(step + 1)
  const goToPreviousStep = () => setStep(step - 1)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    // TODO: Implement sign-up logic here

    setTimeout(() => {
      setIsLoading(false)
      router.push("/home")
    }, 3000)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side - Sign Up Form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-xl space-y-8">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign up</CardTitle>
              <CardDescription>Create an account for your organization</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {/* Social login buttons */}
              <div className="grid grid-cols-2 gap-6">
                <Button variant="outline">
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline">
                  <Icons.google className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
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

              {/* Step 1: Organization Information */}
              {step === 1 && (
                <form onSubmit={goToNextStep}>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="organization">Organization Name</Label>
                    <Input id="organization" type="text" placeholder="Acme Inc." required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="org-type">Organization Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporation">Corporation</SelectItem>
                        <SelectItem value="non-profit">Non-Profit</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="industry">Industry/Domain</Label>
                    <Input id="industry" type="text" placeholder="Technology" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" type="text" placeholder="123 Main St, City, State, ZIP" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="country">Country/Region</Label>
                    <Input id="country" type="text" placeholder="United States" required />
                  </div>
                  <Button className="w-full mt-4" type="submit">
                    Next
                  </Button>
                </form>
              )}

              {/* Step 2: Administrator Information */}
              {step === 2 && (
                <form onSubmit={onSubmit}>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="admin-name">Administrator's Full Name</Label>
                    <Input id="admin-name" type="text" placeholder="John Doe" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="admin-email">Administrator's Email Address</Label>
                    <Input id="admin-email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="role">Role in Organization</Label>
                    <Input id="role" type="text" placeholder="CEO" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" placeholder="johndoe" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </label>
                  </div>
                  <div className="flex justify-between w-full">
                    <Button variant="secondary" className="mt-4" onClick={goToPreviousStep}>
                      Back
                    </Button>
                    <Button className="mt-4" type="submit" disabled={isLoading}>
                      {isLoading && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Sign Up
                    </Button>
                  </div>
                </form>
              )}

              {/* Sign In Button */}
              <Button variant="secondary" className="w-full" disabled={isLoading} onClick={handleSignInRedirect}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Already have an account?
              </Button>
            </CardContent>
            <CardFooter>
              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <a
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right side - Image and Description */}
      <div className="w-full md:w-1/2 bg-gray-100 p-8 flex flex-col items-center justify-center">
        <div className="max-w-md text-center">
          <Image
            src="/placeholder.svg?height=200&width=200"
            alt="Sign Up"
            width={200}
            height={200}
            className="mx-auto mb-8"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Our Community!</h2>
          <p className="text-gray-600">
            Sign up to create an account and start enjoying our services. We’re excited to have you on board!
          </p>
        </div>
      </div>
    </div>
  )
}
