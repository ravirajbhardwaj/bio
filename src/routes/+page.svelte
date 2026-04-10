<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { MetaTags } from 'svelte-meta-tags';

	let username = $state('');

	// Same dot colors as real profile page
	const dotColor: Record<string, string> = {
		work: 'oklch(0.59 0.096 111.8)',
		education: 'oklch(0.74 0.063 80.8)',
		achievement: 'oklch(0.78 0.18 60)'
	};

	const mockJourney = [
		{ type: 'work', title: 'Full Stack Developer', org: 'Freelance', period: '2023 – Present' },
		{ type: 'achievement', title: 'Hackathon Winner', org: 'HackIndia 2023', period: '2023' },
		{ type: 'work', title: 'Frontend Intern', org: 'TechStartup Co.', period: '2022 – 2023' },
		{ type: 'education', title: 'B.Tech, CS', org: 'XYZ University', period: '2019 – 2023' },
		{ type: 'achievement', title: 'AWS Certified', org: 'Solutions Arch.', period: '2023' }
	];

	const mockProjects = [
		{
			title: 'Bio',
			desc: 'Bio-link builder with no code, custom themes, and link scheduling.'
		},
		{
			title: 'API Gateway',
			desc: 'Distributed rate-limiting proxy with Redis and token bucket algorithm.'
		}
	];

	// Icon-only social SVGs (same as profile page)
	const socialIcons = [
		// GitHub
		`<svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
		// LinkedIn
		`<svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
		// X
		`<svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.727-8.836L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
		// Globe (custom/website)
		`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
		// Mail
		`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>`
	];
</script>

<svelte:head>
	<MetaTags
		title="Bio - Your Entire Story in One Link"
		description="Build a clean, beautiful portfolio in minutes — no coding needed. Join 2.5k+ creators sharing their professional journey with Bio."
		openGraph={{
			type: 'website',
			title: 'Bio - Your Entire Story in One Link',
			description: 'Build a clean, beautiful portfolio in minutes — no coding needed.',
			images: [{ url: '/og-image.png', width: 1200, height: 630 }]
		}}
		twitter={{
			cardType: 'summary_large_image',
			title: 'Bio - Your Entire Story in One Link',
			description: 'Build a clean, beautiful portfolio in minutes — no coding needed.'
		}}
	/>
</svelte:head>

<main
	class="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12
	       md:px-12
	       lg:min-h-screen lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-0"
