<script module>
  type LettuceAvatarProps = {
    name: string;
  };

  const host = 'https://api.dicebear.com/9.x/bottts-neutral/svg';
  const bgs = ['BF616A', 'D08770', 'EBCB8B', 'A3BE8C', 'B48EAD', '88C0D0'];
</script>

<script lang="ts">
  import { Avatar } from 'bits-ui';
  let { name }: LettuceAvatarProps = $props();

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

<Avatar.Root delayMs={50} class="pointer-events-none aspect-square size-full overflow-hidden">
  <Avatar.Image src={imageURL} alt="{name} avatar image"></Avatar.Image>
  <Avatar.Fallback class="grid h-full w-full place-items-center text-center"
    >{name.toUpperCase().slice(0, 2)}</Avatar.Fallback
  >
</Avatar.Root>
