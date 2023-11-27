<script>
    import Icon from "$lib/Icon.svelte";
    import { truncate } from "$lib/utils.js";

    export let title = "오늘 15시 아주대 vs 동국대 축구 경기";
    export let content = "아주대학교 축구장에서 아주대 vs 동국대 축구경기가 열립니다. 아주대학교 학생들은 무료로 입장할 수 있습니다. 10분전까지 입장 가능합니다. 다들 오셔서 응원하고 경품도 받아가세요!";
    export let like = 231;
    export let comment = 34;
    export let view = 1193;
    export let time = "3분전";
    export let tag = "#홍보";
    export let nickname = "";
    export let id = 0;
</script>

<a href='/board/{id}' class="block px-4">
    <h4 class="text-gray-600 truncate text-lg font-semibold">
        {truncate(title, 20)}
    </h4>
    <div class="flex gap-4 mt-2 text-sm text-gray-500 justify-between">
        <!-- 사진 -->
        <div class="w-4/5">
            {truncate(content, 80)}
        </div>
        <!-- <div class="bg-gray-200 h-24 w-24" /> -->
    </div>
    <div class="mt-4 flex gap-4 justify-between items-center text-sm text-gray-400">
        <div class="">
            {time}
            <span class="ml-2 text-gray-700">
                {nickname}
            </span>
            <span class="ml-4 text-gray-500">
                {tag}
            </span>
        </div>
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-1">
                <Icon icon="message-square" size={12}/>
                {comment}
            </div>
            <div class="flex items-center gap-1">
                <Icon icon="eye" size={12}/>
                {view}
            </div>
        </div>
    </div>
</a>