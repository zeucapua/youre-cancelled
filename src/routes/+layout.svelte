<script lang="ts">
  import "../app.css";

  let tab = "form";

  function changeTab(type : string) {
    tab = type;
  }
</script>

<main class="flex flex-col gap-8 w-full h-full min-w-screen min-h-screen mx-auto items-center p-4"> 
  <div class="w-fit max-w-xl rounded-xl bg-neutral">
    <img src="/wordart.png" alt="You're Cancelled in WordArt font" class="w-full mx-auto px-auto max-w-xl py-4" />
    <nav class="flex justify-center items-center gap-8">
      <button class="btn btn-link" on:click={() => changeTab("form")}>Schedule</button>
      <button class="btn btn-link" on:click={() => changeTab("about")}>What is This?</button>
    </nav>

    {#if tab === "form"}
      <slot />
    {:else}
      <section class="flex flex-col items-center px-2 gap-8 text-neutral-content">
        <h1 class="text-2xl font-bold text-primary underline underline-offset-8 decoration-dotted">Basically...</h1>
        <img 
          src="/meme.jpeg" 
          alt="Origin Tweet Meme by @mattiekahn: The app is called 'You're Cancelled.' When you've made plans that you wish you could cancel, you go into the app and press a little button. If the other person presses theirs too, congratulations! Confetti exploded and your plans are cancelled.'" 
          class="w-full px-auto max-w-sm lg:max-w-full px-4" />
        <p class="indent-4">
          Make plans with your friends using email! You'll get an email with a 
          <strong class="text-error">Cancel</strong> button. An email will be sent once the 
          reminder date and time comes, <strong class="text-info">BUT</strong> if everyone in the plan 
          cancels, you'll get an email saying that the plan is cancelled!
        </p>

        <div class="flex flex-col items-center gap-2 border border-neutral-content rounded-xl px-8 py-4 border-dashed">
          <h2 class="text-xl font-bold text-primary">{"Made with <3 by Zeu"}</h2>
          <div class="flex gap-4 text-accent underline-offset-4">
            <a class="link" href="https://zeu.dev">zeu.dev</a>
            <a class="link" href="https://github.com/zeucapua">Github</a>
            <a class="link" href="https://twitter.com/zeu_dev">Twitter</a>
            <a class="link" href="https://twitch.tv/zeu_dev">Twitch</a>
          </div>
        </div>
      </section>
    {/if}
  </div>
</main>
