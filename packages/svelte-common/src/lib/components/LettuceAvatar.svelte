<script module>
  function stringToIntHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      hash = (hash << 5) - hash + charCode;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  const host = 'https://api.dicebear.com/9.x/bottts-neutral/svg';
  const bgs = ['BF616A', 'D08770', 'EBCB8B', 'A3BE8C', 'B48EAD', '88C0D0'];
</script>

<script lang="ts">
  type LettuceAvatarProps = {
    name: string;
    size?: 'sm' | 'lg';
  };

  let { name, size = 'sm' }: LettuceAvatarProps = $props();

  const imageURL = $derived.by(() => {
    const hostUrl = new URL(host);
    bgs.forEach((bg) => {
      hostUrl.searchParams.append('backgroundColor', bg);
    });
    hostUrl.searchParams.set('backgroundType', 'gradientLinear');
    hostUrl.searchParams.set('seed', name);
    return hostUrl.toString();
  });
</script>

<img
  class={[
    'pointer-events-none inline aspect-square size-full',
    size === 'sm' && 'rounded-xl',
    size === 'lg' && 'rounded-3xl',
  ]}
  src={imageURL}
  alt="{name} avatar image"
/>
