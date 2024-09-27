# Description.
#
# + Wf - Weight for financial dimension 
# + Wc - Weight for customer dimension  
# + Wp - Weight for internal process dimension  
# + Wl - Weight for learning & growth dimension  
# + Fi - Financial score (0 to 1)  
# + Ci - Customer score (0 to 1) 
# + Pi - Internal process score (0 to 1)  
# + Li - Learning & growth score (0 to 1)
public type BSCInput record {|
    float Wf;  
    float Wc;  
    float Wp; 
    float Wl;  
    float Fi;  
    float Ci;  
    float Pi;  
    float Li;  
|};

public function calculateBalancedScoreMetrics(BSCInput bscInput) returns float {
    return (bscInput.Wf * bscInput.Fi) + (bscInput.Wc * bscInput.Ci) + (bscInput.Wp * bscInput.Pi) + (bscInput.Wl * bscInput.Li);
}

public function makeDecisionBasedOnBSCi(float BSCi) returns string {
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
