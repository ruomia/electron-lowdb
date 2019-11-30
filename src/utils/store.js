/**
 * 存储localStorage
 */
export const setStore = (name, content, expireDay) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  localStorage.setItem(name, content)
};

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  let content = localStorage.getItem(name);
  try {
    content = JSON.parse(content);
    return content;
  } catch (e) {
    return content;
  }
};

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return;
  localStorage.removeItem(name);
};
