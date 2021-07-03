'use strict';

const uniID = require('uni-id');

async function data_get(event, uid) {
    /*  {
            'operation': 'get',
            'content': ''
        }
    }*/
    const db = uniCloud.database();
    const collection = db.collection('user_books');
    let {
        data
    } = await collection.where({
        uid: _uid
    }).limit(1).get();

    if (data.length) {
        return {
            errCode: 0,
            errMsg: '成功',
            content: data[0]
        };
    }
    return {
        errCode: 'no-such-user',
        errMsg: '没有该用户的信息'
    };
};

async function data_set(event, uid) {
    /*  {
            'operation': 'set',
            'content': 'blahblahblah'
        }
    }*/
    const db = uniCloud.database();
    const collection = db.collection('user_books');
    let {
        data
    } = await collection.where({
        uid: _uid
    }).limit(1).get();

    if (data.length) {
        const res = await collection.doc(data[0]._id).set(event.content);
        return {
            errCode: 0,
            errMsg: '成功',
            content: res
        };
    }
    const res = await collection.add([event.content]);
    return {
        errCode: 0,
        errMsg: '成功',
        content: res
    };
};

exports.main = async (event, context) => {
    //event为客户端上传的参数
    /*  {
            'operation': 'get|set',
            'content': 'blahblahblah'  // 仅当 set 时有效
        }
    }*/
    console.log('event : ', event)

    const check_token_res = await uniID.checkToken(event.uniIdToken);
    const {
        code,
        uid
    } = check_token_res;

    if (code) {
        return {
            errCode: 'token-invalid',
            errMsg: '用户token非法'
        };
    }

    if (event.operation === 'get') {
        return data_get(event, uid);
    }

    if (event.operation === 'set') {
        return data_set(event, uid);
    }

    //返回数据给客户端
    return {
        errCode: 'data-operation-invalid',
        errMsg: '数据操作非法'
    };
}
