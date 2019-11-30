import _db from '../../utils/db';
import { success, error, assembleTree } from '../../utils/common';
import shortid from 'shortid'
const db = _db.db;
// 获取列表
export function authRuleList(query) {
  return new Promise((resolve, reject) => {
    let ruleList = db.get('auth_rule').value();
    let ruleTree = assembleTree({
      data: ruleList,
      parent: 'pid',
      id: 'id',
      child: 'children'
    })
    resolve(success(ruleTree, '获取成功'))
  })
}

// 保存
export function authRuleSave(data, formName, method = 'post') {
  return new Promise((resolve, reject) => {
    let saveData = {
      pid: data['pid'],
      rule_name: data['rule_name'],
      title: data['title'],
      status: data['status'],
      // condition: data['condition'],
      ismenu: data['ismenu'],
      // icon: '',
      // listorder: data['listorder'],
      path: data['path']
    }
    let result = null;
    if (formName !== 'edit') {
      result = authRuleAdd(saveData)
    } else {
      result = authRuleEdit(saveData, data['id'])
    }
    // console.log(result)
    resolve(result)
  })
}

// 删除
export function authRuleDelete(data) {
  return new Promise((resolve, reject) => {
    let result = ruleDel(data['id'])
    resolve(result)
  })
}

function authRuleAdd(data = []) {
  // 判断规则名是否重复
  if (!data['rule_name']) {
    return error('规则名不允许为空')
  }
  let find = db.get('auth_rule').find({ rule_name: data['rule_name'] }).value()
  if (find) {
    return error('规则名已经存在，请更换后重试');
  }
  let pid = data['pid']
  console.log(data)
  if (pid) {
    let info = db.get('auth_rule').find({ id: pid }).value()
    if (!info) {
      return error('上一级规则不存在')
    }
  }
  data.id = shortid.generate();
  db.get('auth_rule').push(data).write();
  return success(data, '添加成功')
}
function authRuleEdit(data = [], id = 0) {
  let find = db.get('auth_rule').find({ id: id }).value()
  if (!find) {
    return error('记录不存在')
  }
  let pid = data['pid']
  if (pid) {
    let info = db.get('auth_rule').find({ id: pid }).value()
    if (!info) {
      return error('上一级规则不存在')
    }
  }
  // 判断规则名是否重复
  if (!data['rule_name']) {
    return error('规则名不允许为空')
  }
  let result = db.get('auth_rule').find({ id: id }).assign(data).write();
  if (result) {
    return success(data, '修改成功')
  } else {
    return error('修改失败')
  }
}
function ruleDel(id) {
  let find = db.get('auth_rule').find({ id: id }).value()
  if (!find) return error('记录不存在');

  let childFind = db.get('auth_rule').find({ pid: id }).value();
  if (childFind) return error('记录存在子集，不允许删除')

  let result = db.get('auth_rule').remove({ id: id }).write();
  if (result.length >= 1) {
    return success([], '删除成功')
  } else {
    return error('删除失败')
  }
}
