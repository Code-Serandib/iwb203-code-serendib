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

const weSurvey: SurveyQuestion[] = [
  {
    question: "How often does the stakeholder engage with the project?",
    options: ["Rarely", "Monthly", "Weekly", "Daily"]
  },
  {
    question: "How would you rate the quality of the stakeholder's feedback?",
    options: ["Poor", "Fair", "Good", "Excellent"]
  },
  {
    question: "How responsive is the stakeholder to project updates or issues?",
    options: ["Very slow", "Slow", "Timely", "Very quick"]
  },
  {
    question: "What is the stakeholder's role in the project?",
    options: ["Observer", "Contributor", "Key Decision Maker", "Project Sponsor"]
  }
];

const wiSurvey: SurveyQuestion[] = [
  {
    question: "What level of formal authority does the stakeholder have?",
    options: ["Low", "Medium", "High", "Very High"]
  },
  {
    question: "How much informal influence does the stakeholder have?",
    options: ["Minimal", "Some", "Significant", "Extensive"]
  },
  {
    question: "How much control does the stakeholder have over project resources?",
    options: ["No control", "Limited control", "Moderate control", "Full control"]
  },
  {
    question: "How often has the stakeholder's opinion significantly affected past projects?",
    options: ["Rarely", "Sometimes", "Often", "Always"]
  }
];

const wsSurvey: SurveyQuestion[] = [
  {
    question: "How relevant is this project to the stakeholder's objectives?",
    options: ["Not relevant", "Somewhat relevant", "Relevant", "Highly relevant"]
  },
  {
    question: "How much does the stakeholder stand to gain from the project's success?",
    options: ["Minimal gain", "Some gain", "Significant gain", "Major gain"]
  },
  {
    question: "How much risk does the stakeholder face if the project fails?",
    options: ["No risk", "Low risk", "Moderate risk", "High risk"]
  },
  {
    question: "How directly does the project impact the stakeholder's area of responsibility?",
    options: ["Indirectly", "Somewhat directly", "Directly", "Critically"]
  }
];

const eiSurvey: SurveyQuestion[] = [
  {
    question: "How actively does the stakeholder participate in project activities?",
    options: ["Rarely participates", "Sometimes participates", "Often participates", "Always participates"]
  },
  {
    question: "How frequently does the stakeholder communicate with the project team?",
    options: ["Rarely", "Occasionally", "Regularly", "Very frequently"]
  },
  {
    question: "How proactive is the stakeholder in offering ideas or suggestions?",
    options: ["Not proactive", "Somewhat proactive", "Proactive", "Highly proactive"]
  },
  {
    question: "How engaged is the stakeholder in project decision-making processes?",
    options: ["Not engaged", "Somewhat engaged", "Engaged", "Highly engaged"]
  }
];

const iiSurvey: SurveyQuestion[] = [
  {
    question: "How much control does the stakeholder have over the project budget?",
    options: ["No control", "Limited control", "Significant control", "Full control"]
  },
  {
    question: "What is the stakeholder's position in the organizational hierarchy?",
    options: ["Entry-level", "Mid-level", "Senior-level", "Executive"]
  },
  {
    question: "How influential is the stakeholder through informal networks or relationships?",
    options: ["Not influential", "Somewhat influential", "Influential", "Highly influential"]
  },
  {
    question: "How much can the stakeholder impact project decisions?",
    options: ["Minimal impact", "Some impact", "Significant impact", "Critical impact"]
  }
];

const siSurvey: SurveyQuestion[] = [
  {
    question: "How much does the project's outcome directly impact the stakeholder's role?",
    options: ["Minimal impact", "Moderate impact", "Significant impact", "Critical impact"]
  },
  {
    question: "How well does the project align with the stakeholder's organizational goals?",
    options: ["Poor alignment", "Some alignment", "Good alignment", "Perfect alignment"]
  },
  {
    question: "How personally invested is the stakeholder in the project's success?",
    options: ["Not invested", "Somewhat invested", "Invested", "Highly invested"]
  },
  {
    question: "How much does the project affect the stakeholder's long-term objectives?",
    options: ["Minimal effect", "Some effect", "Significant effect", "Major effect"]
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

export default function EPSComponent() {
  const [epsData, setEpsData] = useState<{ EPSi: number; priority: string } | null>(null);
  const [formData, setFormData] = useState({
    We: 0.0,
    Wi: 0.0,
    Ws: 0.0,
    Ei: 0.0,
    Ii: 0.0,
    Si: 0.0
  });

  const calculateEPS = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:9091/api/priority_score', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      const { EpsResult } = response.data;
      setEpsData({
        EPSi: EpsResult.EPSi,
        priority: EpsResult.priority
      });
    } catch (error) {
      console.error('Error calculating EPS score:', error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: parseFloat(value) }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* <h2 className="text-2xl font-bold mb-6 text-center">Engagement Priority Score Calculator</h2> */}
      <form onSubmit={calculateEPS} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="We">We (Weight for Engagement)</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Weight for Engagement Survey" 
                questions={weSurvey} 
                onComplete={(score) => handleInputChange('We', score.toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="We"
            name="We"
            min={0}
            max={1}
            step={0.01}
            value={formData.We}
            onChange={(e) => handleInputChange('We', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Wi">Wi (Weight for Influence)</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Weight for Influence Survey" 
                questions={wiSurvey} 
                onComplete={(score) => handleInputChange('Wi', score.toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="Wi"
            name="Wi"
            min={0}
            max={1}
            step={0.01}
            value={formData.Wi}
            onChange={(e) => handleInputChange('Wi', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Ws">Ws (Weight for Stakeholder Interest)</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Weight for Stakeholder Interest Survey" 
                questions={wsSurvey} 
                onComplete={(score) => handleInputChange('Ws', score.toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="Ws"
            name="Ws"
            min={0}
            max={1}
            step={0.01}
            value={formData.Ws}
            onChange={(e) => handleInputChange('Ws', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Ei">Ei (Engagement Level)</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Engagement Level Survey" 
                questions={eiSurvey} 
                onComplete={(score) => handleInputChange('Ei', (score * 10).toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="Ei"
            name="Ei"
            min={0}
            max={10}
            step={0.1}
            value={formData.Ei}
            onChange={(e) => handleInputChange('Ei', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Ii">Ii (Influence Level)</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Influence Level Survey" 
                questions={iiSurvey} 
                onComplete={(score) => handleInputChange('Ii', (score * 10).toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="Ii"
            name="Ii"
            min={0}
            max={10}
            step={0.1}
            value={formData.Ii}
            onChange={(e) => handleInputChange('Ii', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Si">Si (Stakeholder Interest)</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <SurveyModal 
                title="Stakeholder Interest Survey" 
                questions={siSurvey} 
                onComplete={(score) => handleInputChange('Si', (score * 10).toString())} 
              />
            </Dialog>
          </div>
          <Input
            type="number"
            id="Si"
            name="Si"
            min={0}
            max={10}
            step={0.1}
            value={formData.Si}
            onChange={(e) => handleInputChange('Si', e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate EPS</Button>
      </form>

      

      {epsData && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
          <p className="text-lg font-semibold text-black">
            EPS Score: {epsData.EPSi.toFixed(2)}
          </p>
          <p className="text-lg font-semibold text-black">
            Priority: {epsData.priority}
          </p>
        </div>
      )}
    </div>
  );
}