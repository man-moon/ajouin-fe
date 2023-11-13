<script>
    import { page } from "$app/stores";
    import Icon from "$lib/Icon.svelte";
    import { goto } from "$app/navigation";
    import BackAppbar from "$lib/BackAppbar.svelte";
    import Carousel from 'svelte-carousel';
    import { browser } from '$app/environment';

    let carousel; // for calling methods of the carousel instance
    let showPrevPage;
    let showNextPage;
    const postId = $page.params.id;

    let commentInput = "";

    //fetched data
    let post = {
        id: 1,
        title: "팔달관에는 왜 이렇게 잘생긴 사람들이 많나요?",
        email: "작성자",
        univ: "mo**29",
        createdAt: "어제",
        tag: "아무말",
        content:
            "특히 소웨분들이 잘생기신거같아요",
        images: [
            "https://www.outdoornews.co.kr/news/photo/201904/31022_85190_1644.jpg",
            "https://newsimg.sedaily.com/2023/05/25/29PPTF3WD0_2.jpg",
            "https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/177/1ac70a90e45159fb44ce79c0ffb549ac_res.jpeg"
        ],
        views: 24,
        likes: 24,
        comments: [
            {
                id: 1,
                email: "ma**72",
                content: "인정합니다",
                createdAt: "어제",
                likes: 9,
                replies: [
                    {
                        id: 1,
                        email: "작성자",
                        content: "감사합니다",
                        createdAt: "어제",
                        likes: 9,
                    },
                ]
            },
            {
                id: 2,
                email: "ld**dv",
                content: "?",
                createdAt: "어제",
                likes: 0,
                replies: []
            },
        ]
    };

    async function addComment() {
        // send commentInput to server
        commentInput = "";
    }

</script>

<BackAppbar title={post.title} />

<!-- 글 헤더 -->
<div class="gap-2 mt-4 mx-4">
    <div class="flex flex-col w-full">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm">
                <div>
                    <div class="font-medium">{post.univ}</div>
                    <span class="text-gray-400 text-xs">{post.createdAt}</span>
                    <span class="text-gray-400">|</span>
                    <span class="text-blue-500 text-xs">#{post.tag}</span>
                </div>

            </div>
            <button class="text-gray-400" >
                <Icon icon="more-horizontal" size={20}/>
            </button>
        </div>

    </div>
</div>

<!-- 본문 -->
<div class="flex-1 text-black text-left mt-4">
    <!-- 이미지 -->
    <!-- {#if browser}
        <Carousel
        >
            {#each post.images as image, i}
                <img
                    src={image}
                    alt="img"
                    class="object-contain w-16 bg-gray-200"
                />
            {/each}
        </Carousel>
    {/if} -->


    <!-- 내용 -->
    <p class="text-sm m-4">
        {post.content}
    </p>

    <div class="flex text-gray-500 m-4 justify-end">
        <!-- 조회수 -->
        <div class="flex gap-1 items-center">
            <Icon icon="eye" size={18} />
            <div class="text-sm">{post.views}</div>
        </div>
        <!-- 좋아요 수 -->
        <button class="ml-4 flex gap-1 items-center">
            <Icon icon="heart" size={18} />
            <div class="text-sm">{post.likes}</div>
        </button>
        <!-- 댓글 수 -->
        <div class="ml-4 flex gap-1 items-center">
            <Icon icon="message-square" size={18} />
            <div class="text-sm">{post.comments.length}</div>
        </div>
    </div>
</div>

<hr />

<!-- 댓글 -->
{#each post.comments as comment, i}
    <div class="bg-white border-b px-4 py-3">
        <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">{comment.email}
                <span class="ml-2 text-gray-400 text-xs">{comment.createdAt}</span>
            </div>
            <button class="text-gray-400" >
                <Icon icon="more-horizontal" size={16}/>
            </button>
        </div>
        <div class="text-sm mt-2">{comment.content}</div>
        <div class="flex justify-between items-center">
            <div class="text-xs mt-2 text-gray-400 flex gap-4">
                <button>좋아요 {comment.likes}</button>
                <button>대댓글</button>
            </div>
        </div>
    </div>
    {#if comment.replies.length > 0}
        {#each comment.replies as reply, i}
            <div class="bg-gray-100 pl-8 pr-4 py-2">
                <div class="text-xs flex gap-1">
                    <div class="flex justify-between w-full">
                        <div class="text-sm text-gray-700">{reply.email}
                            <span class="ml-2 text-gray-400 text-xs">{reply.createdAt}</span>
                        </div>
                        <button class="text-gray-400" >
                            <Icon icon="more-horizontal" size={16}/>
                        </button>
                    </div>
                </div>
                <div class="text-sm mt-2">{reply.content}</div>
                <div class="text-xs mt-2 flex gap-4 text-gray-400">
                    <button>좋아요 {reply.likes}</button>
                </div>
            </div>
        {/each}
    {/if}
{/each}

<div class="h-16" />

<form on:submit|preventDefault={addComment}
    class="bg-white fixed bottom-0 w-full max-w-4xl gap-2 flex items-center py-3 px-4 border border-x-0">
    <input bind:value={commentInput} class="rounded-full border flex-1 h-10 pl-4 pr-16 text-sm bg-gray-100" />
    {#if commentInput.length > 0}
        <button type="submit" class="text-sm absolute right-6 text-blue-500 rounded-full bg-white h-8 px-3 border flex items-center justify-center">
            <Icon icon="send" size={20} />
        </button>
    {/if}
</form>