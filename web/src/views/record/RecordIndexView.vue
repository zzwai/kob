<template>
    <ContentFiled>
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>A</th>
                    <th>B</th>
                    <th>对战结果</th>
                    <th>对战时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in records" :key="record.record.id">
                    <td>
                        <img :src="record.a_photo" alt="" class="record-user-photo">
                        &nbsp;
                        <span class="record-user-name">{{ record.a_username }}</span>
                    </td>
                    <td>
                        <img :src="record.b_photo" alt="" class="record-user-photo">
                        &nbsp;
                        <span class="record-user-name">{{ record.b_username }}</span>
                    </td>
                    <td>{{ record.result }}</td>
                    <td>{{ record.record.createtime }}</td>
                    <td>
                        <button @click="open_record_content(record.record.id)" type="button" class="btn btn-secondary">查看录像</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <nav aria-label="Page navigation example" style="float: right;">
            <ul class="pagination">
                <li class="page-item" @click="click_page(-2)">
                    <a class="page-link" href="#">前一页</a>
                </li>
                <li :class="'page-item ' + page.is_active" v-for="page in pages" :key="page.number" @click="click_page(page.number)">
                    <a class="page-link" href="#">{{ page.number }}</a>
                </li>
                <li class="page-item" @click="click_page(-1)">
                    <a class="page-link" href="#">后一页</a>
                </li>
            </ul>
        </nav>
    </ContentFiled>
</template>

<script>
import ContentFiled from '@/components/ContentFiled.vue'
import { useStore } from 'vuex'
import { ref } from 'vue'
import $ from 'jquery'
import router from '@/router/index'

export default {
    components: {
        ContentFiled
    },
    setup() {
        const store = useStore();
        let current_page = 1;
        let records = ref([]);
        let total_records = 0;
        let pages = ref([]);

        const click_page = page => {
            if (page === -2) page = current_page - 1;
            if (page === -1) page = current_page + 1;
            let max_pages = Math.ceil(total_records / 10);
            if (page >= 1 && page <= max_pages) {
                pull_pages(page);
            }

        }

        const update_pages = () => {
            console.log("I'm update_pages");
            let max_pages = Math.ceil(total_records / 10);
            let new_pages= [];
            for (let i = current_page - 2; i <= current_page + 2; i++) {
                if (i >= 1 && i <= max_pages) {
                    new_pages.push({
                        number: i,
                        is_active: i === current_page ? "active" : "",
                    });
                }
            }
            pages.value = new_pages;
            console.log(pages.value);
        }

        const pull_pages = page => {
            current_page = page;
            $.ajax({
                url: "http://127.0.0.1:3000/record/getlist/",
                data: {
                    page,
                },
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    console.log(resp);
                    records.value = resp.records;
                    total_records = resp.records_count;
                    update_pages();
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }
        pull_pages(current_page);

        const stringTo2D = map => {
            let g = [];
            for (let i = 0, k = 0; i < 13; i ++) {
                let line = [];
                for (let j = 0; j < 14; j ++, k ++) {
                    if (map[k] === '0') line.push(0);
                    else line.push(1);
                }
                g.push(line);
            }
            return g;
        }

        const open_record_content = recordId => {
            console.log("click open_record_content");
            for(const record of records.value) {
                if (record.record.id === recordId) {
                    console.log(record);
                    store.commit("updateIsRecord", true);

                    store.commit("updateGame", {
                        a_id: record.record.aid,
                        a_sx: record.record.aix,
                        a_sy: record.record.aiy,
                        b_id: record.record.bid,
                        b_sx: record.record.bsx,
                        b_sy: record.record.bsy,
                        map: stringTo2D(record.record.map),
                    });
                    store.commit("updateSteps", {
                    a_steps: record.record.asteps,
                    b_steps: record.record.bsteps,
                    });
                    store.commit("updateRecordLoser", record.record.loser);
                    console.log("I'm pushing");
                    router.push({
                        name: "record_content",
                        params: {
                            recordId
                        }
                    })
                    console.log("finished pushing");
                }
            }
        }

        return {
            click_page,
            records,
            open_record_content,
            pages,
        }
    }
}
</script>

<style scoped>
img.record-user-photo {
    width: 4vh;
    border-radius: 50%;
}


</style>