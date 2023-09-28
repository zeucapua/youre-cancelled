<script lang="ts">
  let friends : string[] = ["", ""];
  function addFriend() {
    friends = [...friends, ""];
  }

  function deleteFriend(index : number) {
    friends = friends.filter((f, i) => i !== index); 
  }

  $: num_of_friends = friends.length;
</script>

<form method="POST" action="?/schedulePlan" class="gap-8 form-control w-full max-w-xl rounded-xl bg-primary p-8">
  <div>
    <label class="label">
      <span class="label-text font-bold">What's the Plan?</span>
    </label>
    <input name="description" type="text" required class="input input-bordered" />
  </div>

  <div class="flex flex-col gap-2">
    <label class="label">
      <span class="label-text font-bold">Who's joining?</span>
      <button type="button" class="btn btn-secondary" on:click={addFriend}>Add friend</button>
    </label>
    <input name="num_of_friends" type="hidden" value={num_of_friends} />
    {#each friends as friend, index}
      <div class="join">
        <input name={`friend_${index}`} bind:value={friend} type="email" required class="input input-bordered rounded-r-none w-full" placeholder="jane@example.com"/>
        <button type="button" class="btn join-item rounded-r-full" on:click={() => deleteFriend(index)}>Delete</button>
      </div>
    {/each}
  </div>

  <div>
    <label class="label">
      <span class="label-text font-bold">When should we remind you?</span>
    </label>
    <input name="time" type="datetime-local" required class="input input-bordered" />
  </div>
  <button class="btn btn-accent">Schedule</button>
</form>
