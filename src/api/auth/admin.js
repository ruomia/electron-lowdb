import { success, error } from '../../utils/common';
import _db from '../../utils/db';
import { parseTime } from '@/filters'
import shortid from 'shortid'
const db = _db.db;
// 获取列表
export function adminList(query) {
  return new Promise((resolve, reject) => {
    let skip = (query.page - 1) * query.limit
    let limit = query.page * query.limit
    let list = db.get('admin').slice(skip, limit).value();
    // console.log(list);
    let count = db.get('admin').size().value();
    resolve(success({
      list: list,
      total: count
    }, '获取成功'))
  })
}

// 获取角色列表
export function adminRoleList(query) {
  return new Promise((resolve, reject) => {
    let result = db.get('auth_role').value()
    resolve(success(result, '获取成功'))
  })
}

// 保存
export function adminSave(data, formName, method = 'post') {
  return new Promise((resolve, reject) => {
    let myDate = parseTime(new Date())
    let saveData = {
      user_name: data['user_name'],
      nickname: data['nickname'],
      password: data['password'],
      email: '123@163.com',
      status: Number(data['status']),
      avatar: '/assets/img/avatar.png',
      create_time: myDate,
      update_time: myDate,
      roles: data['roles']
    }
    let result;
    if (formName === 'add') {
      result = adminAdd(saveData)
    } else if (formName === 'edit') {
      result = adminEdit(saveData, data['id'])
    }
    resolve(result)
  })
}

// 删除管理员
export function adminDelete(data) {
  return new Promise((resolve, reject) => {
    let result = _adminDelete(data['id'])
    resolve(result);
  })
}
function adminAdd(data = []) {
  let admin = db.get('admin').find({ user_name: data['user_name'] }).value()
  if (admin) {
    return error('管理员账号已经存在，请更换后重试');
  }
  data.id = shortid.generate();
  db.get('admin').push(data).write();
  return success(data, '添加成功')
}
function adminEdit(data = [], id = 0) {
  let find = db.get('admin').find({ id: id }).value()
  if (!find) {
    return error('记录不存在')
  }
  let result = db.get('admin').find({ id: id }).assign(data).write();
  if (result) {
    return success(data, '修改成功')
  } else {
    return error('修改失败')
  }
}
function _adminDelete(id) {
  let find = db.get('admin').find({ id: id }).value()
  if (!find) return error('记录不存在')

  let result = db.get('admin').remove({ id: id }).write();
  if (result.length >= 1) {
    return success([], '删除成功')
  } else {
    return error('删除失败')
  }
}
