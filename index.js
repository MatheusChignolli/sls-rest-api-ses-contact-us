import AWS from "aws-sdk";

const ses = new AWS.SES();

export const createContact = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: "invalid request, you are missing the parameter body",
    };
  }

  const data = JSON.parse(event.body);
  const { to, from, subject, message } = data || {};

  console.log("data: ", to);

  if (!to || !from || !subject || !data) {
    const requiredParams = [];

    if (!to) {
      requiredParams.push("to");
    }

    if (!from) {
      requiredParams.push("from");
    }

    if (!subject) {
      requiredParams.push("subject");
    }

    if (!message) {
      requiredParams.push("message");
    }

    return {
      statusCode: 400,
      body: `Missing required parameters: ${requiredParams.join(", ")}`,
    };
  }

  const sesParams = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: { Data: message },
      },
      Subject: { Data: subject },
    },
    Source: from,
  };

  try {
    await ses.sendEmail(sesParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Email sent to ${to}`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
