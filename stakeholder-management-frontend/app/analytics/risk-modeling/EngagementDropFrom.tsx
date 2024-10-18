import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { InfoIcon } from "lucide-react"
import axios from 'axios'

type RiskInput = {
    Ws: string;
    We: string;
    Si: string;
    Ei: string;
};

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
    }
];

const teSurvey: SurveyQuestion[] = [
    {
        question: "How critical is the stakeholder's role in decision-making for the project?",
        options: ["Not critical", "Somewhat critical", "Very critical", "Essential"]
    },
    {
        question: "How complex is the project in terms of stakeholder dependencies?",
        options: ["Simple", "Moderately complex", "Complex", "Highly complex"]
    },
    {
        question: "What is the stakeholder's preferred level of engagement?",
        options: ["Minimal engagement", "Occasional updates", "Regular involvement", "Constant communication"]
    },
    {
        question: "At which project stage is this stakeholder's involvement most critical?",
        options: ["Initiation", "Planning", "Execution", "Closing"]
    }
];

function SurveyModal({ title, questions, onComplete }: { title: string; questions: SurveyQuestion[]; onComplete: (score: number) => void }) {
    const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));

    const handleSubmit = () => {
        const score = answers.reduce((total, answer, index) => {
            const questionScore = questions[index].options.indexOf(answer) + 1;
            return total + questionScore;
        }, 0);
        const normalizedScore = (score / (questions.length * 4)).toFixed(2);
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

export default function EngagementDropForm() {
    const [riskInputs, setRiskInputs] = useState<RiskInput[]>([
        { Ws: '0.0', We: '0.0', Si: '0.0', Ei: '0.0' }
    ]);
    const [Te, setTe] = useState<string>('0.0');
    const [engagementAlerts, setEngagementAlerts] = useState<any | null>(null);

    const handleInputChange = (index: number, field: keyof RiskInput, value: string) => {
        const updatedRiskInputs = [...riskInputs];
        updatedRiskInputs[index][field] = value;
        setRiskInputs(updatedRiskInputs);
    };

    const addRiskInput = () => {
        setRiskInputs([...riskInputs, { Ws: '0.0', We: '0.0', Si: '0.0', Ei: '0.0' }]);
    };

    const calculateEngagementDrop = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = {
            riskInputs: riskInputs.map(input => ({
                Ws: parseFloat(input.Ws),
                We: parseFloat(input.We),
                Si: parseFloat(input.Si),
                Ei: parseFloat(input.Ei),
            })),
            Te: parseFloat(Te)
        };

        try {
            const response = await axios.post('http://localhost:9091/api/engagement_drop_alert', data, {
                headers: { 'Content-Type': 'application/json' }
            });
            setEngagementAlerts(response.data.engagementDropAlerts.engagementDropAlerts);
        } catch (error) {
            console.error('Error checking engagement drop:', error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {/* <h2 className="text-2xl font-bold mb-6 text-center">Engagement Drop Calculator</h2> */}
            <form onSubmit={calculateEngagementDrop} className="space-y-6">
                {riskInputs.map((input, index) => (
                    <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-md">
                        <h3 className="text-lg font-semibold">Stakeholder {index + 1}</h3>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Label htmlFor={`Ws-${index}`}>Ws (Stakeholder Weight Start) 0 - 5</Label>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <InfoIcon className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <SurveyModal 
                                        title="Stakeholder Weight Start Survey" 
                                        questions={wsSurvey} 
                                        onComplete={(score) => handleInputChange(index, 'Ws', score.toString())} 
                                    />
                                </Dialog>
                            </div>
                            <Input
                                type="number"
                                id={`Ws-${index}`}
                                name={`Ws-${index}`}
                                value={input.Ws}
                                onChange={e => handleInputChange(index, 'Ws', e.target.value)}
                                step="0.01"
                                min="0"
                                max="5"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Label htmlFor={`We-${index}`}>We (Stakeholder Weight End) 0 - 5</Label>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <InfoIcon className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <SurveyModal 
                                        title="Stakeholder Weight End Survey" 
                                        questions={weSurvey} 
                                        onComplete={(score) => handleInputChange(index, 'We', score.toString())} 
                                    />
                                </Dialog>
                            </div>
                            <Input
                                type="number"
                                id={`We-${index}`}
                                name={`We-${index}`}
                                value={input.We}
                                onChange={e => handleInputChange(index, 'We', e.target.value)}
                                step="0.01"
                                min="0"
                                max="5"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Label htmlFor={`Si-${index}`}>Si (Stakeholder Influence) 0 - 5</Label>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <InfoIcon className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <SurveyModal 
                                        title="Stakeholder Influence Survey" 
                                        questions={siSurvey} 
                                        onComplete={(score) => handleInputChange(index, 'Si', score.toString())} 
                                    />
                                </Dialog>
                            </div>
                            <Input
                                type="number"
                                id={`Si-${index}`}
                                name={`Si-${index}`}
                                value={input.Si}
                                onChange={e => handleInputChange(index, 'Si', e.target.value)}
                                step="0.01"
                                min="0"
                                max="5"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Label htmlFor={`Ei-${index}`}>Ei (Engagement Influence) 0 - 5</Label>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <InfoIcon className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <SurveyModal 
                                        title="Engagement Influence Survey" 
                                        questions={eiSurvey} 
                                        onComplete={(score) => handleInputChange(index, 'Ei', score.toString())} 
                                    />
                                </Dialog>
                            </div>
                            <Input
                                type="number"
                                id={`Ei-${index}`}
                                name={`Ei-${index}`}
                                value={input.Ei}
                                onChange={e => handleInputChange(index, 'Ei', e.target.value)}
                                step="0.01"
                                min="0"
                                max="5"
                            />
                        </div>
                    </div>
                ))}

                <Button type="button" onClick={addRiskInput} className="w-full bg-gray-500 text-white hover:bg-gray-600">Add More Stakeholders</Button>

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="Te">Te (Threshold Engagement) 0 - 1</Label>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <InfoIcon className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <SurveyModal 
                                title="Threshold Engagement Survey" 
                                questions={teSurvey} 
                                onComplete={(score) => setTe(score.toString())} 
                            />
                        </Dialog>
                    </div>
                    <Input
                        type="number"
                        id="Te"
                        name="Te"
                        value={Te}
                        
                        onChange={e => setTe(e.target.value)}
                        step="0.01"
                        min="0"
                        max="1"
                    />
                </div>

                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Check Engagement Drop</Button>
            </form>

            {engagementAlerts && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                    <h3 className="text-lg font-semibold mb-4">Engagement Drop Alerts</h3>
                    {engagementAlerts.map((alert: any, index: number) => (
                        <div key={index} className="mb-4 p-3 bg-white rounded shadow">
                            <p className="font-semibold text-black">Stakeholder {index + 1}:</p>
                            <p>Ws: {alert.stakeholder.Ws.toFixed(2)}, We: {alert.stakeholder.We.toFixed(2)}, Si: {alert.stakeholder.Si.toFixed(2)}, Ei: {alert.stakeholder.Ei.toFixed(2)}</p>
                            <p>Engagement Level: {alert.engagementLevel.toFixed(2)}</p>
                            <p>Threshold: {alert.threshold.toFixed(2)}</p>
                            <p className={`text-sm ${alert.alertStatus === 'Alert' ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                                Alert Status: {alert.alertStatus}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}