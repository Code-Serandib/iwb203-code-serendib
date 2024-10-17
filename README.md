# Stakeholder Management System

## With analytical insight.

This Stakeholder Management System is designed to address key gaps in traditional stakeholder management solutions by providing advanced analytical tools that allow organizations to make  data-driven decisions, mitigate risks, and optimize stakeholder engagement. Built with Next.js for the frontend and Ballerina for the backend, and using MySQL for database management, this  system helps organizations strategically prioritize stakeholders and improve project outcomes. 

### Set up

1. Clone the project 

> ```
> git clone https://github.com/Code-Serandib/iwb203-code-serendib.git
> ```

2. Add a new file named `Config.toml` in the `/stakeholder_management_backend` directory and add the following configurations for the MySQL server.

> ```
> DB_USERNAME="<username>"
> DB_PASSWORD="<password>"
> DB_URL="<databse_url>"
> ```

3. Add the following configurations for the Google Authentication.

> ```
> CLIENT_ID="<client_id>"
> CLIENT_SECRET="<client_secret>"
> ```

4. Add the following configurations for the Mail Service.

> ```
> SMTP_EMAIL="smtp.mailtrap.io"
> SMTP_USERNAME="<username>"
> SMTP_PASSWORD="<password>"
> ```

5. Open a new terminal in the project path and run the `Metrics API`

> ```
> cd stakeholder_management_metrics_api
> bal run
> ```

6. Open an another terminal in the project path and run the `Backend service`

> ```
> cd stakeholder_management_backend
> bal run
> ```

7. Open an another terminal in the project path and run the `React service`

> ```
> cd stakeholder-management-frontend
> npm run dev
> ```

## Analytical Insights

### Influence Index Calculator

#### Features

- **Survey Modal** for collecting stakeholder details on Power, Legitimacy, and Urgency.
- Dynamic influence calculation based on stakeholder type.
- Integration with a backend API to retrieve the calculated influence index.
- Visual feedback on the influence result, categorized into low, medium, or high influence levels.

#### How It Works

This project uses a form-based approach to gather data about stakeholders' Power, Legitimacy, and Urgency. Each factor is derived from a series of survey questions, and the scores are   normalized to values between 0 and 10.

##### Steps:

1. Power: Evaluates the stakeholder's role, authority, and control over resources or decision-making.
2. Legitimacy: Measures the stakeholder's standing in relation to their official role, expertise, or recognized authority.
3. Urgency: Assesses the immediacy and importance of the stakeholder's needs or issues.
4. The survey responses are converted into a numerical score, and these scores are used to compute the Influence Index.

##### Influence Calculation:

1. Each survey question provides a set of options, and the selected option is mapped to a score.
2. The score is normalized and calculated as a factor out of 10 for Power, Legitimacy, and Urgency.
3. The three factors are then passed to a backend API that computes the overall Influence Index using custom logic.

### Nash Equilibrium Calculator

This project is a Nash Equilibrium Calculator designed for a stakeholder management system. It helps to compute the Nash equilibrium for a set of stakeholders with various strategies,  facilitating decision-making in strategic interactions between multiple players (stakeholders).

#### Features

- Support for 2 or 3 players (stakeholders).
- Flexible input of strategic options for each player.
- Input system for payoff matrices corresponding to player strategies.
- Calculates the Nash Equilibrium by using an external API.
- Displays results in an intuitive and interactive payoff matrix with Nash equilibrium points highlighted.

#### Usage

> Once you have the frontend running, follow these steps: 

1. Enter the names of 2 or 3 players (stakeholders).
2. Define the number of strategic options for each player.
3. Specify the options for each player.
4. Input the payoffs for each combination of options.
5. Click `Calculate Nash Equilibrium` to submit the form. The system will display the Nash equilibrium points in the matrix.

#### Components

> The key components used in this project are: 

1. Player Input: For entering the player names.
2. Option Counts Input: Allows input of the number of strategies each player has.
3. Options Input: For specifying strategic options.
4. Payoffs Input: For entering payoff values for each strategy combination.
5. NashMatrixDisplay: Displays the Nash equilibrium result in a matrix format with highlighted equilibrium points.
