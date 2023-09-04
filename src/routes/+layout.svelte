<svelte:head>
    <title>아주인 : 아주대학교 커뮤니티</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
</svelte:head>
<script>
    import "../app.css";
</script>

<div class="w-full bg-gray-50">
    <div class="flex">
        <div class="hidden md:block w-96" />
        <div class="max-w-lg w-full min-h-screen bg-white">
            <slot />
        </div>
        <div class="hidden md:block md:w-full">
            <div class="flex flex-col justify-center items-center w-full">
                <h1 class="text-2xl font-bold mt-24">아주인</h1>
                <p>
                    커뮤니티 설명
                </p>
            </div>
        </div>
    </div>
</div>