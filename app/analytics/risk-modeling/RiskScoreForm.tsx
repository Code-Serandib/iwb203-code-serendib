import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from 'axios';

export default function RiskScoreForm() {
    const [riskScoreData, setRiskScoreData] = useState<{ riskScore: number; riskLevel: string } | null>(null);

    const calculateRiskScore = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {
            Ws: parseFloat(formData.get('Ws') as string),
            We: parseFloat(formData.get('We') as string),
            Si: parseFloat(formData.get('Si') as string),
            Ei: parseFloat(formData.get('Ei') as string),
        };

        try {
            const response = await axios.post('http://localhost:9091/api/risk_score', data, {
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

    return (
        <form onSubmit={calculateRiskScore} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="Ws">Ws (0-1)</Label>
                <Input type="number" id="Ws" name="Ws" min={0} max={1} step={0.1} defaultValue={0.5} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="We">We (0-1)</Label>
                <Input type="number" id="We" name="We" min={0} max={1} step={0.1} defaultValue={0.2} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Si">Si (0-1)</Label>
                <Input type="number" id="Si" name="Si" min={0} max={1} step={0.1} defaultValue={0.4} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Ei">Ei (0-1)</Label>
                <Input type="number" id="Ei" name="Ei" min={0} max={1} step={0.1} defaultValue={0.6} required />
            </div>
            <Button type="submit" className="w-full bg-black text-white">Calculate Risk Score</Button>

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
        </form>
    );
}
