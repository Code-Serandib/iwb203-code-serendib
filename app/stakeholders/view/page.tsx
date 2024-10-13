"use client"; // Add this line at the top

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function ViewStakeholders() {
    const [stakeholders, setStakeholders] = useState<any[]>([]);
    const [filteredStakeholders, setFilteredStakeholders] = useState<any[]>([]);
    const [stakeholderTypes, setStakeholderTypes] = useState<string[]>(["internal", "external"]); // Replace with actual types from API
    const [selectedType, setSelectedType] = useState<string>("");
    const [emailQuery, setEmailQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const userEmail = "a@gmail.com"; // Replace with actual user email

    useEffect(() => {
        // Fetch stakeholders from the API using Axios
        async function fetchStakeholders() {
            try {
                const response = await axios.get("http://localhost:9091/api/getAllStakeholder", {
                    params: { user_email: userEmail },
                });
                setStakeholders(response.data);
                setFilteredStakeholders(response.data);
            } catch (error) {
                console.error("Error fetching stakeholders:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStakeholders();
    }, [userEmail]);

    // Fetch stakeholder types
    useEffect(() => {
        async function fetchStakeholderTypes() {
            try {
                const response = await axios.get("http://localhost:9091/api/types");
                setStakeholderTypes(response.data); // Set types
            } catch (error) {
                console.error("Error fetching stakeholder types:", error);
            }
        }
        fetchStakeholderTypes();
    }, []);

    useEffect(() => {
        // Sort stakeholders by selected type
        async function sortStakeholdersByType() {
            try {
                const response = await axios.get("http://localhost:9091/api/sort", {
                    params: { stakeholder_type: selectedType, user_email: userEmail },
                });
                setFilteredStakeholders(response.data);
            } catch (error) {
                console.error("Error sorting stakeholders:", error);
            }
        }

        // Search stakeholders by email
        async function searchStakeholderByEmail() {
            try {
                const response = await axios.get("http://localhost:9091/api/search", {
                    params: { email_address: emailQuery, user_email: userEmail },
                });
                setFilteredStakeholders(response.data);
            } catch (error) {
                console.error("Error searching stakeholders:", error);
            }
        }

        // Apply filtering based on selected type and email query
        if (selectedType) {
            sortStakeholdersByType();
        } else if (emailQuery) {
            searchStakeholderByEmail();
        } else {
            setFilteredStakeholders(stakeholders);
        }
    }, [selectedType, emailQuery, stakeholders, userEmail]);

    return (
        <Layout>
            <div className="container mx-auto my-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Registered Stakeholders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                            {/* Combo box for sorting by stakeholder type */}
                            <div className="flex-1">
                                <label htmlFor="typeSort" className="font-medium">Sort by Type</label>
                                {/* <select
                                    id="typeSort"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={selectedType}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    {stakeholderTypes.map((type: any) => (
                                        <option key={type.id} value={type.id}>
                                            {type.type_name}
                                        </option>
                                    ))}
                                </select> */}
                                <select
    id="typeSort"
    className="w-full px-3 py-2 border rounded-md"
    value={selectedType}
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
>
    <option value="">All Types</option>
    {stakeholderTypes.map((type: any, index: number) => (
        <option key={type.id || index} value={type.id}>
            {type.type_name}
        </option>
    ))}
</select>

                            </div>

                            {/* Text field for searching by email */}
                            <div className="flex-1">
                                <label htmlFor="emailSearch" className="font-medium">Search Like Email</label>
                                <Input
                                    id="emailSearch"
                                    type="text"
                                    placeholder="Enter email to search"
                                    value={emailQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Table for Viewing Stakeholders */}
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Description</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStakeholders.length > 0 ? (
                                        filteredStakeholders.map((stakeholder) => {
                                            const matchingType = stakeholderTypes.find(
                                                (type: any) => type.id === stakeholder.stakeholder_type
                                            );

                                            return (
                                                <TableRow key={stakeholder.id}>
                                                    <TableCell>{stakeholder.stakeholder_name}</TableCell>
                                                    <TableCell>{matchingType?.type_name || "Unknown Type"}</TableCell> {/* Match ID to type name */}
                                                    <TableCell>{stakeholder.email_address}</TableCell>
                                                    <TableCell>{stakeholder.description}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4}>No stakeholders found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>

                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
