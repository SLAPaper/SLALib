<template>
    <view></view>
</template>

<script>
export default {
    data() {
        return {};
    },
    onShow: function() {
        console.log('Book List Show');

        // #ifdef MP-BAIDU
        console.log('Baidu setPageInfo');
        swan.setPageInfo({
            title: '纸睡图书馆-图书室',
            keywords: '图书管理',
            description: '你的私人藏书管家',
            image: 'static/logo.png'
        });
        // #endif
    },
    onTabItemTap: function(e) {
        console.log(e);
    },
    methods: {}
};
</script>

<style></style>
