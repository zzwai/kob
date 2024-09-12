<template>
    <PlayGround v-if="$store.state.pk.status === 'playing'"/>
    <MatchGround v-if="$store.state.pk.status === 'matching'"/>
</template>

<script>
// import ContentFiled from '@/components/ContentFiled.vue'
import PlayGround from '@/components/PlayGround.vue'
import MatchGround from '@/components/MatchGround.vue'
import { useStore } from 'vuex'
import { onMounted, onUnmounted } from 'vue'

export default {
    components: {
        PlayGround,
        MatchGround,
    },
    setup() {
        const store = useStore();
        const socketUrl = `ws://127.0.0.1:3000/websocket/${store.state.user.token}/`;

        let socket = null;
        onMounted(() => {
            store.commit("updateOpponent", {
                username: "我的对手",
                photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png"
            });
            socket = new WebSocket(socketUrl);

            store.commit("updateSocket", socket);

            socket.onopen = () =>{
                console.log("connetcted!");
                store.commit("updateSocket", socket);
            }

            socket.onmessage = (msg) => {
                const data = JSON.parse(msg.data);
                if (data.event === "start-matching") {
                    console.log(data);
                    store.commit("updateOpponent", {
                        username: data.opponent_username,
                        photo: data.opponent_photo
                    })
                    setTimeout(()=>{
                        store.commit("updateStatus", "playing");
                    },2000);
                    console.log(data.gamemap);
                    store.commit("updateGamemap", data.gamemap);
                }
            }

            socket.onclose = () => {
                console.log("disconnected!");
            }
        });

        onUnmounted(() => { //当当前页面关闭时调用
            socket.close(); //卸载的时候断开连接
            store.commit("updateStatus", "matching");
        });
    },

}
</script>

<style scoped>

</style>