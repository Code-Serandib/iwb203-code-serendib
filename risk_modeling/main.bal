import ballerina/data.jsondata;
import ballerina/http;

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

service /risk\-modelling on new http:Listener(9090) {

    //Risk Score
    resource function post calculate_risk_score(http:Caller caller, RiskInput riskInput) returns error? {
        // Validation
        if (riskInput.Si < 0.0 || riskInput.Si > 1.0 || riskInput.Ei < 0.0 || riskInput.Ei > 1.0) {
            json errorResponse = {"error": "Satisfaction and Engagement levels must be between 0 and 1"};
            check caller->respond(errorResponse);
            return;
        }

        float riskScore = calculate(riskInput);

        string riskLevel = pretendRiskLevel(riskScore);

        json response = {
            "riskScore": riskScore,
            "riskLevel": riskLevel
        };

        check caller->respond(response);
    }

    //Total Project Risk
    resource function post calculate_project_risk(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();

        RiskInput[] riskInputs = check jsondata:parseAsType(check payload.riskInputs);
        float[] influences = check jsondata:parseAsType(check payload.influences);

        float|error totalRisk = calculateProjectRisk(riskInputs, influences);

        if (totalRisk is float) {
            string riskLevel = pretendProjectRiskLevel(totalRisk);
          
            json response = {
                "totalProjectRisk": totalRisk,
                "riskLevel": riskLevel,
                "action": determineAction(riskLevel)
            };

            check caller->respond(response);
        } else {
            json errorResponse = {"error": totalRisk.message()};
            check caller->respond(errorResponse);
        }
    }

    //Engagement Drop Alert
    resource function post engagement_drop_alert(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();

        RiskInput[] riskInputs = check jsondata:parseAsType(check payload.riskInputs);
        float engamenetTreshold = check payload.Te;

        json[] edaResults = [];

        foreach var riskInput in riskInputs {
            json stakeholderResult = calculateEDA(riskInput, engamenetTreshold);
            edaResults.push(stakeholderResult);
        }

        json response = {
            "engagementDropAlerts": edaResults
        };

        check caller->respond(response);
    }
}
