<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/Button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { ActionData, PageData } from './$types';
	import type { ProfileFormData } from './+page.server';
	import { MetaTags } from 'svelte-meta-tags';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let profile = $state<ProfileFormData>(
		data.profile ?? {
			name: '',
			profession: '',
			bio: '',
			location: '',
			avatar: '',
			socialLinks: [],
			journey: [],
			projects: []
		}
	);

	let saving = $state(false);

	const socialTypes = ['github', 'linkedin', 'x', 'instagram', 'custom'];
	const journeyTypes = ['work', 'education', 'achievement', 'course', 'project', 'custom'];

	const addSocialLink = () => {
		profile.socialLinks = [...profile.socialLinks, { type: 'custom', url: '' }];
	};
	const removeSocialLink = (i: number) => {
		profile.socialLinks = profile.socialLinks.filter((_, idx) => idx !== i);
	};

	const addJourneyItem = () => {
		const maxOrder = profile.journey.reduce((m, j) => Math.max(m, j.order), 0);
		profile.journey = [
			...profile.journey,
			{
				order: maxOrder + 1,
				type: 'work',
				title: '',
				organization: '',
				description: '',
				startDate: '',
				endDate: undefined
			}
		];
	};
	const removeJourneyItem = (i: number) => {
		profile.journey = profile.journey.filter((_, idx) => idx !== i);
	};
	const moveJourneyItem = (i: number, dir: -1 | 1) => {
		const arr = [...profile.journey];
		const target = i + dir;
		if (target < 0 || target >= arr.length) return;
		[arr[i], arr[target]] = [arr[target], arr[i]];
		arr.forEach((item, idx) => (item.order = idx + 1));
		profile.journey = arr;
	};

	const addProject = () => {
		profile.projects = [
			...profile.projects,
			{ id: crypto.randomUUID(), title: '', description: '', link: '', createdAt: new Date() }
		];
	};
	const removeProject = (i: number) => {
		profile.projects = profile.projects.filter((_, idx) => idx !== i);
	};
</script>

<svelte:head>
	<MetaTags
		title="Edit Profile - OnePage"
		description="Customize your OnePage profile. Add your bio, journey, projects and social links."
	/>
</svelte:head>

