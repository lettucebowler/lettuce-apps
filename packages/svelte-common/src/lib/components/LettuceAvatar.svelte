<script lang="ts">
  const host = 'https://api.dicebear.com/9.x/bottts-neutral/svg';
  const bgs = ['BF616A', 'D08770', 'EBCB8B', 'A3BE8C', 'B48EAD', '88C0D0'];

  let {
    name,
  }: {
    name: string;
  } = $props();

  function generateImageUrl(name: string) {
    const hostUrl = new URL(host);
    bgs.forEach((bg) => {
      hostUrl.searchParams.append('backgroundColor', bg);
    });
    hostUrl.searchParams.set('backgroundType', 'gradientLinear');
    hostUrl.searchParams.set('seed', name);
    return hostUrl.toString();
  }
</script>

<img
  src={generateImageUrl(name)}
  alt="{name} avatar"
  class="pointer-events-none grid h-full max-w-full place-items-center"
/>
