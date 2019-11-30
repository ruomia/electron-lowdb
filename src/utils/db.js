import path from 'path'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync';
import os from 'os'

class Db {
  constructor() {
    const adapter = new FileSync(path.join(os.homedir(), 'datastore.json')); // 存储在本地目录

    this.db = low(adapter)

    // this.db.defaults({ info: {}, isActivated: false, user: [], posts: [] }).write();
    // let appInfo = this.db.get('info').value();
    // console.log('db', appInfo);
    // this.db = null;
    // console.log('初始化');
    // stmt = this.db.prepare('drop table auth_role_admin');
    // stmt.run();
    this.createTable()
  }
  static getIntance() {
    if (!Db.instance) {
      Db.instance = new Db();
    }
    return Db.instance;
  }
  createTable() {
    // 初始化建表
    let tables = {
      admin: [
        {
          id: 'Aj5LsaqWrw',
          user_name: 'admin',
          nickname: '管理员',
          password: '123456',
          avatar: '',
          email: 'blc0927@163.com',
          status: 1,
          create_time: '',
          update_time: '',
          roles: ['g4kSPxHV31']
        }
      ],
      auth_role: [
        {
          id: 'g4kSPxHV31',
          pid: 0,
          role_name: '超级管理员',
          status: 1,
          remark: '',
          rules: []
        }
      ],
      auth_rule: [
        {
          id: 'u5oyHqW6',
          pid: 0,
          rule_name: 'auth',
          title: '权限管理',
          status: 1,
          ismenu: 1,
          path: '/'
        },
        {
          id: 'l0D2kQRi9',
          pid: 'u5oyHqW6',
          rule_name: 'auth/rule',
          title: '菜单规则',
          status: 1,
          ismenu: 1,
          path: 'u5oyHqW6'
        },
        {
          id: '_gjBkH_OK',
          pid: 'l0D2kQRi9',
          rule_name: 'auth/rule/index',
          title: 'Index',
          status: 1,
          ismenu: 0,
          path: 'u5oyHqW6/l0D2kQRi9'
        },
        {
          id: 'Ab1Dn7Jk4',
          pid: 'l0D2kQRi9',
          rule_name: 'auth/rule/add',
          title: 'Add',
          status: 1,
          ismenu: 0,
          path: 'u5oyHqW6/l0D2kQRi9'
        },
        {
          id: '2xv1r7g7i',
          pid: 'l0D2kQRi9',
          rule_name: 'auth/rule/edit',
          title: 'Edit',
          status: 1,
          ismenu: 0,
          path: 'u5oyHqW6/l0D2kQRi9'
        },
        {
          id: 'bYAvr1Gft',
          pid: 'l0D2kQRi9',
          rule_name: 'auth/rule/del',
          title: 'Del',
          status: 1,
          ismenu: 0,
          path: 'u5oyHqW6/l0D2kQRi9'
        },
        {
          id: 'yGHIPOn2C',
          pid: 'u5oyHqW6',
          rule_name: 'auth/admin',
          title: '管理员管理',
          status: 1,
          ismenu: 1,
          path: 'u5oyHqW6'
        },
        {
          id: 'f_fboZOc_',
          pid: 'yGHIPOn2C',
          rule_name: 'auth/admin/index',
          title: 'Index',
          status: 1,
          ismenu: 0,
          path: 'u5oyHqW6/yGHIPOn2C'
        },
        {
          id: 'yH2-haZFL',
          pid: 'yGHIPOn2C',
          rule_name: 'auth/admin/add',
          title: 'Add',
          status: 1,
          ismenu: 0,
          path: 'u5oyHqW6/yGHIPOn2C'
        },
        {
          id: 'Spt2TsZRF',
          pid: 'yGHIPOn2C',
          rule_name: 'auth/admin/edit',
          title: 'Edit',
          status: 1,
          ismenu: 0,
          path: 'u5oyHqW6/yGHIPOn2C'
        },
        {
          id: 'uMS8NPjwh',
          pid: 'yGHIPOn2C',
          rule_name: 'auth/admin/del',
          title: 'Del',
          status: 1,
          ismenu: 0,
          path: 'u5oyHqW6/yGHIPOn2C'
        },
        {
          id: '8_eu5zzVQ',
          pid: 'u5oyHqW6',
          rule_name: 'auth/role',
          title: '角色组',
          status: 1,
          ismenu: 1,
          path: 'u5oyHqW6'
        },
        {
          id: '-Mt4mrYkJ',
          pid: '8_eu5zzVQ',
          rule_name: 'auth/role/index',
          title: 'Index',
          status: 1,
          ismenu: 0,
          path: 'u5oyHqW6/8_eu5zzVQ'
        },
        {
          id: 'aTHDJkM8W',
          pid: '8_eu5zzVQ',
          rule_name: 'auth/role/add',
          title: 'Add',
          status: 1,
          ismenu: 0,
          path: 'u5oyHqW6/8_eu5zzVQ'
        },
        {
          id: 'm_hNFkXhc',
          pid: '8_eu5zzVQ',
          rule_name: 'auth/role/edit',
          title: 'Edit',
          status: 1,
          ismenu: 0,
          path: 'u5oyHqW6/8_eu5zzVQ'
        },
        {
          id: 'u5kdsEO6r',
          pid: '8_eu5zzVQ',
          rule_name: 'auth/role/del',
          title: 'Del',
          status: 1,
          ismenu: 0,
          path: 'u5oyHqW6/8_eu5zzVQ'
        }
      ]
    }

    // let tableList = this.db.get('').all();
    // tableList = tableList.flatMap((i) => i.name)
    // console.log(tableList)
    try {
      for (let index of Object.keys(tables)) {
        // this.db.set(index, tables[index]).write()
        let table = this.db.get(index).value();
        // console.log(index, table)
        if (!table) {
          this.db.set(index, tables[index]).write()
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}

let _db = Db.getIntance();

export default _db;
