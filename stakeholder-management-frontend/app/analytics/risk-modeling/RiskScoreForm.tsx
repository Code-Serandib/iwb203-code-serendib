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

const wsSurvey: SurveyQuestion[] = [
    {
        question: "What is the stakeholder's role in the organization?",
        options: ["Entry-level", "Middle management", "Senior management", "Executive"]
    },
    {
        question: "How frequently has this stakeholder been involved in similar projects?",
        options: ["Never", "Rarely", "Occasionally", "Frequently"]
    },
    {
        question: "What is the level of financial or resource contribution from this stakeholder?",
        options: ["None", "Low", "Medium", "High"]
    },
    {
        question: "How dependent is the project on this stakeholder's department or input?",
        options: ["Not dependent", "Slightly dependent", "Moderately dependent", "Highly dependent"]
    },
    {
        question: "How many meetings or interactions has this stakeholder been involved in previously?",
        options: ["0-2", "3-5", "6-10", "More than 10"]
    }
];

const weSurvey: SurveyQuestion[] = [
    {
        question: "How satisfied was the stakeholder with the project outcome?",
        options: ["Very dissatisfied", "Dissatisfied", "Satisfied", "Very satisfied"]
    },
    {
        question: "How would you rate the stakeholder's actual contribution to the project?",
        options: ["Minimal", "Below expectations", "Met expectations", "Exceeded expectations"]
    },
    {
        question: "Did the stakeholder's role or priorities change during the project?",
        options: ["Significantly decreased", "Slightly decreased", "Remained the same", "Increased"]
    },
    {
        question: "How did the project outcome affect the stakeholder's importance?",
        options: ["Decreased significantly", "Decreased slightly", "No change", "Increased"]
    },
    {
        question: "How would you characterize the stakeholder's support or conflicts during the project?",
        options: ["Major conflicts", "Minor conflicts", "Neutral", "Supportive", "Highly supportive"]
    }
];

const siSurvey: SurveyQuestion[] = [
    {
        question: "Where does the stakeholder fall on the power-interest grid?",
        options: ["Low power, low interest", "Low power, high interest", "High power, low interest", "High power, high interest"]
    },
    {
        question: "What level of decision-making authority does the stakeholder have?",
        options: ["No authority", "Limited authority", "Significant authority", "Final decision maker"]
    },
    {
        question: "How much influence does this stakeholder have over other stakeholders?",
        options: ["No influence", "Some influence", "Moderate influence", "High influence"]
    },
    {
        question: "How dependent is the project on this stakeholder's inputs?",
        options: ["Not dependent", "Slightly dependent", "Moderately dependent", "Highly dependent"]
    },
    {
        question: "How has this stakeholder influenced similar projects in the past?",
        options: ["Negatively", "No influence", "Slightly positive", "Significantly positive"]
    }
];

const eiSurvey: SurveyQuestion[] = [
    {
        question: "What is the stakeholder's participation rate in project meetings and activities?",
        options: ["Rarely attends", "Sometimes attends", "Often attends", "Always attends"]
    },
    {
        question: "How quickly does the stakeholder respond to project-related communications?",
        options: ["Very slow", "Slow", "Timely", "Very quick"]
    },
    {
        question: "How would you rate the quality and quantity of feedback provided by the stakeholder?",
        options: ["Poor", "Fair", "Good", "Excellent"]
    },
    {
        question: "How proactive is the stakeholder in taking initiatives or volunteering for tasks?",
        options: ["Not proactive", "Somewhat proactive", "Proactive", "Highly proactive"]
    },
    {
        question: "How effective is the stakeholder in problem-solving and clearing roadblocks?",
        options: ["Not effective", "Somewhat effective", "Effective", "Highly effective"]
    }
];

function SurveyModal({ title, questions, onComplete }: { title: string; questions: SurveyQuestion[]; onComplete: (score: number) => void }) {
    const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));

    const handleSubmit = () => {
        const score = answers.reduce((total, answer, index) => {
            const questionScore = questions[index].options.indexOf(answer) + 1;
            return total + questionScore;
        }, 0);
        const normalizedScore = (score / (questions.length * questions[0].options.length)).toFixed(2); // Normalize to 0-1 scale
        onComplete(parseFloat(normalizedScore));
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

export default function RiskScoreForm() {
    const [riskScoreData, setRiskScoreData] = useState<{ riskScore: number; riskLevel: string } | null>(null);
    const [formData, setFormData] = useState({
        Ws: 0.0,
        We: 0.0,
        Si: 0.0,
        Ei: 0.0
    });

    const calculateRiskScore = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:9091/api/risk_score', formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            const { riskScore } = response.data;
            setRiskScoreData({
                riskScore: riskScore.riskScore,
                riskLevel: riskScore.riskLevel
            });
        } catch (error) {
            console.error('Error calculating risk score:', error);
        }
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: parseFloat(value) }));
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {/* <h2 className="text-2xl font-bold mb-6 text-center">Risk Score Calculator</h2> */}
            <form onSubmit={calculateRiskScore} className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="Ws">Ws (Stakeholder Weight Start) 0 - 1</Label>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <InfoIcon className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <SurveyModal 
                                title="Stakeholder Weight Start Survey" 
                                questions={wsSurvey} 
                                onComplete={(score) => handleInputChange('Ws', score.toString())} 
                            />
                        </Dialog>
                    </div>
                    <Input
                        type="number"
                        id="Ws"
                        name="Ws"
                        value={formData.Ws}
                        onChange={(e) => handleInputChange('Ws', e.target.value)}
                        min={0}
                        max={1}
                        step={0.01}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="We">We (Stakeholder Weight End) 0 - 1</Label>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <InfoIcon className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <SurveyModal 
                                title="Stakeholder Weight End Survey" 
                                questions={weSurvey} 
                                onComplete={(score) => handleInputChange('We', score.toString())} 
                            />
                        </Dialog>
                    </div>
                    <Input
                        type="number"
                        id="We"
                        name="We"
                        value={formData.We}
                        onChange={(e) => handleInputChange('We', e.target.value)}
                        min={0}
                        max={1}
                        step={0.01}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="Si">Si (Stakeholder Influence) 0 - 1</Label>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <InfoIcon className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <SurveyModal 
                                title="Stakeholder Influence Survey" 
                                questions={siSurvey} 
                                onComplete={(score) => handleInputChange('Si', score.toString())} 
                            />
                        </Dialog>
                    </div>
                    <Input
                        type="number"
                        id="Si"
                        name="Si"
                        value={formData.Si}
                        onChange={(e) => handleInputChange('Si', e.target.value)}
                        min={0}
                        max={1}
                        step={0.01}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="Ei">Ei (Engagement Influence) 0 - 1</Label>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <InfoIcon className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <SurveyModal 
                                title="Engagement Influence Survey" 
                                questions={eiSurvey} 
                                onComplete={(score) => handleInputChange('Ei', score.toString())} 
                            />
                        </Dialog>
                    </div>
                    <Input
                        type="number"
                        id="Ei"
                        name="Ei"
                        value={formData.Ei}
                        onChange={(e) => handleInputChange('Ei', e.target.value)}
                        min={0}
                        max={1}
                        step={0.01}
                        required
                    />
                </div>
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate Risk Score</Button>
            </form>

            {riskScoreData && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                    <p className="text-lg font-semibold text-black">
                        Risk Score: {riskScoreData.riskScore.toFixed(2)}
                    </p>
                    <p className="text-lg font-semibold text-black">
                        Risk Level: {riskScoreData.riskLevel}
                    </p>
                </div>
            )}
        </div>
    );
}