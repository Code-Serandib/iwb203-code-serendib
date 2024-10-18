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

const wfSurvey: SurveyQuestion[] = [
  {
    question: "What is the stakeholder's primary role in the organization?",
    options: ["Investor", "Financial Officer", "Executive", "Other"]
  },
  {
    question: "How much capital has the stakeholder invested in the project?",
    options: ["None", "Low", "Medium", "High"]
  },
  {
    question: "What level of ROI does the stakeholder expect?",
    options: ["Low (<5%)", "Medium (5-15%)", "High (15-25%)", "Very High (>25%)"]
  },
  {
    question: "How important is revenue growth to the stakeholder?",
    options: ["Not Important", "Somewhat Important", "Important", "Very Important"]
  },
  {
    question: "How much does the stakeholder prioritize profit margins?",
    options: ["Low Priority", "Medium Priority", "High Priority", "Top Priority"]
  }
];

const wcSurvey: SurveyQuestion[] = [
  {
    question: "What is the stakeholder's focus on customer satisfaction?",
    options: ["Low", "Medium", "High", "Very High"]
  },
  {
    question: "How important is market research to the stakeholder?",
    options: ["Not Important", "Somewhat Important", "Important", "Very Important"]
  },
  {
    question: "What priority does the stakeholder give to customer retention?",
    options: ["Low Priority", "Medium Priority", "High Priority", "Top Priority"]
  },
  {
    question: "How much does the stakeholder value brand image?",
    options: ["Not Valued", "Somewhat Valued", "Valued", "Highly Valued"]
  },
  {
    question: "What importance does the stakeholder place on Net Promoter Score (NPS)?",
    options: ["Low Importance", "Medium Importance", "High Importance", "Critical Importance"]
  }
];

const wpSurvey: SurveyQuestion[] = [
  {
    question: "How much does the stakeholder focus on operational efficiency?",
    options: ["Low Focus", "Medium Focus", "High Focus", "Very High Focus"]
  },
  {
    question: "What priority does the stakeholder give to process optimization?",
    options: ["Low Priority", "Medium Priority", "High Priority", "Top Priority"]
  },
  {
    question: "How important are operational KPIs to the stakeholder?",
    options: ["Not Important", "Somewhat Important", "Important", "Very Important"]
  },
  {
    question: "What level of interest does the stakeholder have in supply chain efficiency?",
    options: ["Low Interest", "Medium Interest", "High Interest", "Very High Interest"]
  },
  {
    question: "How much does the stakeholder value innovation in processes?",
    options: ["Low Value", "Medium Value", "High Value", "Very High Value"]
  }
];

const wlSurvey: SurveyQuestion[] = [
  {
    question: "How much does the stakeholder prioritize employee learning and development?",
    options: ["Low Priority", "Medium Priority", "High Priority", "Top Priority"]
  },
  {
    question: "What is the stakeholder's focus on innovation?",
    options: ["Low Focus", "Medium Focus", "High Focus", "Very High Focus"]
  },
  {
    question: "How important is talent development to the stakeholder?",
    options: ["Not Important", "Somewhat Important", "Important", "Very Important"]
  },
  {
    question: "What priority does the stakeholder give to technology adoption?",
    options: ["Low Priority", "Medium Priority", "High Priority", "Top Priority"]
  },
  {
    question: "How much does the stakeholder value employee satisfaction and retention?",
    options: ["Low Value", "Medium Value", "High Value", "Very High Value"]
  }
];

const fiSurvey: SurveyQuestion[] = [
  {
    question: "How much has revenue grown due to the stakeholder's influence?",
    options: ["No Growth", "Slight Growth (1-5%)", "Moderate Growth (5-15%)", "Significant Growth (>15%)"]
  },
  {
    question: "To what extent has the stakeholder contributed to cost savings?",
    options: ["No Savings", "Minor Savings", "Moderate Savings", "Major Savings"]
  },
  {
    question: "How has the stakeholder impacted profitability?",
    options: ["No Impact", "Slight Improvement", "Moderate Improvement", "Significant Improvement"]
  },
  {
    question: "What level of return on investment has the stakeholder achieved?",
    options: ["Below Expectations", "Met Expectations", "Exceeded Expectations", "Far Exceeded Expectations"]
  },
  {
    question: "How has the stakeholder improved cash flow management?",
    options: ["No Improvement", "Slight Improvement", "Moderate Improvement", "Significant Improvement"]
  }
];

const ciSurvey: SurveyQuestion[] = [
  {
    question: "How have customer satisfaction ratings changed due to the stakeholder's efforts?",
    options: ["Decreased", "No Change", "Slight Increase", "Significant Increase"]
  },
  {
    question: "What impact has the stakeholder had on customer retention rates?",
    options: ["Negative Impact", "No Impact", "Positive Impact", "Highly Positive Impact"]
  },
  {
    question: "How has the stakeholder influenced market share?",
    options: ["Decreased", "No Change", "Slight Increase", "Significant Increase"]
  },
  {
    question: "To what extent has the stakeholder improved brand perception?",
    options: ["Worsened", "No Change", "Slight Improvement", "Significant Improvement"]
  },
  {
    question: "How has the number of customer complaints changed due to the stakeholder's influence?",
    options: ["Increased", "No Change", "Slight Decrease", "Significant Decrease"]
  }
];

