import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from 'axios';

const TESComponent: React.FC = () => {
    const [tesData, setTesData] = useState<{ TESi: number; priority: string } | null>(null);

    const calculateTES = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {
            alpha: parseFloat(formData.get('alpha') as string),
            beta: parseFloat(formData.get('beta') as string),
            EPSi: parseFloat(formData.get('EPSi') as string),
            BSCi: parseFloat(formData.get('BSCi') as string)
        };

        try {
            const response = await axios.post('http://localhost:9091/api/engagement_score', data, {
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

    return (
        <form onSubmit={calculateTES} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="alpha">Alpha (Weight for Alpha)</Label>
                <Input
                    type="number"
                    id="alpha"
                    name="alpha"
                    min={0}
                    max={5}
                    step={0.01}
                    defaultValue={0.5}
                    required
                    className="border-black"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="beta">Beta (Weight for Beta)</Label>
                <Input
                    type="number"
                    id="beta"
                    name="beta"
                    min={0}
                    max={5}
                    step={0.01}
                    defaultValue={0.8}
                    required
                    className="border-black"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="EPSi">EPSi (Engagement Performance Score)</Label>
                <Input
                    type="number"
                    id="EPSi"
                    name="EPSi"
                    min={0}
                    max={5}
                    step={0.01}
                    defaultValue={1.2}
                    required
                    className="border-black"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="BSCi">BSCi (Balanced Scorecard Index)</Label>
                <Input
                    type="number"
                    id="BSCi"
                    name="BSCi"
                    min={0}
                    max={5}
                    step={0.01}
                    defaultValue={0.9}
                    required
                    className="border-black"
                />
            </div>
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                Calculate TES
            </Button>

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
        </form>
    );
};

export default TESComponent;
