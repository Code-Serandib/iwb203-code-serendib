// import ballerina/io;

public type CustomTable record {
    string[] players_names;
    int[] atr_count;
    string[] atr;
    int[] values;
};

public function game_theory_cal(CustomTable customTable) returns string|error {
    int playerCount = customTable.players_names.length();
    int totalCombinations = 1;
    foreach int count in customTable.atr_count {
        totalCombinations *= count;
    }

    if customTable.values.length() != totalCombinations * playerCount {
        return error("The number of values provided does not match the required strategy combinations.");
    }

    string output = "";
    output += "Players and their strategies:\n";
    foreach int i in 0 ..< playerCount {
        output += customTable.players_names[i] + ": Options count = " + customTable.atr_count[i].toString() + "\n";
    }

    if playerCount == 2 {
        output += nash_equilib_for_two_players(customTable, playerCount);
    }
    else if playerCount == 3 {
        output += nash_equilib_for_three_players(customTable, playerCount);
    }

    return output; 
}
