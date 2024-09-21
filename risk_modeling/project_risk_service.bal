public function calculateProjectRisk(RiskInput[] riskInputs, float[] influences) returns float|error {
    if (riskInputs.length() != influences.length()) {
        return error("Mismatch between number of risk scores and influences.");
    } 

    float totalProjectRisk = 0.0;

    foreach int i in 0 ..< (riskInputs.length()) {
        float riskScore = calculate(riskInputs[i]);
        float influence = influences[i];
        totalProjectRisk += (riskScore * influence);
    }

    return totalProjectRisk;
}

function pretendProjectRiskLevel(float totalRisk) returns string {
    string riskLevel;
    if (totalRisk < 0.3) {
        riskLevel = "Low";
    } else if (totalRisk >= 0.3 && totalRisk <= 0.6) {
        riskLevel = "Moderate";
    } else {
        riskLevel = "High";
    }
    return riskLevel;
}

function determineAction(string riskLevel) returns string {
    string action;
    if (riskLevel == "Low") {
        action = "Risk is low. No immediate action required.";
    } else if (riskLevel == "Moderate") {
        action = "Risk is moderate. Monitor stakeholders and address concerns.";
    } else {
        action = "Risk is high. Immediate action required to mitigate risks.";
    }
    return action;
}
