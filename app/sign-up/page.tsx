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

  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [industry, setIndustry] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [administratorName, setAdministratorName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignInRedirect = () => {
    router.push("/sign-in")
  }

  async function handleOAuthLogin(provider: string) {
    window.location.href = "http://localhost:9090/auth/googleLogin";
  }

  const goToNextStep = () => setStep(step + 1)
  const goToPreviousStep = () => setStep(step - 1)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const formData = {
      organizationName: organizationName,
      organizationType: organizationType,
      industry: industry,
      address: address,
      country: country,
      administratorName: administratorName,
      email: email,
      contactNumber: contactNumber,
      role: role,
      username: username,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:9090/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle successful sign-up (e.g., redirect to home)
        setTimeout(() => {
          setIsLoading(false);
          router.push("/sign-in");
        }, 3000);
      } else {
        // Handle errors (e.g., display error message)
        const errorData = await response.json();
        console.error("Sign-up error:", errorData.message);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
    } finally {
      setIsLoading(false);
    }
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
                <Button variant="outline" onClick={() => handleOAuthLogin('github')}>
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline" onClick={() => handleOAuthLogin('google')}>
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
                    <Input id="organization" type="text" onChange={(e) => setOrganizationName(e.target.value)} placeholder="Acme Inc." required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="org-type">Organization Type</Label>
                    <Select onValueChange={(value) => setOrganizationType(value)}>
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
                    <Input id="industry" onChange={(e) => setIndustry(e.target.value)} type="text" placeholder="Technology" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" type="text" onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, City, State, ZIP" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="country">Country/Region</Label>
                    <Input id="country" type="text" onChange={(e) => setCountry(e.target.value)} placeholder="United States" required />
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
                    <Input id="admin-name" type="text" onChange={(e) => setAdministratorName(e.target.value)} placeholder="John Doe" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="admin-email">Administrator's Email Address</Label>
                    <Input id="admin-email" type="email" onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" onChange={(e) => setContactNumber(e.target.value)} placeholder="+1 (555) 123-4567" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="role">Role in Organization</Label>
                    <Input id="role" type="text" onChange={(e) => setRole(e.target.value)} placeholder="CEO" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" onChange={(e) => setUsername(e.target.value)} placeholder="johndoe" required />
                  </div>
                  <div className="grid gap-2 my-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" onChange={(e) => setPassword(e.target.value)} type="password" required />
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
          <h2 className="text-2xl font-bold text-gray-200 mb-4">Welcome to Our Community!</h2>
          <p className="text-white">
          Sign up to create an account and start enjoying our services. We’re excited to have you on board!
          </p>
        </div>
      </div>
    </div>
  )
}
