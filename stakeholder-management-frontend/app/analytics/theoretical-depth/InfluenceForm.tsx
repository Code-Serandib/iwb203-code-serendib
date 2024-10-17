import { FormEvent, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { InfoIcon } from "lucide-react"
import axios from "axios"

type InfluenceValues = {
  power: number;
  legitimacy: number;
  urgency: number;
};

type SurveyQuestion = {
  question: string;
  options: string[];
};

const powerSurvey: SurveyQuestion[] = [
  {
    question: "What is the stakeholder's role in the organization?",
    options: ["Senior Manager", "Executive Director", "Middle Management", "Entry Level"]
  },
  {
    question: "How many direct reports does the stakeholder have?",
    options: ["0-5", "6-10", "11-20", "20+"]
  },
  {
    question: "Does the stakeholder have direct influence on board-level decisions?",
    options: ["Yes", "No"]
  },
  {
    question: "What is the annual budget under the stakeholder's control?",
    options: ["<$100,000", "$100,000-$500,000", "$500,000-$1,000,000", ">$1,000,000"]
  },
  {
    question: "Is the stakeholder recognized as a thought leader in the industry?",
    options: ["Yes", "No"]
  }
];

const legitimacySurvey: SurveyQuestion[] = [
  {
    question: "Does the stakeholder have a regulatory or compliance role?",
    options: ["Yes", "No"]
  },
  {
    question: "What is the stakeholder's official role in the project?",
    options: ["Project Sponsor", "Team Member", "External Consultant", "No Official Role"]
  },
  {
    question: "How long has the stakeholder been involved with the organization?",
    options: ["<1 year", "1-5 years", "5-10 years", "10+ years"]
  },
  {
    question: "Is the stakeholder recognized as a community leader?",
    options: ["Yes", "No"]
  },
  {
    question: "What is the stakeholder's level of expertise in the field?",
    options: ["Novice", "Intermediate", "Expert", "Thought Leader"]
  }
];

const urgencySurvey: SurveyQuestion[] = [
  {
    question: "How soon is the deadline for the stakeholder's issue?",
    options: ["Within a week", "Within a month", "Within 3 months", "No specific deadline"]
  },
  {
    question: "What is the severity of the stakeholder's issue?",
    options: ["Low", "Medium", "High", "Critical"]
  },
  {
    question: "Has the stakeholder filed any formal complaints?",
    options: ["Yes", "No"]
  },
  {
    question: "What is the potential impact on operations if the issue is not addressed?",
    options: ["Low", "Medium", "High", "Critical"]
  },
  {
    question: "How frequently does the stakeholder interact with the project or organization?",
    options: ["Daily", "Weekly", "Monthly", "Rarely"]
  }
];

function SurveyModal({ title, questions, onComplete }: { title: string; questions: SurveyQuestion[]; onComplete: (score: number) => void }) {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));

  const handleSubmit = () => {
    const score = answers.reduce((total, answer, index) => {
      const questionScore = questions[index].options.indexOf(answer) + 1;
      return total + questionScore;
    }, 0);
    const normalizedScore = (score / (questions.length * 4)) * 10;
    onComplete(normalizedScore);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={index}>
              <Label>{q.question}</Label>
              <RadioGroup value={answers[index]} onValueChange={(value) => {
                const newAnswers = [...answers];
                newAnswers[index] = value;
                setAnswers(newAnswers);
              }}>
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${index}-${optionIndex}`} />
                    <Label htmlFor={`${index}-${optionIndex}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleSubmit}>Submit Survey</Button>
      </div>
    </DialogContent>
  );
}

export default function InfluenceForm() {
  const [influenceValues, setInfluenceValues] = useState<InfluenceValues>({ power: 0, legitimacy: 0, urgency: 0 })
  const [stakeholderType, setStakeholderType] = useState<string>("")
  const [influenceResult, setInfluenceResult] = useState<number | null>(null)

  const handleInfluenceSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const se_metrics = {
        power: influenceValues.power,
        legitimacy: influenceValues.legitimacy,
        urgency: influenceValues.urgency,
        stakeholder_type: stakeholderType
    };

    try {
        const response = await axios.post('http://localhost:9091/api/influence_index_cal', se_metrics, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("influence res:", response.data);
        setInfluenceResult(response.data.influenceIndex.details.influence);
    } catch (error) {
        console.error('Error checking engagement drop:', error);
    }
  }

  const handleSurveyComplete = (factor: keyof InfluenceValues, score: number) => {
    setInfluenceValues(prev => ({ ...prev, [factor]: score }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* <h2 className="text-2xl font-bold mb-6 text-center">Influence Index Calculator</h2> */}
      <form onSubmit={handleInfluenceSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="power">Power (0-10)</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal title="Power Survey" questions={powerSurvey} onComplete={(score) => handleSurveyComplete('power', score)} />
            </Dialog>
          </div>
          <Input
            id="power"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={influenceValues.power}
            onChange={(e) => setInfluenceValues({ ...influenceValues, power: Number(e.target.value) })}
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="legitimacy">Legitimacy (0-10)</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal title="Legitimacy Survey" questions={legitimacySurvey} onComplete={(score) => handleSurveyComplete('legitimacy', score)} />
            </Dialog>
          </div>
          <Input
            id="legitimacy"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={influenceValues.legitimacy}
            onChange={(e) => setInfluenceValues({ ...influenceValues, legitimacy: Number(e.target.value) })}
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="urgency">Urgency (0-10)</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal title="Urgency Survey" questions={urgencySurvey} onComplete={(score) => handleSurveyComplete('urgency', score)} />
            </Dialog>
          </div>
          <Input
            id="urgency"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={influenceValues.urgency}
            onChange={(e) => setInfluenceValues({ ...influenceValues, urgency: Number(e.target.value) })}
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stakeholder-type">Stakeholder Type</Label>
          <Select onValueChange={setStakeholderType}>
            <SelectTrigger id="stakeholder-type" className="border-black">
              <SelectValue placeholder="Select stakeholder type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="investor">Investor</SelectItem>
              <SelectItem value="director">Director</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate Influence Index</Button>
      </form>
      {influenceResult !== null && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
          <p className="text-lg font-semibold text-black">Influence Index: {influenceResult.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">
            {influenceResult < 3 ? 'Low Influence' : influenceResult < 7 ? 'Medium Influence' : 'High Influence'}
          </p>
        </div>
      )}
    </div>
  )
}