function calculateBalancedScoreMetrics(BSCInput bscInput) returns float {
    return (bscInput.Wf * bscInput.Fi) + (bscInput.Wc * bscInput.Ci) + (bscInput.Wp * bscInput.Pi) + (bscInput.Wl * bscInput.Li);
}

function makeDecisionBasedOnBSCi(float BSCi) returns string {
    string decision;
    if BSCi > 0.75 {
        decision = "High priority stakeholder - Critical to overall strategy";
    } else if BSCi > 0.5 {
        decision = "Medium priority stakeholder - Important but less critical";
    } else {
        decision = "Low priority stakeholder - Limited impact on strategy";
    }
    return decision;
}
