# Description.
#
# + alpha - Weighting factor for EPS 
# + beta - Weighting factor for BSC  
# + EPSi - Engagement Priority Score  
# + BSCi - Balanced Scorecard Score
public type TESInput record {|
    float alpha;  
    float beta;   
    float EPSi;   
    float BSCi;   
|};

public function calculateTotalEngagementScore(TESInput tesInput) returns float {
    return (tesInput.alpha * tesInput.EPSi) + (tesInput.beta * tesInput.BSCi);
}

public function makeDecisionBasedOnTES(float TESi) returns string{
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
