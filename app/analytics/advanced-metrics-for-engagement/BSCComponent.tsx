import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from 'axios';

export default function BSCForm() {
    const [bscData, setBscData] = useState<{ BSCi: number; decision: string } | null>(null);

    const calculateBSC = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {
            Wf: parseFloat(formData.get('Wf') as string),
            Wc: parseFloat(formData.get('Wc') as string),
            Wp: parseFloat(formData.get('Wp') as string),
            Wl: parseFloat(formData.get('Wl') as string),
            Fi: parseFloat(formData.get('Fi') as string),
            Ci: parseFloat(formData.get('Ci') as string),
            Pi: parseFloat(formData.get('Pi') as string),
            Li: parseFloat(formData.get('Li') as string)
        };

        try {
            const response = await axios.post('http://localhost:9091/api/balanced_score', data, {
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

    return (
        <form onSubmit={calculateBSC} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="Wf">Wf (Weight for Financial)</Label>
                <Input type="number" id="Wf" name="Wf" min={0} max={1} step={0.01} defaultValue={0.85} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Wc">Wc (Weight for Customer)</Label>
                <Input type="number" id="Wc" name="Wc" min={0} max={1} step={0.01} defaultValue={0.15} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Wp">Wp (Weight for Process)</Label>
                <Input type="number" id="Wp" name="Wp" min={0} max={1} step={0.01} defaultValue={0.2} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Wl">Wl (Weight for Learning & Growth)</Label>
                <Input type="number" id="Wl" name="Wl" min={0} max={1} step={0.01} defaultValue={0.1} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Fi">Fi (Financial Impact)</Label>
                <Input type="number" id="Fi" name="Fi" min={0} max={5} step={0.01} defaultValue={1.25} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Ci">Ci (Customer Impact)</Label>
                <Input type="number" id="Ci" name="Ci" min={0} max={5} step={0.01} defaultValue={0.75} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Pi">Pi (Process Impact)</Label>
                <Input type="number" id="Pi" name="Pi" min={0} max={5} step={0.01} defaultValue={2.5} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Li">Li (Learning & Growth Impact)</Label>
                <Input type="number" id="Li" name="Li" min={0} max={5} step={0.01} defaultValue={3.0} required />
            </div>
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                Calculate BSC Score
            </Button>

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
        </form>
    );
}
