import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import axios from "axios"

type NashMatrixProps = {
  matrix: {
    players: string[];
    options: string[][];
    payoffs: any[][];
    nashEquilibrium: number[][];
  };
};

export default function NashEquilibriumCalculator() {
  const [players, setPlayers] = useState<string[]>([])
  const [optionCounts, setOptionCounts] = useState<number[]>([])
  const [options, setOptions] = useState<string[][]>([])
  const [payoffs, setPayoffs] = useState<number[]>([])
  const [nashResult, setNashResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPayoffsDialogOpen, setIsPayoffsDialogOpen] = useState(false)

  const validatePlayers = (value: string) => {
    const playerNames = value.split(",").map(name => name.trim()).filter(name => name !== "")
    if (playerNames.length < 2 || playerNames.length > 3) {
      setError("Please enter 2 or 3 player names.")
      return false
    }
    setPlayers(playerNames)
    setError(null)
    return true
  }

  const handleOptionCountsSubmit = (counts: number[]) => {
    if (counts.length !== players.length) {
      setError("Please enter option counts for all players.")
      return
    }
    setOptionCounts(counts)
    setOptions(players.map((_, index) => Array(counts[index]).fill("")))
    setError(null)
  }

  const handleOptionsSubmit = (newOptions: string[][]) => {
    setOptions(newOptions)
  }

  const handlePayoffsSubmit = (newPayoffs: number[]) => {
    const expectedPayoffsCount = optionCounts.reduce((a, b) => a * b) * players.length
    if (newPayoffs.length !== expectedPayoffsCount) {
      setError(`Please enter exactly ${expectedPayoffsCount} payoff values.`)
      return
    }
    setPayoffs(newPayoffs)
    setError(null)
    setIsPayoffsDialogOpen(false)
  }

  const handleNashSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (players.length < 2 || optionCounts.length !== players.length || options.flat().length !== optionCounts.reduce((a, b) => a + b, 0) || payoffs.length !== optionCounts.reduce((a, b) => a * b) * players.length) {
      setError("Please fill in all required fields correctly before submitting.")
      return
    }

    const customTable = {
      players_names: players,
      atr_count: optionCounts,
      atr: options.flat(),
      values: payoffs
    };

    try {
      const response = await axios.post('http://localhost:9091/api/nash_equilibrium_cal', customTable, {
        headers: { 'Content-Type': 'application/json' }
      });
      const payoffMatrix = {
        players: response.data.nashEquilibrium.nashResult.matrix.players,
        options: response.data.nashEquilibrium.nashResult.matrix.options,
        payoffs: response.data.nashEquilibrium.nashResult.matrix.payoffs.payoffMatrix,
        nashEquilibrium: response.data.nashEquilibrium.nashResult.matrix.nashEquilibrium,
      }
      setNashResult(payoffMatrix);
    } catch (error) {
      console.error('Error calculating Nash Equilibrium:', error);
      setError("An error occurred while calculating the Nash Equilibrium.")
    }
  }

  const validateInputs = () => {
    if (players.length === 0) {
      setError("Please enter player names before setting payoffs.")
      return false
    }
    if (optionCounts.length === 0 || optionCounts.some(count => count === 0)) {
      setError("Please set option counts for all players before setting payoffs.")
      return false
    }
    if (options.some(playerOptions => playerOptions.some(option => option === ""))) {
      setError("Please set all options for all players before setting payoffs.")
      return false
    }
    setError(null)
    return true
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleNashSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="players">Players (2-3, comma-separated)</Label>
          <Input
            id="players"
            placeholder="e.g. Player1, Player2"
            onChange={(e) => validatePlayers(e.target.value)}
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="option-counts">Option Counts</Label>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">Set Option Counts</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Option Counts for Players</DialogTitle>
              </DialogHeader>
              <OptionCountsInput players={players} onSubmit={handleOptionCountsSubmit} />
            </DialogContent>
          </Dialog>
          <Input
            id="option-counts"
            value={optionCounts.join(", ")}
            readOnly
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="options">Options</Label>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">Set Options</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Set Options for Players</DialogTitle>
              </DialogHeader>
              <OptionsInput players={players} optionCounts={optionCounts} onSubmit={handleOptionsSubmit} />
            </DialogContent>
          </Dialog>
          <Input
            id="options"
            value={options.map(playerOptions => playerOptions.join(", ")).join(" | ")}
            readOnly
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payoffs">Payoffs</Label>
          <Dialog open={isPayoffsDialogOpen} onOpenChange={setIsPayoffsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={(e) => {
                  e.preventDefault()
                  if (validateInputs()) {
                    setIsPayoffsDialogOpen(true)
                  }
                }}
              >
                Set Payoffs
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Set Payoffs</DialogTitle>
              </DialogHeader>
              <PayoffsInput players={players} optionCounts={optionCounts} onSubmit={handlePayoffsSubmit} />
            </DialogContent>
          </Dialog>
          <Input
            id="payoffs"
            value={payoffs.join(", ")}
            readOnly
            className="border-black"
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button 
          type="submit" 
          className="w-full bg-black text-white hover:bg-gray-800"
          onClick={(e) => {
            e.preventDefault()
            if (validateInputs() && payoffs.length > 0) {
              handleNashSubmit(e)
            } else if (payoffs.length === 0) {
              setError("Please set payoffs before calculating Nash Equilibrium.")
            }
          }}
        >
          Calculate Nash Equilibrium
        </Button>
      </form>
      
      {nashResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
          <h3 className="text-lg font-semibold text-black mb-2">Nash Equilibrium Result</h3>
          <NashMatrixDisplay matrix={nashResult} />
        </div>
      )}
    </div>
  )
}

