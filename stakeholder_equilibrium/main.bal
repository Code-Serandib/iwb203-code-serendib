import ballerina/http;
import ballerina/data.jsondata;
public type Stakeholder record {|
    string name;
    float connectionStrength;
    float influence;
|};

service /stakeholder\-modelling on new http:Listener(9090) {

    // Calculate SIM
    // resource function post calculate_sim(http:Caller caller, Stakeholder[] stakeholders) returns error? {
    resource function post calculate_sim(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();

         // Ensure the 'stakeholders' field is present and is of type json
        json stakeholdersJson = check payload.stakeholders;
        
        // Parse the 'stakeholders' field in the JSON payload
        Stakeholder[] stakeholders = check jsondata:parseAsType(stakeholdersJson);

        float[][] SIM = buildStakeholderInfluenceMatrix(stakeholders);

        json response = { "SIM": SIM };
        check caller->respond(response);
    }

    // Calculate DSI
    resource function post calculate_dsi(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();
        Stakeholder[] stakeholders = check jsondata:parseAsType(check payload.stakeholders);
        float[] deltaBehavior = check jsondata:parseAsType(check payload.deltaBehavior);

        float[] DSI = calculateDynamicStakeholderImpact(stakeholders, deltaBehavior);

        json response = {
            "DSI": DSI
        };

        check caller->respond(response);
    }

    // Calculate SNS
    resource function post calculate_sns(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();
        Stakeholder[] stakeholders = check jsondata:parseAsType(check payload.stakeholders);
        float[] deltaBehavior = check jsondata:parseAsType(check payload.deltaBehavior);

        float SNS = calculateStakeholderNetworkStability(stakeholders, deltaBehavior);

        json response = {
            "SNS": SNS
        };

        check caller->respond(response);
    }

    // Calculate SIS
    resource function post calculate_sis(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();
        
         // Ensure the 'stakeholders' field is present and is of type json
        json stakeholdersJson = check payload.stakeholders;

        
        // Parse the 'stakeholders' field in the JSON payload
        Stakeholder[] stakeholders = check jsondata:parseAsType(stakeholdersJson);

        float[] SIS = calculateSystemicInfluenceScore(stakeholders);

        json response = {
            "SIS": SIS
        };

        check caller->respond(response);//end
    }
}
