


import mongoose from 'mongoose';
import url from 'url';
import { redis } from '../redis';

const toJSON = (authentication) => {
  authentication = JSON.parse(JSON.stringify(authentication));

  let out = {};
  out.id = authentication.id;
  out.status = authentication.status;
  out.created = authentication.created;
  out.logo = authentication.application.logo;
  out.name = authentication.application.name;
  return out;
};

export default (ws, req) => {
  const Authentication = mongoose.model('Authentication');
  const User = mongoose.model('User');

  const location = url.parse(req.url, true);
  const { u: accessToken } = location.query;

  let subscriber;

  ws.on('message', (message) => {
    if(message.toString('utf8') === 'keepalive') {
      return;
    }

    ws.close();
  });

  ws.on('close', (message) => {
    subscriber.unsubscribe();
    subscriber.quit();
  });

  let q = User.findOne({ accessToken }).exec();
  q = q.then((user) => {
    const { id } = user.toJSON();

    subscriber = redis();
    subscriber.on('message', (channel, message) => {
      message = JSON.parse(message);
      ws.send(JSON.stringify(toJSON(message)));
    });
    subscriber.subscribe(`user:${id}`);

    return Authentication.find({ user, status: 'pending' }).populate('user application').exec();
  });
  q = q.then((authentications) => {
    authentications.forEach((authentication) => {
      ws.send(JSON.stringify(toJSON(authentication)));
    });
  });
  q.catch((err) => console.error(err));
};
