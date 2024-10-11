import { FormEvent, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { InfoIcon } from "lucide-react"
import axios from "axios"

export default function SocialExchangeCalculator() {
  const [benefit, setBenefit] = useState<number>(0)
  const [cost, setCost] = useState<number>(0)
  const [relationshipValue, setRelationshipValue] = useState<number | null>(null)

  const handleSocialExchangeSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const stakeholderRelation = {
      benefit: benefit,
      cost: cost
    };

    try {
      const response = await axios.post('http://localhost:9091/api/social_exchange_cal', stakeholderRelation, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("RelationshipValue res:", response.data);
      setRelationshipValue(response.data.socialExchange.details.relationshipValue);
    } catch (error) {
      console.error('Error calculating social exchange:', error);
    }
  }

  const calculateBenefitFromSurvey = (surveyResults: Record<string, number>) => {
    const weights = {
      financial: 0.4,
      strategic: 0.3,
      operational: 0.2,
      social: 0.1
    }
    const weightedSum = Object.entries(surveyResults).reduce((sum, [key, value]) => {
      return sum + (weights[key as keyof typeof weights] * value / 5)
    }, 0)
    return Math.round(weightedSum * 100)
  }

  const calculateCostFromSurvey = (surveyResults: Record<string, number>) => {
    const weights = {
      financial: 0.4,
      strategic: 0.3,
      operational: 0.2,
      reputational: 0.1
    }
    const weightedSum = Object.entries(surveyResults).reduce((sum, [key, value]) => {
      return sum + (weights[key as keyof typeof weights] * value / 5) 
    }, 0)
    return Math.round(weightedSum * 100) 
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* <h2 className="text-2xl font-bold mb-6 text-center">Social Exchange Calculator</h2> */}
      <form onSubmit={handleSocialExchangeSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="benefit">Benefit</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Stakeholder Benefit Survey</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh] overflow-y-auto">
                  <BenefitSurvey onComplete={(result) => setBenefit(calculateBenefitFromSurvey(result))} />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          <Input
            id="benefit"
            type="number"
            value={benefit}
            onChange={(e) => setBenefit(Number(e.target.value))}
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="cost">Cost</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Stakeholder Cost Survey</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh] overflow-y-auto">
                  <CostSurvey onComplete={(result) => setCost(calculateCostFromSurvey(result))} />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          <Input
            id="cost"
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="border-black"
          />
        </div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate Social Exchange</Button>
      </form>
      
      {relationshipValue !== null && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
          <h3 className="text-lg font-semibold text-black mb-2">Relationship Value</h3>
          <p>{relationshipValue}</p>
        </div>
      )}
    </div>
  )
}

function BenefitSurvey({ onComplete }: { onComplete: (result: Record<string, number>) => void }) {
  const [surveyResults, setSurveyResults] = useState({
    financial: 0,
    strategic: 0,
    operational: 0,
    social: 0
  })

  const handleChange = (category: string, value: number) => {
    setSurveyResults(prev => ({ ...prev, [category]: value }))
  }

  const handleSubmit = () => {
    onComplete(surveyResults)
  }

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Financial Benefits</h3>
        <SurveyQuestion
          question="How significant is the revenue contribution from this stakeholder?"
          onChange={(value) => handleChange('financial', value)}
        />
        <SurveyQuestion
          question="To what extent does this stakeholder contribute to cost reductions?"
          onChange={(value) => handleChange('financial', value)}
        />
        <SurveyQuestion
          question="How valuable are the investments or funding provided by this stakeholder?"
          onChange={(value) => handleChange('financial', value)}
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Strategic Benefits</h3>
        <SurveyQuestion
          question="How much does this stakeholder contribute to market access and expansion?"
          onChange={(value) => handleChange('strategic', value)}
        />
        <SurveyQuestion
          question="How valuable is the knowledge and expertise shared by this stakeholder?"
          onChange={(value) => handleChange('strategic', value)}
        />
        <SurveyQuestion
          question="To what extent does this stakeholder enhance your brand image and reputation?"
          onChange={(value) => handleChange('strategic', value)}
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Operational Benefits</h3>
        <SurveyQuestion
          question="How much does this stakeholder contribute to process efficiency improvements?"
          onChange={(value) => handleChange('operational', value)}
        />
        <SurveyQuestion
          question="To what extent does this stakeholder contribute to workforce and skill development?"
          onChange={(value) => handleChange('operational', value)}
        />
        <SurveyQuestion
          question="How much does this stakeholder improve service delivery or project timelines?"
          onChange={(value) => handleChange('operational', value)}
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social and Ethical Benefits</h3>
        <SurveyQuestion
          question="How significant are this stakeholder's contributions to CSR initiatives?"
          onChange={(value) => handleChange('social', value)}
        />
        <SurveyQuestion
          question="To what extent does this stakeholder contribute to sustainability goals?"
          onChange={(value) => handleChange('social', value)}
        />
        <SurveyQuestion
          question="How much does this stakeholder promote diversity and inclusion?"
          onChange={(value) => handleChange('social', value)}
        />
      </div>
      <Button onClick={handleSubmit} className="w-full">Submit Survey</Button>
    </div>
  )
}

