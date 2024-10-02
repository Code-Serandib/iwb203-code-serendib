import ballerina/sql;
function ifKeyNameExist(string keyName) returns sql:ParameterizedQuery{
    sql:ParameterizedQuery query = `SELECT key_name FROM user_api WHERE key_name = ${keyName}`;
    return  query;
}

function insertUserApi(APIReg apireg, string apiKey) returns sql:ParameterizedQuery{
    sql:ParameterizedQuery query = `INSERT INTO user_api (username, email, api_key, project_name, key_name) VALUES (${apireg.username}, ${apireg.email}, ${apiKey}, ${apireg.projectName}, ${apireg.keyName})`;
    return  query;
}

function ifUserExistByAPIKey(string apiKey) returns sql:ParameterizedQuery{
    sql:ParameterizedQuery query = `SELECT username FROM user_api WHERE api_key = ${apiKey}`;
    return  query;
}

function updateAPIKey(string apiKey, string newApiKey) returns sql:ParameterizedQuery{
    sql:ParameterizedQuery query = `UPDATE user_api SET api_key = ${newApiKey} WHERE api_key = ${apiKey}`;
    return  query;
}