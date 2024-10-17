"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data (replace with actual API calls in a real application)
const mockSurveys = [
  { id: 0, title: "", description: "" },
]

const mockQuestions = [
  { id: 0, surveyId: 0, questionText: "", questionType: "" },
]

const mockChoices = [
  { id: 0, questionId: 0, choiceText: "" },
]

export default function SurveyPage() {
  const searchParams = useSearchParams()
  const [surveys, setSurveys] = useState([])
  const [questions, setQuestions] = useState([])
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [userEmail, setUserEmail] = useState('')
  const [stakeholderEmail, setStakeholderEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [responses, setResponses] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const surveyId = searchParams.get('surveyid');
    const stakeholderemail = searchParams.get('stakeholderemail');

    if (!surveyId || !stakeholderemail) {
      setError("Missing survey ID or stakeholder email.")
      setIsLoading(false)
      return;
    }

    const validateSurvey = async () => {
      try {
        const response = await axios.get(`http://localhost:9091/api/checkStakeholder`, {
          params: { stakeholderemail, surveyid: surveyId },
        })

        if (response.status === 200 && response.data.message === "Valid stakeholder and survey") {
          setUserEmail(response.data.email);
          setStakeholderEmail(stakeholderemail);
          setSelectedSurvey(Number(surveyId));

          // Fetch surveys
          const surveysResponse = await axios.get(`http://localhost:9091/api/allSurveys`, { params: { user_email: response.data.email } });
          setSurveys(surveysResponse.data);

          // Fetch questions
          const questionsResponse = await axios.get(`http://localhost:9091/api/allQuestion`, { params: { user_email: response.data.email } });
          setQuestions(questionsResponse.data);
        } else {
          setError(response.data.message || "Invalid survey or stakeholder.")
        }
      } catch (err) {
        setError("Failed to validate the survey or fetch data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    validateSurvey();
  }, [searchParams])

  const handleResponseChange = (questionId, value, isCheckbox = false) => {
    setResponses(prev => {
      if (isCheckbox) {
        const currentValues = prev[questionId] || []
        const updatedValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
        return { ...prev, [questionId]: updatedValues }
      }
      return { ...prev, [questionId]: value }
    })
  }

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:9091/api/submitSurvey', {
        stakeholderEmail: stakeholderEmail,
        surveyId: selectedSurvey,
        responses
      });
      setSubmitted(true);
    } catch (error) {
      setError("Failed to submit the survey. Please try again later.");
    }
  }

  const renderQuestion = (question) => {
    switch (question.questionType) {
      case 'rating':
      const [min, max] = question.choices.map(Number).sort((a, b) => a - b);
      const range = Array.from({ length: max - min + 1 }, (_, i) => i + min);
      return (
        <RadioGroup
          onValueChange={(value) => handleResponseChange(question.id, value)}
          className="flex flex-row space-x-2"
        >
          {range.map((value) => (
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
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.choices.map((choice) => (
              <div key={choice} className="flex items-center space-x-2">
                <Checkbox
                  id={`checkbox-${question.id}-${choice}`}
                  onCheckedChange={(checked) => 
                    handleResponseChange(question.id, choice, true)
                  }
                />
                <Label htmlFor={`checkbox-${question.id}-${choice}`}>{choice}</Label>
              </div>
            ))}
          </div>
        )
      case 'multiple_choice':
        return (
          <Select onValueChange={(value) => handleResponseChange(question.id, value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.choices.map((choice) => (
                <SelectItem key={choice} value={choice}>
                  {choice}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading survey...</div>
  }

  if (error) {
    return <div className="container mx-auto p-4">Error: {error}</div>
  }

  const survey = surveys.find(s => s.id === selectedSurvey)
  const surveyQuestions = questions.filter(q => q.surveyId === selectedSurvey)

  if (!survey) {
    return <div className="container mx-auto p-4">Survey not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Survey Page</h1>
      {submitted ? (
        <Card>
          <CardHeader>
            <CardTitle>Thank You!</CardTitle>
            <CardDescription>Your responses have been submitted successfully.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{survey.title}</CardTitle>
            <CardDescription>{survey.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {surveyQuestions.map((question) => (
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