function OptionCountsInput({ players, onSubmit }: { players: string[], onSubmit: (counts: number[]) => void }) {
  const [counts, setCounts] = useState<number[]>(Array(players.length).fill(0))

  const handleSubmit = () => {
    onSubmit(counts)
  }

  return (
    <div className="space-y-4">
      {players.map((player, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Label htmlFor={`count-${index}`}>{player}</Label>
          <Input
            id={`count-${index}`}
            type="number"
            min="1"
            value={counts[index]}
            onChange={(e) => {
              const newCounts = [...counts]
              newCounts[index] = parseInt(e.target.value)
              setCounts(newCounts)
            }}
            className="w-20"
          />
        </div>
      ))}
      <Button onClick={handleSubmit}>Set Counts</Button>
    </div>
  )
}

function OptionsInput({ players, optionCounts, onSubmit }: { players: string[], optionCounts: number[], onSubmit: (options: string[][]) => void }) {
  const [options, setOptions] = useState<string[][]>(players.map((_, index) => Array(optionCounts[index]).fill("")))

  const handleSubmit = () => {
    onSubmit(options)
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-6">
        {players.map((player, playerIndex) => (
          <div key={playerIndex} className="space-y-2">
            <h3 className="font-semibold">{player}</h3>
            {Array.from({ length: optionCounts[playerIndex] }).map((_, optionIndex) => (
              <Input
                key={optionIndex}
                placeholder={`Option ${optionIndex + 1}`}
                value={options[playerIndex][optionIndex]}
                onChange={(e) => {
                  const newOptions = [...options]
                  newOptions[playerIndex][optionIndex] = e.target.value
                  setOptions(newOptions)
                }}
                className="w-full"
              />
            ))}
          </div>
        ))}
        <Button onClick={handleSubmit}>Set Options</Button>
      </div>
    </ScrollArea>
  )
}

function PayoffsInput({ players, optionCounts, onSubmit }: { players: string[], optionCounts: number[], onSubmit: (payoffs: number[]) => void }) {
  const [payoffs, setPayoffs] = useState<number[]>([])

  const handleSubmit = () => {
    onSubmit(payoffs)
  }

  const totalPayoffs = optionCounts.reduce((a, b) => a * b) * players.length

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        <p>Enter {totalPayoffs} payoff values:</p>
        {Array.from({ length: totalPayoffs }).map((_, index) => (
          <Input
            key={index}
            type="number"
            placeholder={`Payoff ${index + 1}`}
            value={payoffs[index] || ""}
            onChange={(e) => {
              const newPayoffs = [...payoffs]
              newPayoffs[index] = parseFloat(e.target.value)
              setPayoffs(newPayoffs)
            }}
            className="w-full"
          />
        ))}
        <Button onClick={handleSubmit}>Set Payoffs</Button>
      </div>
    </ScrollArea>
  )
}

function NashMatrixDisplay({ matrix }: NashMatrixProps) {
  const { players, options, payoffs, nashEquilibrium } = matrix

  const isNashEquilibrium = (row: number, col: number, payoffIndex: number) => {
    return nashEquilibrium.some((equilibrium) => {
      if (equilibrium.length === 3) {
        return equilibrium[0] === row && equilibrium[1] === col && equilibrium[2] === payoffIndex
      } else if (equilibrium.length === 2) {
        return equilibrium[0] === row && equilibrium[1] === col
      }
      return false
    })
  }

  const renderPayoffCell = (payoff: number[], isNash: boolean) => (
    <div className={`p-2 rounded ${isNash ? "bg-yellow-100 font-bold" : ""}`}>
      ({payoff.join(", ")})
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nash Equilibrium Result</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[210px]">Player Options</TableHead>
              {options[0].map((option, index) => (
                <TableHead key={index} className="text-center">
                  {`${players[0]}: ${option}`}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {payoffs.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell className="font-medium">
                  {players.length === 3 ? (
                    <>
                      <div>{`${players[2]}: ${options[2][Math.floor(rowIndex / options[1].length)]}`}</div>
                      <div>{`${players[1]}: ${options[1][rowIndex % options[1].length]}`}</div>
                    </>
                  ) : (
                    `${players[1]}: ${options[1][rowIndex]}`
                  )}
                
                </TableCell>
                {row.map((cell, colIndex) => (
                  <TableCell key={colIndex} className="p-0">
                    <div className="grid grid-cols-1 gap-1">
                      {Array.isArray(cell[0])
                        ? cell.map((payoff, payoffIndex) =>
                            renderPayoffCell(payoff, isNashEquilibrium(rowIndex, colIndex, payoffIndex))
                          )
                        : renderPayoffCell(cell, isNashEquilibrium(rowIndex, colIndex, 0))}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}