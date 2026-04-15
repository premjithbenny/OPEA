<script lang="ts">
  export let data;

  import { knowledge1, storageFiles } from "$lib/shared/stores/common/Store";
  import { onMount } from "svelte";
  import {
    LOCAL_STORAGE_KEY,
    MessageRole,
    MessageType,
    type Message,
  } from "$lib/shared/constant/Interface";
  import {
    getCurrentTimeStamp,
    scrollToBottom,
    scrollToTop,
  } from "$lib/shared/Utils";
  import { fetchTextStream } from "$lib/network/chat/Network";
  import LoadingAnimation from "$lib/shared/components/loading/Loading.svelte";
  import UploadFile from "$lib/shared/components/upload/uploadFile.svelte";
  import PaperAirplane from "$lib/assets/chat/svelte/PaperAirplane.svelte";
  import ChatMessage from "$lib/modules/chat/ChatMessage.svelte";
  import { fetchAllFile } from "$lib/network/upload/Network.js";
  import { getNotificationsContext } from "svelte-notifications";
  import Spinner from "$lib/shared/components/loading/Spinner.svelte";

  let query: string = "";
  let loading: boolean = false;
  let scrollToDiv: HTMLDivElement;
  let chatMessages: Message[] = data.chatMsg ? data.chatMsg : [];
  const { addNotification } = getNotificationsContext();

  $: knowledge_1 = $knowledge1?.id ? $knowledge1.id : "default";

  onMount(async () => {
    scrollToDiv = document.querySelector(".chat-scrollbar");

    const res = await fetchAllFile();
    if (res) storageFiles.set(res);
  });

  function showNotification(text: string, type: string) {
    addNotification({
      text,
      position: "top-left",
      type,
      removeAfter: 3000,
    });
  }

  function handleTop() {
    scrollToTop(scrollToDiv);
  }

  function storeMessages() {
    localStorage.setItem(
      LOCAL_STORAGE_KEY.STORAGE_CHAT_KEY,
      JSON.stringify(chatMessages)
    );
  }

  function mapRole(r: number): "user" | "assistant" | "system" {
    if (r === 1) return "user";
    if (r === 0) return "assistant";
    return "system";
  }

  function multiMessages(history: any[]) {
    return history.map((m) => ({
      role: mapRole(m.role),
      content: typeof m.content === "string" ? m.content : String(m.content ?? ""),
    }));
  }

  /* 🔥 CLEAN MESSAGE */
  function cleanMessage(msg: string): string {
    try {
      if (msg.startsWith("b'") || msg.startsWith('b"')) {
        msg = msg.slice(2, -1);
      }

      if (/\\x[\dA-Fa-f]{2}/.test(msg)) {
        const bytes = msg.split("\\x").slice(1).map(h => parseInt(h, 16));
        msg = new TextDecoder().decode(new Uint8Array(bytes));
      }

      msg = msg.replace(/\\u[\dA-Fa-f]{4}/g, (m) =>
        String.fromCharCode(parseInt(m.replace("\\u", ""), 16))
      );

      msg = msg.replace(/\\n/g, "\n");

      return msg;
    } catch {
      return msg;
    }
  }

  const callTextStream = async (query: object, startSendTime: number) => {
    try {
      const eventSource = await fetchTextStream(query);

      eventSource.addEventListener("error", () => {
        showNotification("Failed to load chat content.", "error");
        loading = false;
      });

      eventSource.addEventListener("message", (e: any) => {
        let msg = e.data;

        if (msg === "[DONE]") {
          let startTime = chatMessages[chatMessages.length - 1].time;
          loading = false;

          let totalTime = parseFloat(
            ((getCurrentTimeStamp() - startTime) / 1000).toFixed(2)
          );

          if (chatMessages.length - 1 !== -1) {
            chatMessages[chatMessages.length - 1].time = totalTime;
          }

          storeMessages();
          return;
        }

        msg = cleanMessage(msg);

        /* ✅ FIXED STREAM LOGIC */
        let lastMsg = chatMessages[chatMessages.length - 1];

        if (!lastMsg || lastMsg.role !== MessageRole.Assistant) {
          chatMessages.push({
            role: MessageRole.Assistant,
            type: MessageType.Text,
            content: "",
            time: startSendTime,
          });
        }

        chatMessages[chatMessages.length - 1].content += msg;

        scrollToBottom(scrollToDiv);
      });

      eventSource.stream();
    } catch {
      showNotification("Failed to load chat content.", "error");
      loading = false;
    }
  };

  const handleTextSubmit = async () => {
    if (!query.trim()) return;

    loading = true;

    const newMessage = {
      role: MessageRole.User,
      type: MessageType.Text,
      content: query,
      time: 0,
    };

    chatMessages = [...chatMessages, newMessage];
    scrollToBottom(scrollToDiv);
    storeMessages();

    query = "";

    await callTextStream(multiMessages(chatMessages), getCurrentTimeStamp());

    scrollToBottom(scrollToDiv);
    storeMessages();
  };

  function handelClearHistory() {
    localStorage.removeItem(LOCAL_STORAGE_KEY.STORAGE_CHAT_KEY);
    chatMessages = [];
  }
</script>

<div class="h-full flex flex-col text-white">

  <!-- HEADER -->
  <div class="flex justify-between items-center px-4 py-3 border-b border-gray-700">
    <h1 class="text-xl font-semibold tracking-wide">ChatQnA</h1>
    <UploadFile />
  </div>

  <!-- CHAT -->
  <div class="flex-1 overflow-hidden">
    <div class="chat-scrollbar h-full w-full px-4 py-4 overflow-y-auto custom-scroll">

      {#each chatMessages as message, i}
        <ChatMessage
          on:scrollTop={() => handleTop()}
          msg={message}
          time={i === 0 || (message.time > 0 && message.time < 100)
            ? message.time
            : ""}
        />
      {/each}

    </div>

    {#if loading}
      <LoadingAnimation />
    {/if}
  </div>

  <!-- CLEAR -->
  {#if chatMessages.length > 0 && !loading}
    <div class="px-4 py-2">
      <button
        class="text-sm text-gray-400 hover:text-[#FF6A00] transition"
        on:click={handelClearHistory}
      >
        Clear Chat
      </button>
    </div>
  {/if}

  <!-- INPUT -->
  <div class="p-4 border-t border-gray-700 bg-[#0F2A4D]">
    <div class="relative flex items-center">

      <input
        class="w-full rounded-xl bg-[#132B4F] border border-gray-600 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6A00]"
        type="text"
        placeholder="Ask something..."
        disabled={loading}
        bind:value={query}
        on:keydown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleTextSubmit();
          }
        }}
      />

      <button
        on:click={handleTextSubmit}
        class="absolute right-2 bg-[#FF6A00] hover:bg-[#E65C00] p-2 rounded-lg shadow-lg transition"
      >
        {#if loading}
          <Spinner />
        {:else}
          <PaperAirplane />
        {/if}
      </button>

    </div>
  </div>

</div>

<style>
  :global(body) {
    background: transparent;
  }

  /* 🔥 CLEAN SCROLLBAR */
  :global(.custom-scroll) {
    scrollbar-width: thin;
    scrollbar-color: #FF6A00 transparent;
  }

  :global(.custom-scroll::-webkit-scrollbar) {
    width: 6px;
  }

  :global(.custom-scroll::-webkit-scrollbar-thumb) {
    background-color: #FF6A00;
    border-radius: 10px;
  }
</style>
