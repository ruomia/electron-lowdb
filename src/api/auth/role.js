import _db from '../../utils/db';
import { success, error, assembleTree } from '../../utils/common';
import shortid from 'shortid'

const db = _db.db;
// 获取列表
export function authRoleList(query) {
  return new Promise((resolve, reject) => {
    let skip = (query.page - 1) * query.limit
    let limit = query.page * query.limit

    let list = db.get('auth_role').slice(skip, limit).value();
    let count = db.get('auth_role').size().value();
    resolve(success({
      list: list,
      total: count
    }, '获取成功'))
  })
}

// 获取权限
export function authRoleAuthList(data) {
  // return axios({
  //     url: "/admin/auth/role/authList",
  //     method: "get",
  //     params: query
  // });
  return new Promise((resolve, reject) => {
    // let roleId = Number(data['role_id']);
    let role = db.get('auth_role').find({ id: data['role_id'] }).value();
    let rules = role.hasOwnProperty('rules') ? role['rules'] : [];
    // let checked_keys = typeof rules === 'Array' ? rules : [];
    let ruleList = db.get('auth_rule').value();

    let ruleTree = assembleTree({
      data: ruleList,
      parent: 'pid',
      id: 'id',
      child: 'children'
    })
    let result = {
      auth_list: ruleTree,
      checked_keys: rules
    }
    resolve(success(result, '获取成功'))
  })
}
// 授权
export function authRoleAuth(data) {
  return new Promise((resolve, reject) => {
    console.log(data)
    db.get('auth_role').find({ id: data['role_id'] })
      .assign({ rules: data['auth_rules'] })
      .write();
    resolve(success([], '授权成功'))
  })
}

// 保存
export function authRoleSave(data, formName, method = 'post') {
  return new Promise((resolve, reject) => {
    let saveData = {
      pid: data['pid'],
      role_name: data['role_name'],
      status: data['status'],
      remark: data['remark']
    }
    let result;
    if (formName === 'add') {
      result = authRoleAdd(saveData)
    } else if (formName === 'edit') {
      result = authRoleEdit(saveData, data['id'])
    }
    resolve(result)
  })
}

// 删除
export function authRoleDelete(data) {
  return new Promise((resolve, reject) => {
    let result = roleDelete(data['id'])
    resolve(result)
  })
}
function authRoleAdd(data = []) {
  let find = db.get('auth_role').find({ user_name: data['role_name'] }).value()
  if (find) {
    return error('角色名称已经存在，请更换后重试');
  }
  data.id = shortid.generate();
  db.get('auth_role').push(data).write();
  return success(data, '添加成功')
}
function authRoleEdit(data = [], id = 0) {
  let find = db.get('auth_role').find({ id: id }).value()
  if (!find) {
    return error('记录不存在')
  }
  let result = db.get('auth_role').find({ id: id }).assign(data).write();
  if (result) {
    return success(data, '修改成功')
  } else {
    return error('修改失败')
  }
}
function roleDelete(id) {
  let find = db.get('auth_role').find({ id: id }).value()
  if (!find) return error('记录不存在')
  if (id === 'g4kSPxHV31') return error('超级管理员不允许删除')

  let result = db.get('auth_role').remove({ id: id }).write();
  if (result.length >= 1) {
    return success([], '删除成功')
  } else {
    return error('删除失败')
  }
}
