
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import handlebars from 'express-handlebars';
import routerTree from './router-tree';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../../webpack.config';

import createWebSocketServer from './websockets';

import './mongo';

const app = express();
const server = http.createServer(app);
createWebSocketServer(server);

app.engine('hbs', handlebars({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: 'src/server/views/layouts',
  partialsDir: 'src/server/views/partials',
  helpers: {
    json: (context, block) => JSON.stringify(context)
  }
}));
app.set('view engine', 'hbs');
app.set('views', 'src/server/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(webpackMiddleware(webpack(webpackConfig), {
  publicPath: '/assets/'
}));

app.use(routerTree('src/server/routes'));

app.use('/assets/', express.static('src/static'));

server.listen(process.env.PORT || 3000, (err) => {
  console.info(`Listening on port ${server.address().port}`);
});
