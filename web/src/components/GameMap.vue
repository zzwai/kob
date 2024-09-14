<template>
    <div ref="parent" class="gamemap">
        <canvas ref="canvas" tabindex="0"></canvas>
    </div>
</template>

<script>
import { GameMap } from '@/assets/scripts/GameMap'
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
    setup() {
        const store = useStore();
        let parent = ref(null);
        let canvas = ref(null);

        onMounted(() =>{
                store.commit("updateGameObject",
                    new GameMap(canvas.value.getContext('2d'), parent.value, store)
                )
                // console.log(GameMap.ctx, GameMap.parent);
                // console.log(GameMap);
            });

        return {
            parent,
            canvas
        }
    }
}

</script>

<style scoped>
div.gamemap {
    height: 100%;
    width: 100%;
    /* background: lightblue; */
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>