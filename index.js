#! /usr/bin/env node

var shell = require('shelljs');
var jsonfile = require('jsonfile');

if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}

var contributors = shell.exec('git shortlog -s -n < /dev/tty', {silent: true});

if (contributors.code !== 0) {
    shell.echo('Error: Git commit failed');
    shell.exit(1);
}

function identity(item) {
  return item;
}

function trim(string) {
    return string.trim();
}

function splitByTab(string) {
    return string.split('\t')
}

function arrayElementAtIndex(index) {
    return function(array) {
        return array[index];
    }
}

contributors = contributors.stdout.split('\n').map(splitByTab).map(arrayElementAtIndex(1)).filter(identity).map(trim).join(', ');

var cwd = process.cwd();
var packageFile = cwd + '/package.json';

var package = jsonfile.readFileSync(packageFile);
package.author = contributors;
jsonfile.writeFileSync(packageFile, package, {spaces: 2});

shell.echo('Updated authors field in package.json to "' + contributors + '"');