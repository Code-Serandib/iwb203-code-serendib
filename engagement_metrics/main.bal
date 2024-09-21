import ballerina/http;

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
type BSCInput record {|
    float Wf;  
    float Wc;  
    float Wp; 
    float Wl;  
    float Fi;  
    float Ci;  
    float Pi;  
    float Li;  
|};

# Description.
#
# + alpha - Weighting factor for EPS 
# + beta - Weighting factor for BSC  
# + EPSi - Engagement Priority Score  
# + BSCi - Balanced Scorecard Score
type TESInput record {|
    float alpha;  
    float beta;   
    float EPSi;   
    float BSCi;   
|};

service /engagement\-metrics on new http:Listener(9090) {

    //calculate priority score
    resource function post calculate_eps(http:Caller caller, EPSInput epsInput) returns error? {
        float EPSi = calculateEngamentPriorityScore(epsInput);

        string priority = determinePriority(EPSi);

        json epsResult = {
            "EPSi": EPSi,
            "priority": priority
        };

        check caller->respond(epsResult);
    }

    //calculate balanced score metrics
    resource function post calculate_bsc(http:Caller caller, BSCInput bscInput) returns error? {
        
        float BSCi = calculateBalancedScoreMetrics(bscInput);

        string decision = makeDecisionBasedOnBSCi(BSCi);

        json bscResult = {
            "BSCi": BSCi,
            "decision": decision
        };

        check caller->respond(bscResult);
    }

    //calculate total engament score
    resource function post calculate_tes(http:Caller caller, TESInput tesInput) returns error? {
        float TESi = calculateTotalEngagementScore(tesInput);

        string priority = makeDecisionBasedOnTES(TESi);

        json tesResult = {
            "TESi": TESi,
            "priority": priority
        };

        check caller->respond(tesResult);
    }
}
