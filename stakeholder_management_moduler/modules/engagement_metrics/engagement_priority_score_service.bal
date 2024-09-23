# Description.
#
# + We - Weight for engagement
# + Wi - Weight for influence
# + Ws - Weight for stakeholder interest 
# + Ei - Engagement level (0 to 1)  
# + Ii - Influence level (0 to 1) 
# + Si - Stakeholder interest (0 to 1)
public type EPSInput record {|
    float We;
    float Wi;
    float Ws;
    float Ei;
    float Ii;
    float Si;
|};

public function calculateEngamentPriorityScore(EPSInput epsInput) returns float{
 return (epsInput.We * epsInput.Ei) + (epsInput.Wi * epsInput.Ii) + (epsInput.Ws * epsInput.Si);
}
public function determinePriority(float EPSi) returns string{
    string priority;
        if EPSi > 0.75 {
            priority = "High";
        } else if EPSi > 0.5 {
            priority = "Medium";
        } else {
            priority = "Low";
        }
    return priority;
}