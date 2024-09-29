const pages = import.meta.glob([ '../pages/**/+Page.vue', '!../pages/_error', '!../pages/tests_1', '!../pages/tests_2' ]);
const configs = import.meta.glob([ '../pages/**/+config.h.ts', '!../pages/_error', '!../pages/tests_1', '!../pages/tests_2', '!../pages/+config.h.ts' ], { eager: true, import: 'default' });
const reUrl = /^\.\.\/pages\/(.+)\/\+(Page\.vue|config\.h\.ts)$/;

interface ILink {
  url: string;
  name: string;
  named?: boolean;
  links: LinkSetType;
}

type LinkSetType = Record<string, ILink>;

export interface ILinkItem {
  name: string;
  names?: { name: string; named: boolean; }[];
  url?: string;
  children?: ILinkItem[];
}

function linksTree2List(tree: LinkSetType): ILinkItem[] {
  const links = [];

  for (const urlKey in tree) {
    const children = linksTree2List(tree[ urlKey ].links);
    const { name, named } = tree[ urlKey ];

    const item: ILinkItem = {
      name,
      names: [ { name, named: named === true } ],
    };

    if (children.length === 0) {
      item.url = tree[ urlKey ].url;
      links.push(item);
    } else {
      const index = children.find((l) => typeof l.url === 'string' && l.url.endsWith('/index'));

      if (index) {
        item.url = tree[ urlKey ].url || '/';

        if (index.name.endsWith('/index') === false) {
          item.name = index.name;
        }

        const filteredChildren = children.filter((l) => l !== index);
        if (filteredChildren.length > 0) {
          item.children = filteredChildren;
        }
        links.push(item);
      } else if (children.length === 1) {
        for (const l of children) {
          const names = [ ...(item.names || []), ...(l.names || []) ];

          links.push({
            ...l,
            name: names.filter((n) => n.named).map((n) => n.name).join(' » ') || names.map((n) => n.name).join(' » '),
            names,
          });
        }
      } else {
        item.children = children;
        links.push(item);
      }
    }
  }

  return links;
}

const names: Record<string, string> = {};
for (const path in configs) {
  const match = reUrl.exec(path);

  if (match !== null) {
    const url = `/${ match[ 1 ] }`;
    const obj = configs[ path ] as Record<string, string>;

    if (obj.title) {
      names[ url ] = obj.title;
    }
  }
}

const linksTree: LinkSetType = {
  root: {
    url: '',
    name: 'Root',
    links: {},
  },
};
let linksTreeRef: LinkSetType;

for (const path in pages) {
  const match = reUrl.exec(path);

  if (match !== null) {
    const url = match[ 1 ];
    const urlParts = url.split('/');

    linksTreeRef = linksTree.root.links;

    for (let i = 0, iMax = urlParts.length; i < iMax; i += 1) {
      const urlPart = `/${ urlParts.slice(0, i + 1).join('/') }`;
      const urlKey = urlParts[ i ];
      const named = typeof names[ urlPart ] === 'string' && names[ urlPart ].trim().length > 0;

      if (linksTreeRef[ urlKey ] === undefined) {
        linksTreeRef[ urlKey ] = {
          url: urlPart,
          name: named ? names[ urlPart ] : urlKey,
          named,
          links: {},
        };
      }

      linksTreeRef = linksTreeRef[ urlKey ].links;
    }
  }
}

const linksRoot = linksTree2List(linksTree);
const links = linksRoot.length === 1 ? linksRoot[ 0 ].children || [] : [];

if (linksRoot.length === 1) {
  const { name, url } = linksRoot[ 0 ];

  if (typeof url === 'string') {
    links.unshift({ name, url });
  }
}

export { links };
