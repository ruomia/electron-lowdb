/**
 * Created by lk on 17/6/4.
 */
import axios from "../utils/axios";

// 获取列表
export function userList(query) {
    return axios({
        url: "/admin/user/index",
        method: "get",
        params: query
    });
}

// 保存
export function meetingSave(data, formName, method = "post") {
    let url = formName === "add" ? "/admin/user/add" : "/admin/meeting/edit";
    return axios({
        url: url,
        method: method,
        data: data
    });
}

// 删除
export function userDelete(data) {
    return axios({
        url: "/admin/user/delete",
        method: "post",
        data: data
    });
}


