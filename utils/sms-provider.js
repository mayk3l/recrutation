const querystring = require('querystring');

export const sendConfirmationSms = async (
 	phoneNumber, smsCode,
 ) => {
 	const message = `Aktywuj logowanie: ${smsCode}`;
 	const urlParameters = querystring.stringify(
 		{
 			key: process.env.SMS_KEY,
 			clear_polish: 1,
 			password: process.env.SMS_PASS,
 			from: 'ITFOCUS',
 			to: phoneNumber instanceof Array ? phoneNumber : [phoneNumber],
 			msg: message,
 			test: 1,
 		},
 		null,
 		null,
 		{ encodeURIComponent: encodeURI },
 	);

 	const response = await fetch(process.env.SMS_URL, {
 		method: 'POST',
 		body: urlParameters,
 		headers: {
 			'Content-Type': 'application/x-www-form-urlencoded',
 		},
 	});

 	console.log(response);

 	const responseMessage = JSON.parse(await response.text());

 	console.log(responseMessage);
 	if (
 		responseMessage.errorCode) {
 		if (responseMessage.errorCode === 106) {
			throw new Error('Sms provider does not accept phone number');
 		}
		throw new Error('Unexpected error');
 	}

 	return null;
};