<main class="min-h-screen bg-[oklch(0.91_0.048_83.6)] px-4 py-12 md:px-6 md:py-16">
	<div class="mx-auto max-w-2xl space-y-10">
		<header class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-[oklch(0.26_0.016_0)]">Edit Profile</h1>
				<p class="mt-0.5 text-sm font-bold text-[oklch(0.51_0.077_78.9)]">
					Changes are saved to your account
				</p>
			</div>
			<a
				href="/"
				class="text-sm font-bold text-[oklch(0.51_0.077_78.9)] hover:text-[oklch(0.41_0.077_78.9)]"
				>← Preview</a
			>
		</header>

		{#if form?.error}
			<div
				class="rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
			>
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				saving = true;
				return async ({ update }) => {
					await update();
					saving = false;
				};
			}}
		>
			<input type="hidden" name="payload" value={JSON.stringify(profile)} />

			<div class="space-y-10">
				<!-- Basic Info -->
				<section
					class="space-y-5 rounded-xl border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.95_0.03_83.6)] p-6"
				>
					<h2
						class="text-[0.65rem] font-bold tracking-[0.15em] text-[oklch(0.51_0.077_78.9)] uppercase"
					>
						Basic Info
					</h2>

					<div class="flex items-center gap-4">
						{#if profile.avatar}
							<img
								src={profile.avatar}
								alt="avatar"
								class="h-14 w-14 rounded-xl border-2 border-[oklch(0.74_0.063_80.8)] object-cover"
							/>
						{/if}
						<div class="flex-1">
							<Label class="mb-1 block text-xs font-bold text-[oklch(0.41_0.077_78.9)]"
								>Avatar URL</Label
							>
							<Input
								type="url"
								bind:value={profile.avatar}
								placeholder="https://..."
								class="w-full border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.91_0.048_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<Label class="mb-1 block text-xs font-bold text-[oklch(0.41_0.077_78.9)]"
								>Full Name</Label
							>
							<Input
								type="text"
								bind:value={profile.name}
								placeholder="Your name"
								class="w-full border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.91_0.048_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
							/>
						</div>
						<div>
							<Label class="mb-1 block text-xs font-bold text-[oklch(0.41_0.077_78.9)]"
								>Profession</Label
							>
							<Input
								type="text"
								bind:value={profile.profession}
								placeholder="Full Stack Developer"
								class="w-full border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.91_0.048_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
							/>
						</div>
					</div>

					<div>
						<Label class="mb-1 block text-xs font-bold text-[oklch(0.41_0.077_78.9)]"
							>Location</Label
						>
						<Input
							type="text"
							bind:value={profile.location}
							placeholder="Bengaluru, India"
							class="w-full border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.91_0.048_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
						/>
					</div>

					<div>
						<Label class="mb-1 block text-xs font-bold text-[oklch(0.41_0.077_78.9)]">Bio</Label>
						<Textarea
							bind:value={profile.bio}
							rows={4}
							placeholder="Write a short bio..."
							class="w-full resize-none border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.91_0.048_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
						/>
					</div>
				</section>

				<!-- Social Links -->
				<section
					class="space-y-4 rounded-xl border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.95_0.03_83.6)] p-6"
				>
					<div class="flex items-center justify-between">
						<h2
							class="text-[0.65rem] font-bold tracking-[0.15em] text-[oklch(0.51_0.077_78.9)] uppercase"
						>
							Social Links
						</h2>
						<Button variant="outline" size="sm" onclick={addSocialLink}>+ Add Link</Button>
					</div>

					{#if profile.socialLinks.length === 0}
						<p class="py-3 text-center text-sm font-bold text-[oklch(0.74_0.063_80.8)]">
							No links yet — add one above
						</p>
					{/if}

					<div class="space-y-3">
						{#each profile.socialLinks as link, i}
							<div class="flex items-center gap-2">
								<select
									bind:value={link.type}
									class="rounded-lg border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.91_0.048_83.6)] px-2 py-2 text-sm font-bold text-[oklch(0.26_0.016_0)]"
								>
									{#each socialTypes as t}
										<option value={t}
											>{t === 'x' ? 'X / Twitter' : t.charAt(0).toUpperCase() + t.slice(1)}</option
										>
									{/each}
								</select>
								<Input
									type="url"
									bind:value={link.url}
									placeholder="https://..."
									class="flex-1 border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.91_0.048_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
								/>
								<Button
									type="button"
									onclick={() => removeSocialLink(i)}
									class="rounded-lg border-2 border-[oklch(0.74_0.063_80.8)] p-2 text-[oklch(0.51_0.077_78.9)] hover:border-red-400 hover:text-red-500"
									>×</Button
								>
							</div>
						{/each}
					</div>
				</section>

				<!-- Journey -->
				<section
					class="space-y-5 rounded-xl border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.95_0.03_83.6)] p-6"
				>
					<div class="flex items-center justify-between">
						<div>
							<h2
								class="text-[0.65rem] font-bold tracking-[0.15em] text-[oklch(0.51_0.077_78.9)] uppercase"
							>
								Journey
							</h2>
							<p class="mt-0.5 text-xs font-bold text-[oklch(0.74_0.063_80.8)]">
								Work, education & achievements
							</p>
						</div>
						<Button variant="outline" size="sm" onclick={addJourneyItem}>+ Add Item</Button>
					</div>

					{#if profile.journey.length === 0}
						<p class="py-3 text-center text-sm font-bold text-[oklch(0.74_0.063_80.8)]">
							No items yet
						</p>
					{/if}

					<div class="space-y-4">
						{#each profile.journey as item, i}
							<div
								class="space-y-3 rounded-lg border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.91_0.048_83.6)] p-4"
							>
								<div class="flex items-center gap-2">
									<select
										bind:value={item.type}
										class="rounded-lg border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.95_0.03_83.6)] px-2 py-1.5 text-xs font-bold text-[oklch(0.26_0.016_0)]"
									>
										{#each journeyTypes as t}
											<option value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
										{/each}
									</select>
									<div class="ml-auto flex items-center gap-1">
										<Button
											type="button"
											onclick={() => moveJourneyItem(i, -1)}
											disabled={i === 0}
											class="rounded border-2 border-[oklch(0.74_0.063_80.8)] p-1.5 text-[oklch(0.51_0.077_78.9)] hover:bg-[oklch(0.88_0.055_83.6)] disabled:opacity-30"
											>↑</Button
										>
										<Button
											type="button"
											onclick={() => moveJourneyItem(i, 1)}
											disabled={i === profile.journey.length - 1}
											class="rounded border-2 border-[oklch(0.74_0.063_80.8)] p-1.5 text-[oklch(0.51_0.077_78.9)] hover:bg-[oklch(0.88_0.055_83.6)] disabled:opacity-30"
											>↓</Button
										>
										<Button
											type="button"
											onclick={() => removeJourneyItem(i)}
											class="rounded border-2 border-[oklch(0.74_0.063_80.8)] p-1.5 text-[oklch(0.51_0.077_78.9)] hover:border-red-400 hover:text-red-500"
											>×</Button
										>
									</div>
								</div>

								<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
									<div>
										<Label class="mb-1 block text-[0.65rem] font-bold text-[oklch(0.51_0.077_78.9)]"
											>Title</Label
										>
										<Input
											type="text"
											bind:value={item.title}
											placeholder="e.g. Full Stack Developer"
											class="w-full border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.95_0.03_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
										/>
									</div>
									<div>
										<Label class="mb-1 block text-[0.65rem] font-bold text-[oklch(0.51_0.077_78.9)]"
											>Organization</Label
										>
										<Input
											type="text"
											bind:value={item.organization}
											placeholder="e.g. Freelance"
											class="w-full border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.95_0.03_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
										/>
									</div>
								</div>

								<div class="grid grid-cols-2 gap-3">
									<div>
										<Label class="mb-1 block text-[0.65rem] font-bold text-[oklch(0.51_0.077_78.9)]"
											>Start</Label
										>
										<Input
											type="text"
											bind:value={item.startDate}
											placeholder="2022"
											class="w-full border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.95_0.03_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
										/>
									</div>
									<div>
										<Label class="mb-1 block text-[0.65rem] font-bold text-[oklch(0.51_0.077_78.9)]"
											>End (optional)</Label
										>
										<Input
											type="text"
											bind:value={item.endDate}
											placeholder="2023"
											class="w-full border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.95_0.03_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
										/>
									</div>
								</div>

								<div>
									<Label class="mb-1 block text-[0.65rem] font-bold text-[oklch(0.51_0.077_78.9)]"
										>Description</Label
									>
									<Textarea
										bind:value={item.description}
										rows={2}
										placeholder="What did you do here?"
										class="w-full resize-none border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.95_0.03_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
									/>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- Projects -->
				<section
					class="space-y-5 rounded-xl border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.95_0.03_83.6)] p-6"
				>
					<div class="flex items-center justify-between">
						<div>
							<h2
								class="text-[0.65rem] font-bold tracking-[0.15em] text-[oklch(0.51_0.077_78.9)] uppercase"
							>
								Proof of Work
							</h2>
							<p class="mt-0.5 text-xs font-bold text-[oklch(0.74_0.063_80.8)]">
								Projects & contributions
							</p>
						</div>
						<Button variant="outline" size="sm" onclick={addProject}>+ Add Project</Button>
					</div>

					{#if profile.projects.length === 0}
						<p class="py-3 text-center text-sm font-bold text-[oklch(0.74_0.063_80.8)]">
							No projects yet
						</p>
					{/if}

					<div class="space-y-4">
						{#each profile.projects as project, i}
							<div
								class="space-y-3 rounded-lg border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.91_0.048_83.6)] p-4"
							>
								<div class="flex items-center justify-between">
									<span class="text-xs font-bold text-[oklch(0.74_0.063_80.8)]"
										>Project {i + 1}</span
									>
									<Button
										type="button"
										onclick={() => removeProject(i)}
										class="rounded border-2 border-[oklch(0.74_0.063_80.8)] p-1.5 text-[oklch(0.51_0.077_78.9)] hover:border-red-400 hover:text-red-500"
										>×</Button
									>
								</div>

								<div>
									<Label class="mb-1 block text-[0.65rem] font-bold text-[oklch(0.51_0.077_78.9)]"
										>Title</Label
									>
									<Input
										type="text"
										bind:value={project.title}
										placeholder="e.g. Linktree Clone"
										class="w-full border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.95_0.03_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
									/>
								</div>

								<div>
									<Label class="mb-1 block text-[0.65rem] font-bold text-[oklch(0.51_0.077_78.9)]"
										>Description</Label
									>
									<Textarea
										bind:value={project.description}
										rows={2}
										placeholder="What does this project do?"
										class="w-full resize-none border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.95_0.03_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
									/>
								</div>

								<div>
									<Label class="mb-1 block text-[0.65rem] font-bold text-[oklch(0.51_0.077_78.9)]"
										>Link</Label
									>
									<Input
										type="url"
										bind:value={project.link}
										placeholder="https://github.com/..."
										class="w-full border-2 border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.95_0.03_83.6)] focus-visible:ring-[oklch(0.59_0.096_111.8)]"
									/>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- Sticky Save Bar -->
				<div class="sticky bottom-6 z-10">
					<div
						class="flex items-center justify-between rounded-xl border-2 border-[oklch(0.41_0.077_78.9)] bg-[oklch(0.26_0.016_0)] px-5 py-3 shadow-xl"
					>
						<p class="text-sm font-bold text-[oklch(0.74_0.063_80.8)]">
							{#if form?.success}
								✓ Saved successfully
							{:else if form?.error}
								✗ Save failed
							{:else}
								Ready to save
							{/if}
						</p>
						<Button
							type="submit"
							disabled={saving}
							class="rounded-lg bg-[oklch(0.59_0.096_111.8)] px-5 py-2 text-sm font-bold text-[oklch(0.95_0.03_83.6)] hover:bg-[oklch(0.52_0.096_111.8)] disabled:opacity-50"
						>
							{saving ? 'Saving…' : 'Save Profile'}
						</Button>
					</div>
				</div>
			</div>
		</form>

		{#if form?.success && !data.isPaid}
			<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
				<Card.Root class="w-full max-w-md border-2 border-[oklch(0.74_0.063_80.8)]">
					<Card.Header>
						<Card.Title class="text-2xl">Upgrade to Pro</Card.Title>
						<Card.Description>
							Your profile is saved. Upgrade to make it visible to everyone.
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-4">
						<ul class="space-y-2 text-sm text-[oklch(0.51_0.077_78.9)]">
							<li>✓ Public profile page</li>
							<li>✓ Custom domain support</li>
							<li>✓ Analytics & insights</li>
						</ul>
						<div class="flex gap-3">
							<Button class="flex-1" onclick={() => (window.location.href = '/api/checkout')}>
								Upgrade Now
							</Button>
							<Button variant="outline" class="flex-1" onclick={() => window.history.back()}>
								Later
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		{/if}
	</div>
</main>
