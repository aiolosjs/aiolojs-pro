interface routerTypes {
  path?: string;
  component?: string;
  name?: string;
  icon?: string;
  menuType?: number;
  routes?: routerTypes[];
}

export default [
  {
    name: '标准列表',
    path: '/standardtable',
    icon: 'unorderedList',
    menuType: 2,
    component: './StandardTable',
  },
] as routerTypes[];
