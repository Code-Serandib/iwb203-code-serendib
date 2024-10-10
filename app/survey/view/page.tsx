"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data (replace with actual API calls in a real application)
const mockSurveys = [
  { id: 1, title: "Customer Satisfaction Survey", description: "We would like to know your feedback on our services." },
  { id: 2, title: "Product Feedback Survey", description: "Please provide your thoughts on our latest product." },
]

const mockQuestions = [
  { id: 1, surveyId: 1, questionText: "How satisfied are you with our service?", questionType: "rating" },
  { id: 2, surveyId: 1, questionText: "What can we do to improve?", questionType: "text" },
  { id: 3, surveyId: 2, questionText: "How likely are you to recommend our product?", questionType: "rating" },
  { id: 4, surveyId: 2, questionText: "Which features did you like the most?", questionType: "multiple_choice" },
  { id: 5, surveyId: 2, questionText: "Any additional comments?", questionType: "text" },
]

const mockChoices = [
  { id: 1, questionId: 4, choiceText: "Ease of use" },
  { id: 2, questionId: 4, choiceText: "Design" },
  { id: 3, questionId: 4, choiceText: "Performance" },
  { id: 4, questionId: 4, choiceText: "Customer support" },
]

export default function SurveyPage() {
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [responses, setResponses] = useState({})

  const handleSurveySelect = (surveyId) => {
    setSelectedSurvey(surveyId)
    setResponses({})
  }

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = () => {
    console.log("Submitting responses:", responses)
    // Here you would typically send the responses to your backend
    alert("Survey submitted successfully!")
    setSelectedSurvey(null)
    setResponses({})
  }

  const renderQuestion = (question) => {
    switch (question.questionType) {
      case 'rating':
        return (
          <RadioGroup
            onValueChange={(value) => handleResponseChange(question.id, value)}
            className="flex flex-row space-x-2"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value.toString()} id={`rating-${question.id}-${value}`} />
                <Label htmlFor={`rating-${question.id}-${value}`}>{value}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case 'text':
        return (
          <Textarea
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
          />
        )
      case 'multiple_choice':
        const choices = mockChoices.filter(choice => choice.questionId === question.id)
        return (
          <Select onValueChange={(value) => handleResponseChange(question.id, value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {choices.map((choice) => (
                <SelectItem key={choice.id} value={choice.choiceText}>
                  {choice.choiceText}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Survey Page</h1>
      {!selectedSurvey ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockSurveys.map((survey) => (
            <Card key={survey.id}>
              <CardHeader>
                <CardTitle>{survey.title}</CardTitle>
                <CardDescription>{survey.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => handleSurveySelect(survey.id)}>Take Survey</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{mockSurveys.find(s => s.id === selectedSurvey).title}</CardTitle>
            <CardDescription>{mockSurveys.find(s => s.id === selectedSurvey).description}</CardDescription>
          </CardHeader>
          <CardContent>
            {mockQuestions
              .filter(q => q.surveyId === selectedSurvey)
              .map((question) => (
                <div key={question.id} className="mb-4">
                  <Label htmlFor={`question-${question.id}`} className="mb-2 block">
                    {question.questionText}
                  </Label>
                  {renderQuestion(question)}
                </div>
              ))}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit}>Submit Survey</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}