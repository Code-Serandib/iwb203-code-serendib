"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export default function StakeholderRegistration() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("internal");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");

  const handleHomeRedirect = () => {
    router.push("/home");
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const stakeholderData = {
      name,
      type,
      description,
      contact,
    };

    // TODO: Implement form submission logic here
    console.log("Submitting:", stakeholderData);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 3000);
  };

  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px] my-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Stakeholder Registration</CardTitle>
          <CardDescription>Fill in the details to register a new stakeholder</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2 my-2">
              <Label htmlFor="name">Stakeholder Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="First and Last Name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
              />
            </div>
            {/* <div className="grid gap-2 my-2">
              <Label htmlFor="type">Stakeholder Type</Label>
              <Select value={type} onValueChange={(value) => setType(value)}>
                <option value="internal">Internal</option>
                <option value="external">External</option>
              </Select>
            </div> */}
            <div className="grid gap-2 my-2">
  <Label htmlFor="type">Stakeholder Type</Label>
  <select
    id="type"
    className="w-full px-3 py-2 border rounded-md"
    value={type}
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value)}
  >
    <option value="internal">Internal</option>
    <option value="external">External</option>
  </select>
</div>

            <div className="grid gap-2 my-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter a brief description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2 my-2">
              <Label htmlFor="contact">Contact Details</Label>
              <Input
                id="contact"
                type="text"
                placeholder="Enter contact details"
                value={contact}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContact(e.target.value)}
              />
            </div>
            <Button
              className="w-full mt-4"
              onClick={handleHomeRedirect}
              type="submit"
              disabled={isLoading}
            >
              {isLoading && (
                <span className="mr-2 h-4 w-4 animate-spin">🔄</span>
              )}
              Register Stakeholder
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <a href="/help" className="underline underline-offset-4 hover:text-primary">
              Need help with registration?
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
