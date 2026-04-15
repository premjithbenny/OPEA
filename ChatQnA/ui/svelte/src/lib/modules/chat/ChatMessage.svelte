<script lang="ts">
  import MessageAvatar from "$lib/modules/chat/MessageAvatar.svelte";
  import type { Message } from "$lib/shared/constant/Interface";
  import MessageTimer from "./MessageTimer.svelte";
  import { createEventDispatcher } from "svelte";

  let dispatch = createEventDispatcher();

  export let msg: Message;
  export let time: string = "";
</script>

<!-- 💬 MESSAGE CONTAINER -->
<div
  class={`flex w-full ${
    msg.role === 0 ? "justify-start" : "justify-end"
  } px-2 py-2`}
  data-testid={msg.role === 0 ? "display-answer" : "display-question"}
>

  <!-- 🤖 AI MESSAGE -->
  {#if msg.role === 0}
    <div class="flex items-start gap-3 max-w-[80%]">

      <!-- Avatar -->
      <div class="hidden sm:flex">
        <MessageAvatar role={msg.role} />
      </div>

      <!-- Bubble -->
      <div class="bg-[#132B4F] border border-gray-700 text-white px-4 py-3 rounded-2xl shadow-md whitespace-pre-line break-words leading-6 text-[0.9rem]">
        {@html msg.content}
      </div>

    </div>

  <!-- 👤 USER MESSAGE -->
  {:else}
    <div class="flex items-start gap-3 max-w-[80%] flex-row-reverse">

      <!-- Avatar -->
      <div class="hidden sm:flex">
        <MessageAvatar role={msg.role} />
      </div>

      <!-- Bubble -->
      <div class="bg-[#FF6A00] text-white px-4 py-3 rounded-2xl shadow-lg whitespace-pre-line break-words leading-6 text-[0.9rem]">
        {@html msg.content}
      </div>

    </div>
  {/if}

</div>

<!-- ⏱️ RESPONSE TIME -->
{#if time}
  <div class="flex justify-center text-xs text-gray-400 mt-1">
    <MessageTimer
      {time}
      on:handleTop={() => dispatch("scrollTop")}
    />
  </div>
{/if}

<style>
  div {
    word-wrap: break-word;
    word-break: break-word;
  }
</style>
