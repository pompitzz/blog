import fs from "fs";

const filterNames = ['.vuepress', 'README.md', 'TAG']

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
            .map(dirent => new File(rootPath + "/" + dirent.name, dirent.name, dirent.isDirectory(), dirent.isFile()))
    }
}

class SidebarConfig {
    constructor(title) {
        this.title = title;
        this.children = [] // string or this type
    }

    addChildren(data) {
        this.children.push(data)
    }

    parseToString() {
        if (this.children.length === 0) {
            console.error("need children to parse");
            return '';
        }

        return ` { title: '${this.title}', children: [ ${this.getChildrenText()} ] }, `
    }

    getChildrenText() {
        const list = []
        this.children.forEach(child => {
            if (child instanceof SidebarConfig) {
                list.push(child.parseToString())
            } else {
                list.push(`'${child}',`)
            }
        })
        return list.join('')
    }
}

// SidebarConfig 리턴
function resolveToSidebarConfig(rootfile) {
    const config = new SidebarConfig(rootfile.name);
    File.readdir(rootfile.path)
        .forEach(file => {
            if (file.isDirectory) {
                config.addChildren(resolveToSidebarConfig(file));
            } else {
                config.addChildren(file.path.substring('./docs'.length));
            }
        })
    return config;
}


const reulst = File.readdir('./docs')
    .filter(file => file.isDirectory)
    .map(resolveToSidebarConfig)
    .map(sidebarConfig => sidebarConfig.parseToString())
    .reduce((prev, cur) => prev + cur);

const sidebarConfig = ` module.exports = { '/': [ ${reulst} ] } `

fs.writeFile('./docs/.vuepress/sidebarConfig.js', sidebarConfig, 'utf8', (err => {
    if (err) {
        console.log('### fail sidbarConfigMaker', err);
        process.exit();
    }
}))
console.log('### success sidbarConfigMaker')

