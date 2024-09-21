function calculateEngamentPriorityScore(EPSInput epsInput) returns float{
 return (epsInput.We * epsInput.Ei) + (epsInput.Wi * epsInput.Ii) + (epsInput.Ws * epsInput.Si);
}

function determinePriority(float EPSi) returns string{
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