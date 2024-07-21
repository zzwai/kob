<template>
    <div class="container content-filed">
        <div class="card">
            <div class="card-body">
            <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'ContentFiled'
}
</script>

<style scoped>
.content-filed {
  margin-top: 20px;
}
</style>