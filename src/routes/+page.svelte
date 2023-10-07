<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  export let form : ActionData;
  let submitting = false;
  let friends : string[] = ["", ""];

  function addFriend() {
    friends = [...friends, ""];
  }

  function deleteFriend(index : number) {
    friends = friends.filter((f, i) => i !== index); 
  }

  $: num_of_friends = friends.length;
  $: success = form?.success ?? false;
  $: submitting = success ?? false;
</script>

{#if form?.missing}
  <div class="alert alert-error w-full max-w-xl font-bold">
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <span>Error! Need friends (at least 2) to make a plan! </span>
  </div>
{/if}

{#if success}
  <div class="card w-96 bg-success text-success-content">
    <div class="card-body items-center text-center">
      <h2 class="card-title">Success!</h2>
      <p>Invites have been sent to your friends! Reminder: everyone can secretly cancel, but the plan is only cancelled after EVERYONE says so.</p>
      <div class="card-actions justify-end">
        <button on:click={() => success = false} class="btn btn-primary">Make Another Plan</button>
      </div>
    </div>
  </div>
{:else}
  <form use:enhance method="POST" action="?/schedulePlan" class="gap-8 form-control w-full max-w-xl rounded-xl p-8 text-base-content"> 
    <div>
      <label class="label">
        <span class="label-text text-neutral-content lg:text-lg font-bold">What's the Plan?</span>
      </label>
      <input 
        name="description" type="text" required 
        value={ form?.description ?? "" }
        placeholder="Date at Coffee Shop"
        class="input input-bordered w-full" 
      />
    </div>

    <div class="flex flex-col gap-2">
      <label class="label">
        <span class="label-text text-neutral-content lg:text-lg font-bold">Who's joining?</span>
        <button type="button" class="btn btn-secondary" on:click={addFriend}>Add friend</button>
      </label>
      <input name="num_of_friends" type="hidden" value={num_of_friends} />
      {#each friends as friend, index}
        <div class="join">
          <input name={`friend_${index}`} bind:value={friend} type="email" required class="input rounded-r-none w-full" placeholder="jane@example.com"/>
          <button type="button" class="btn btn-error join-item" on:click={() => deleteFriend(index)}>Delete</button>
        </div>
      {/each}
    </div>

    <div>
      <label class="label">
        <span class="label-text text-neutral-content lg:text-lg font-bold">When should we remind you?</span>
      </label>
      <input 
        name="time" type="datetime-local" required 
        value={ form?.time ?? "" }   
        class="input input-bordered w-full" 
      />
    </div>
    <button class="btn btn-primary" on:submit={() => submitting = true} disabled={submitting}>
      {#if submitting}
        <span class="loading loading-spinner"></span>
        Submitting
      {:else}
        Schedule
      {/if}
    </button>
  </form>
{/if}
