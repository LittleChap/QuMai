import Cookies from 'js-cookie'

const TokenKey = 'Admin-UserId'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

// 金额 和 纯数字 的数字控制
export function numInput (value, item, itemName, isMoney, _this) {
  if (!value && value !== 0) {
    return false
  }
  value = String(value)
  if (isMoney) { // 有小数点
    value = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
    value = value.replace(/^\./g, '0.') // 验证第一个字符是数字而不是 .
    value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的

    value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.') // 保证.只出现一次，而不能出现两次以上
    value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
  } else {
    value = value.replace(/[^\d]/g, '') // 清除“数字”以外的字符
  }
  if (value.indexOf('.') < 0 && value !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    value = parseFloat(value)
  }
  // 数据有变化  视图才会变
  item[itemName] = 'bbbbbbbbaaaaaaaa'
  _this.$nextTick(() => {
    item[itemName] = value + ''
  })
}
