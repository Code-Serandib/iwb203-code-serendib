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



