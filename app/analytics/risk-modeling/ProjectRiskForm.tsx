import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from 'axios';

interface RiskInput {
    Ws: number;
    We: number;
    Si: number;
    Ei: number;
}

export default function ProjectRiskForm() {
    const [riskInputs, setRiskInputs] = useState<RiskInput[]>([
        { Ws: 0, We: 0, Si: 0, Ei: 0 } // Initial one set of inputs
    ]);
    const [influences, setInfluences] = useState<number[]>([0]);
    const [projectRisk, setProjectRisk] = useState<{ totalProjectRisk: number; riskLevel: string; action: string } | null>(null);

    const handleRiskInputChange = (index: number, field: keyof RiskInput, value: number) => {
        const updatedRiskInputs = [...riskInputs];
        updatedRiskInputs[index][field] = value;
        setRiskInputs(updatedRiskInputs);
    };

    const handleInfluenceChange = (index: number, value: number) => {
        const updatedInfluences = [...influences];
        updatedInfluences[index] = value;
        setInfluences(updatedInfluences);
    };

    const addRiskInputSet = () => {
        setRiskInputs([...riskInputs, { Ws: 0, We: 0, Si: 0, Ei: 0 }]);
        setInfluences([...influences, 0]);
    };

    const calculateProjectRisk = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:9091/api/project_risk', {
                riskInputs,
                influences
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const { projectRisk } = response.data;
            setProjectRisk({
                totalProjectRisk: projectRisk.totalProjectRisk,
                riskLevel: projectRisk.riskLevel,
                action: projectRisk.action
            });
        } catch (error) {
            console.error('Error calculating project risk:', error);
        }
    };

    return (
        <form onSubmit={calculateProjectRisk} className="space-y-6">
            {riskInputs.map((input, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold">Risk Input Set {index + 1}</h3>
                    <div className="space-y-2">
                        <Label htmlFor={`Ws${index}`}>Ws (0-1)</Label>
                        <Input
                            type="number"
                            id={`Ws${index}`}
                            name={`Ws${index}`}
                            min={0}
                            max={1}
                            step={0.1}
                            value={input.Ws}
                            onChange={(e) => handleRiskInputChange(index, 'Ws', parseFloat(e.target.value))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`We${index}`}>We (0-1)</Label>
                        <Input
                            type="number"
                            id={`We${index}`}
                            name={`We${index}`}
                            min={0}
                            max={1}
                            step={0.1}
                            value={input.We}
                            onChange={(e) => handleRiskInputChange(index, 'We', parseFloat(e.target.value))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`Si${index}`}>Si (0-1)</Label>
                        <Input
                            type="number"
                            id={`Si${index}`}
                            name={`Si${index}`}
                            min={0}
                            max={1}
                            step={0.1}
                            value={input.Si}
                            onChange={(e) => handleRiskInputChange(index, 'Si', parseFloat(e.target.value))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`Ei${index}`}>Ei (0-1)</Label>
                        <Input
                            type="number"
                            id={`Ei${index}`}
                            name={`Ei${index}`}
                            min={0}
                            max={1}
                            step={0.1}
                            value={input.Ei}
                            onChange={(e) => handleRiskInputChange(index, 'Ei', parseFloat(e.target.value))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`influence${index}`}>Influence</Label>
                        <Input
                            type="number"
                            id={`influence${index}`}
                            name={`influence${index}`}
                            min={0}
                            max={1}
                            step={0.1}
                            value={influences[index]}
                            onChange={(e) => handleInfluenceChange(index, parseFloat(e.target.value))}
                            required
                        />
                    </div>
                </div>
            ))}

            <Button type="button" onClick={addRiskInputSet} className="w-full bg-gray-300 text-black">
                Add Another Risk Input Set
            </Button>

            <Button type="submit" className="w-full bg-black text-white">
                Calculate Project Risk
            </Button>

            {projectRisk && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                    <p className="text-lg font-semibold text-black">
                        Total Project Risk: {projectRisk.totalProjectRisk}
                    </p>
                    <p className="text-lg font-semibold text-black">
                        Risk Level: {projectRisk.riskLevel}
                    </p>
                    <p className="text-lg font-semibold text-black">
                        Action: {projectRisk.action}
                    </p>
                </div>
            )}
        </form>
    );
}
