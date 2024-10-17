"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Building2, Briefcase, MapPin, Globe, User, Mail, Phone, UserCircle, Lock } from "lucide-react"
import Layout from '@/components/layout/Layout';
import { useRouter } from "next/navigation"
import axios from "axios"

export default function OrganizationProfile() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState("https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg")

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

  // Fetch user data on component mount
  
  useEffect(() => {
    const googleAccessToken = localStorage.getItem("googleAccessToken");
    const fetchUserData = async () => {
      const storedEmail = localStorage.getItem("email");

      if (googleAccessToken) {
        const res = getUserFromAccessToken(googleAccessToken);
      }

      if (!storedEmail) return;

      try {
        const response = await axios.get(`http://localhost:9091/api/getUserDetails?email=${storedEmail}`);
        if (response.data) {
          const userData = response.data;
          // Set state variables with the fetched data
          setOrganizationName(userData.organizationName);
          setOrganizationType(userData.organizationType);
          setIndustry(userData.industry);
          setAddress(userData.address);
          setCountry(userData.country);
          setAdministratorName(userData.administratorName);
          setEmail(userData.email);
          setContactNumber(userData.contactNumber);
          setRole(userData.role);
          setUsername(userData.username);
          setPassword(userData.password);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const getUserFromAccessToken = async (accessToken: string | null) => {
    try {
        const response = await fetch("http://localhost:9091/api/getUserDataFromAccessToken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ accessToken: accessToken })
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Result user: ",result);
            console.log("Result user: ",result.profilePicture);
            setProfileImage(result.profilePicture); 
            return result;
        } else {
            console.error("Failed to retrieve user data:", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error during request:", error);
        return null;
    }
};

  const handleImageUpload = (event: { target: { files: any[] } }) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setProfileImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  async function updateUserProfile(event: React.SyntheticEvent) {
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
      const response = await fetch("http://localhost:9091/api/userProfileUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle successful sign-up (e.g., redirect to home)
        alert("Profile Updated!");
        setTimeout(() => {
          setIsLoading(false);
          router.push("/home");
        }, 3000);
        
      } else {
        // Handle errors (e.g., display error message)
        const errorData = await response.json();
        console.error("Profile update error:", errorData.message);
      }
    } catch (error) {
      console.error("Error during profile update:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Organization Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-40 h-40">
                <img
                  src={profileImage}
                  alt="Organization Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <Button>Update Profile Picture</Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <div className="flex">
                  <Building2 className="w-5 h-5 mr-2 text-muted-foreground" />
                  <Input id="org-name" onChange={(e) => setOrganizationName(e.target.value)} value={organizationName} placeholder="Enter organization name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-type">Organization Type</Label>
                <div className="flex">
                  <Briefcase className="w-5 h-5 mr-2 text-muted-foreground" />
                  <Select onValueChange={(value) => setOrganizationType(value)} value={organizationType}>
                    <SelectTrigger id="org-type">
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry/Domain</Label>
                <div className="flex">
                  <Briefcase className="w-5 h-5 mr-2 text-muted-foreground" />
                  <Input id="industry" onChange={(e) => setIndustry(e.target.value)} value={industry} placeholder="Enter industry or domain" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-6 mt-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="flex">
                <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
                <Textarea id="address" onChange={(e) => setAddress(e.target.value)} value={address} placeholder="Enter organization address" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country/Region</Label>
              <div className="flex">
                <Globe className="w-5 h-5 mr-2 text-muted-foreground" />
                <Input id="country" onChange={(e) => setCountry(e.target.value)} value={country} placeholder="Enter country or region" />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Administrator Information</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Full Name</Label>
                <div className="flex">
                  <User className="w-5 h-5 mr-2 text-muted-foreground" />
                  <Input id="admin-name" onChange={(e) => setAdministratorName(e.target.value)} value={administratorName} placeholder="Enter administrator's full name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email Address</Label>
                <div className="flex">
                  <Mail className="w-5 h-5 mr-2 text-muted-foreground" />
                  <Input id="admin-email" type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter administrator's email" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-phone">Phone Number</Label>
                <div className="flex">
                  <Phone className="w-5 h-5 mr-2 text-muted-foreground" />
                  <Input id="admin-phone" type="tel" onChange={(e) => setContactNumber(e.target.value)} value={contactNumber} placeholder="Enter administrator's phone number" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-role">Role in Organization</Label>
                <div className="flex">
                  <UserCircle className="w-5 h-5 mr-2 text-muted-foreground" />
                  <Input id="admin-role" onChange={(e) => setRole(e.target.value)} value={role} placeholder="Enter administrator's role" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex">
                  <User className="w-5 h-5 mr-2 text-muted-foreground" />
                  <Input id="username" onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Enter username" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex">
                  <Lock className="w-5 h-5 mr-2 text-muted-foreground" />
                  <Input id="password" onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Enter password" disabled />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={updateUserProfile}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </Layout>
  )
}