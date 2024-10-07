import { FormEvent, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import React from "react"

// interface PayoffMatrix {
//   players: string[];
//   options: string[][];
//   payoffs: number[][][];
//   nashEquilibrium: number[][];
// }

export default function NashForm() {
  const [players, setPlayers] = useState<string[]>([])
  const [optionCounts, setOptionCounts] = useState<number[]>([])
  const [options, setOptions] = useState<string[]>([])
  const [payoffs, setPayoffs] = useState<number[]>([])
  const [nashResult, setNashResult] = useState<any | null>(null)

  const handleNashSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const customTable = {
      players_names: players,
      atr_count: optionCounts,
      atr: options,
      values: payoffs
    };

    try {
        const response = await axios.post('http://localhost:9091/api/nash_equilibrium_cal', customTable, {
            headers: { 'Content-Type': 'application/json' }
        });
        // console.log("nash res:", response.data);
        const payoffMatrix = {
          players: response.data.nashEquilibrium.nashResult.matrix.players,
          options: response.data.nashEquilibrium.nashResult.matrix.options,
          payoffs: response.data.nashEquilibrium.nashResult.matrix.payoffs.payoffMatrix,
          nashEquilibrium: response.data.nashEquilibrium.nashResult.matrix.nashEquilibrium,
        }
        // setNashResult(JSON.stringify(response.data.nashEquilibrium.nashResult.nashResult));
        setNashResult(payoffMatrix);
    } catch (error) {
        console.error('Error checking engagement drop:', error);
    }

  }

  return (
    <>
      <form onSubmit={handleNashSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="players">Players (comma-separated)</Label>
          <Input
            id="players"
            value={players.join(",")}
            onChange={(e) => setPlayers(e.target.value.split(","))}
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="option-counts">Option Counts (comma-separated)</Label>
          <Input
            id="option-counts"
            value={optionCounts.join(",")}
            onChange={(e) => setOptionCounts(e.target.value.split(",").map(Number))}
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="options">Options (comma-separated)</Label>
          <Input
            id="options"
            value={options.join(",")}
            onChange={(e) => setOptions(e.target.value.split(","))}
            className="border-black"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payoffs">Payoffs (comma-separated)</Label>
          <Input
            id="payoffs"
            value={payoffs.join(",")}
            onChange={(e) => setPayoffs(e.target.value.split(",").map(Number))}
            className="border-black"
          />
        </div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Calculate Nash Equilibrium</Button>
      </form>
      <div className="mt-4">
        <Input type="file" accept=".csv,.xlsx" />
        <p className="text-sm text-gray-500 mt-2">Upload CSV or Excel file as an alternative</p>
      </div>
      {nashResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-black">
          <h3 className="text-lg font-semibold text-black mb-2">Nash Equilibrium Result</h3>
          {/* {nashResult} */}
          <NashMatrixDisplay matrix={nashResult} />
        </div>
      )}
    </>
  )
}

type NashMatrixProps = {
  matrix: {
    players: string[];
    options: string[][];
    payoffs: any[][]; // Updated to handle 2D or 3D arrays dynamically
    nashEquilibrium: number[][];
  };
};

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
            {players.length === 3 ? (
              <>
              <TableHead className="w-[210px]">Player Options</TableHead></>
            ):(
              <TableHead className="w-[210px]">Player Options</TableHead>
            )}
              {/* <TableHead className="w-[150px]">Player Options</TableHead> */}
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
                  <><TableCell className="font-medium">
                      {`${players[2]}: ${options[2][rowIndex]}`}
                    </TableCell>
                    <TableCell className="font-medium">
                        {payoffs.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            <TableCell className="font-medium">{`${players[1]}: ${options[1][rowIndex]}`}</TableCell>
                          </TableRow>
                        ))}
                      </TableCell></>
                ):(
                  <TableCell className="font-medium">
                    {`${players[1]}: ${options[1][rowIndex]}`}
                  </TableCell>
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