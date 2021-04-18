<template>
    <view class="content">
        <image class="logo" src="/static/logo.png"></image>
        <view class="text-area"><text class="title">纸睡图书馆</text></view>
        <view class="text-area"><text class="subtitle">登录以访问你的私人藏书</text></view>

        <!-- #ifdef MP-WEIXIN -->
        <view class="wrap weixin-login">
            <view class="card-area">
                <button type="primary" class="middle-btn" @click="weixin_login">微信用户授权登录</button>
            </view>
        </view>
        <!-- #endif -->

        <!-- #ifdef MP-BAIDU -->
        <view class="wrap baidu-login">
            <view class="card-area">
                <button type="primary" class="middle-btn" open-type="login" @login="baidu_login">
                    百度用户授权登录
                </button>
            </view>
        </view>
        <!-- #endif -->
    </view>
</template>

<script>
export default {
    data() {
        return {};
    },
    onShow: function() {
        console.log('Page Show');

        // #ifdef MP-BAIDU
        console.log('Baidu setPageInfo');
        swan.setPageInfo({
            title: '纸睡图书馆',
            keywords: '图书管理',
            description: '你的私人藏书管家',
            image: 'static/logo.png'
        });
        // #endif
    },
    onTabItemTap: function(e) {
        console.log(e);
    },
    onLoad() {
        console.log('Page Load');
    },
    methods: {
        // #ifdef MP-WEIXIN
        weixin_login() {
            console.log('Weixin login');
            wx.login({
                success: function (res) {
                    if (res.code) {
                        console.log('微信登录成功: ', res.code);
                        uniCloud.callFunction({
                            name: 'login',
                            data: {
                                type: 'weixin',
                                code: res.code
                            }
                        }).then(function (res) {
                            console.log('内部登录：', res.result);
                            uni.setStorageSync('uni_id_token', res.result.token);
                            uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired);
                            // TODO: 跳转到用户主页
                            uni.switchTab({
                                url: '/pages/list/list'
                            });
                        });
                    } else {
                        console.log('微信授权登陆失败！', res);
                        // TODO: 友善错误界面
                    }
                },
                fail: function(err) {
                    console.log('微信授权登录失败！', err);
                    // TODO: 友善错误界面
                }
            });
        },
        // #endif

        // #ifdef MP-BAIDU
        baidu_login(e) {
            console.log(e);
            if (e.detail.errMsg !== 'login:ok') {
                swan.showToast({
                    title: '登录失败',
                    icon: 'none'
                });
                return;
            }
            swan.showToast({
                title: '登录成功',
                icon: 'none'
            });
            swan.getLoginCode({
                success: function(res) {
                    console.log('百度登录成功：', res.code);
                        uniCloud.callFunction({
                            name: 'login',
                            data: {
                                type: 'baidu',
                                code: res.code
                            }
                        }).then(function (res) {
                            console.log('内部登录：', res.result);
                            uni.setStorageSync('uni_id_token', res.result.token);
                            uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired);
                            // TODO: 跳转到用户主页
                            uni.switchTab({
                                url: '/pages/list/list'
                            });
                        });
                },
                fail: function(err) {
                    console.log('百度授权登录失败！', err);
                    // TODO: 友善错误界面
                }
            });
        },
        // #endif
    }
};
</script>

<style>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
}

.text-area {
    display: flex;
    justify-content: center;
}

.title {
    font-size: 36rpx;
    color: #8f8f94;
    margin-bottom: 0.5rem;
}

.subtitle {
    font-size: 24rpx;
    color: #8f8f94;
    margin-bottom: 0.2rem;
}

.baidu-login {
    margin-top: 2rem;
}

.weixin-login {
    margin-top: 2rem;
}
</style>
