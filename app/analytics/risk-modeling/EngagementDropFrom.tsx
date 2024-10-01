import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from 'axios';

export default function EngagementDropForm() {
    const [riskInputs, setRiskInputs] = useState([
        { Ws: '0.5', We: '0.3', Si: '0.7', Ei: '0.6' }
    ]);
    const [Te, setTe] = useState<string>('0.5');
    const [engagementAlerts, setEngagementAlerts] = useState<any | null>(null);

    const handleInputChange = (index: number, field: 'Ws' | 'We' | 'Si' | 'Ei', value: string) => {
        const updatedRiskInputs = [...riskInputs];
        updatedRiskInputs[index][field] = value;
        setRiskInputs(updatedRiskInputs);
    };

    const addRiskInput = () => {
        setRiskInputs([...riskInputs, { Ws: '0.5', We: '0.3', Si: '0.7', Ei: '0.6' }]);
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
        <form onSubmit={calculateEngagementDrop} className="space-y-6">
            {riskInputs.map((input, index) => (
                <div key={index} className="space-y-4">
                    <Label htmlFor={`Ws-${index}`}>Ws (Stakeholder Weight Start)</Label>
                    <Input
                        type="number"
                        id={`Ws-${index}`}
                        name={`Ws-${index}`}
                        value={input.Ws}
                        onChange={e => handleInputChange(index, 'Ws', e.target.value)}
                    />
                    <Label htmlFor={`We-${index}`}>We (Stakeholder Weight End)</Label>
                    <Input
                        type="number"
                        id={`We-${index}`}
                        name={`We-${index}`}
                        value={input.We}
                        onChange={e => handleInputChange(index, 'We', e.target.value)}
                    />
                    <Label htmlFor={`Si-${index}`}>Si (Stakeholder Influence)</Label>
                    <Input
                        type="number"
                        id={`Si-${index}`}
                        name={`Si-${index}`}
                        value={input.Si}
                        onChange={e => handleInputChange(index, 'Si', e.target.value)}
                    />
                    <Label htmlFor={`Ei-${index}`}>Ei (Engagement Influence)</Label>
                    <Input
                        type="number"
                        id={`Ei-${index}`}
                        name={`Ei-${index}`}
                        value={input.Ei}
                        onChange={e => handleInputChange(index, 'Ei', e.target.value)}
                    />
                </div>
            ))}

            <Button type="button" onClick={addRiskInput} className="bg-gray-500 text-white">Add More Stakeholders</Button>

            <div className="space-y-4">
                <Label htmlFor="Te">Te (Threshold Engagement)</Label>
                <Input
                    type="number"
                    id="Te"
                    name="Te"
                    value={Te}
                    onChange={e => setTe(e.target.value)}
                />
            </div>

            <Button type="submit" className="w-full bg-black text-white">Check Engagement Drop</Button>

            {engagementAlerts && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
                    {engagementAlerts.map((alert: any, index: number) => (
                        <div key={index} className="mb-4">
                            <p className="font-semibold text-black">Stakeholder {index + 1}:</p>
                            <p>Ws: {alert.stakeholder.Ws}, We: {alert.stakeholder.We}, Si: {alert.stakeholder.Si}, Ei: {alert.stakeholder.Ei}</p>
                            <p>Engagement Level: {alert.engagementLevel}</p>
                            <p>Threshold: {alert.threshold}</p>
                            <p className="text-sm text-gray-700">Alert Status: {alert.alertStatus}</p>
                        </div>
                    ))}
                </div>
            )}
        </form>
    );
}
