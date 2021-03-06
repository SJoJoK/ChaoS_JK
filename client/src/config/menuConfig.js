/**
 * icon:菜单项图标
 * roles:标明当前菜单项在何种角色下可以显示，如果不写此选项，表示该菜单项完全公开，在任何角色下都显示
 */
const menuList = [
  {
    title: "首页",
    path: "/dashboard",
    icon: "home",
    roles:["admin","editor","guest"]
  },
  {
    title: "设备管理",
    path: "/table",
    icon: "table",
    roles:["admin","editor","guest"]
  },
  {
    title: "地图显示",
    path: "/map",
    icon: "global",
    roles: ["admin", "editor", "guest"],
  },
  {
    title: "关于作者",
    path: "/about",
    icon: "user",
    roles:["admin","editor","guest"]
  },
];
export default menuList;
