"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash, Eye, Search } from 'lucide-react'
import Layout from '@/components/layout/Layout';

// Mock data (replace with actual API calls in a real application)
const initialSurveys = [
    { id: 1, title: "Customer Satisfaction Survey", description: "We would like to know your feedback on our services." },
    { id: 2, title: "Product Feedback Survey", description: "Please provide your thoughts on our latest product." },
]

const initialQuestions = [
    { id: 1, surveyId: 1, questionText: "How satisfied are you with our service?", questionType: "rating", choices: ["1", "2", "3", "4", "5"] },
    { id: 2, surveyId: 1, questionText: "What can we do to improve?", questionType: "text" },
    { id: 3, surveyId: 2, questionText: "How likely are you to recommend our product?", questionType: "rating", choices: ["1", "2", "3", "4", "5"] },
    { id: 4, surveyId: 2, questionText: "Which features did you like the most?", questionType: "multiple_choice", choices: ["Ease of use", "Design", "Performance", "Customer support"] },
    { id: 5, surveyId: 2, questionText: "Any additional comments?", questionType: "text" },
]

const initialResponses = [
    { id: 1, stakeholderId: 1, surveyId: 1, questionId: 1, responseText: "4" },
    { id: 2, stakeholderId: 1, surveyId: 1, questionId: 2, responseText: "Improve the response time of customer support." },
    { id: 3, stakeholderId: 2, surveyId: 2, questionId: 3, responseText: "5" },
    { id: 4, stakeholderId: 2, surveyId: 2, questionId: 4, responseText: "Design" },
    { id: 5, stakeholderId: 2, surveyId: 2, questionId: 5, responseText: "No additional comments." },
]

const initialSubmissions = [
    { id: 1, stakeholderId: 1, surveyId: 1, submittedAt: "2024-09-28 10:30:00" },
    { id: 2, stakeholderId: 2, surveyId: 2, submittedAt: "2024-09-28 11:00:00" },
]

const initialStakeholders = [
    { id: 1, stakeholderName: "John", stakeholderType: 2, description: "Buyer", emailAddress: "john@example.com" },
    { id: 2, stakeholderName: "Doe", stakeholderType: 1, description: "User", emailAddress: "doe@example.com" },
    { id: 3, stakeholderName: "Jane", stakeholderType: 1, description: "User", emailAddress: "jane@example.com" },
    { id: 4, stakeholderName: "Smith", stakeholderType: 1, description: "User", emailAddress: "smith@example.com" },
]

