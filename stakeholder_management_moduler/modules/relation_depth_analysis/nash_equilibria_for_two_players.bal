
public function nash_equilib_for_two_players(CustomTable customTable, int playerCount) returns FindNash {
    string output = "";
    int valueIndex = 0;

    int rows = customTable.atr_count[0];
    int cols = customTable.atr_count[1];

    int[][][] payoffs = [];
    int[][][] isBestPossibleOutcome = [[[0, 0], [0, 0]], [[0, 0], [0, 0]]];

    output += "\nPayoff Matrix for " + customTable.players_names[0] + " and " + customTable.players_names[1] + ":\n";

    foreach int i in 0 ..< rows {
        int[][] rowPayoffs = [];
        output += "[";
        foreach int j in 0 ..< cols {
            int[] payoff = [customTable.values[valueIndex], customTable.values[valueIndex + 1]];
            rowPayoffs.push(payoff);
            output += "(" + customTable.values[valueIndex].toString() + ", "
                        + customTable.values[valueIndex + 1].toString() + ")";
            valueIndex += playerCount;
            if j < cols - 1 {
                output += " ";
            }
        }
        payoffs.push(rowPayoffs);
        output += "]\n";
    }

    foreach int j in 0 ..< cols {
        int maxPayoff = -1;
        int bestRow = 0;
        foreach int i in 0 ..< rows {
            if payoffs[i][j][0] > maxPayoff {
                maxPayoff = payoffs[i][j][0];
                bestRow = i;
            }
        }
        isBestPossibleOutcome[bestRow][j][0] = 2;
    }

    foreach int i in 0 ..< rows {
        int maxPayoff = -1;
        int bestCol = 0;
        foreach int j in 0 ..< cols {
            if payoffs[i][j][1] > maxPayoff {
                maxPayoff = payoffs[i][j][1];
                bestCol = j;
            }
        }
        isBestPossibleOutcome[i][bestCol][1] = 2;
    }

    output += "\nNash Equilibria for 2 Players:\n";
    map<anydata> nashResult = {};
    foreach int i in 0 ..< rows {
        foreach int j in 0 ..< cols {
            if isBestPossibleOutcome[i][j][0] == 2 && isBestPossibleOutcome[i][j][1] == 2 {
                output += "(" + payoffs[i][j][0].toString() + ", "
                            + payoffs[i][j][1].toString() + ")\n";
                nashResult["strategy/"+i.toString()+"/"+j.toString()] = 
                            "(" + payoffs[i][j][0].toString() + ", "
                            + payoffs[i][j][1].toString() + ")";
            }
        }
    }

    output += "\nNash Equilibria matrix: ";
    output += isBestPossibleOutcome.toString();
    map<anydata> nashPossition = {};
    nashPossition["isBestPossibleOutcome"] = isBestPossibleOutcome;

    FindNash gtr = {
        message: output,
        nashResult: nashResult,
        nashPossition: nashPossition
    };

    return gtr;
}
