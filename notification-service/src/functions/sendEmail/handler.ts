import { SES } from "aws-sdk";

const simpleEmailService = new SES({ region: "eu-central-1" });

const sendEmail = async (event: any) => {
  console.log(event);
  const params = {
    Source: "sender_adress@email.com", //who is the sender (previously validated by AWS)
    Destination: {
      ToAddresses: ["reepient1@email.com", '"reepient2@email.com"'],
    },
    Message: {
      Body: {
        Text: {
          Data: "Hello from Serhii!",
        },
      },
      Subject: {
        Data: "@AWS-Auction: test Mail message",
      }
    },
  };

  try {
    const result = await simpleEmailService.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const main = sendEmail;