export default function EnhancedSurveyManagement() {
    const [surveys, setSurveys] = useState(initialSurveys)
    const [questions, setQuestions] = useState(initialQuestions)
    const [responses, setResponses] = useState(initialResponses)
    const [submissions, setSubmissions] = useState(initialSubmissions)
    const [stakeholders, setStakeholders] = useState(initialStakeholders)
    const [editingSurvey, setEditingSurvey] = useState(null)
    const [editingQuestion, setEditingQuestion] = useState(null)
    const [newSurvey, setNewSurvey] = useState({ title: '', description: '' })
    const [newQuestion, setNewQuestion] = useState({ surveyId: null, questionText: '', questionType: '', choices: [] })
    const [showSurveyDialog, setShowSurveyDialog] = useState(false)
    const [showQuestionDialog, setShowQuestionDialog] = useState(false)
    const [selectedSurvey, setSelectedSurvey] = useState(null)
    const [stakeholderSearch, setStakeholderSearch] = useState('')
    const [surveySearch, setSurveySearch] = useState('')

    const handleCreateSurvey = () => {
        const survey = { id: Date.now(), ...newSurvey }
        setSurveys([...surveys, survey])
        setNewSurvey({ title: '', description: '' })
        setShowSurveyDialog(false)
    }

    const handleUpdateSurvey = () => {
        setSurveys(surveys.map(s => s.id === editingSurvey.id ? editingSurvey : s))
        setEditingSurvey(null)
    }

    const handleDeleteSurvey = (id) => {
        setSurveys(surveys.filter(s => s.id !== id))
        setQuestions(questions.filter(q => q.surveyId !== id))
        setResponses(responses.filter(r => r.surveyId !== id))
        setSubmissions(submissions.filter(s => s.surveyId !== id))
    }

    const handleCreateQuestion = () => {
        const question = { id: Date.now(), ...newQuestion }
        setQuestions([...questions, question])
        setNewQuestion({ surveyId: null, questionText: '', questionType: '', choices: [] })
        setShowQuestionDialog(false)
    }

    const handleUpdateQuestion = () => {
        setQuestions(questions.map(q => q.id === editingQuestion.id ? editingQuestion : q))
        setEditingQuestion(null)
    }

    const handleDeleteQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id))
        setResponses(responses.filter(r => r.questionId !== id))
    }

    const filteredResponses = responses.filter(response => {
        const stakeholder = stakeholders.find(s => s.id === response.stakeholderId)
        const survey = surveys.find(s => s.id === response.surveyId)
        return (
            stakeholder.stakeholderName.toLowerCase().includes(stakeholderSearch.toLowerCase()) &&
            survey.title.toLowerCase().includes(surveySearch.toLowerCase())
        )
    })

    const filteredSubmissions = submissions.filter(submission => {
        const stakeholder = stakeholders.find(s => s.id === submission.stakeholderId)
        const survey = surveys.find(s => s.id === submission.surveyId)
        return (
            stakeholder.stakeholderName.toLowerCase().includes(stakeholderSearch.toLowerCase()) &&
            survey.title.toLowerCase().includes(surveySearch.toLowerCase())
        )
    })

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Enhanced Survey Management</h1>

                <Tabs defaultValue="surveys" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="surveys">Surveys</TabsTrigger>
                        <TabsTrigger value="questions">Questions</TabsTrigger>
                        <TabsTrigger value="responses">Responses</TabsTrigger>
                        <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="surveys">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Surveys</h2>
                            <Dialog open={showSurveyDialog} onOpenChange={setShowSurveyDialog}>
                                <DialogTrigger asChild>
                                    <Button><Plus className="mr-2 h-4 w-4" /> Create New Survey</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Create New Survey</DialogTitle>
                                        <DialogDescription>
                                            Create a new survey here. Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="title" className="text-right">
                                                Title
                                            </Label>
                                            <Input
                                                id="title"
                                                value={newSurvey.title}
                                                onChange={(e) => setNewSurvey({ ...newSurvey, title: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="description" className="text-right">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={newSurvey.description}
                                                onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={handleCreateSurvey}>Save Survey</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {surveys.map((survey) => (
                                <Card key={survey.id}>
                                    <CardHeader>
                                        <CardTitle>{survey.title}</CardTitle>
                                        <CardDescription>{survey.description}</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex justify-between">
                                        <Button variant="outline" onClick={() => setEditingSurvey(survey)}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </Button>
                                        <Button variant="outline" onClick={() => setSelectedSurvey(survey)}>
                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                        </Button>
                                        <Button variant="destructive" onClick={() => handleDeleteSurvey(survey.id)}>
                                            <Trash className="mr-2 h-4 w-4" /> Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        {editingSurvey && (
                            <Dialog open={!!editingSurvey} onOpenChange={() => setEditingSurvey(null)}>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit Survey</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your survey here. Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-title" className="text-right">
                                                Title
                                            </Label>
                                            <Input
                                                id="edit-title"
                                                value={editingSurvey.title}
                                                onChange={(e) => setEditingSurvey({ ...editingSurvey, title: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-description" className="text-right">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="edit-description"
                                                value={editingSurvey.description}
                                                onChange={(e) => setEditingSurvey({ ...editingSurvey, description: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={handleUpdateSurvey}>Save Changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}

                        {selectedSurvey && (
                            <Dialog open={!!selectedSurvey} onOpenChange={() => setSelectedSurvey(null)}>
                                <DialogContent className="sm:max-w-[725px]">
                                    <DialogHeader>
                                        <DialogTitle>{selectedSurvey.title}</DialogTitle>
                                        <DialogDescription>{selectedSurvey.description}</DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold mb-2">Questions:</h3>
                                        <ul className="list-disc pl-5">
                                            {questions.filter(q => q.surveyId === selectedSurvey.id).map(question => (
                                                <li key={question.id}>{question.questionText}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold mb-2">Submissions:</h3>
                                        <ul className="list-disc pl-5">
                                            {submissions.filter(s => s.surveyId === selectedSurvey.id).map(submission => (
                                                <li key={submission.id}>
                                                    Stakeholder ID: {submission.stakeholderId}, Submitted at: {submission.submittedAt}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </TabsContent>

                    <TabsContent value="questions">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Questions</h2>
                            <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
                                <DialogTrigger asChild>
                                    <Button><Plus className="mr-2 h-4 w-4" /> Add New Question</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New Question</DialogTitle>
                                        <DialogDescription>
                                            Add a new question to a survey. Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="survey" className="text-right">
                                                Survey
                                            </Label>
                                            <Select onValueChange={(value) => setNewQuestion({ ...newQuestion, surveyId: parseInt(value) })}>
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select a survey" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {surveys.map((survey) => (
                                                        <SelectItem key={survey.id} value={survey.id.toString()}>{survey.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="question-text" className="text-right">
                                                Question
                                            </Label>
                                            <Input
                                                id="question-text"
                                                value={newQuestion.questionText}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="question-type" className="text-right">
                                                Type
                                            </Label>
                                            <Select onValueChange={(value) => setNewQuestion({ ...newQuestion, questionType: value, choices: [] })}>
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select question type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="text">Text</SelectItem>
                                                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                                    <SelectItem value="checkbox">Checkbox</SelectItem>
                                                    <SelectItem value="rating">Rating</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {(newQuestion.questionType === 'multiple_choice' || newQuestion.questionType === 'checkbox') && (
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="choices" className="text-right">
                                                    Choices
                                                </Label>
                                                <div className="col-span-3">
                                                    {newQuestion.choices.map((choice, index) => (
                                                        <div key={index} className="flex items-center mb-2">
                                                            <Input
                                                                value={choice}
                                                                onChange={(e) => {
                                                                    const newChoices = [...newQuestion.choices]
                                                                    newChoices[index] = e.target.value
                                                                    setNewQuestion({ ...newQuestion, choices: newChoices })
                                                                }}
                                                                className="mr-2"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const newChoices = newQuestion.choices.filter((_, i) => i !== index)
                                                                    setNewQuestion({ ...newQuestion, choices: newChoices })
                                                                }}
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setNewQuestion({ ...newQuestion, choices: [...newQuestion.choices, ''] })}
                                                    >
                                                        Add Choice
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        {newQuestion.questionType === 'rating' && (
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="rating-scale" className="text-right">
                                                    Rating Scale
                                                </Label>
                                                <div className="col-span-3 flex items-center">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max="10"
                                                        value={newQuestion.choices[1] || '5'}
                                                        onChange={(e) => setNewQuestion({ ...newQuestion, choices: ['1', e.target.value] })}
                                                        className="w-20 mr-2"
                                                    />
                                                    <span>points</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={handleCreateQuestion}>Save Question</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Survey</TableHead>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Choices</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {questions.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell>{surveys.find(s => s.id === question.surveyId)?.title}</TableCell>
                                        <TableCell>{question.questionText}</TableCell>
                                        <TableCell>{question.questionType}</TableCell>
                                        <TableCell>{question.choices ? question.choices.join(', ') : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" className="mr-2" onClick={() => setEditingQuestion(question)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" onClick={() => handleDeleteQuestion(question.id)}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {editingQuestion && (
                            <Dialog open={!!editingQuestion} onOpenChange={() => setEditingQuestion(null)}>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit Question</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your question here. Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-question-text" className="text-right">
                                                Question
                                            </Label>
                                            <Input
                                                id="edit-question-text"
                                                value={editingQuestion.questionText}
                                                onChange={(e) => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-question-type" className="text-right">
                                                Type
                                            </Label>
                                            <Select
                                                onValueChange={(value) => setEditingQuestion({ ...editingQuestion, questionType: value, choices: [] })}
                                                defaultValue={editingQuestion.questionType}
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select question type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="text">Text</SelectItem>
                                                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                                    <SelectItem value="checkbox">Checkbox</SelectItem>
                                                    <SelectItem value="rating">Rating</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {(editingQuestion.questionType === 'multiple_choice' || editingQuestion.questionType === 'checkbox') && (
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="edit-choices" className="text-right">
                                                    Choices
                                                </Label>
                                                <div className="col-span-3">
                                                    {editingQuestion.choices.map((choice, index) => (
                                                        <div key={index} className="flex items-center mb-2">
                                                            <Input
                                                                value={choice}
                                                                onChange={(e) => {
                                                                    const newChoices = [...editingQuestion.choices]
                                                                    newChoices[index] = e.target.value
                                                                    setEditingQuestion({ ...editingQuestion, choices: newChoices })
                                                                }}
                                                                className="mr-2"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const newChoices = editingQuestion.choices.filter((_, i) => i !== index)
                                                                    setEditingQuestion({ ...editingQuestion, choices: newChoices })
                                                                }}
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setEditingQuestion({ ...editingQuestion, choices: [...editingQuestion.choices, ''] })}
                                                    >
                                                        Add Choice
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        {editingQuestion.questionType === 'rating' && (
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="edit-rating-scale" className="text-right">
                                                    Rating Scale
                                                </Label>
                                                <div className="col-span-3 flex items-center">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max="10"
                                                        value={editingQuestion.choices[1] || '5'}
                                                        onChange={(e) => setEditingQuestion({ ...editingQuestion, choices: ['1', e.target.value] })}
                                                        className="w-20 mr-2"
                                                    />
                                                    <span>points</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={handleUpdateQuestion}>Save Changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </TabsContent>

                    <TabsContent value="responses">
                        <h2 className="text-2xl font-semibold mb-4">Responses</h2>
                        <div className="flex space-x-4 mb-4">
                            <div className="flex-1">
                                <Label htmlFor="stakeholder-search">Search by Stakeholder</Label>
                                <div className="flex items-center">
                                    <Input
                                        id="stakeholder-search"
                                        value={stakeholderSearch}
                                        onChange={(e) => setStakeholderSearch(e.target.value)}
                                        placeholder="Enter stakeholder name"
                                        className="mr-2"
                                    />
                                    <Search className="h-4 w-4 text-gray-500" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="survey-search">Search by Survey</Label>
                                <div className="flex items-center">
                                    <Input
                                        id="survey-search"
                                        value={surveySearch}
                                        onChange={(e) => setSurveySearch(e.target.value)}
                                        placeholder="Enter survey title"
                                        className="mr-2"
                                    />
                                    <Search className="h-4 w-4 text-gray-500" />
                                </div>
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Stakeholder</TableHead>
                                    <TableHead>Survey</TableHead>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Response</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredResponses.map((response) => (
                                    <TableRow key={response.id}>
                                        <TableCell>{stakeholders.find(s => s.id === response.stakeholderId)?.stakeholderName}</TableCell>
                                        <TableCell>{surveys.find(s => s.id === response.surveyId)?.title}</TableCell>
                                        <TableCell>{questions.find(q => q.id === response.questionId)?.questionText}</TableCell>
                                        <TableCell>{response.responseText}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>

                    <TabsContent value="submissions">
                        <h2 className="text-2xl font-semibold mb-4">Submissions</h2>
                        <div className="flex space-x-4 mb-4">
                            <div className="flex-1">
                                <Label htmlFor="stakeholder-search">Search by Stakeholder</Label>
                                <div className="flex items-center">
                                    <Input
                                        id="stakeholder-search"
                                        value={stakeholderSearch}
                                        onChange={(e) => setStakeholderSearch(e.target.value)}
                                        placeholder="Enter stakeholder name"
                                        className="mr-2"
                                    />
                                    <Search className="h-4 w-4 text-gray-500" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="survey-search">Search by Survey</Label>
                                <div className="flex items-center">
                                    <Input
                                        id="survey-search"
                                        value={surveySearch}
                                        onChange={(e) => setSurveySearch(e.target.value)}
                                        placeholder="Enter survey title"
                                        className="mr-2"
                                    />
                                    <Search className="h-4 w-4 text-gray-500" />
                                </div>
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Stakeholder</TableHead>
                                    <TableHead>Survey</TableHead>
                                    <TableHead>Submitted At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSubmissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell>{stakeholders.find(s => s.id === submission.stakeholderId)?.stakeholderName}</TableCell>
                                        <TableCell>{surveys.find(s => s.id === submission.surveyId)?.title}</TableCell>
                                        <TableCell>{submission.submittedAt}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>

    )
}