"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, Edit, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Layout from '@/components/layout/Layout'

interface ApiKey {
  id: string
  name: string
  projectName: string
  secretKey: string
  createdDate: Date
  lastUsedDate: Date | null
  createdBy: string
}

export default function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState("")
  const [newProjectName, setNewProjectName] = useState("")
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null)
  const [editKeyName, setEditKeyName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const generateApiKey = () => {
    if (!newKeyName || !newProjectName) {
      setError("Please provide both a key name and a project name.")
      return
    }

    const newKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: newKeyName,
      projectName: newProjectName,
      secretKey: Math.random().toString(36).substr(2, 24),
      createdDate: new Date(),
      lastUsedDate: null,
      createdBy: "Current User", // Replace with actual user info
    }

    setApiKeys([...apiKeys, newKey])
    setNewKeyName("")
    setNewProjectName("")
    setError(null)
  }

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id))
  }

  const startEditingKey = (key: ApiKey) => {
    setEditingKey(key)
    setEditKeyName(key.name)
  }

  const saveEditedKey = () => {
    if (editingKey) {
      setApiKeys(apiKeys.map(key => 
        key.id === editingKey.id ? { ...key, name: editKeyName } : key
      ))
      setEditingKey(null)
    }
  }

  const maskSecretKey = (key: string) => {
    return key.substr(0, 4) + "•".repeat(key.length - 8) + key.substr(-4)
  }

  return (
    <Layout>
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-8">API Key Management</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate New API Key</CardTitle>
          <CardDescription>Create a new API key for your project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key-name" className="text-right">
                Key Name
              </Label>
              <Input
                id="key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-name" className="text-right">
                Project Name
              </Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button onClick={generateApiKey}>Generate API Key</Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>Manage your existing API keys</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Name</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Secret Key</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>{key.name}</TableCell>
                  <TableCell>{key.projectName}</TableCell>
                  <TableCell>{maskSecretKey(key.secretKey)}</TableCell>
                  <TableCell>{key.createdDate.toLocaleDateString()}</TableCell>
                  <TableCell>{key.lastUsedDate ? key.lastUsedDate.toLocaleDateString() : 'Never'}</TableCell>
                  <TableCell>{key.createdBy}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => startEditingKey(key)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit API Key Name</DialogTitle>
                            <DialogDescription>
                              Change the name of your API key here. Click save when you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-key-name" className="text-right">
                                Key Name
                              </Label>
                              <Input
                                id="edit-key-name"
                                value={editKeyName}
                                onChange={(e) => setEditKeyName(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={saveEditedKey}>Save changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon" onClick={() => deleteApiKey(key.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </Layout>
  )
}