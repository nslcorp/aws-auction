import { SES } from "aws-sdk";

const simpleEmailService: SES = new SES({ region: "eu-central-1" });

const sendEmail = async (event: any) => {
  const {subjectText, bodyText, recipients} = JSON.parse(event.Records[0].body);
  console.log('event.Records', event.Records)

  const params = {
    Source: "sender_adress@email.com", //who is the sender (previously validated by AWS)
    Destination: {
      ToAddresses: recipients,
    },
    Message: {
      Body: {
        Text: {
          Data: bodyText
        },
      },
      Subject: {
        Data: subjectText
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
