type TagMap = {
    [key: string]: string[],
}


type TagMatcher = {
    tag: string,
    check: RegExp,
}

export const enum EntryTags {
    NodeModules = 'node_modules',
    Documents   = 'documents',
    Image       = 'image',
    Audio       = 'audio',
    Video       = 'video',
    Archive     = 'archive',
    Shortcut    = 'shortcut',
    Executable  = 'executable',
    None        = 'none',
    Font        = 'font',
    Code        = 'code',
    CodeDotNet  = 'code-dotnet',
    CodeWeb     = 'code-web',
    Git         = 'git',
    Games       = 'games',
    System      = 'system',
}

const builtInTags : TagMap = {
    [EntryTags.System]: [
        'plist',
        'tmp',
        'sys',
    ],
    [EntryTags.Documents]: [
        'docx',
        'pptx',
        'drawio',
        'pdf',
        'xlsx',
        'doc',
        'txt',
        'md',
        'ini',
        'log',
        'markdown',
        'rtf',
        'pages',
        'csv',
        'chm',
    ],
    [EntryTags.Image]: [
        'png',
        'jpg',
        'gif',
        'ico',
        'svg',
        'dds',
        'tga',
        'ai',
        'psd',
        'tif',
        'targa',
        'raw',
        'bmp',
        'mtl',
        'fbx',
    ],
    [EntryTags.Audio]: [
        'mp3',
        'mp4',
        'wav',
        'rm',
        'ogg',
        'mp4',
    ],
    [EntryTags.Video]: [
        'mpg',
        'mp4',
        'webm',
        'wmv',
        'swf',
        'm4v',
    ],
    [EntryTags.Archive]: [
        'zip',
        'rar',
        'tar',
        '7z',
        'iso',
        'qm',
        'jar',
        'strings',
        'bak',
        'tgz',
        'img',
        'sub',
        'dmg',
        'mdf',
        'mds',
        'upk',
        'pak',
        'gz',
        'br',
    ],
    [EntryTags.Shortcut]: [
        'lnk',
        'url',
    ],
    [EntryTags.Executable]: [
        'exe',
        'bat',
        'ps1',
        'cmd',
        'dll',
        'sh',
        'msi',
        'rlib',
        'so',
        'ocx',
        'o',
    ],
    [EntryTags.Games]: [
        'sav',
        'gba',
        'vdf',
        'pcsav',
        'ess',
        'Civ6Save',
        'srm',
        'xnb',
        'scm',
        'scx',
        'rep',
        'nds',
        'gb',
        'gbc',
        'dsv',
    ],
    [EntryTags.Code]: [
        'gitignore',
        'rs',
        'gitattributes',
        'config',
        'styl',
        'psd1',
        'psm1',
        'xml',
        'sqlitedb',
        'sqlite',
        'ftl',
        'vim',
        'gradle',
        'lua',
        'yml',
        'npmignore',
        'eslintrc',
        'editorconfig',
        'bash_history',
        'node_repl_history',
        'yarnrc',
        'lock',
        'tfignore',
        'java',
        'py',
        'toml',
        'glsl',
        'cfg',
        'vs',
        'sql',
        'hpp',
        'cmake',
        'resjson',
        'asm',
        'xsd',
        'xsl',
        'yaml',
        'pl',
        'pm',
    ],
    [EntryTags.CodeWeb]: [
        'scss',
        'htm',
        'ejs',
        'vue',
        'ts',
        'js',
        'css',
        'html',
        'json',
        'php',
        'less',
        'babelrc',
        'eslintignore',
        'css.map',
        'js.map',
    ],
    [EntryTags.CodeDotNet]: [
        'resx',
        'c',
        'cpp',
        'h',
        'pdb',
        'cs',
        'resources',
        'vcxproj',
        'suo',
        'sln',
        'obj',
        'idb',
        'idb',
        'vcxproj.filters',
        'tlog',
        'nupkg',
        'dtbcache.v2',
        'rc',
        'res',
        'ilk',
        'VC.db',
        'asax',
        'csproj',
        'fsproj',
        'fsx',
        'fs',
        'vstemplate',
        'vsixmanifest',
        'ilproj',
        'il',
        'vb',
        'vbproj',
        'csproj.user',

    ],
    [EntryTags.Font]: [
        'otf',
        'ttf',
        'woff',
        'woff2',
        'eot',
    ],
};



function createMatcher(tag: string, extensions : string[]) : TagMatcher {
    let regex = extensions.map(t => `(\\.${t})`).join('|');
    regex = `(${regex})$`;


    return {
        tag,
        check: new RegExp(regex, 'i'),
    };
}

const tags = [
    {
        tag: EntryTags.NodeModules,
        check: /(node_modules)/i,
    },
    {
        tag: EntryTags.System,
        check: /(Windows)/i,
    },
    {
        tag: EntryTags.Git,
        check: /(\.git)/i,
    },
    ...Object.keys(builtInTags).map(key => createMatcher(key, builtInTags[key]))
];

tags.push({
    tag: EntryTags.Documents,
    check: /(LICENSE)|(README)|(CONTRIBUTORS)|(AUTHORS)|(LICENSE-APACHE)|(TODO)|(COPYING)/i,
});

tags.push({
    tag: EntryTags.Code,
    check: /(Dockerfile)/i,
});

tags.push({
    tag: EntryTags.System,
    check: /(Thumbs\.db)|(\._Thumbs\.db)|(AppData)/i,
});

tags.push({
    tag: EntryTags.Games,
    check: /(steamapps)|(Origin Games)/i,
});



export function getTag(text: string) : string {
    for(let j = 0; j < tags.length; j++) {
        if(!!text.toLowerCase().match(tags[j].check)) {
            return tags[j].tag;
        }
    }

    return EntryTags.None;
}