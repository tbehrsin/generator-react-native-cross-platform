
import express from 'express';
import path from 'path';
import glob from 'glob';

export default (root) => {
  root = path.resolve(process.cwd(), root);
  const files = glob.sync('**/*.js', { cwd: root });

  const router = express.Router();
  for(const file of files) {
    const parts = file.split('/');
    parts.unshift('');

    const basename = path.basename(parts.pop(), '.js');
    if(basename !== 'index') {
      parts.push(basename);
    }

    const url = parts.join('/');
    router.use(url, require(path.resolve(root, file)).router);
  }

  return router;
};
