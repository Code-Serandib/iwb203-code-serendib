import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { InfoIcon } from "lucide-react"
import axios from 'axios'

type SurveyQuestion = {
  question: string;
  options: string[];
};

const alphaSurvey: SurveyQuestion[] = [
  {
    question: "How active has the stakeholder been in past engagements?",
    options: ["Not active", "Somewhat active", "Active", "Very active"]
  },
  {
    question: "What level of influence does the stakeholder have on organizational outcomes?",
    options: ["Low influence", "Some influence", "High influence", "Critical influence"]
  },
  {
    question: "How critical is this stakeholder relationship to the organization's mission?",
    options: ["Not critical", "Somewhat critical", "Critical", "Extremely critical"]
  },
  {
    question: "What has been the trend of the stakeholder's engagement over time?",
    options: ["Decreasing", "Stable", "Slightly increasing", "Significantly increasing"]
  },
  {
    question: "How valuable has the stakeholder's input been in past engagements?",
    options: ["Not valuable", "Somewhat valuable", "Valuable", "Highly valuable"]
  }
];

const betaSurvey: SurveyQuestion[] = [
  {
    question: "How significant is the stakeholder's financial contribution to the organization?",
    options: ["Minimal", "Moderate", "Significant", "Critical"]
  },
  {
    question: "To what extent is the stakeholder involved in internal processes or efficiency improvements?",
    options: ["Not involved", "Somewhat involved", "Involved", "Heavily involved"]
  },
  {
    question: "How closely aligned are the stakeholder's goals with the organization's strategic metrics?",
    options: ["Not aligned", "Somewhat aligned", "Aligned", "Perfectly aligned"]
  },
  {
    question: "What is the stakeholder's impact on customer satisfaction or retention?",
    options: ["Minimal impact", "Some impact", "Significant impact", "Critical impact"]
  },
  {
    question: "How much does the stakeholder contribute to innovation or learning within the organization?",
    options: ["Minimal contribution", "Some contribution", "Significant contribution", "Leading contributor"]
  }
];

const epsiSurvey: SurveyQuestion[] = [
  {
    question: "How frequently does the stakeholder engage with the organization?",
    options: ["Rarely", "Occasionally", "Regularly", "Very frequently"]
  },
  {
    question: "How would you rate the quality of the stakeholder's input or feedback?",
    options: ["Poor", "Fair", "Good", "Excellent"]
  },
  {
    question: "How responsive is the stakeholder in providing feedback or making decisions?",
    options: ["Not responsive", "Somewhat responsive", "Responsive", "Highly responsive"]
  },
  {
    question: "How consistent has the stakeholder's engagement been over time?",
    options: ["Inconsistent", "Somewhat consistent", "Consistent", "Highly consistent"]
  },
  {
    question: "To what extent has the stakeholder contributed to key organizational decisions?",
    options: ["No contribution", "Minor contribution", "Moderate contribution", "Major contribution"]
  }
];

const bsciSurvey: SurveyQuestion[] = [
  {
    question: "How has the stakeholder impacted the organization's financial performance?",
    options: ["Negative impact", "No impact", "Positive impact", "Significant positive impact"]
  },
  {
    question: "What effect has the stakeholder had on customer satisfaction or loyalty?",
    options: ["Decreased", "No change", "Improved", "Significantly improved"]
  },
  {
    question: "How has the stakeholder contributed to internal process improvements?",
    options: ["No contribution", "Minor improvements", "Moderate improvements", "Major improvements"]
  },
  {
    question: "To what extent has the stakeholder fostered learning and growth within the organization?",
    options: ["Not at all", "To a small extent", "To a moderate extent", "To a great extent"]
  },
  {
    question: "How has the stakeholder influenced innovation within the organization?",
    options: ["No influence", "Some influence", "Significant influence", "Transformative influence"]
  }
];

function SurveyModal({ title, questions, onComplete }: { title: string; questions: SurveyQuestion[]; onComplete: (score: number) => void }) {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));

  const handleSubmit = () => {
    const score = answers.reduce((total, answer, index) => {
      const questionScore = questions[index].options.indexOf(answer) + 1;
      return total + questionScore;
    }, 0);
    const normalizedScore = score / (questions.length * 4);
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

export default function TESComponent() {
  const [tesData, setTesData] = useState<{ TESi: number; priority: string } | null>(null);
  const [formData, setFormData] = useState({
    alpha: 0.0,
    beta: 0.0,
    EPSi: 0.0,
    BSCi: 0.0
  });

  const calculateTES = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:9091/api/engagement_score', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      const { TscResult } = response.data;
      setTesData({
        TESi: TscResult.TESi,
        priority: TscResult.priority
      });
    } catch (error) {
      console.error('Error calculating TES score:', error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: parseFloat(value) }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* <h2 className="text-2xl font-bold mb-6 text-center">Total Engagement Score (TES) Calculator</h2> */}
      <form onSubmit={calculateTES} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="alpha">Alpha (Weight for EPS) 0 - 1</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Alpha (Weight for EPS) Survey" 
                questions={alphaSurvey} 
                onComplete={(score) => handleInputChange('alpha', score.toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="alpha"
            name="alpha"
            min={0}
            max={1}
            step={0.01}
            value={formData.alpha}
            onChange={(e) => handleInputChange('alpha', e.target.value)}
            required
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="beta">Beta (Weight for BSC) 0 - 1</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Beta (Weight for BSC) Survey" 
                questions={betaSurvey} 
                onComplete={(score) => handleInputChange('beta', score.toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="beta"
            name="beta"
            min={0}
            max={1}
            step={0.01}
            value={formData.beta}
            onChange={(e) => handleInputChange('beta', e.target.value)}
            required
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="EPSi">EPSi (Engagement Performance Score) 0 - 1</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Engagement Performance Score (EPSi) Survey" 
                questions={epsiSurvey} 
                onComplete={(score) => handleInputChange('EPSi', (score * 5).toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="EPSi"
            name="EPSi"
            min={0}
            max={5}
            step={0.01}
            value={formData.EPSi}
            onChange={(e) => handleInputChange('EPSi', e.target.value)}
            required
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="BSCi">BSCi (Balanced Scorecard Index) 0 - 1</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Balanced Scorecard Index (BSCi) Survey" 
                questions={bsciSurvey} 
                onComplete={(score) => handleInputChange('BSCi', (score * 5).toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="BSCi"
            name="BSCi"
            min={0}
            max={5}
            step={0.01}
            value={formData.BSCi}
            onChange={(e) => handleInputChange('BSCi', e.target.value)}
            required
            className="border-black"
          />
        </div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
          Calculate TES
        </Button>
      </form>

      {tesData && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
          <p className="text-lg font-semibold text-black">
            TES Score: {tesData.TESi.toFixed(2)}
          </p>
          <p className="text-lg font-semibold text-black">
            Priority: {tesData.priority}
          </p>
        </div>
      )}
    </div>
  );
}