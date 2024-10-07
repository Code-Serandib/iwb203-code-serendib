import { FormEvent, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

type InfluenceValues = {
  power: number;
  legitimacy: number;
  urgency: number;
};

export default function InfluenceForm() {
  const [influenceValues, setInfluenceValues] = useState<InfluenceValues>({ power: 0, legitimacy: 0, urgency: 0 })
  const [stakeholderType, setStakeholderType] = useState<string>("")
  const [influenceResult, setInfluenceResult] = useState<number | null>(null)

  const handleInfluenceSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const se_metrics = {
        power: influenceValues.power,
        legitimacy: influenceValues.legitimacy,
        urgency: influenceValues.urgency,
        stakeholder_type: stakeholderType
    };

    try {
        const response = await axios.post('http://localhost:9091/api/influence_index_cal', se_metrics, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("influence res:", response.data);
        setInfluenceResult(response.data.influenceIndex.details.influence);
    } catch (error) {
        console.error('Error checking engagement drop:', error);
    }

  }

  return (
    <>
      <form onSubmit={handleInfluenceSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="power">Power (0-10)</Label>
          <Input
            id="power"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={influenceValues.power}
            onChange={(e) => setInfluenceValues({ ...influenceValues, power: Number(e.target.value) })}
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="legitimacy">Legitimacy (0-10)</Label>
          <Input
            id="legitimacy"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={influenceValues.legitimacy}
            onChange={(e) => setInfluenceValues({ ...influenceValues, legitimacy: Number(e.target.value) })}
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="urgency">Urgency (0-10)</Label>
          <Input
            id="urgency"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={influenceValues.urgency}
            onChange={(e) => setInfluenceValues({ ...influenceValues, urgency: Number(e.target.value) })}
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stakeholder-type">Stakeholder Type</Label>
          <Select onValueChange={setStakeholderType}>
            <SelectTrigger id="stakeholder-type" className="border-black">
              <SelectValue placeholder="Select stakeholder type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="investor">Investor</SelectItem>
              <SelectItem value="director">Director</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate Influence Index</Button>
      </form>
      <div className="mt-4">
        <Input type="file" accept=".csv,.xlsx" />
        <p className="text-sm text-gray-500 mt-2">Upload CSV or Excel file as an alternative</p>
      </div>
      {influenceResult !== null && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
          <p className="text-lg font-semibold text-black">Influence Index: {influenceResult.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">
            {influenceResult < 3 ? 'Low Influence' : influenceResult < 7 ? 'Medium Influence' : 'High Influence'}
          </p>
        </div>
      )}
    </>
  )
}