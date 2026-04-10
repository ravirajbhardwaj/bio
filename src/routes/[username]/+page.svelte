<script lang="ts">
	import type { SocialLink, JourneyItem, Project } from '$lib/server/db/schema';
	import { Button } from '$lib/components/ui/Button';
	import type { PageData } from './$types';
	import { MetaTags } from 'svelte-meta-tags';

	let { data }: { data: PageData } = $props();

	let profile = $derived(data.profile ?? null);

	let allJourneyItems = $derived(
		[...(profile?.journey ?? [])].sort((a: JourneyItem, b: JourneyItem) => a.order - b.order)
	);

	function formatDateRange(start?: string, end?: string): string {
		if (!start) return '';
		if (!end) return `${start} – Present`;
		return `${start} – ${end}`;
	}

	const typeLabel: Record<string, string> = {
		work: 'Work',
		education: 'Education',
		course: 'Course',
		project: 'Project',
		achievement: 'Achievement',
		custom: 'Other'
	};

	const dotColor: Record<string, string> = {
		work: 'oklch(0.59 0.096 111.8)',
		education: 'oklch(0.74 0.063 80.8)',
		course: 'oklch(0.68 0.16 184.9)',
		project: 'oklch(0.66 0.19 41.6)',
		achievement: 'oklch(0.78 0.18 60)',
		custom: 'oklch(0.74 0.063 80.8)'
	};

	function getLinkMeta(link: SocialLink): { label: string; icon: string } {
		if (link.url.startsWith('mailto:')) {
			return {
				label: 'Email',
				icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>`
			};
		}
		const map: Record<string, { label: string; icon: string }> = {
			github: {
				label: 'GitHub',
				icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`
			},
			linkedin: {
				label: 'LinkedIn',
				icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
			},
			x: {
				label: 'X / Twitter',
				icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.727-8.836L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
			},
			instagram: {
				label: 'Instagram',
				icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`
			},
			custom: {
				label: 'Website',
				icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`
			}
		};
		return map[link.type] ?? map.custom;
	}
</script>

<svelte:head>
	<MetaTags
		title={`${profile?.name ?? data.username} — OnePage Profile`}
		description={profile?.bio?.slice(0, 160) ||
			`${data.username}'s professional profile on OnePage`}
		openGraph={profile?.bio
			? {
					type: 'profile',
					title: `${profile.name} — OnePage Profile`,
					description: profile.bio,
					images: profile.avatar ? [{ url: profile.avatar, width: 400, height: 400 }] : undefined
				}
			: undefined}
		twitter={{
			cardType: 'summary',
			title: `${profile?.name ?? data.username} — OnePage Profile`,
			description: profile?.bio?.slice(0, 200) || `${data.username}'s professional profile`
		}}
	/>
</svelte:head>

