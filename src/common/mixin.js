export const UserFormValidator = {
    data() {
        // 自定义验证规则
        var checkEmail = (rule, value, callback) => {
            const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
            if (regEmail.test(value)) {
                return callback();
            }
            callback(new Error('请输入正确格式的邮箱'));
        };
        var checkPhone = (rule, value, callback) => {
            const regPhone = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
            if (regPhone.test(value)) {
                return callback();
            }
            callback(new Error('请输入正确的手机号'));
        }
        return {
            editRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机', trigger: 'blur' },
                    { validator: checkPhone, trigger: 'blur' }
                ]
            }
        }
    },
}