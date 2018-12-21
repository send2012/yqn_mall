export const idCard = (val) => {
	return /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(val)
}

export const phone = (val) => {
  return /^1(3|4|5|7|8)\d{9}$/.test(val);
}

export const mobile = (val) => {
	return /^1[0-9]{10}$/.test(val)
}

export const repassword = (val) =>
{
    return val !== val
}

export const address = (val) => {
	const value = val.trim();
	return value.length >= 5 && value.length <= 100
}

export const userName = (val) => {
	return /^[a-zA-Z0-9_\u4e00-\u9fa5]{3,20}$/.test(val)
}
