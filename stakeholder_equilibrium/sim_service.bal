// import ballerina/math;

// Function to calculate the absolute value (custom abs function)
function abs(float value) returns float {
    return value < 0.0 ? -value : value;
}

// Function to calculate influence
public function calculateInfluence(float Ci, float Ij) returns float {
    return Ci * Ij;
}

// Function to build the Stakeholder Influence Matrix (SIM)
public function buildStakeholderInfluenceMatrix(Stakeholder[] stakeholders) returns float[][] {
    int n = stakeholders.length();
    float[][] SIM = [];

    foreach int i in 0 ..< n {
        float[] row = [];
        foreach int j in 0 ..< n {
            float Ci = stakeholders[i].connectionStrength;
            float Ij = stakeholders[j].influence;
            float SIMij = calculateInfluence(Ci, Ij);
            row.push(SIMij);
        }
        SIM.push(row);
    }

    return SIM;
}

// Function to calculate Dynamic Stakeholder Impact (DSI)
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

// Function to calculate Stakeholder Network Stability (SNS)
public function calculateStakeholderNetworkStability(Stakeholder[] stakeholders, float[] deltaBehavior) returns float {
    float[][] SIM = buildStakeholderInfluenceMatrix(stakeholders);
    int N = SIM.length();
    float totalSensitivity = 0;

    foreach int j in 0 ..< N {
        float impact = 0;
        foreach int i in 0 ..< N {
            impact += SIM[i][j] * deltaBehavior[i];
        }

         totalSensitivity += abs(impact); // Use custom abs function
        // totalSensitivity += math:abs(impact);
    }

    float SNS = 1 - (totalSensitivity / N);

    return SNS;
}

// Function to calculate Systemic Influence Score (SIS)
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
