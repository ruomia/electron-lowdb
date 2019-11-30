/**
 * Created by lk on 17/6/4.
 */
import _db from '../../utils/db';
import { success, error } from '../../utils/common';
import { getAdminId } from '../../utils/auth'; // 验权

let db = _db.db
// 获取信息
export function userInfo(adminId) {
  return new Promise((resolve, reject) => {
    let adminId = getAdminId();
    // 1.获取角色id列表
    let admin = db.get('admin').find({ id: adminId }).value();
    // roleIdList = admin.roles
    // 判断是否有超级管理员权限
    let authRules = [];
    if (!admin.roles.find(i => i === 'g4kSPxHV31')) {
      // 根据角色ID列表，获取规则ID列表
      let roleList = db.get('auth_role').filter(function (item) {
        if (admin.roles.indexOf(item.id) !== -1) {
          return true;
        } else {
          return false;
        }
      }).value();
      let ruleIdList = [];
      for (let item of roleList) {
        ruleIdList = ruleIdList.concat(item.rules);
      }
      ruleIdList = [...new Set(ruleIdList)]

      // 根据角色id，获取规则名列表
      let ruleNameList = db.get('auth_rule').filter(function (item) {
        if (ruleIdList.indexOf(item.id) !== -1) {
          return true;
        } else {
          return false;
        }
      }).map('rule_name').value();
      // let ruleNameList = db.prepare('SELECT rule_name FROM auth_rule_role a LEFT JOIN auth_rule b ON a.rule_id=b.id  WHERE role_id in (?) ').all(roleIdList.join(','));
      // console.log(ruleNameList)
      // ruleNameList = ruleNameList.map(i => i.rule_name)
      // 规则名列表可能会重复，需要去重
      authRules = [...new Set(ruleNameList)]
    } else {
      authRules = ['admin']
    }
    // 获取到管理员信息
    let result = {
      username: admin['nickname'],
      avatar: admin['avatar'],
      authRules: authRules
    }
    resolve(success(result, '获取成功'));
  })
}

// 查询数据库判断是否存在用户
export function loginName(username, password) {
  return new Promise((resolve, reject) => {
    resolve(_loginName(username, password))
  })
}
function _loginName(username, password) {
  let admin = db.get('admin').find({ user_name: username }).value();
  if (!admin) return error('管理员不存在');
  if (password !== admin.password) return error('密码错误')

  return success(admin, '登录成功')
}

export function logout(uid, token) {
  return new Promise((resolve, reject) => {
    resolve(success([], '退出成功'));
  })
}

export function password(data) {
  return new Promise((resolve, reject) => {
    resolve(_password(data));
  })
}
function _password(data = []) {
  let admin = db.get('admin').find({ id: data['admin_id'] }).value();
  if (admin['password'] !== data['old_password']) {
    return error('旧密码不正确，请重新输入！')
  }
  let length = data['new_password'].length;
  if (length <= 5 || length > 30) {
    return error('新密码长度必须在6到30个字符范围内');
  }
  let result = db.get('admin').find({ id: data['admin_id'] }).assign({ password: data['new_password'] }).write()
  if (result) {
    return success([], '密码修改成功');
  } else {
    return error('密码修改失败');
  }
}
