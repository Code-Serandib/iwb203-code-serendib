function calculateEDA(RiskInput riskInput, float engamenetTreshold) returns json {
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