function CostSurvey({ onComplete }: { onComplete: (result: Record<string, number>) => void }) {
  const [surveyResults, setSurveyResults] = useState({
    financial: 0,
    strategic: 0,
    operational: 0,
    reputational: 0
  })

  const handleChange = (category: string, value: number) => {
    setSurveyResults(prev => ({ ...prev, [category]: value }))
  }

  const handleSubmit = () => {
    onComplete(surveyResults)
  }

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Financial Costs</h3>
        <SurveyQuestion
          question="How significant are the direct monetary expenditures associated with this stakeholder?"
          onChange={(value) => handleChange('financial', value)}
        />
        <SurveyQuestion
          question="To what extent does this stakeholder require allocation of employee resources?"
          onChange={(value) => handleChange('financial', value)}
        />
        <SurveyQuestion
          question="How substantial are the project funding and support costs for this stakeholder?"
          onChange={(value) => handleChange('financial', value)}
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Strategic Costs</h3>
        <SurveyQuestion
          question="How significant are the opportunity costs associated with this stakeholder?"
          onChange={(value) => handleChange('strategic', value)}
        />
        <SurveyQuestion
          question="To what extent does this stakeholder require investment in risk management?"
          onChange={(value) => handleChange('strategic', value)}
        />
        <SurveyQuestion
          question="How much effort is required to align this stakeholder's vision with organizational goals?"
          onChange={(value) => handleChange('strategic', value)}
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Operational Costs</h3>
        <SurveyQuestion
          question="How significant are the process and workflow disruptions caused by this stakeholder?"
          onChange={(value) => handleChange('operational', value)}
        />
        <SurveyQuestion
          question="To what extent does this stakeholder increase supply chain and logistics costs?"
          onChange={(value) => handleChange('operational', value)}
        />
        <SurveyQuestion
          question="How much does this stakeholder contribute to complexity in operations management?"
          onChange={(value) => handleChange('operational', value)}
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reputational Costs</h3>
        <SurveyQuestion
          question="How significant is the potential for negative publicity associated with this stakeholder?"
          onChange={(value) => handleChange('reputational', value)}
        />
        <SurveyQuestion
          question="To what extent could this stakeholder negatively impact your brand image?"
          onChange={(value) => handleChange('reputational', value)}
        />
        <SurveyQuestion
          question="How much risk does this stakeholder pose to your organization's ethical standards?"
          onChange={(value) => handleChange('reputational', value)}
        />
      </div>
      <Button onClick={handleSubmit} className="w-full">Submit Survey</Button>
    </div>
  )
}

function SurveyQuestion({ question, onChange }: { question: string; onChange: (value: number) => void }) {
  return (
    <div className="space-y-2">
      <p className="font-medium">{question}</p>
      <RadioGroup onValueChange={(value) => onChange(Number(value))}>
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5].map((value) => (
            <div key={value} className="flex flex-col items-center">
              <RadioGroupItem value={value.toString()} id={`q-${value}`} />
              <Label htmlFor={`q-${value}`}>{value}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}