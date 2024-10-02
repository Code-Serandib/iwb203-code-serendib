import ballerina/sql;

configurable string DB_PORT = ?;
configurable string DB_HOST = ?;
configurable string DB_USER = ?;
configurable string DB_PASSWORD = ?;

string jdbcUrl = string `jdbc:mysql://${DB_HOST}:${DB_PORT}/stakeholder_api?user=${DB_USER}&password=${DB_PASSWORD}`;

function initDatabase(sql:Client dbClient) returns error? {
    _ = check dbClient->execute(`CREATE TABLE IF NOT EXISTS user_api (id INT AUTO_INCREMENT PRIMARY KEY,
                                    username VARCHAR(100) NOT NULL,
                                    email VARCHAR(100) NOT NULL,
                                    api_key VARCHAR(255) UNIQUE NOT NULL,
                                    project_name VARCHAR(100),
                                    key_name VARCHAR(100) UNIQUE,
                                    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
}