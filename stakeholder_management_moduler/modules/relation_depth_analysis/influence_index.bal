
type NullAtributeException distinct error;
type InvalidScaleException distinct error;

# Only valid types should be for stakeholders is stakeholderType enum.
# Or InvalidTypeException should be thrown.
public type InvalidTypeException distinct error;

public enum stakeholderType {
    EMPLOYEE,
    INVESTOR,
    DIRECTOR,
    CLIENT,
    COMPETITOR,
    AUDITOR,
    GOVERMENT_AGENT
};

public type SEmetrics record {|
    float? power;
    float? legitimacy;
    float? urgency;
    string? stakeholder_type;
|};

function CalculateInfluence(float power, float legitamacy, float urgency) returns float{
    return (power+legitamacy+urgency) / 3;
};

function GetDefaultPowerByStakeholderType(string sh_type) returns float|error{
    match sh_type{
        EMPLOYEE => {return 8.0;}
        INVESTOR => {return 10.0;}
        DIRECTOR => {return 9.0;}
        CLIENT => {return 9.0;}
        COMPETITOR => {return 5.0;}
        AUDITOR => {return 7.0;}
        GOVERMENT_AGENT => {return 6.0;}
        _ => {return error InvalidTypeException("\""+sh_type+"\" is invalid type!...");}
    }
};

public function stakeholder_influence_index(
    float? power, 
    float? legitimacy, 
    float? urgency, 
    stakeholderType? stakeholder_type) returns float|error {

    float realPower;

    if power is (){
        if stakeholder_type is (){
            return error NullAtributeException("\"power\" and \"employee_type\" both cannot be null at same time!...");
        }else {
            var result = GetDefaultPowerByStakeholderType(stakeholder_type);
            if result is float{
                realPower = result;
            }else{
                return result;
            }
        }
    }else{
        realPower = power;
    }

    if legitimacy !is () && urgency !is (){

        if realPower < 1.0 || realPower > 10.0{
            return error NullAtributeException("\"power\" is in invalid range! (power should be grater than 1 and less than 10)");
        } else if legitimacy < 1.0 || legitimacy > 10.0{
            return error NullAtributeException("\"legitimacy\" is in invalid range! (legitimacy should be grater than 1 and less than 10)");
        } else if urgency < 1.0 || urgency > 10.0{
            return error NullAtributeException("\"urgency\" is in invalid range! (urgency should be grater than 1 and less than 10)");
        }

        float sii = CalculateInfluence(realPower, legitimacy, urgency);
        return sii;
    }

    return error NullAtributeException("Operation unsuccess...");
}