import ballerina/uuid;


public function generateApiKey() returns string {
    return uuid:createType1AsString();
}
