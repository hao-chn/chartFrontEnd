<template>
    <div id="error">
        <img src="/static/img/bg_404.jpg" width="100%">
    </div>
</template>

<script>
    export default {
        name: "error"
    }
　　window.location.href="#/login"; 
</script>

<style scoped>
    #error {
        padding: 0px;
        margin: 0px;
        background: #313050;
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    img {
        max-width: 800px;
    }

</style>
