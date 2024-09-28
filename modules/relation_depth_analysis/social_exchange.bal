
public type StakeholderRelation record {
    float benefit;
    float cost;
};

public type RelationResult record {
    string message;
    string suggestion;
    json details;
};

public function relationshipValueCal(StakeholderRelation relation) returns RelationResult|error {
    // Validate
    if (relation.benefit <= 0.0 || relation.cost < 0.0) {
        return error("Invalid input values. Benefit must be positive and cost cannot be negative.");
    }

    // Calculate the relationship value
    float relationshipValue = (relation.benefit - relation.cost) / relation.benefit;

    // result and suggestions
    string message = string `The relationship value (Ri,j) is ${relationshipValue}`;
    string suggestion;
    if (relationshipValue > 0.0) {
        suggestion = "The relationship is beneficial and should be maintained or prioritized.";
    } else if (relationshipValue == 0.0) {
        suggestion = "The relationship is neutral, and no significant action is needed.";
    } else {
        suggestion = "The relationship has more costs than benefits, and it may be worth reconsidering.";
    }

    // Return response
    RelationResult result = {
        message: message,
        suggestion: suggestion,
        details: {
            "benefit": relation.benefit,
            "cost": relation.cost,
            "relationshipValue": relationshipValue
        }
    };

    return result;
}

