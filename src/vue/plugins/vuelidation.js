import Vuelidation, {defaultOptions} from 'vuelidation';

defaultOptions.methods = {
    phone(value, args) {
        let msg = "请填入正确的手机号码";
        // let valid = /^1[0-9]{10}$/.test(value);
        let valid = /^1(3|4|5|7|8)\d{9}$/.test(value);
        return [valid, msg];
    },

    repassword(value, args) {
        let msg = '重复密码不匹配';

        let valid = value !== value;

        return [valid, msg];
    }
};

export default Vuelidation
