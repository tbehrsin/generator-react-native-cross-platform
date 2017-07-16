
import express from 'express';
import mongoose from 'mongoose';
import scrypt from 'scrypt';
import crypto from 'crypto';
import { base16, base62 } from '../../utils';

export const router = express.Router();

mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: {
      hash: {
        type: String,
        required: true
      },
      salt: {
        type: String,
        required: true
      }
    },
    required: true
  },
  accessToken: {
    type: String,
    unique: true,
    required: true
  },
  pushToken: {
    type: String,
    default: null
  },
  created: {
    type: Date,
    required: true,
    default: Date
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = base62.encode(base16.decode(ret._id.toString()));
      delete ret._id;
      delete ret.__v;

      delete ret.accessToken;
      delete ret.password;
      delete ret.key;
    }
  }
}));

// register user, returns login token
router.post('/', (req, res, next) => {
  const User = mongoose.model('User');
  const { name, email, password } = req.body;

  crypto.randomBytes(32, (err, salt) => {
    if(err) {
      next(err);
      return;
    }

    crypto.randomBytes(32, (err, accessToken) => {
      if(err) {
        next(err);
        return;
      }

      scrypt.hash(password, { N: 16, r: 1, p: 1 }, 64, salt, (err, hash) => {
        if(err) {
          next(err);
          return;
        }

        salt = salt.toString('base64');
        hash = hash.toString('base64');
        accessToken = accessToken.toString('base64');

        const user = new User({
          name,
          email,
          password: { hash, salt },
          accessToken
        });

        user.save((err, user) => {
          if(err) {
            if(/duplicate key error/.test(err.message)) {
              res.status(403).json(null);
              return;
            }

            next(err);
            return;
          }

          const json = user.toJSON();
          json.accessToken = user.accessToken;
          res.json(json);
        });
      });
    });
  });
});

export const auth = (req, res, next) => {
  const User = mongoose.model('User');

  let accessToken = req.get('Authorization') && req.get('Authorization').match(/^Bearer (.+)$/);
  if(!accessToken || !accessToken[1]) {
    res.status(403).json(null);
    return;
  }
  accessToken = accessToken[1];

  User.findOne({ accessToken }).exec((err, user) => {
    if(err) {
      next(err);
      return;
    }

    if(!user) {
      res.status(403).json(null);
      return;
    }

    req.user = user;
    next();
  });
};

// retrieve access token
router.put('/', (req, res, next) => {
  const User = mongoose.model('User');
  const { email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if(err) {
      next(err);
      return;
    }

    if(!user) {
      res.status(403).json(null);
      return;
    }

    let { hash, salt } = user.password;
    salt = Buffer.from(salt, 'base64');

    scrypt.hash(password, { N: 16, r: 1, p: 1 }, 64, salt, (err, hashCheck) => {
      if(err) {
        next(err);
        return;
      }

      hashCheck = hashCheck.toString('base64');

      if(hash !== hashCheck) {
        res.status(403).json(null);
        return;
      }

      const json = user.toJSON();
      json.accessToken = user.accessToken;
      res.json(json);
    });
  });
});

// get authenticated user
router.get('/me', auth, (req, res, next) => {
  res.json(req.user);
});

router.put('/me', auth, (req, res, next) => {
  const { pushToken } = req.body;

  const user = req.user;
  user.pushToken = pushToken;

  user.save((err, user) => {
    if(err) {
      next(err);
      return;
    }

    res.json(user);
  });
});
