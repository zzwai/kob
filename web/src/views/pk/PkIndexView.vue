<template>
    <PlayGround v-if="$store.state.pk.status === 'playing'"/>
    <MatchGround v-if="$store.state.pk.status === 'matching'"/>
    <ResultBoard v-if="$store.state.pk.loser != 'none'"/>
</template>

<script>
// import ContentFiled from '@/components/ContentFiled.vue'
import PlayGround from '@/components/PlayGround.vue'
import MatchGround from '@/components/MatchGround.vue'
import ResultBoard from '@/components/ResultBoard.vue'
import { useStore } from 'vuex'
import { onMounted, onUnmounted } from 'vue'

export default {
    components: {
        PlayGround,
        MatchGround,
        ResultBoard,
    },
    setup() {
        const store = useStore();
        const socketUrl = `ws://127.0.0.1:3000/websocket/${store.state.user.token}/`;
        store.commit("updateIsRecord", false); // 表示不是录像页面

        let socket = null;
        onMounted(() => {
            store.commit("updateLoser", "none") // 更新为none，避免之前结果保存下来影响页面展示
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
                    },200);
                    console.log(data);
                    store.commit("updateGame", data.game);
                } else if (data.event === "move") {
                    console.log(data);
                    const game = store.state.pk.gameObject;
                    const [snake0, snake1] = game.snakes;
                    snake0.set_direction(data.a_direction);
                    snake1.set_direction(data.b_direction);
                } else if (data.event === "result") {
                    const game = store.state.pk.gameObject;
                    const [snake0, snake1] = game.snakes;
                    if (data.loser === "all" || data.loser === "A") {
                        snake0.status = "die";
                    }
                    if (data.loser === "all" || data.loser === "B") {
                        snake1.status = "die";
                    }
                    store.commit("updateLoser", data.loser);
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