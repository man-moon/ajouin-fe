<script>
  export let title = "TEXT";
</script>

<div class="relative sticky top-0 bg-white h-14 items-center border-b flex z-20">
    <button on:click={()=>{history.back()}} class="absolute p-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="gray"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-arrow-left"
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    </button>
    <div class="px-14 text-center w-full font-bold truncate">
      {title}
    </div>
</div>