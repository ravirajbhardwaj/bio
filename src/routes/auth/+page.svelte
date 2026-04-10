<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Loader2, Mail, Sparkles } from '@lucide/svelte';
	import { MetaTags } from 'svelte-meta-tags';

	let { form } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<MetaTags
		title="Sign In - OnePage"
		description="Sign in to your OnePage account with magic link. No password needed."
	/>
</svelte:head>

<main class="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 px-4">
	<Card.Root class="w-full max-w-sm shadow-sm">
		<Card.Header class="space-y-1 pb-4 text-center">
			<Card.Title class="text-xl font-bold tracking-tight">Welcome back</Card.Title>
			<Card.Description class="text-sm">
				Enter your email and we'll send a magic link
			</Card.Description>
		</Card.Header>

		<Card.Content>
			{#if form?.success}
				<!-- Success state -->
				<div class="flex flex-col items-center gap-3 py-4 text-center">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
					>
						<Mail class="h-5 w-5" />
					</div>
					<div>
						<p class="text-sm font-semibold">Check your inbox</p>
						<p class="mt-1 text-xs text-balance text-muted-foreground">{form.message}</p>
					</div>
					<p class="text-xs text-muted-foreground">Didn't receive it? Check your spam folder.</p>
				</div>
			{:else}
				<form
					method="POST"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							loading = false;
							update();
						};
					}}
					class="flex flex-col gap-3"
				>
					{#if form?.message}
						<p class="text-center text-xs font-medium text-destructive">{form.message}</p>
					{/if}

					<Input
						type="email"
						name="email"
						value={(form as { email?: string })?.email}
						placeholder="raviraj@gmail.com"
						required
						disabled={loading}
						class="h-10"
					/>

					<Button type="submit" class="h-10 w-full font-semibold" disabled={loading}>
						{#if loading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Sending…
						{:else}
							<Sparkles class="mr-2 h-4 w-4" />
							Send Magic Link
						{/if}
					</Button>
				</form>
			{/if}
		</Card.Content>

		<Card.Footer class="justify-center border-t pt-4">
			<p class="text-xs text-muted-foreground">No password needed. No spam, ever.</p>
		</Card.Footer>
	</Card.Root>
</main>
