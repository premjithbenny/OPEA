<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { open } from "$lib/shared/stores/common/Store";
  import Scrollbar from "$lib/shared/components/scrollbar/Scrollbar.svelte";

  let root: HTMLElement;

  onMount(() => {
    document.body.removeAttribute("tabindex");
  });

  if (browser) {
    page.subscribe(() => {
      if (window.innerWidth > 768) {
        $open = true;
      }
    });
  }
</script>

<!-- 🌌 ROOT WRAPPER -->
<div bind:this={root} class="h-full w-full relative">

  <div class="h-full flex">

    <!-- 📦 MAIN CONTENT -->
    <div class="flex flex-col h-full w-full bg-transparent">

      <Scrollbar
        className="h-full w-full"
        classLayout="h-full"
        alwaysVisible={false}
      >
        <slot />
      </Scrollbar>

    </div>

  </div>

</div>
