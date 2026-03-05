<script lang="ts">
  import { getFirstDayOfTheMonth } from '$lib/utils/CalendarDate';
  import { DateRangePicker, type DateRange } from 'bits-ui';
  import CalendarBlankIcon from 'phosphor-svelte/lib/CalendarBlankIcon';
  import CaretLeft from 'phosphor-svelte/lib/CaretLeftIcon';
  import CaretRight from 'phosphor-svelte/lib/CaretRightIcon';

  type Props = {
    startName?: string;
    endName?: string;
    initialValue?: DateRange;
  };

  let { startName = 'date-range-start', endName = 'date-range-end', initialValue }: Props = $props();

  let value = $derived<DateRange | undefined>(initialValue);
</script>

<DateRangePicker.Root
  class="ml-auto flex w-full max-w-max flex-col gap-1.5 sm:ml-0"
  fixedWeeks={true}
  weekdayFormat="short"
  placeholder={getFirstDayOfTheMonth()}
  bind:value
>
  <DateRangePicker.Label class="block font-medium text-charade-50 select-none">Date range</DateRangePicker.Label>
  <div
    class="flex items-center gap-2 rounded-xl border border-1 border-charade-200 bg-charade-950 p-2 tracking-[0.01em] select-none focus-within:border-charade-50 hover:border-charade-50"
  >
    <div class="flex flex-col flex-wrap items-baseline gap-2 sm:flex-row">
      {#each ['start', 'end'] as const as type}
        {#if type === 'end'}
          <span aria-hidden="true" class="hidden text-charade-200 sm:ml-2 sm:inline-block">–⁠⁠⁠⁠⁠</span>
          <span aria-hidden="true" class="inline-block px-1.5 font-mono text-charade-200 sm:hidden">to</span>
        {/if}
        <DateRangePicker.Input {type} class="flex items-baseline gap-1" name={type === 'start' ? startName : endName}>
          {#snippet children({ segments })}
            {#each segments as { part, value }}
              <div class="inline-block h-full font-mono select-none">
                {#if part === 'literal'}
                  <DateRangePicker.Segment {part} class="text-charade-200">
                    {value}
                  </DateRangePicker.Segment>
                {:else}
                  <DateRangePicker.Segment
                    {part}
                    class="inline-flex h-8 items-center rounded px-2 hover:bg-charade-800 focus:bg-charade-800 focus:text-charade-50 focus-visible:ring-0! focus-visible:ring-offset-0! aria-[valuetext=Empty]:text-charade-300"
                  >
                    {value}
                  </DateRangePicker.Segment>
                {/if}
              </div>
            {/each}
          {/snippet}
        </DateRangePicker.Input>
      {/each}
    </div>
    <DateRangePicker.Trigger
      class="ml-auto inline-flex size-8 items-center justify-center rounded text-charade-200 transition-all hover:bg-charade-800 hover:text-charade-50 active:bg-charade-950 active:text-charade-200"
    >
      <CalendarBlankIcon class="size-6" />
    </DateRangePicker.Trigger>
  </div>

  <DateRangePicker.Content class="z-50" align="center">
    <DateRangePicker.Calendar
      class="mt-2 w-full rounded-lg border border-charade-300 bg-charade-950 p-6 shadow-sm sm:mt-6"
    >
      {#snippet children({ months, weekdays })}
        <DateRangePicker.Header class="flex items-center justify-between">
          <DateRangePicker.PrevButton
            class="inline-flex size-10 items-center justify-center rounded bg-charade-900 transition-all hover:bg-charade-800 active:scale-[0.98]"
          >
            <CaretLeft class="size-6" />
          </DateRangePicker.PrevButton>
          <DateRangePicker.Heading class="text-[15px] font-medium" />
          <DateRangePicker.NextButton
            class="inline-flex size-10 items-center justify-center rounded bg-charade-900 transition-all hover:bg-charade-800 active:scale-[0.98]"
          >
            <CaretRight class="size-6" />
          </DateRangePicker.NextButton>
        </DateRangePicker.Header>
        <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {#each months as month (month.value)}
            <DateRangePicker.Grid class="w-full border-collapse space-y-1 select-none">
              <DateRangePicker.GridHead>
                <DateRangePicker.GridRow class="mb-1 flex w-full justify-between">
                  {#each weekdays as day}
                    <DateRangePicker.HeadCell class="w-10 rounded-md text-xs font-normal! text-charade-100">
                      {day.substring(0, 2)}
                    </DateRangePicker.HeadCell>
                  {/each}
                </DateRangePicker.GridRow>
              </DateRangePicker.GridHead>
              <DateRangePicker.GridBody>
                {#each month.weeks as weekDates}
                  <DateRangePicker.GridRow class="flex w-full">
                    {#each weekDates as date}
                      <DateRangePicker.Cell
                        {date}
                        month={month.value}
                        class="relative m-0 size-10 overflow-visible p-0! text-center focus-within:relative focus-within:z-20"
                      >
                        <DateRangePicker.Day
                          class="group relative inline-flex size-10 items-center justify-center overflow-visible rounded border border-transparent bg-transparent p-0 font-normal whitespace-nowrap text-charade-100 transition-all hover:border-charade-200  focus-visible:ring-charade-200! data-disabled:pointer-events-none data-disabled:text-charade-400 data-highlighted:rounded-none data-highlighted:bg-charade-800 data-outside-month:pointer-events-none data-selected:bg-charade-800 data-selected:font-medium data-selected:text-charade-50 data-selection-end:rounded data-selection-end:bg-charade-300 data-selection-end:font-medium data-selection-end:text-charade-950 data-selection-start:rounded data-selection-start:bg-charade-300 data-selection-start:font-medium data-selection-start:text-charade-950 data-selection-start:focus-visible:ring-2 data-selection-start:focus-visible:ring-offset-2! data-unavailable:text-charade-400 data-unavailable:line-through data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border-charade-200 data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-0! data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-offset-0!"
                        >
                          <div
                            class="bg-foreground group-data-selected:bg-background absolute top-[5px] hidden size-1 rounded-full transition-all group-data-today:block"
                          ></div>
                          {date.day}
                        </DateRangePicker.Day>
                      </DateRangePicker.Cell>
                    {/each}
                  </DateRangePicker.GridRow>
                {/each}
              </DateRangePicker.GridBody>
            </DateRangePicker.Grid>
          {/each}
        </div>
      {/snippet}
    </DateRangePicker.Calendar>
  </DateRangePicker.Content>
</DateRangePicker.Root>
