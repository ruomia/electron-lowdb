export function error(msg = '') {
  return {
    code: 1,
    message: msg,
    data: []
  }
}
export function success(data = [], msg = '') {
  return {
    code: 0,
    message: msg,
    data: data
  }
}
// var treeArray = assembleTree({
//   data: copyVal,
//   parent: "parentId",
//   id: "id",
//   child: "children"
// });

export function assembleTree(params) {
  // 深度拷贝
  let param = JSON.parse(JSON.stringify(params))
  var options = {
    data: param.data,
    parent: param.parent,
    id: param.id,
    child: param.child
  };
  let tree = options.data.filter(function (parent) {
    let item = options.data.filter(function (child) {
      return parent[options.id] === child[options.parent];
    });
    if (item.length > 0) {
      parent[options.child] = item;
    }
    return parent[options.parent] === 0;
  });
  return tree;
}
export function dateFtt(fmt, date) {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('' + o[k]).substr(('' + o[k]).length)));
    }
  }

  return fmt;
}
