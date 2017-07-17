
const Generator = require('yeoman-generator');
const rename = require('gulp-rename');

const deps = (deps) => Object.keys(deps).map(name => {
  if(deps[name] === '*') {
    return name;
  } else {
    return `${name}@${deps[name]}`;
  }
});

const slugify = (name) => {
  name = name.replace(/[^A-Za-z0-9]/g, '-').replace(/[A-Z]/g, (g) => `-${g}`).toLowerCase().replace(/-+/g, '-').replace(/^-+/, '').replace(/-$/, '');
  return name;
};

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'projectTitle',
      message: 'Your project title',
      default: slugify(this.appname).replace(/(^|-)([a-z0-9])/g, (g, g1, g2) => g2.toUpperCase()),
      store: true
    }, {
      type: 'input',
      name: 'company',
      message: 'Your company\'s name',
      store: true
    }, {
      type: 'input',
      name: 'repository',
      message: 'Your repository\'s URL',
      store: true
    }, {
      type: 'input',
      name: 'domainName',
      message: 'Your project\'s domain name',
      store: true
    }, {
      type: 'input',
      name: 'name',
      message: 'Your name',
      store: true
    }, {
      type: 'input',
      name: 'email',
      message: 'Your email address',
      store: true
    }]).then((answers) => {
      this.answers = answers;
      this.answers.projectName = this.answers.projectTitle.replace(/\s+/, '');
      this.answers.serverProjectName = `${slugify(this.answers.projectName)}-server`;
      this.answers.clientProjectName = `${slugify(this.answers.projectName)}-client`;
    });
  }

  clientDestinationPath(path = '') {
    return this.destinationPath(`${this.answers.clientProjectName}/${path}`);
  }

  serverDestinationPath(path = '') {
    return this.destinationPath(`${this.answers.serverProjectName}/${path}`);
  }

  writing() {
    if(!this.fs.exists(this.serverDestinationPath('package.json'))) {
      const pkg = {
        name: `@${slugify(this.answers.company)}/${this.answers.serverProjectName}`,
        version: '1.0.0',
        description: `${this.answers.projectTitle} Server`,
        author: `${this.answers.name} <${this.answers.email}>`,
        license: 'UNLICENSED',
        private: true,
        scripts: {
          'start:server': 'nodemon -e js -w src/server -x babel-node src/server',
          'start': 'docker-compose up -d --build',
          'stop': 'docker-compose stop',
          'restart': 'npm-run-all stop start',
          'logs': 'docker-compose logs -f --tail 50 server',
          'start:db': `docker-compose exec mongo mongo ${slugify(this.answers.projectName)}`,
          'db:drop': `docker-compose exec mongo mongo ${slugify(this.answers.projectName)} --eval 'db.dropDatabase()'`
        }
      }
      this.fs.write(this.serverDestinationPath('package.json'), JSON.stringify(pkg, null, 2));
    }

    if(!this.fs.exists(this.clientDestinationPath('package.json'))) {
      const pkg = {
        name: `@${slugify(this.answers.company)}/${this.answers.clientProjectName}`,
        version: '1.0.0',
        description: `${this.answers.projectTitle} Client`,
        author: `${this.answers.name} <${this.answers.email}>`,
        license: 'UNLICENSED',
        private: true,
        scripts: {
          'start:ios': 'react-native run-ios --simulator=\"iPhone 7 Plus\"',
          'start:ios-device': 'react-native run-ios --device',
          'start:android': 'react-native run-android --simulator',
          'start:web': 'webpack-dev-server -w',
          'start:webpack': 'webpack -w',
          'start:desktop': 'npm-run-all -r --parallel start:webpack start:electron',
          'start:electron': 'sleep 2; electron lib/electron.js',
          'build:ios': 'bash ios/build.sh',
          'build:macos': `webpack; electron-packager . --appname '${this.answers.projectTitle}' --overwrite  --asar --ignore=\"src/\" --platform=darwin --arch=x64 --icon=icon.icns --prune=true --out=dist`
        }
      }
      this.fs.write(this.clientDestinationPath('package.json'), JSON.stringify(pkg, null, 2));
    }

    this.registerTransformStream(rename((path) => {
      if(path.basename[0] === '_') path.basename = `.${path.basename.substring(1)}`;
      return path;
    }));

    this.fs.copyTpl(
      this.templatePath('_*'),
      this.destinationRoot(),
      this.answers
    );

    this.fs.copyTpl(
      this.templatePath('client/**/*'),
      this.clientDestinationPath(),
      this.answers
    );

    this.fs.copy(
      this.templatePath('client/**/*.png'),
      this.clientDestinationPath()
    );

    this.fs.copyTpl(
      this.templatePath('server/**/*'),
      this.serverDestinationPath(),
      this.answers
    );
  }

  install() {
    const clientDependencies = {
      "events": "^1.1.1",
      "md5": "^2.2.1",
      "prop-types": "^15.5.10"
    };

    const clientDevDependencies = {
      "babel-loader": "^7.1.1",
      "babel-plugin-transform-runtime": "^6.23.0",
      "babel-preset-es2015": "^6.24.1",
      "babel-preset-react": "^6.24.1",
      "babel-preset-stage-0": "^6.24.1",
      "electron": "^1.6.11",
      "html-webpack-plugin": "^2.29.0",
      "electron-packager": "^8.7.2",
      "file-loader": "^0.11.2",
      "npm-run-all": "^4.0.2",
      "url-loader": "^0.5.9",
      "webpack": "^3.2.0",
      "webpack-dev-server": "^2.5.1",
      "react": "^15.4.1",
      "react-dom": "^15.4.1",
      "react-native": "^0.42.3",
      "react-native-config": "^0.5.0",
      "react-native-device-info": "^0.10.2",
      "react-native-notifications": "^1.1.12",
      "react-native-web": "^0.0.112",
      "react-router-native": "^4.1.1"
    };

    const serverDependencies = {
      "apn": "^2.1.5",
      "babel-cli": "^6.24.1",
      "babel-plugin-transform-runtime": "^6.23.0",
      "babel-preset-es2015": "^6.24.1",
      "babel-preset-stage-0": "^6.24.1",
      "base-x": "^3.0.2",
      "body-parser": "^1.17.2",
      "css-loader": "^0.28.4",
      "express": "^4.15.3",
      "express-handlebars": "^3.0.0",
      "extract-text-webpack-plugin": "^3.0.0",
      "glob": "^7.1.2",
      "mongoose": "^4.11.1",
      "node-fetch": "^1.7.1",
      "node-sass": "^4.5.3",
      "nodemon": "^1.11.0",
      "sass-loader": "^6.0.6",
      "redis": "^2.7.1",
      "scrypt": "^6.0.3",
      "style-loader": "^0.18.2",
      "uuid": "^3.1.0",
      "ws": "^3.0.0"
    };

    const serverDevDependencies = {
      "babel-loader": "^7.1.1",
      "file-loader": "^0.11.2",
      "prompt": "^1.0.0",
      "react": "^15.6.1",
      "url-loader": "^0.5.9",
      "webpack": "^3.2.0",
      "webpack-dev-middleware": "^1.11.0",
      "npm-run-all": "^4.0.2"
    };

    this.spawnCommandSync('yarn', ['add', ...deps(clientDependencies)], { cwd: this.clientDestinationPath() });
    this.spawnCommandSync('yarn', ['add', ...deps(clientDevDependencies), '--dev'], { cwd: this.clientDestinationPath() });
    this.spawnCommandSync('yarn', ['add', ...deps(serverDependencies)], { cwd: this.serverDestinationPath() });
    this.spawnCommandSync('yarn', ['add', ...deps(serverDevDependencies), '--dev'], { cwd: this.serverDestinationPath() });

    this.spawnCommandSync('yarn', ['react-native', 'eject'], { cwd: this.clientDestinationPath(), stdio: null });
    this.spawnCommandSync('yarn', ['react-native', 'link'], { cwd: this.clientDestinationPath() });

    if(!this.fs.exists(this.destinationPath('.git'))) {
      this.spawnCommandSync('git', ['init']);
      this.spawnCommandSync('git', ['remote', 'add', 'origin', this.answers.repository]);
      this.spawnCommandSync('git', ['add', '.']);
      this.spawnCommandSync('git', ['commit', '-m', 'generator commit']);
    }
  }

};