<main class="min-h-screen bg-[oklch(0.91_0.048_83.6)]">
	{#if data.isOwner && !data.isPaid}
		<div
			class="bg-[oklch(0.59_0.096_111.8)] px-4 py-3 text-center text-sm font-bold text-[oklch(0.95_0.03_83.6)]"
		>
			Subscription inactive. Your profile is not publicly visible.
			<Button
				href="/api/checkout"
				class="ml-2 inline-flex items-center gap-1 rounded bg-[oklch(0.26_0.016_0)] px-3 py-1 font-bold text-[oklch(0.95_0.03_83.6)] transition-colors hover:bg-[oklch(0.41_0.077_78.9)]"
			>
				Upgrade to Pro
			</Button>
		</div>
	{/if}

	<article class="mx-auto max-w-2xl px-6 py-12 md:py-16">
		{#if !profile}
			<!-- Not paid / no profile — locked state -->
			<section class="flex flex-col items-center justify-center py-20 text-center">
				<div class="mb-6 rounded-full bg-[oklch(0.74_0.063_80.8)]/30 p-6">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="h-12 w-12 text-[oklch(0.41_0.077_78.9)]"
					>
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
						<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
					</svg>
				</div>
				<h1 class="mb-2 text-2xl font-bold text-[oklch(0.26_0.016_0)]">Profile Unavailable</h1>
				<p class="mb-6 max-w-md text-[oklch(0.51_0.077_78.9)]">
					@{data.username}'s profile is not publicly available yet.
				</p>
				<div class="flex gap-3">
					<a
						href="/onboarding"
						class="rounded-lg bg-[oklch(0.26_0.016_0)] px-6 py-3 text-sm font-bold text-[oklch(0.95_0.03_83.6)] transition-colors hover:bg-[oklch(0.41_0.077_78.9)]"
					>
						Create Your Profile
					</a>
					<a
						href="/"
						class="rounded-lg border-2 border-[oklch(0.74_0.063_80.8)] px-6 py-3 text-sm font-bold text-[oklch(0.41_0.077_78.9)] transition-colors hover:bg-[oklch(0.88_0.055_83.6)]"
					>
						Go Home
					</a>
				</div>
			</section>
		{:else}
			<!-- Profile Header -->
			<header class="mb-10 flex items-start gap-6">
				{#if profile.avatar}
					<img
						src={profile.avatar}
						alt={profile.name}
						class="h-20 w-20 shrink-0 rounded-[0.625rem] border-2 border-[oklch(0.74_0.063_80.8)] object-cover md:h-24 md:w-24"
					/>
				{/if}
				<div class="min-w-0 flex-1 pt-1">
					<div class="flex items-start justify-between gap-4">
						<div>
							<h1 class="text-2xl leading-tight font-bold text-[oklch(0.26_0.016_0)] md:text-3xl">
								{profile.name}
							</h1>
							<p class="mt-0.5 text-sm font-bold text-[oklch(0.51_0.077_78.9)]">
								{profile.profession}
							</p>
							{#if profile.location}
								<div class="mt-1.5 flex items-center gap-1">
									<svg
										class="h-3.5 w-3.5 text-[oklch(0.51_0.077_78.9)]"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2.5"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2.5"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<span class="text-xs font-bold text-[oklch(0.51_0.077_78.9)]"
										>{profile.location}</span
									>
								</div>
							{/if}
						</div>
						{#if data.isOwner}
							<a
								href="/onboardig"
								class="hidden shrink-0 text-sm font-bold whitespace-nowrap text-[oklch(0.51_0.077_78.9)] transition-colors hover:text-[oklch(0.41_0.077_78.9)] sm:block"
							>
								Edit Profile
							</a>
						{/if}
					</div>
				</div>
			</header>

			<!-- Bio -->
			{#if profile.bio}
				<p class="mb-8 text-[0.95rem] leading-relaxed font-bold text-[oklch(0.41_0.077_78.9)]">
					{profile.bio}
				</p>
			{/if}

			<!-- Social Links -->
			{#if profile.socialLinks?.length}
				<div class="mb-10 flex flex-wrap gap-2">
					{#each profile.socialLinks as link}
						{@const meta = getLinkMeta(link)}
						<a
							href={link.url}
							target={link.url.startsWith('mailto:') ? undefined : '_blank'}
							rel="noopener noreferrer"
							title={meta.label}
							class="inline-flex h-9 w-9 items-center justify-center rounded-[0.625rem] border-2 border-[oklch(0.74_0.063_80.8)] text-[oklch(0.41_0.077_78.9)] transition-colors hover:bg-[oklch(0.88_0.055_83.6)]"
						>
							{@html meta.icon}
						</a>
					{/each}
				</div>
			{/if}

			<div class="mb-10 border-t-2 border-[oklch(0.74_0.063_80.8)]"></div>

			<!-- Journey -->
			{#if allJourneyItems.length > 0}
				<section class="mb-14">
					<h2
						class="mb-7 text-[0.65rem] font-bold tracking-[0.15em] text-[oklch(0.51_0.077_78.9)] uppercase"
					>
						Journey
					</h2>

					<div class="relative pl-7">
						<div
							class="absolute top-2.5 bottom-2.5 left-1.5 w-px bg-[oklch(0.74_0.063_80.8)]"
						></div>

						<div class="space-y-8">
							{#each allJourneyItems as item}
								<div class="relative">
									<div
										class="absolute top-1.5 -left-7 h-3 w-3 rounded-full border-2 border-[oklch(0.74_0.063_80.8)]"
									></div>

									<div class="mb-1 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
										<h3 class="text-[0.95rem] leading-tight font-bold text-[oklch(0.26_0.016_0)]">
											{item.title}
										</h3>
										<div class="flex shrink-0 items-center gap-2">
											<span
												class="text-sm font-bold whitespace-nowrap text-[oklch(0.51_0.077_74.3)]"
											>
												{formatDateRange(item.startDate, item.endDate)}
											</span>
											<span
												class="rounded border-2 border-[oklch(0.74_0.063_80.8)] px-2 py-0.5 text-[0.65rem] font-bold whitespace-nowrap text-[oklch(0.51_0.077_78.9)]"
											>
												{typeLabel[item.type]}
											</span>
										</div>
									</div>

									{#if item.organization}
										<p class="mb-1 text-sm font-bold text-[oklch(0.51_0.077_74.3)]">
											{item.organization}
										</p>
									{/if}
									{#if item.description}
										<p class="text-sm font-bold text-[oklch(0.51_0.077_74.3)]">
											{item.description}
										</p>
									{/if}
									{#if item.link}
										<a
											href={item.link}
											target="_blank"
											rel="noopener noreferrer"
											class="mt-1 inline-block text-xs font-bold text-[oklch(0.59_0.096_111.8)] hover:underline"
										>
											View ↗
										</a>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</section>
			{/if}

			<!-- Projects -->
			{#if profile.projects?.length}
				<section>
					<h2
						class="mb-7 text-[0.65rem] font-bold tracking-[0.15em] text-[oklch(0.51_0.077_78.9)] uppercase"
					>
						Proof of Work
					</h2>

					<div class="divide-y-2 divide-[oklch(0.74_0.063_80.8)]">
						{#each profile.projects as project}
							<div class="py-4 first:pt-0 last:pb-0">
								<div class="flex items-start gap-3">
									<div
										class="mt-[0.45rem] h-2 w-2 shrink-0 rounded-full"
										style="background-color: oklch(0.59 0.096 111.8);"
									></div>
									<div class="min-w-0 flex-1">
										<h3 class="mb-1 text-[0.95rem] font-bold text-[oklch(0.26_0.016_0)]">
											{project.title}
										</h3>
										{#if project.description}
											<p class="mb-2 text-sm font-bold text-[oklch(0.51_0.077_74.3)]">
												{project.description}
											</p>
										{/if}
										{#if project.link}
											<a
												href={project.link}
												target="_blank"
												rel="noopener noreferrer"
												class="inline-flex items-center gap-1 text-xs font-bold text-[oklch(0.59_0.096_111.8)] hover:underline"
											>
												View project
												<svg
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2.5"
													width="12"
													height="12"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14"
													/>
												</svg>
											</a>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/if}
		{/if}
	</article>
</main>
