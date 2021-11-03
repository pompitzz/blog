import fs from 'fs';

const filterNames = ['.vuepress', 'README.md', 'TAG'];

class File {
  constructor(path, name, isDirectory, isFile) {
    this.path = path;
    this.name = name;
    this.isDirectory = isDirectory;
    this.isFile = isFile;
  }

  static readdir(rootPath) {
    const dirents = fs.readdirSync(rootPath, { withFileTypes: true });
    return dirents
        .filter(dirent => !filterNames.includes(dirent.name))
        .filter(dirent => dirent.isDirectory() || dirent.name.endsWith('.md'))
        .map(dirent => new File(rootPath + '/' + dirent.name, dirent.name, dirent.isDirectory(), dirent.isFile()));
  }
}

class SidebarConfig {
  constructor(fileName, filePath) {
    this.fileName = fileName;
    this.filePath = filePath;
    this.sidebarPath = filePath.substring(6); // ./docs/ComputerScience -> /ComputerScience
    this.depth = this.sidebarPath.split('/').length - 2; // ComputerScience -> 0
    this.children = []; // string or this type
  }

  addChildren(data) {
    this.children.push(data);
  }

  parseToString() {
    if (this.children.length === 0) {
      console.error('need children to parse. fileName: ' + this.fileName);
      return '';
    }
    if (this.depth !== 0) {
      let title = this.fileName;
      const data = fs.readFileSync(this.filePath + '/index.md', 'utf8');
      if (data) {
        const lines = data.split('\n');
        if (lines.length > 1) {
          const titleLine = lines[1]; // title: 데이터 중심 애플리케이션 설계
          title = titleLine.substring(7);
        }
        return ` { title: '${title}', path: '${this.sidebarPath}/', children: [ ${this.getChildrenTestByIndexMd(lines)} ] }, `;
      }
      return ` { title: '${title}', path: '${this.sidebarPath}/', children: [ ${this.getChildrenText()} ] }, `;
    }
    return ` { title: '${this.fileName}', children: [ ${this.getChildrenText()} ] }, `;
  }

  getChildrenText() {
    const list = [];
    this.children
        .filter(child => !(child instanceof SidebarConfig))
        .forEach(child => list.push(`'${child}',`));
    this.children
        .filter(child => (child instanceof SidebarConfig))
        .forEach(child => list.push(child.parseToString()));
    return list.join('');
  }

  getChildrenTestByIndexMd(lines) {
    const filteredLines = lines.filter(line => line.includes('###'));
    return filteredLines.map(line => {
      const match1 = line.match(/\[.*\]/)[0];
      const match2 = line.match(/\(.*\)/)[0];
      const title = match1.substring(1, match1.length - 1);
      const fileWithTag = match2.substring(1, match2.length - 1);
      const file = fileWithTag.split('#')[0].replace('.html', '.md');
      return ` { title: '${title}', path: '${this.sidebarPath}/${file}'} `;
    });
  }
}

function hasMdFile(directory) {
  const mdFiles = File.readdir(directory.path).filter(file => file.path.endsWith('.md'));
  return mdFiles.length > 0;

}

// SidebarConfig 리턴
function resolveToSidebarConfig(rootfile) {
  const config = new SidebarConfig(rootfile.name, rootfile.path);
  File.readdir(rootfile.path)
      .forEach(file => {
        if (file.isDirectory) {
          if (hasMdFile(file)) {
            config.addChildren(resolveToSidebarConfig(file));
          } else {
            console.log('pass adding to children because it is directory but it do not have md file. name: ' + file.name);
          }
        } else {
          if (file.path.endsWith('.md')) {
            if (!file.path.endsWith('index.md')) {
              config.addChildren(file.path.substring('./docs'.length));
            }
          }
        }
      });
  return config;
}

const reulst = File.readdir('./docs')
    .filter(file => file.isDirectory)
    .map(resolveToSidebarConfig)
    .map(sidebarConfig => sidebarConfig.parseToString())
    .reduce((prev, cur) => prev + cur);

const sidebarConfig = ` module.exports = { '/': [ ${reulst} ] } `;

fs.writeFile('./docs/.vuepress/sidebarConfig.js', sidebarConfig, 'utf8', (err => {
  if (err) {
    console.log('### fail sidbarConfigMaker', err);
    process.exit();
  }
}));
console.log('### success sidbarConfigMaker');

