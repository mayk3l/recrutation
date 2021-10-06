const querystring = require('querystring');

export const sendConfirmationSms = async (
 	phoneNumber, smsCode,
 ) => {
 	const message = `Aktywuj logowanie: ${smsCode}`;
 	const urlParameters = querystring.stringify(
 		{
 			key: 'test',
 			clear_polish: 1,
 			password: 'test',
 			from: 'ITFOCUS',
 			to: phoneNumber instanceof Array ? phoneNumber : [phoneNumber],
 			msg: message,
 			test: 1,
 		},
 		null,
 		null,
 		{ encodeURIComponent: encodeURI },
 	);

 	const response = await fetch(`https://api2.smsplanet.pl/sms`, {
 		method: 'POST',
 		body: urlParameters,
 		headers: {
 			'Content-Type': 'application/x-www-form-urlencoded',
 		},
 	});

 	const responseMessage = JSON.parse(await response.text());
 	if (
 		responseMessage.errorCode) {
 		if (responseMessage.errorCode === 106) {
			throw new Error('Sms provider does not accept phone number');
 		}
		throw new Error('Unexpected error');
 	}

 	return null;
};
