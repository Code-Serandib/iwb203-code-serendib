# Description.
#
# + Ws - is the weight given to the satisfaction level of the stakeholder.  
# + We - is the weight given to the satisfaction level of the stakeholder. 
# + Si - is the satisfaction level of stakeholder iii (scaled from 0 to 1, where 1 is fully satisfied).
# + Ei - is the engagement level of stakeholder iii (scaled from 0 to 1, where 1 is fully engaged).
public type RiskInput record {|
    float Ws;
    float We; 
    float Si; 
    float Ei; 
|};

public function calculateEDA(RiskInput riskInput, float engamenetTreshold) returns json {
    float Ei = riskInput.Ei;
    string alertStatus;

    if (Ei < engamenetTreshold) {
        alertStatus = "Alert: Engagement has dropped below threshold";
    } else {
        alertStatus = "No Alert: Engagement is above threshold";
    }

    return {
        "stakeholder": {
            "Ws": riskInput.Ws,
            "We": riskInput.We,
            "Si": riskInput.Si,
            "Ei": riskInput.Ei
        },
        "engagementLevel": Ei,
        "threshold": engamenetTreshold,
        "alertStatus": alertStatus
    };
}
