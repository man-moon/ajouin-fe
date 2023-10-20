<script>
	import Icon from '$lib/Icon.svelte';
	import Nav from '$lib/Nav.svelte';
	import DocumentCard from '$lib/DocumentCard.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/logo.png';

	import * as d3 from 'd3';
	import wikidata from '$lib/assets/wiki.json';

	let width = 450;
	let element;

	onMount(async function () {
		let data = wikidata;

		let chart = ForceGraph(data, {
			nodeId: (d) => d.index,
			nodeGroup: (d) => d.group,
			nodeTitle: (d) => `${d.name}\n${d.group}`,
			linkStrokeWidth: (l) => Math.sqrt(l.value),
			width,
			height: 300
		});

		d3.select(element).append(() => chart);
		// Or alternatively, via the native DOM API:
		// element.appendChild(chart)
	});

	// Copyright 2021 Observable, Inc.
	// Released under the ISC license.
	// https://observablehq.com/@d3/force-directed-graph
	function ForceGraph(
		{
			nodes, // an iterable of node objects (typically [{id}, …])
			links // an iterable of link objects (typically [{source, target}, …])
		},
		{
			nodeId = (d) => d.id, // given d in nodes, returns a unique identifier (string)
			nodeGroup, // given d in nodes, returns an (ordinal) value for color
			nodeGroups, // an array of ordinal values representing the node groups
			nodeTitle, // given d in nodes, a title string
			nodeFill = 'currentColor', // node stroke fill (if not using a group color encoding)
			nodeStroke = '#fff', // node stroke color
			nodeStrokeWidth = 1.5, // node stroke width, in pixels
			nodeStrokeOpacity = 1, // node stroke opacity
			nodeRadius = 5, // node radius, in pixels
			nodeStrength,
			linkSource = ({ source }) => source, // given d in links, returns a node identifier string
			linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
			linkStroke = '#999', // link stroke color
			linkStrokeOpacity = 0.6, // link stroke opacity
			linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
			linkStrokeLinecap = 'round', // link stroke linecap
			linkStrength,
			colors = d3.schemeTableau10, // an array of color strings, for the node groups
			width = 640, // outer width, in pixels
			height = 450, // outer height, in pixels
			invalidation // when this promise resolves, stop the simulation
		} = {}
	) {
		// Compute values.
		const N = d3.map(nodes, nodeId).map(intern);
		const LS = d3.map(links, linkSource).map(intern);
		const LT = d3.map(links, linkTarget).map(intern);
		if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
		const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
		const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
		const W = typeof linkStrokeWidth !== 'function' ? null : d3.map(links, linkStrokeWidth);
		const L = typeof linkStroke !== 'function' ? null : d3.map(links, linkStroke);

		// Replace the input nodes and links with mutable objects for the simulation.
		nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
		links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

		// Compute default domains.
		if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

		// Construct the scales.
		const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

		// Construct the forces.
		const forceNode = d3.forceManyBody();
		const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);
		if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
		if (linkStrength !== undefined) forceLink.strength(linkStrength);

		const simulation = d3
			.forceSimulation(nodes)
			.force('link', forceLink)
			.force('charge', forceNode)
			.force('center', d3.forceCenter())
			.on('tick', ticked);

		const svg = d3
			.create('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', [-width / 2, -height / 2, width, height])
			.attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

		const link = svg
			.append('g')
			.attr('stroke', typeof linkStroke !== 'function' ? linkStroke : null)
			.attr('stroke-opacity', linkStrokeOpacity)
			.attr('stroke-width', typeof linkStrokeWidth !== 'function' ? linkStrokeWidth : null)
			.attr('stroke-linecap', linkStrokeLinecap)
			.selectAll('line')
			.data(links)
			.join('line');

		const node = svg
			.append('g')
			.attr('fill', nodeFill)
			.attr('stroke', nodeStroke)
			.attr('stroke-opacity', nodeStrokeOpacity)
			.attr('stroke-width', nodeStrokeWidth)
			.selectAll('circle')
			.data(nodes)
			.join('circle')
			.attr('r', nodeRadius)
			.call(drag(simulation));

		if (W) link.attr('stroke-width', ({ index: i }) => W[i]);
		if (L) link.attr('stroke', ({ index: i }) => L[i]);
		if (G) node.attr('fill', ({ index: i }) => color(G[i]));
		if (T) node.append('title').text(({ index: i }) => T[i]);
		if (invalidation != null) invalidation.then(() => simulation.stop());

		function intern(value) {
			return value !== null && typeof value === 'object' ? value.valueOf() : value;
		}

		function ticked() {
			link
				.attr('x1', (d) => d.source.x)
				.attr('y1', (d) => d.source.y)
				.attr('x2', (d) => d.target.x)
				.attr('y2', (d) => d.target.y);

			node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
		}

		function drag(simulation) {
			function dragstarted(event) {
				if (!event.active) simulation.alphaTarget(0.3).restart();
				event.subject.fx = event.subject.x;
				event.subject.fy = event.subject.y;
			}

			function dragged(event) {
				event.subject.fx = event.x;
				event.subject.fy = event.y;
			}

			function dragended(event) {
				if (!event.active) simulation.alphaTarget(0);
				event.subject.fx = null;
				event.subject.fy = null;
			}

			return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
		}

		return Object.assign(svg.node(), { scales: { color } });
	}

	let hideHeader = false;
	let lastScrollPosition = 0;

	let userRanking = [
		{
			email: 'mo**29'
		},
		{
			email: 'mo**29'
		},
		{
			email: 'mo**29'
		},
		{
			email: 'mo**29'
		},
		{
			email: 'mo**29'
		},
		{
			email: 'mo**29'
		},
		{
			email: 'mo**29'
		},
		{
			email: 'mo**29'
		},
		{
			email: 'mo**29'
		},
		{
			email: 'mo**29'
		}
	];

	onMount(() => {
		const handleScroll = () => {
			const currentScrollPosition = window.scrollY;

			if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 50) {
				hideHeader = true;
			} else {
				hideHeader = false;
			}

			lastScrollPosition = currentScrollPosition;
		};
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<header class="z-30 sticky top-0 {hideHeader ? 'hide-animation' : ''} border-b">
	<div class="flex items-center max-w-4xl justify-between gap-4 p-4 bg-white">
		<a href="/"><img src={logo} alt="홈아이콘" class="inline rounded-xl w-14" /></a>
		<div
			class="flex items-center justify-center w-full h-10 px-4 bg-gray-100 rounded-full border-none gap-2"
		>
			<Icon icon="search" size={20} />
			<input
				class="w-full h-10 px-2 text-base border-none bg-transparent ring:border-none rounded-full placeholder-neutral-400 focus:outline-none"
				type="text"
				placeholder="검색어를 입력하세요"
			/>
		</div>
		<button class="relative">
			<Icon icon="bell" />
			<div
				class="absolute -right-1 -top-1 flex justify-center items-center w-2 h-2 rounded-full bg-red-500 text-xs text-white"
			/>
		</button>
	</div>
</header>

<main>
	<!-- 설명 -->
	<div class="mt-4 px-4 grid place-items-center text-lg font-bold text-gray-500">
		<div class="text-center">
			아주대학교의 모든 것,<br />
			<span class="text-blue-500">아주위키</span>에 오신 것을 환영합니다.
			<div class="mt-4 text-sm font-normal whitespace-wrap">
				아주위키는 아주대학교 학생들이 함께 만들어가는 위키입니다.<br />
				아주대학교 구성원이라면 누구나 자유롭게 문서를 편집할 수 있습니다.
			</div>
		</div>
	</div>

	<div class="mt-4 flex items-center justify-center">
		<div bind:this={element} />
	</div>

	<div class="px-4 flex items-center justify-center">
		<button on:click={() => goto('/wiki/아주위키:작성')}
			class="block px-4 text-blue-500 text-lg border border-blue-500 py-3 rounded-lg">
			나도 기여해보기!
		</button>
	</div>


	<!-- 리더보드 -->
	<h3 class="px-4">리더보드</h3>
	<div class="relative border rounded-lg p-4 m-4">
		<div class="absolute left-4 -top-2.5 text-gray-500 text-sm font-normal bg-white px-1">
			이번 주 아주위키 기여도 TOP 10
		</div>
		<div class="grid grid-rows-5 grid-flow-col text-gray-700 gap-1">
			{#each userRanking as user, i}
				<div class="flex items-center gap-1">
					<div
						class="rounded-full w-5 h-5 flex items-center justify-center {i == 0
							? 'bg-yellow-300'
							: i == 1
							? 'bg-gray-200'
							: i == 2
							? 'bg-yellow-500'
							: 'bg-blue-200'}"
					>
						{i + 1}
					</div>
					{user.email}
				</div>
			{/each}
		</div>
	</div>

	<!-- 카테고리 목록 -->
	<div class="px-4 pt-4 flex justify-between items-center">
		<h3>카테고리</h3>
		<a href="/wiki/아주위키:카테고리" class="text-gray-700 flex items-center">
			모든 카테고리 보기
			<Icon icon="chevron-right" size={16}/>
		</a>
	</div>
	<div class="mx-4 rounded-lg border border-gray-300">
		<table class="w-full border-none text-gray-700">
			<tbody>
			  <tr>
				<td class="w-1/3 py-2 px-4 border-b">
					<a href="/wiki/동아리">동아리</a>
				</td>
				<td class="w-1/3 py-2 px-4 border-b border-l">
					<a href="/wiki/맛집">맛집</a>
				</td>
				<td class="w-1/3 py-2 px-4 border-b border-l">
					<a href="/wiki/수업">수업</a>
				</td>
			  </tr>
			  <tr>
				<td class="py-2 px-4 border-b">
					<a href="/wiki/행사">행사</a>
				</td>
				<td class="py-2 px-4 border-b border-l">
					<a href="/wiki/건물">건물</a>
				</td>
				<td class="py-2 px-4 border-b border-l">
					<a href="/wiki/교수">교수진</a>
				</td>
			  </tr>
			  <tr>
				<td class="py-2 px-4 border-b">
					<a href="/wiki/단과대">단과대</a>
				</td>
				<td class="py-2 px-4 border-b border-l">
					<a href="/wiki/학과">학과</a>
				</td>
				<td class="py-2 px-4 border-b border-l">
					<a href="/wiki/카페">카페</a>
				</td>
			  </tr>
			  <tr>
				<td class="py-2 px-4">
					<a href="/wiki/편의시설">편의시설</a>
				</td>
				<td class="py-2 px-4 border-l">
					<a href="/wiki/맛집"></a>
				</td>
				<td class="py-2 px-4 border-l">
					<a href="/wiki/맛집"></a>
				</td>
			  </tr>
			</tbody>
		  </table>
	</div>

<!-- 
	최근 가장 많이 검색된 문서
	<h3 class="px-4 pt-8">최근 가장 많이 검색된 문서</h3>
	<ul class="mt-4">
		{#each '012' as i}
			<DocumentCard />
			<hr class="my-2" />
		{/each}
	</ul> -->

	<!-- 최근 수정/등록된 문서 -->
	<div class="flex items-center justify-between px-4 mt-8">
		<h3>최근 편집된 문서</h3>
		<a href="/wiki/아주위키:문서" class="text-gray-700 flex items-center">
			모든 문서 보기
			<Icon icon="chevron-right" size={16}/>
		</a>
	</div>

	<ul class="mt-4">
		{#each '012' as i}
			<DocumentCard />
			<hr class="my-2" />
		{/each}
	</ul>
</main>

<div class="h-16" />

<Nav currentPath="/wiki" />

<style>
	header {
		transition: transform 0.3s ease-in-out;
	}
	.hide-animation {
		transform: translateY(-100%);
	}
</style>
