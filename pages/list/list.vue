<template>
    <view>
        <!-- <u-action-sheet :list="list" v-model="show"></u-action-sheet> -->
    </view>
</template>

<script>
export default {
    data() {
        return {
            list: [
                {
                    text: '点赞',
                    color: 'blue',
                    fontSize: 28
                },
                {
                    text: '分享'
                },
                {
                    text: '评论'
                }
            ],
            show: true
        };
    },
    onTabItemTap: function(e) {
        console.log(e);
    },
    onShow: function() {
        console.log('List Page Show');

        // #ifdef MP-BAIDU
        console.log('Baidu setPageInfo');
        swan.setPageInfo({
            title: '纸睡图书馆-藏书馆',
            keywords: '图书管理',
            description: '你的私人藏书管家',
            image: 'static/logo.png'
        });
        // #endif
    },
    methods: {}
};
</script>

<style></style>
