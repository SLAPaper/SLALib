'use strict';

const uniID = require('uni-id');
const secrets = require('secret-data');

async function weixin_login(event) {
    return await uniID.loginByWeixin({
        code: event.code
    });
}

async function baidu_login(event) {
    if (!event.code) {
        return {
            code: 10801,
            message: '百度授权code非法'
        };
    }

    const res = await uniCloud.httpclient.request('https://spapi.baidu.com/oauth/jscode2sessionkey', {
        method: 'POST',
        data: {
            code: event.code,
            client_id: secrets().baidu_appid,
            sk: secrets().baidu_appsk
        },
        dataType: 'json'
    });

    console.log('百度响应: ', res);

    if (res.status === 200 && res.data.openid) {
        const openid = res.data.openid;
        // const session_key = res.data.session_key;

        // 首先尝试直接登录
        const login_res = await uniID.login({
            username: 'baidu' + openid,
            password: 'baidu' + openid
        });

        console.log('用户登录: ', login_res);

        if (login_res.code !== 10101) {
            return login_res;
        }

        // 登录失败尝试注册
        const reg_res = await uniID.register({
            username: 'baidu' + openid,
            password: 'baidu' + openid
        });

        console.log('用户注册: ', reg_res);

        // 注册成功设置baiduid
        if (reg_res.code === 0) {
            const up_res = await uniID.updateUser({
                uid: reg_res.uid,
                baidu_openid: openid
            });
            console.log('更新用户：', up_res);
        }
        return reg_res;
    }

    return {
        code: 10802,
        message: '百度授权登录失败'
    };
}

exports.main = async (event, context) => {
    //event为客户端上传的参数
    /*  {
            'type': 'weixin|baidu',
     *      'code': 'blahblahblah'
     *  }
     */
    console.log('event : ', event)

    if (event.type === 'weixin') {
        return weixin_login(event);
    }

    if (event.type === 'baidu') {
        return baidu_login(event);
    }

    return {
        code: 10002,
        message: '登录类型非法'
    };
};
