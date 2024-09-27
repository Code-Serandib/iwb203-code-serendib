
// Function to calculate Dynamic Stakeholder Impact (DSI)
# Description.
#
# + stakeholders - parameter description  
# + deltaBehavior - parameter description
# + return - return value description
public function calculateDynamicStakeholderImpact(Stakeholder[] stakeholders, float[] deltaBehavior) returns float[] {
    float[][] SIM = buildStakeholderInfluenceMatrix(stakeholders);
    int n = SIM.length();
    float[] DSI = [];

    foreach int j in 0 ..< n {
        float totalImpact = 0;
        foreach int i in 0 ..< n {
            totalImpact += SIM[i][j] * deltaBehavior[i];
        }
        DSI.push(totalImpact);
    }
    return DSI;
}
