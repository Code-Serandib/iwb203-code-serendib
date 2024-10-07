import { FormEvent, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import axios from "axios"

export default function SocialForm() {
  const [benefit, setBenefit] = useState<number>(0)
  const [cost, setCost] = useState<number>(0)
  const [relationshipValue, setRelationshipValue] = useState<number | null>(null)

  const handleSocialExchangeSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const stakeholderRelation = {
      benefit: benefit,
      cost: cost
    };

    try {
        const response = await axios.post('http://localhost:9091/api/social_exchange_cal', stakeholderRelation, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("RelationshipValue res:", response.data);
        setRelationshipValue(response.data.socialExchange.details.relationshipValue);
    } catch (error) {
        console.error('Error checking engagement drop:', error);
    }

    // Simulate API call
    // setTimeout(() => {
    //   setRelationshipValue(benefit - cost)
    // }, 1000)
  }

  return (
    <>
      <form onSubmit={handleSocialExchangeSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="benefit">Benefit</Label>
          <Input
            id="benefit"
            type="number"
            value={benefit}
            onChange={(e) => setBenefit(Number(e.target.value))}
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost">Cost</Label>
          <Input
            id="cost"
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="border-black"
          />
        </div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate Social Exchange</Button>
      </form>
      <div className="mt-4">
        <Input type="file" accept=".csv,.xlsx" />
        <p className="text-sm text-gray-500 mt-2">Upload CSV or Excel file as an alternative</p>
      </div>
      {relationshipValue !== null && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
          <h3 className="text-lg font-semibold text-black mb-2">Relationship Value</h3>
          <p>{relationshipValue}</p>
        </div>
      )}
    </>
  )
}