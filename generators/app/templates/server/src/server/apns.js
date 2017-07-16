import apn from 'apn';

console.info(process.env.APNS_ENVIRONMENT === 'production', process.env.APNS_ENVIRONMENT);
const apns = new apn.Provider({
  pfx: Buffer.from(process.env.APNS_KEY, 'base64'),
  passphrase: process.env.APNS_PASSPHRASE,
  production: process.env.APNS_ENVIRONMENT === 'production'
});


export default {
  send: apns.send.bind(apns),
  Notification: apn.Notification
};
