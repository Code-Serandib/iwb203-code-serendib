function calculateTotalEngagementScore(TESInput tesInput) returns float {
    return (tesInput.alpha * tesInput.EPSi) + (tesInput.beta * tesInput.BSCi);
}

function makeDecisionBasedOnTES(float TESi) returns string{
    string priority;
    if TESi > 0.75 {
        priority = "High";
    } else if TESi > 0.5 {
        priority = "Medium";
    } else {
        priority = "Low";
    }
    return priority;
}
