public function calculate(RiskInput riskInput) returns float {
    float Ws = riskInput.Ws;
    float We = riskInput.We;
    float Si = riskInput.Si;
    float Ei = riskInput.Ei;

    float riskScore = Ws * (1 - Si) + We * (1 - Ei);

    return riskScore;
}

public function pretendRiskLevel(float riskScore) returns string {
    string riskLevel;

    if (riskScore <= 0.3) {
        riskLevel = "Low Risk";
    } else if (riskScore > 0.3 && riskScore <= 0.7) {
        riskLevel = "Medium Risk";
    } else {
        riskLevel = "High Risk";
    }

    return riskLevel;
}
