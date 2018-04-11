'use strict';

/**
 * @author Ankit Verma
 */

const aws = require('aws-sdk');

const ses = new aws.SES({ region: 'us-east-1' });

const EMAIL_PAYLOAD = {
    Destination: {
        ToAddresses: [],
    },
    Message: {
        Body: {
            Html: {
                Charset: 'UTF-8',
                Data: '',
            },
        },
        Subject: {
            Charset: 'UTF-8',
            Data: '',
        },
    },
    Source: '"Cell Free Zone" <qa@medlmobile.com>',
};

const AwsSES = (() => {
    return {
        /**
         *
         * @param toAddresses {String | Array} This an address or array of addresses to send the
         * email to. If sent as a string, the value should only contain a single email address.
         * @param subject {String} Simple string to represent the Subject line of the Email
         * @param message {String} The value should be html formatted into a string.
         * @return {Promise}
         */
        sendEmail: (toAddresses, subject, message) => {
            return new Promise((resolve, reject) => {
                if (!toAddresses && !toAddresses.size) {
                    return reject(new Error('No "toAddresses" where provided'));
                }

                if (!message) {
                    return reject(new Error('No "message" was provided'));
                }

                if (!subject) {
                    return reject(new Error('No "Subject" was provided'));
                }

                let destinationAddresses = toAddresses;
                if (typeof destinationAddresses === 'string') {
                    destinationAddresses = [toAddresses];
                }

                const emailMessage = Object.assign({}, EMAIL_PAYLOAD);
                emailMessage.Message.Body.Html.Data = message;
                emailMessage.Message.Subject.Data = subject;
                emailMessage.Destination.ToAddresses = destinationAddresses;

                return ses.sendEmail(emailMessage, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(data);
                });
            });
        },
    };
})();

module.exports = AwsSES;