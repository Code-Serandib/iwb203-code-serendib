import ballerina/uuid;

public type User record {
    string username;
    string email;
    string apiKey;
};

public User[] users = [];

public function generateApiKey() returns string {
    return uuid:createType1AsString();
}