>
	<!-- ── LEFT — copy + CTA ────────────────────────────────── -->
	<section class="flex flex-col items-start gap-5">
		<div class="space-y-3">
			<h1
				class="text-4xl leading-[1.08] font-black tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]"
			>
				One link.<br />
				Your entire<br />
				<span class="text-primary">story.</span>
			</h1>
			<p class="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
				Build a clean, beautiful portfolio in minutes — no coding needed.
			</p>
		</div>

		<div class="flex w-full flex-col gap-2.5 sm:flex-row sm:items-center">
			<div
				class="flex min-w-0 flex-1 items-center overflow-hidden rounded-2xl border border-border bg-transparent px-4 py-3 transition-colors focus-within:border-foreground/40"
			>
				<span class="shrink-0 text-sm font-semibold whitespace-nowrap text-muted-foreground">
					bio/
				</span>
				<input
					bind:value={username}
					placeholder="raviraj"
					class="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-semibold shadow-none outline-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
				/>
			</div>
			<Button
				href={'/auth'}
				class="w-full shrink-0 rounded-2xl px-6 py-3 text-sm font-bold tracking-wide sm:h-full sm:w-auto"
			>
				Claim profile →
			</Button>
		</div>

		<div class="flex items-center gap-3 text-sm text-muted-foreground">
			<div class="flex -space-x-2">
				{#each ['bg-emerald-500', 'bg-cyan-500', 'bg-orange-500'] as color}
					<div class="h-6 w-6 rounded-full border-2 border-background {color}"></div>
				{/each}
			</div>
			<span class="font-bold text-foreground">Join 2.5k+ creators</span>
		</div>

		<div class="flex flex-wrap gap-4 text-xs text-muted-foreground">
			{#each ['No design skills needed', 'Ready in 2 minutes'] as t}
				<span class="flex items-center gap-1">
					<svg
						width="11"
						height="11"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
					{t}
				</span>
			{/each}
		</div>
	</section>

	<!-- ── RIGHT — mockup matching actual profile page ────────── -->
	<aside class="flex items-center justify-center lg:py-8">
		<article
			class="w-full max-w-xs overflow-hidden rounded-3xl border border-border bg-[oklch(0.91_0.048_83.6)] shadow-2xl lg:flex lg:max-h-[88vh] lg:flex-col"
		>
			<!-- browser chrome -->
			<header
				class="flex shrink-0 items-center gap-2 border-b border-[oklch(0.74_0.063_80.8)] bg-[oklch(0.88_0.055_83.6)] px-3 py-2"
			>
				<div class="flex gap-1.5">
					<div class="h-2 w-2 rounded-full bg-red-400/70"></div>
					<div class="h-2 w-2 rounded-full bg-yellow-400/70"></div>
					<div class="h-2 w-2 rounded-full bg-green-400/70"></div>
				</div>
				<div
					class="flex-1 rounded-full bg-[oklch(0.91_0.048_83.6)] px-3 py-0.5 text-center text-[10px] font-bold text-[oklch(0.51_0.077_78.9)]"
				>
					bio/raviraj
				</div>
			</header>

			<!-- scrollable profile content -->
			<div class="no-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-5">
				<!-- Header: avatar + name + location -->
				<div class="flex items-start gap-3">
					<img
						src="https://pbs.twimg.com/profile_images/2033138665921339392/SxMxaark_400x400.jpg"
						alt="Ravi Raj"
						class="h-12 w-12 shrink-0 rounded-[0.4rem] border-2 border-[oklch(0.74_0.063_80.8)] object-cover"
					/>
					<div class="min-w-0 flex-1 pt-0.5">
						<div class="flex items-start justify-between gap-2">
							<div>
								<p class="text-[11px] leading-tight font-bold text-[oklch(0.26_0.016_0)]">
									Ravi Raj
								</p>
								<p class="mt-0.5 text-[9px] font-bold text-[oklch(0.51_0.077_78.9)]">
									Full Stack Developer
								</p>
								<div class="mt-0.5 flex items-center gap-1">
									<svg
										width="8"
										height="8"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<span class="text-[8px] font-bold text-[oklch(0.51_0.077_78.9)]"
										>Bengaluru, India</span
									>
								</div>
							</div>
							<span
								class="shrink-0 text-[8px] font-bold whitespace-nowrap text-[oklch(0.51_0.077_78.9)]"
								>View CV ↗</span
							>
						</div>
					</div>
				</div>

				<!-- Bio -->
				<p class="text-[9px] leading-relaxed font-bold text-[oklch(0.41_0.077_78.9)]">
					Self-taught developer who loves backend engineering, clean APIs, and distributed systems.
					Comfortable owning the full stack.
				</p>

				<!-- Social — icon-only squares, matching profile page -->
				<div class="flex flex-wrap gap-1.5">
					{#each socialIcons as icon}
						<span
							class="inline-flex h-6 w-6 items-center justify-center rounded-md border-2 border-[oklch(0.74_0.063_80.8)] text-[oklch(0.41_0.077_78.9)]"
						>
							{@html icon}
						</span>
					{/each}
				</div>

				<!-- Divider -->
				<div class="border-t-2 border-[oklch(0.74_0.063_80.8)]"></div>

				<!-- Journey — unified timeline with achievements inline -->
				<div class="space-y-2">
					<p class="text-[7px] font-bold tracking-[0.15em] text-[oklch(0.51_0.077_78.9)] uppercase">
						Journey
					</p>

					<div class="relative pl-4">
						<!-- vertical line -->
						<div
							class="absolute top-1.5 bottom-1.5 left-1.25 w-px bg-[oklch(0.74_0.063_80.8)]"
						></div>

						<div class="space-y-3">
							{#each mockJourney as item}
								<div class="relative">
									<!-- dot -->
									<div
										class="absolute top-1 -left-4 h-2 w-2 rounded-full border-2 border-[oklch(0.74_0.063_80.8)]"
										style="background-color: {dotColor[
											item.type
										]}; box-shadow: 0 0 0 2px oklch(0.91 0.048 83.6);"
									></div>

									<div class="flex items-start justify-between gap-2">
										<div class="min-w-0">
											<p class="text-[9.5px] leading-tight font-bold text-[oklch(0.26_0.016_0)]">
												{item.title}
											</p>
											<p class="text-[8px] font-bold text-[oklch(0.51_0.077_78.9)]">{item.org}</p>
										</div>
										<div class="flex shrink-0 items-center gap-1">
											<span
												class="text-[7.5px] font-bold whitespace-nowrap text-[oklch(0.51_0.077_74.3)]"
												>{item.period}</span
											>
											<span
												class="rounded border border-[oklch(0.74_0.063_80.8)] px-1 py-px text-[6px] font-bold whitespace-nowrap text-[oklch(0.51_0.077_78.9)] capitalize"
											>
												{item.type}
											</span>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Divider -->
				<div class="border-t-2 border-[oklch(0.74_0.063_80.8)]"></div>

				<!-- Proof of Work — flat, always visible, link button -->
				<div class="space-y-2">
					<p class="text-[7px] font-bold tracking-[0.15em] text-[oklch(0.51_0.077_78.9)] uppercase">
						Proof of Work
					</p>

					<div class="divide-y-2 divide-[oklch(0.74_0.063_80.8)]">
						{#each mockProjects as project}
							<div class="py-2 first:pt-0 last:pb-0">
								<div class="flex items-start gap-2">
									<div
										class="mt-0.75 h-1.5 w-1.5 shrink-0 rounded-full"
										style="background-color: oklch(0.59 0.096 111.8);"
									></div>
									<div class="min-w-0">
										<p class="text-[9.5px] leading-tight font-bold text-[oklch(0.26_0.016_0)]">
											{project.title}
										</p>
										<p
											class="mt-0.5 text-[8px] leading-relaxed font-bold text-[oklch(0.51_0.077_74.3)]"
										>
											{project.desc}
										</p>
										<span
											class="mt-1 inline-flex items-center gap-0.5 text-[7.5px] font-bold text-[oklch(0.59_0.096_111.8)]"
										>
											View project
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2.5"
												width="7"
												height="7"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14"
												/>
											</svg>
										</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</article>
	</aside>
</main>
