import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from 'axios';

export default function EPSComponent() {
    const [epsData, setEpsData] = useState<{ EPSi: number; priority: string } | null>(null);

    const calculateEPS = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {
            We: parseFloat(formData.get('We') as string),
            Wi: parseFloat(formData.get('Wi') as string),
            Ws: parseFloat(formData.get('Ws') as string),
            Ei: parseFloat(formData.get('Ei') as string),
            Ii: parseFloat(formData.get('Ii') as string),
            Si: parseFloat(formData.get('Si') as string),
        };

        try {
            const response = await axios.post('http://localhost:9091/api/priority_score', data, {
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

    return (
        <form onSubmit={calculateEPS} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="We">We (0-1)</Label>
                <Input type="number" id="We" name="We" min={0} max={1} step={0.1} defaultValue={0.4} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Wi">Wi (0-1)</Label>
                <Input type="number" id="Wi" name="Wi" min={0} max={1} step={0.1} defaultValue={0.3} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Ws">Ws (0-1)</Label>
                <Input type="number" id="Ws" name="Ws" min={0} max={1} step={0.1} defaultValue={0.3} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Ei">Ei (0-10)</Label>
                <Input type="number" id="Ei" name="Ei" min={0} max={10} step={0.1} defaultValue={8.5} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Ii">Ii (0-10)</Label>
                <Input type="number" id="Ii" name="Ii" min={0} max={10} step={0.1} defaultValue={7.2} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="Si">Si (0-10)</Label>
                <Input type="number" id="Si" name="Si" min={0} max={10} step={0.1} defaultValue={6.8} required />
            </div>
            <Button type="submit" className="w-full bg-black text-white">Calculate EPS</Button>

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
        </form>
    );
}
