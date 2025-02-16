<script lang="ts">
  type LettuceAvatarProps = {
    name: string;
  };
  let { name }: LettuceAvatarProps = $props();

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
  const hostUrl = new URL(host);
  // bgs.forEach((backgroundColor) => {
  //   hostUrl.searchParams.append('backgroundColor', backgroundColor);
  // });
  console.log('name', name, 'index', (name.length + 1) % bgs.length, 'color', bgs.at((name.length + 1) % bgs.length)!);

  hostUrl.searchParams.set(
    'backgroundColor',
    // bgs.at(stringToIntHash(name + Math.floor(name.length ** 2 * 3).toString()) % bgs.length)!,
    bgs.at(stringToIntHash(name) % bgs.length)!,
  );
  hostUrl.searchParams.set('seed', name);
</script>

<img
  class="pointer-events-none inline aspect-square h-full w-full rounded-xl"
  src={hostUrl.toString()}
  alt="{name} avatar image"
/>
