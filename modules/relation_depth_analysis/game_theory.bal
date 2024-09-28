// import ballerina/io;

public type CustomTable record {
    string[] players_names;
    int[] atr_count;
    string[] atr;
    int[] values;
};

public type GameTheoryResult record {
    string message;
};

public type FindNash record {
    string message;
    map<anydata> nashResult;
    map<anydata> nashPossition;
};

public function game_theory_cal(CustomTable customTable) returns error|GameTheoryResult {
    int playerCount = customTable.players_names.length();
    int totalCombinations = 1;
    foreach int count in customTable.atr_count {
        totalCombinations *= count;
    }

    if customTable.values.length() != totalCombinations * playerCount {
        return error("The number of values provided does not match the required strategy combinations.");
    }

    string output = "";
    map<anydata> playerStrategies = {};
    output += "Players and their strategies:\n";
    foreach int i in 0 ..< playerCount {
        output += customTable.players_names[i] + ": Options count = " + customTable.atr_count[i].toString() + "\n";
        playerStrategies[customTable.players_names[i]] = customTable.atr_count[i];
    }

    FindNash findNash;
    map<anydata> nashResult = {};
    if playerCount == 2 {
        findNash = nash_equilib_for_two_players(customTable, playerCount);
        nashResult["nashResult"] = findNash.nashResult;
        nashResult["nashPossition"] = findNash.nashPossition;
        output += findNash.message;
    }
    else if playerCount == 3 {
        findNash = nash_equilib_for_three_players(customTable, playerCount);
        nashResult["nashResult"] = findNash.nashResult;
        nashResult["nashPossition"] = findNash.nashPossition;
        output += findNash.message;
    }

        GameTheoryResult gtr = {
            message: output,
            "playersCount": playerCount,
            "playersStrategies": playerStrategies,
            "nashResult": nashResult
        };
        return gtr;

}
