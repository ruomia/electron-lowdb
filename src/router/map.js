import Home from '../views/home/index.vue';
import authRule from '../views/auth/Rule.vue';
import authAdmin from '../views/auth/Admin.vue';
import authRole from '../views/auth/Role.vue';

// 动态需要根据权限加载的路由表
const asyncRouterMap = [
  {
    path: '/auth',
    // redirect: '/auth/rule/index',
    component: Home,
    icon: 'el-icon-s-tools',
    name: '权限管理',
    meta: {
      authRule: ['auth/rule', 'auth/role', 'auth/admin']
    },
    children: [
      {
        path: 'rule',
        component: authRule,
        icon: 'el-icon-menu',
        name: '菜单规则',
        meta: {
          authRule: ['auth/rule']
        }
      },
      {
        path: 'role',
        component: authRole,
        icon: 'el-icon-s-custom',
        name: '角色管理',
        meta: {
          authRule: ['auth/role']
        }
      },
      {
        path: 'admin',
        component: authAdmin,
        icon: 'el-icon-key',
        name: '管理员管理',
        meta: {
          authRule: ['auth/admin']
        }
      }
    ]
  }
  // {
  //   path: '/meeting',
  //   component: Home,
  //   icon: 'el-icon-s-claim',
  //   name: '会议管理',
  //   meta: {
  //     authRule: ['meeting/index']
  //   },
  //   noDropdown: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: meeting
  //     }
  //   ]
  // }
];

export default asyncRouterMap;
