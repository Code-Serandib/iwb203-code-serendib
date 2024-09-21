import ballerina/http;
import ballerina/io;

type SEmetrics record {|
    float? power;
    float? legitimacy;
    float? urgency;
    string? stakeholder_type;
|};

service /relation\-depth on new http:Listener(9090) {
    resource function get analytics() returns string|float|error {
        float|error hello = stakeholder_influence_index(4.5, 3.0, 2, "EMPLOYEE");
        io:println(hello);
        return hello;
    }

    resource function post analytics(SEmetrics se_metrics) returns http:Created|error {

        stakeholderType? stakeholderEnumType = null;
        if (se_metrics.stakeholder_type is string) {
            match se_metrics.stakeholder_type {
                "EMPLOYEE" => {
                    stakeholderEnumType = EMPLOYEE;
                }
                "INVESTOR" => {
                    stakeholderEnumType = INVESTOR;
                }
                "DIRECTOR" => {
                    stakeholderEnumType = DIRECTOR;
                }
                "CLIENT" => {
                    stakeholderEnumType = CLIENT;
                }
                "COMPETITOR" => {
                    stakeholderEnumType = COMPETITOR;
                }
                "AUDITOR" => {
                    stakeholderEnumType = AUDITOR;
                }
                "GOVERMENT_AGENT" => {
                    stakeholderEnumType = GOVERMENT_AGENT;
                }
                _ => {
                    return error InvalidTypeException("Invalid stakeholder type");
                }
            }
        }

        float|error result = stakeholder_influence_index(se_metrics.power, se_metrics.legitimacy, se_metrics.urgency, stakeholderEnumType);
        if (result is float) {
            io:println(result);
            return http:CREATED;
        } else {
            return result;
        }

    }

    resource function post gt_analytics(CustomTable customTable) returns http:Created|error {
        string|error result = game_theory_cal(customTable);
        if (result is string) {
            io:println(result);
            return http:CREATED;
        } else {
            return result;
        }
    }

    resource function post relationshipValue(http:Caller caller, http:Request req) returns error? {
        json inputJson = check req.getJsonPayload();
        StakeholderRelation relation = check inputJson.cloneWithType(StakeholderRelation);

        // Call the relationshipValueCal function and handle errors
        RelationResult|error result = relationshipValueCal(relation);

        if (result is error) {
            // Handle the error case and respond with a meaningful message
            json errorResponse = {
                "status": "error",
                "message": "Invalid input values",
                "details": {
                    "benefit": relation.benefit,
                    "cost": relation.cost,
                    "hint": "Benefit must be positive and cost cannot be negative."
                }
            };
            check caller->respond(errorResponse);
        } else {
            // Handle the success case and respond with the result
            check caller->respond(result.toJson());
        }
    }
}
