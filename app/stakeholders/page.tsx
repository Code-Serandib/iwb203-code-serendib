"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from '@/components/layout/Layout';
import React, { useEffect, FormEvent } from 'react';
import axios from 'axios';
import { Alert } from "@/components/ui/alert";

interface Stakeholder {
  stakeholder_name: string;
  stakeholder_type: number | string;
  description: string;
  email_address: string;
  user_email: string;
}

export default function StakeholderRegistration() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [types, setTypes] = useState<any[]>([]);
  const [type, setType] = useState<number | string>("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState(""); // Changed to email

    const [userEmail, setUserEmail] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

  const handleHomeRedirect = () => {
    // router.push("/stakeholders/view");
    // alert("abc");
    // alert(userEmail);
  };

  // const handleSubmit = async (event: React.SyntheticEvent) => {
  //   event.preventDefault();
  //   setIsLoading(true);

  //   const stakeholderData = {
  //     name,
  //     type,
  //     description,
  //     email, // Changed to email
  //   };

  //   // TODO: Implement form submission logic here
  //   console.log("Submitting:", stakeholderData);

  //   setTimeout(() => {
  //     setIsLoading(false);
  //     router.push("/dashboard");
  //   }, 3000);
  // };



  useEffect(() => {
    // Fetch the user email from the backend when the component mounts
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get('http://localhost:9091/api/callback');
        // setUserEmail(response.data.user_email);
        setUserEmail("a@gmail.com");
        // alert("abc");
        // alert(userEmail);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, []);

  // Fetch stakeholder types
  useEffect(() => {
    async function fetchStakeholderTypes() {
      try {
        const response = await fetch("http://localhost:9091/api/types"); // Replace with actual API URL
        const data = await response.json();
        setTypes(data);
      } catch (error) {
        console.error("Error fetching stakeholder types:", error);
      }
    }

    fetchStakeholderTypes();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation: Ensure fields are not empty
    if (!name || !type || !email || !description) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }

    const stakeholder: Stakeholder = {
      stakeholder_name: name,
      stakeholder_type: type,
      description: description,
      email_address: email,
      user_email: userEmail
    };

    try {
      const response = await axios.post('http://localhost:9091/api/registerStakeholder', stakeholder);
      console.log('Stakeholder added:', response.data.statusCode);
      if (response.data.statusCode == 409) {
        setErrorMessage("Email already exists. Please use a different email address.");
      }else {
        router.push("/stakeholders/view");
      }
    } catch (error) {
      console.error('Error adding stakeholder:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[1050px] my-12"> {/* Increased size */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl">Stakeholder Registration</CardTitle> {/* Increased title size */}
            <CardDescription>Fill in the details to register a new stakeholder</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6"> {/* Increased gap */}
            <form onSubmit={handleSubmit}>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <div className="grid gap-2 my-4">
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
              {/* <div className="grid gap-2 my-4">
                <Label htmlFor="type">Stakeholder Type</Label>
                <select
                  id="type"
                  className="w-full px-3 py-2 border rounded-md"
                  value={type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(parseInt(e.target.value))}
                >
                  <option value="1">Internal</option>
                  <option value="2">External</option>
                </select>
              </div> */}
               <div className="grid gap-2 my-4">
      <Label htmlFor="type">Stakeholder Type</Label>
      <select
        id="type"
        className="w-full px-3 py-2 border rounded-md"
        value={type}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(parseInt(e.target.value))}
      >
        <option value="">Select Type</option>
        {types.map((type) => (
          <option key={type.id} value={type.id}>
            {type.type_name}
          </option>
        ))}
      </select>
    </div>
              <div className="grid gap-2 my-4">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter a brief description"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2 my-4"> {/* Changed from contact to email */}
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                className="w-full mt-6"
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
              <a href="/stakeholders/view" className="underline underline-offset-4 hover:text-primary">
                View Stakeholders
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
