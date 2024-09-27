
// Function to calculate Systemic Influence Score (SIS)
# Description.
#
# + stakeholders - parameter description
# + return - return value description
public function calculateSystemicInfluenceScore(Stakeholder[] stakeholders) returns float[] {
    float[][] SIM = buildStakeholderInfluenceMatrix(stakeholders);
    int n = SIM.length();
    float[] SIS = [];

    foreach int i in 0 ..< n {
        float directInfluence = 0;
        float indirectInfluence = 0;

        // Direct influence
        foreach int j in 0 ..< n {
            directInfluence += SIM[i][j];
        }

        // Indirect influence
        foreach int k in 0 ..< n {
            foreach int j in 0 ..< n {
                indirectInfluence += SIM[i][k] * SIM[k][j];
            }
        }

        SIS.push(directInfluence + indirectInfluence);
    }

    return SIS;
}
