
// Function to calculate Stakeholder Network Stability (SNS)
# Description.
#
# + stakeholders - parameter description  
# + deltaBehavior - parameter description
# + return - return value description
public function calculateStakeholderNetworkStability(Stakeholder[] stakeholders, float[] deltaBehavior) returns float {
    float[][] SIM = buildStakeholderInfluenceMatrix(stakeholders);
    int N = SIM.length();
    float totalSensitivity = 0;

    foreach int j in 0 ..< N {
        float impact = 0;
        foreach int i in 0 ..< N {
            impact += SIM[i][j] * deltaBehavior[i];
        }

        totalSensitivity += abs(impact); 
    }
    float SNS = 1 - (totalSensitivity / N);
    return SNS;
}

function abs(float value) returns float {
    return value < 0.0 ? -value : value;
}
