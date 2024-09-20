public function nash_equilib_for_three_players(CustomTable customTable, int playerCount) returns string {

    string output = "";
    int valueIndex = 0;

    int rows = customTable.atr_count[0];
    int cols = customTable.atr_count[1];
    int depth = customTable.atr_count[2];

    int[][][][] payoffs = [];
    int[][][][] isBestPossibleOutcome = [[[[0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0]]], [[[0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0]]]];

    output += "\nPayoff Matrices for " + customTable.players_names[0] + ", "
                + customTable.players_names[1] + ", and " + customTable.players_names[2] + ":\n";

    foreach int k in 0 ..< depth {
        int[][][] matrixForPlayer3 = [];
        output += "\nMatrix for " + customTable.players_names[2] + "'s strategy " + customTable.atr[k] + ":\n";
        foreach int i in 0 ..< rows {
            int[][] rowPayoffs = [];
            output += "[";
            foreach int j in 0 ..< cols {
                int[] payoff = [customTable.values[valueIndex], customTable.values[valueIndex + 1], customTable.values[valueIndex + 2]];
                rowPayoffs.push(payoff);
                output += "(" + payoff[0].toString() + ", " + payoff[1].toString() + ", " + payoff[2].toString() + ")";
                valueIndex += playerCount;
                if j < cols - 1 {
                    output += " ";
                }
            }
            matrixForPlayer3.push(rowPayoffs);
            output += "]\n";
        }
        payoffs.push(matrixForPlayer3);
    }

    foreach int k in 0 ..< depth {
        foreach int j in 0 ..< cols {
            int maxPayoff = -1;
            int bestRow = 0;
            foreach int i in 0 ..< rows {
                if payoffs[k][i][j][0] > maxPayoff {
                    maxPayoff = payoffs[k][i][j][0];
                    bestRow = i;
                }
            }
            isBestPossibleOutcome[k][bestRow][j][0] = 2;
        }
    }

    foreach int k in 0 ..< depth {
        foreach int i in 0 ..< rows {
            int maxPayoff = -1;
            int bestCol = 0;
            foreach int j in 0 ..< cols {
                if payoffs[k][i][j][1] > maxPayoff {
                    maxPayoff = payoffs[k][i][j][1];
                    bestCol = j;
                }
            }
            isBestPossibleOutcome[k][i][bestCol][1] = 2;
        }
    }

    foreach int i in 0 ..< rows {
        foreach int j in 0 ..< cols {
            int maxPayoff = -1;
            int bestDepth = 0;
            foreach int k in 0 ..< depth {
                if payoffs[k][i][j][2] > maxPayoff {
                    maxPayoff = payoffs[k][i][j][2];
                    bestDepth = k;
                }
            }
            isBestPossibleOutcome[bestDepth][i][j][2] = 2;
        }
    }

    output += "\nNash Equilibria for 3 Players:\n";
    foreach int k in 0 ..< depth {
        foreach int i in 0 ..< rows {
            foreach int j in 0 ..< cols {
                if (isBestPossibleOutcome[k][i][j][0] == 2 &&
                        isBestPossibleOutcome[k][i][j][1] == 2 &&
                        isBestPossibleOutcome[k][i][j][2] == 2) {
                    output += "(" + payoffs[k][i][j][0].toString() + ", "
                                + payoffs[k][i][j][1].toString() + ", "
                                + payoffs[k][i][j][2].toString() + ")\n";
                }
            }
        }
    }

    output += "\nNash Equilibria matrix: ";
    output += isBestPossibleOutcome.toString();

    return output;

}