const piSurvey: SurveyQuestion[] = [
  {
    question: "How much has process efficiency improved due to the stakeholder's contributions?",
    options: ["No Improvement", "Slight Improvement", "Moderate Improvement", "Significant Improvement"]
  },
  {
    question: "To what extent has the stakeholder reduced operational costs?",
    options: ["No Reduction", "Minor Reduction", "Moderate Reduction", "Major Reduction"]
  },
  {
    question: "How has the stakeholder impacted productivity?",
    options: ["Decreased", "No Change", "Slight Increase", "Significant Increase"]
  },
  {
    question: "What level of automation or innovation has the stakeholder introduced?",
    options: ["None", "Low", "Medium", "High"]
  },
  {
    question: "How much has the stakeholder contributed to waste reduction?",
    options: ["No Contribution", "Minor Contribution", "Moderate Contribution", "Major Contribution"]
  }
];

const liSurvey: SurveyQuestion[] = [
  {
    question: "How has the stakeholder contributed to employee training programs?",
    options: ["No Contribution", "Minor Contribution", "Moderate Contribution", "Major Contribution"]
  },
  {
    question: "To what extent has the stakeholder fostered innovation initiatives?",
    options: ["Not at All", "To a Small Extent", "To a Moderate Extent", "To a Great Extent"]
  },
  {
    question: "How has the stakeholder influenced technology adoption?",
    options: ["Negatively", "No Influence", "Positive Influence", "Highly Positive Influence"]
  },
  {
    question: "What impact has the stakeholder had on organizational learning?",
    options: ["Negative Impact", "No Impact", "Positive Impact", "Highly Positive Impact"]
  },
  {
    question: "How has employee engagement changed due to the stakeholder's efforts?",
    options: ["Decreased", "No Change", "Slight Increase", "Significant Increase"]
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

export default function BSCForm() {
  const [bscData, setBscData] = useState<{ BSCi: number; decision: string } | null>(null);
  const [formData, setFormData] = useState({
    Wf: 0.0,
    Wc: 0.0,
    Wp: 0.0,
    Wl: 0.0,
    Fi: 0.0,
    Ci: 0.0,
    Pi: 0.0,
    Li: 0.0
  });

  const calculateBSC = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:9091/api/balanced_score', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      const { BscResult } = response.data;
      setBscData({
        BSCi: BscResult.BSCi,
        decision: BscResult.decision
      });
    } catch (error) {
      console.error('Error calculating BSC score:', error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: parseFloat(value) }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* <h2 className="text-2xl font-bold mb-6 text-center">Balanced Scorecard (BSC) Calculator</h2> */}
      <form onSubmit={calculateBSC} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Wf">Wf (Weight for Financial)  0 - 1</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Weight for Financial Survey" 
                questions={wfSurvey} 
                onComplete={(score) => handleInputChange('Wf', score.toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="Wf"
            name="Wf"
            min={0}
            max={1}
            step={0.01}
            value={formData.Wf}
            onChange={(e) => handleInputChange('Wf', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Wc">Wc (Weight for Customer)  0 - 1</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Weight for Customer Survey" 
                questions={wcSurvey} 
                onComplete={(score) => handleInputChange('Wc', score.toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="Wc"
            name="Wc"
            min={0}
            max={1}
            step={0.01}
            value={formData.Wc}
            onChange={(e) => handleInputChange('Wc', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Wp">Wp (Weight for Process)  0 - 1</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Weight for Process Survey" 
                questions={wpSurvey} 
                onComplete={(score) => handleInputChange('Wp', score.toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="Wp"
            name="Wp"
            min={0}
            max={1}
            step={0.01}
            value={formData.Wp}
            
            onChange={(e) => handleInputChange('Wp', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Wl">Wl (Weight for Learning & Growth) 0 - 1</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Weight for Learning & Growth Survey" 
                questions={wlSurvey} 
                onComplete={(score) => handleInputChange('Wl', score.toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="Wl"
            name="Wl"
            min={0}
            max={1}
            step={0.01}
            value={formData.Wl}
            onChange={(e) => handleInputChange('Wl', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Fi">Fi (Financial Impact) 0 - 5</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Financial Impact Survey" 
                questions={fiSurvey} 
                onComplete={(score) => handleInputChange('Fi', (score * 5).toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="Fi"
            name="Fi"
            min={0}
            max={5}
            step={0.01}
            value={formData.Fi}
            onChange={(e) => handleInputChange('Fi', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Ci">Ci (Customer Impact) 0 - 5</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Customer Impact Survey" 
                questions={ciSurvey} 
                onComplete={(score) => handleInputChange('Ci', (score * 5).toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="Ci"
            name="Ci"
            min={0}
            max={5}
            step={0.01}
            value={formData.Ci}
            onChange={(e) => handleInputChange('Ci', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Pi">Pi (Process Impact) 0 - 5</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Process Impact Survey" 
                questions={piSurvey} 
                onComplete={(score) => handleInputChange('Pi', (score * 5).toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="Pi"
            name="Pi"
            min={0}
            max={5}
            step={0.01}
            value={formData.Pi}
            onChange={(e) => handleInputChange('Pi', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Li">Li (Learning & Growth Impact) 0 - 5</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Learning & Growth Impact Survey" 
                questions={liSurvey} 
                onComplete={(score) => handleInputChange('Li', (score * 5).toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="Li"
            name="Li"
            min={0}
            max={5}
            step={0.01}
            value={formData.Li}
            onChange={(e) => handleInputChange('Li', e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate BSC Score</Button>
      </form>

      {bscData && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
          <p className="text-lg font-semibold text-black">
            BSC Score: {bscData.BSCi.toFixed(2)}
          </p>
          <p className="text-lg font-semibold text-black">
            Decision: {bscData.decision}
          </p>
        </div>
      )}
    </div>
  );
}