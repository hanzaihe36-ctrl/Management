// 用户名：3-20个字符，只能包含字母、数字、下划线
export const validateUsername = (rule, value, callback) => {
  const reg = /^[a-zA-Z0-9_]{3,20}$/;
  if (!value) {
    callback(new Error("请输入用户名"));
  } else if (!reg.test(value)) {
    callback(new Error("用户名必须在3-20位之间且只能包含字母数字下划线"));
  } else {
    callback();
  }
};

// 手机号：11位数字
export const validatePhone = (rule, value, callback) => {
  const reg = /^1\d{10}$/;
  if (!value) {
    callback(new Error("请输入手机号"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的11位手机号"));
  } else {
    callback();
  }
};
