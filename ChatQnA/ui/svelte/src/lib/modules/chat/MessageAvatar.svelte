<script lang="ts">
  import AssistantIcon from "$lib/assets/chat/svelte/Assistant.svelte";
  import PersonOutlined from "$lib/assets/chat/svelte/PersonOutlined.svelte";
  import { MessageRole } from "$lib/shared/constant/Interface";

  export let role: MessageRole;
</script>

<!-- 👤 USER -->
{#if role === MessageRole.User}
  <div class="flex items-center justify-center w-9 h-9 rounded-full bg-[#FF6A00] shadow-md">
    <div class="text-white scale-90">
      <PersonOutlined />
    </div>
  </div>

<!-- 🤖 AI -->
{:else}
  <div class="flex items-center justify-center w-9 h-9 rounded-full bg-[#132B4F] border border-gray-600 shadow-md">
    <div class="text-white scale-90">
      <AssistantIcon />
    </div>
  </div>
{/if}
