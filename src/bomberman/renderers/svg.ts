import { GameTheme } from '../../shared/types';
import { Utils } from '../../shared/utils/utils';
import { CELL_SIZE, DELTA_TIME, GAP_SIZE, GRID_HEIGHT, GRID_WIDTH, SPRITE_SETS, SVG } from '../core/constants';
import { ITEM_DEFINITIONS } from '../entities/item';
import { BombermanStore, BombState, CellEvent, Direction, ExplosionEvent, ItemState, PlayerState } from '../types';
import {
	buildChangingValuesAnimation,
	buildFrameValueAnimation,
	buildStepwiseLinearAnimation,
	buildValueWindowAnimation,
	buildVisibilityAnimation
} from './animation';

type SpriteFrame = {
	readonly width: number;
	readonly height: number;
	readonly data: string;
};

type SpriteSymbol = {
	id: string;
	frame: SpriteFrame;
	flipX?: boolean;
	preserveAspectRatio?: 'none';
};

type SpriteCycle = readonly SpriteSymbol[];
type BlastSpriteKind = 'center' | 'segment' | 'end';
type BlastDirection = PlayerState['direction'];
type WalkFrameKey =
	| 'walkDown0'
	| 'walkDown1'
	| 'walkDown2'
	| 'walkDown3'
	| 'walkUp0'
	| 'walkUp1'
	| 'walkUp2'
	| 'walkUp3'
	| 'walkRight0'
	| 'walkRight1'
	| 'walkRight2'
	| 'walkRight3'
	| 'walkRight4'
	| 'walkRight5';
type PlayerWalkSpriteSet = Record<WalkFrameKey, SpriteFrame>;
type BlastAnimationContext = {
	explosion: ExplosionEvent;
	spriteFrameIndex: number;
};
type PlayerTimeline = {
	positions: string[];
	opacities: string[];
	spriteRefs: string[];
};
type SvgRenderContext = {
	store: BombermanStore;
	theme: GameTheme;
	cellEventsByPosition: Map<string, CellEvent[]>;
	totalDurationMs: number;
};

interface SvgLayerRenderer {
	render(context: SvgRenderContext): string;
}

class MonthLabelsLayerRenderer implements SvgLayerRenderer {
	render({ store, theme }: SvgRenderContext) {
		if (store.config.showMonthLabels === false) return '';
		let svg = '';
		let lastMonth = '';
		for (let x = 0; x < GRID_WIDTH; x++) {
			if (store.monthLabels[x] === lastMonth) continue;
			const xPos = x * (CELL_SIZE + GAP_SIZE) + CELL_SIZE / 2;
			svg += `<text x="${xPos}" y="${SVG.MONTH_LABEL_Y}" text-anchor="middle" font-size="${SVG.MONTH_LABEL_FONT_SIZE}" fill="${theme.textColor}">${store.monthLabels[x]}</text>`;
			lastMonth = store.monthLabels[x];
		}
		return svg;
	}
}

class GridLayerRenderer implements SvgLayerRenderer {
	render({ store, theme, cellEventsByPosition, totalDurationMs }: SvgRenderContext) {
		let svg = '';
		for (let x = 0; x < GRID_WIDTH; x++) {
			for (let y = 0; y < GRID_HEIGHT; y++) {
				const colorAnim = getCellAnimationData(store, x, y, cellEventsByPosition);
				svg += `<rect id="c-${x}-${y}" x="${toSvgX(x)}" y="${toSvgY(y)}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="${SVG.CELL_RADIUS}" fill="${store.initialColors[x]?.[y] ?? theme.intensityColors[0]}">`;
				if (colorAnim) {
					svg += `<animate attributeName="fill" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite" values="${colorAnim.values}" keyTimes="${colorAnim.keyTimes}"/>`;
				}
				svg += `</rect>`;
			}
		}
		return svg;
	}
}

class BombLayerRenderer implements SvgLayerRenderer {
	render({ store, totalDurationMs }: SvgRenderContext) {
		let svg = '';
		const totalFrames = store.gameHistory.length;
		for (const { bomb, startFrame, endFrameExclusive, positions } of collectBombs(store)) {
			const opacityAnim = buildVisibilityAnimation(totalFrames, startFrame, endFrameExclusive);
			const initialOpacity = startFrame === 0 ? '1' : '0';
			svg += `<g id="bomb-${bomb.id}" opacity="${initialOpacity}">`;
			if (opacityAnim) {
				svg += `<animate attributeName="opacity" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite" keyTimes="${opacityAnim.keyTimes}" values="${opacityAnim.values}"/>`;
			}
			svg += renderBombPulse(positions, totalDurationMs);
			svg += `</g>`;
		}
		return svg;
	}
}

class ItemLayerRenderer implements SvgLayerRenderer {
	render({ store, totalDurationMs }: SvgRenderContext) {
		let svg = '';
		const totalFrames = store.gameHistory.length;
		for (const { item, startFrame, endFrameExclusive } of collectItems(store)) {
			const opacityAnim = buildVisibilityAnimation(totalFrames, startFrame, endFrameExclusive);
			const x = toSvgX(item.x) + (CELL_SIZE - SVG.ITEM_WIDTH) / 2;
			const y = toSvgY(item.y) + (CELL_SIZE - SVG.ITEM_HEIGHT) / 2;
			svg += `<use id="item-${item.id}" x="${x}" y="${y}" width="${SVG.ITEM_WIDTH}" height="${SVG.ITEM_HEIGHT}" href="${getItemRef(item.type)}" opacity="${startFrame === 0 ? '1' : '0'}">`;
			if (opacityAnim) {
				svg += `<animate attributeName="opacity" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite" keyTimes="${opacityAnim.keyTimes}" values="${opacityAnim.values}"/>`;
			}
			svg += `</use>`;
		}
		return svg;
	}
}

class ExplosionLayerRenderer implements SvgLayerRenderer {
	render({ store, totalDurationMs }: SvgRenderContext) {
		let svg = '';
		for (const explosion of store.explosionEvents) {
			svg += renderExplosionAnimation(store, explosion, totalDurationMs);
		}
		return svg;
	}
}

class PlayerLayerRenderer implements SvgLayerRenderer {
	render({ store, totalDurationMs }: SvgRenderContext) {
		let svg = '';
		for (const player of store.players) {
			const { positions, opacities, spriteRefs } = getPlayerTimeline(store, player.id);
			const positionAnim = buildStepwiseLinearAnimation(positions);
			const opacityAnim = buildChangingValuesAnimation(opacities);
			const spriteAnim = buildChangingValuesAnimation(spriteRefs);

			svg += `<use id="player-${player.id}" x="${-SVG.PLAYER_SPRITE_WIDTH / 2}" y="${-SVG.PLAYER_SPRITE_HEIGHT + CELL_SIZE / 2}" width="${SVG.PLAYER_SPRITE_WIDTH}" height="${SVG.PLAYER_SPRITE_HEIGHT}" href="${spriteRefs[0] ?? getDefaultPlayerRef(player.id)}" opacity="${opacities[0] ?? '0'}" transform="translate(${positions[0] ?? '0 0'})">`;
			if (spriteAnim) {
				svg += `<animate attributeName="href" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite" keyTimes="${spriteAnim.keyTimes}" values="${spriteAnim.values}"/>`;
			}
			if (opacityAnim) {
				svg += `<animate attributeName="opacity" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite" keyTimes="${opacityAnim.keyTimes}" values="${opacityAnim.values}"/>`;
			}
			if (positionAnim) {
				svg += `<animateTransform attributeName="transform" type="translate" calcMode="linear" dur="${totalDurationMs}ms" repeatCount="indefinite" keyTimes="${positionAnim.keyTimes}" values="${positionAnim.values}"/>`;
			}
			svg += `</use>`;
		}
		return svg;
	}
}

const SVG_LAYERS: readonly SvgLayerRenderer[] = [
	new MonthLabelsLayerRenderer(),
	new GridLayerRenderer(),
	new BombLayerRenderer(),
	new ItemLayerRenderer(),
	new ExplosionLayerRenderer(),
	new PlayerLayerRenderer()
];

const createPlayerChains = (playerId: PlayerState['id'], spriteSet: PlayerWalkSpriteSet) => {
	const createChain = (prefix: string, frames: SpriteFrame[], flipX = false) =>
		frames.map((frame, i) => ({ id: `bm-player-${playerId}-${prefix}-${i}`, frame, flipX }));

	return {
		down: createChain('down', [spriteSet.walkDown0, spriteSet.walkDown1, spriteSet.walkDown2, spriteSet.walkDown3]),
		up: createChain('up', [spriteSet.walkUp0, spriteSet.walkUp1, spriteSet.walkUp2, spriteSet.walkUp3]),
		left: createChain(
			'left',
			[
				spriteSet.walkRight0,
				spriteSet.walkRight1,
				spriteSet.walkRight2,
				spriteSet.walkRight3,
				spriteSet.walkRight4,
				spriteSet.walkRight5
			],
			true
		),
		right: createChain('right', [
			spriteSet.walkRight0,
			spriteSet.walkRight1,
			spriteSet.walkRight2,
			spriteSet.walkRight3,
			spriteSet.walkRight4,
			spriteSet.walkRight5
		])
	};
};

const PLAYER_SPRITE_CHAINS: Record<PlayerState['id'], Record<PlayerState['direction'], SpriteCycle>> = {
	1: createPlayerChains(1, SPRITE_SETS.player),
	2: createPlayerChains(2, SPRITE_SETS.plunderBomber)
};

const PLAYER_DEATH_SPRITE_CHAINS: Record<PlayerState['id'], SpriteCycle> = {
	1: [
		SPRITE_SETS.player.death0,
		SPRITE_SETS.player.death1,
		SPRITE_SETS.player.death2,
		SPRITE_SETS.player.death3,
		SPRITE_SETS.player.death4
	].map((frame, i) => ({ id: `bm-player-1-death-${i}`, frame })),
	2: [
		SPRITE_SETS.plunderBomber.death0,
		SPRITE_SETS.plunderBomber.death1,
		SPRITE_SETS.plunderBomber.death2,
		SPRITE_SETS.plunderBomber.death3
	].map((frame, i) => ({ id: `bm-player-2-death-${i}`, frame }))
};

const BOMB_SPRITE: SpriteSymbol = { id: 'bm-bomb', frame: SPRITE_SETS.explosions.bombs.fuse0 };

const BLAST_SPRITES: Record<BlastSpriteKind, SpriteCycle> = {
	center: SPRITE_SETS.explosions.blast.center.map((frame, index) => ({
		id: `bm-blast-center-${index}`,
		frame,
		preserveAspectRatio: 'none'
	})),
	segment: SPRITE_SETS.explosions.blast.segment.map((frame, index) => ({
		id: `bm-blast-segment-${index}`,
		frame,
		preserveAspectRatio: 'none'
	})),
	end: SPRITE_SETS.explosions.blast.end.map((frame, index) => ({
		id: `bm-blast-end-${index}`,
		frame,
		preserveAspectRatio: 'none'
	}))
};

const ITEM_SPRITES = Object.fromEntries(
	Object.entries(ITEM_DEFINITIONS).map(([type, definition]) => [type, { id: `bm-item-${type}`, frame: definition.sprite }])
) as Record<ItemState['type'], SpriteSymbol>;

const toSvgX = (gx: number) => gx * (CELL_SIZE + GAP_SIZE);
const toSvgY = (gy: number) => gy * (CELL_SIZE + GAP_SIZE) + SVG.HEADER_HEIGHT;

const generateAnimatedSVG = (store: BombermanStore): string => {
	const svgWidth = GRID_WIDTH * (CELL_SIZE + GAP_SIZE);
	const svgHeight = GRID_HEIGHT * (CELL_SIZE + GAP_SIZE) + SVG.HEADER_HEIGHT;
	const totalFrames = store.gameHistory.length;
	const totalDurationMs = Math.max((totalFrames * DELTA_TIME) / SVG.DURATION_SPEED_DIVISOR, SVG.MIN_DURATION_MS);
	const theme = Utils.getCurrentTheme(store);
	const cellEventsByPosition = indexCellEvents(store.cellEvents);
	const context = { store, theme, cellEventsByPosition, totalDurationMs };

	let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" color-interpolation="sRGB">`;
	svg += `<style>image { image-rendering: pixelated; image-rendering: -moz-crisp-edges; }</style>`;
	svg += buildSpriteDefs(store);
	svg += `<rect width="100%" height="100%" fill="${theme.gridBackground}"/>`;

	for (const layer of SVG_LAYERS) {
		svg += layer.render(context);
	}

	svg += '</svg>';
	return minifySvg(svg);
};

const minifySvg = (svg: string): string =>
	svg
		.replace(/>\s+</g, '><')
		.replace(/\s{2,}/g, ' ')
		.replace(/\s\/>/g, '/>')
		.trim();

const getCellAnimationData = (store: BombermanStore, x: number, y: number, eventsByPosition: Map<string, CellEvent[]>) => {
	const totalFrames = store.gameHistory.length;
	const initialColor = store.initialColors[x]?.[y] ?? Utils.getCurrentTheme(store).intensityColors[0];
	const events = eventsByPosition.get(cellEventKey(x, y));

	if (!events || events.length === 0) return null;

	return buildFrameValueAnimation(
		totalFrames,
		initialColor,
		events.map((event) => ({ frameIndex: event.frameIndex, value: event.color }))
	);
};

type BombRenderEvent = {
	bomb: BombState;
	startFrame: number;
	endFrameExclusive: number;
	positions: string[];
};

type ItemRenderEvent = {
	item: ItemState;
	startFrame: number;
	endFrameExclusive: number;
};

const collectBombs = (store: BombermanStore): BombRenderEvent[] => {
	const bombs = new Map<number, BombRenderEvent>();
	const totalFrames = store.gameHistory.length;
	for (let frameIndex = 0; frameIndex < store.gameHistory.length; frameIndex++) {
		const frame = store.gameHistory[frameIndex];
		for (const bomb of frame.bombs) {
			const existing = bombs.get(bomb.id);
			if (existing) {
				existing.endFrameExclusive = frameIndex + 1;
				existing.positions[frameIndex] = centerPosition(bomb.x, bomb.y);
			} else {
				const position = getInitialBombRenderPosition(bomb);
				const positions = Array<string>(totalFrames);
				positions[frameIndex] = position;
				bombs.set(bomb.id, {
					bomb,
					startFrame: frameIndex,
					endFrameExclusive: frameIndex + 1,
					positions
				});
			}
		}
	}
	for (const event of bombs.values()) {
		let lastPosition = event.positions[event.startFrame] ?? centerPosition(event.bomb.x, event.bomb.y);
		for (let frameIndex = 0; frameIndex < event.startFrame; frameIndex++) {
			event.positions[frameIndex] = lastPosition;
		}
		for (let frameIndex = event.startFrame; frameIndex < totalFrames; frameIndex++) {
			lastPosition = event.positions[frameIndex] ?? lastPosition;
			event.positions[frameIndex] = lastPosition;
		}
	}
	return Array.from(bombs.values());
};

const getInitialBombRenderPosition = (bomb: BombState) => {
	if (!bomb.kickDirection) return centerPosition(bomb.x, bomb.y);

	const source = getKickSourcePosition(bomb, bomb.kickDirection);
	if (source.x < 0 || source.x >= GRID_WIDTH || source.y < 0 || source.y >= GRID_HEIGHT) {
		return centerPosition(bomb.x, bomb.y);
	}

	return centerPosition(source.x, source.y);
};

const getKickSourcePosition = (bomb: BombState, kickDirection: Direction) => {
	const vector = KICK_SOURCE_OFFSETS[kickDirection];
	return {
		x: bomb.x + vector.x,
		y: bomb.y + vector.y
	};
};

const KICK_SOURCE_OFFSETS: Record<Direction, { x: number; y: number }> = {
	up: { x: 0, y: 1 },
	down: { x: 0, y: -1 },
	left: { x: 1, y: 0 },
	right: { x: -1, y: 0 }
};

const collectItems = (store: BombermanStore): ItemRenderEvent[] => {
	const items = new Map<number, ItemRenderEvent>();

	for (let frameIndex = 0; frameIndex < store.gameHistory.length; frameIndex++) {
		const frame = store.gameHistory[frameIndex];
		for (const item of frame.items) {
			if (item.hidden || item.collected || item.destroyed) continue;

			const existing = items.get(item.id);
			if (existing) {
				existing.endFrameExclusive = frameIndex + 1;
			} else {
				items.set(item.id, {
					item,
					startFrame: frameIndex,
					endFrameExclusive: frameIndex + 1
				});
			}
		}
	}

	return Array.from(items.values());
};

const getPlayerTimeline = (store: BombermanStore, playerId: PlayerState['id']): PlayerTimeline => {
	const deathFrameIndex = getPlayerDeathFrameIndex(store, playerId);
	const positions: string[] = [];
	const opacities: string[] = [];
	const spriteRefs: string[] = [];
	let previousPlayer: PlayerState | undefined;

	store.gameHistory.forEach((frame, frameIndex) => {
		const player = frame.players.find((candidate) => candidate.id === playerId);
		positions.push(player ? centerPosition(player.x, player.y) : '0 0');

		if (!player) {
			opacities.push('0');
			spriteRefs.push(getDefaultPlayerRef(playerId));
			previousPlayer = undefined;
			return;
		}

		if (player.alive) {
			const moving = Boolean(previousPlayer && (previousPlayer.x !== player.x || previousPlayer.y !== player.y));
			const cycle = PLAYER_SPRITE_CHAINS[playerId][player.direction];
			const spriteIndex = moving ? Math.floor(frameIndex / SVG.PLAYER_SPRITE_FRAME_INTERVAL) % cycle.length : 0;
			opacities.push('1');
			spriteRefs.push(toSpriteRef(cycle[spriteIndex]));
			previousPlayer = player;
			return;
		}

		if (deathFrameIndex === null) {
			opacities.push('0');
			spriteRefs.push(getDefaultPlayerRef(playerId));
			previousPlayer = player;
			return;
		}

		const deathFrame = frameIndex - deathFrameIndex;
		const deathChain = PLAYER_DEATH_SPRITE_CHAINS[playerId];
		const deathSpriteIndex = Math.min(Math.max(deathFrame, 0), deathChain.length - 1);
		opacities.push(deathFrame >= 0 && deathFrame < deathChain.length ? '1' : '0');
		spriteRefs.push(toSpriteRef(deathChain[deathSpriteIndex]));
		previousPlayer = player;
	});

	return { positions, opacities, spriteRefs };
};

const getPlayerDeathFrameIndex = (store: BombermanStore, playerId: PlayerState['id']): number | null => {
	for (let frameIndex = 1; frameIndex < store.gameHistory.length; frameIndex++) {
		const previousPlayer = store.gameHistory[frameIndex - 1].players.find((candidate) => candidate.id === playerId);
		const currentPlayer = store.gameHistory[frameIndex].players.find((candidate) => candidate.id === playerId);

		if (previousPlayer?.alive && currentPlayer && !currentPlayer.alive) return frameIndex;
	}

	return null;
};

const centerPosition = (x: number, y: number) => `${toSvgX(x) + CELL_SIZE / 2} ${toSvgY(y) + CELL_SIZE / 2}`;

const renderBombPulse = (positions: string[], totalDurationMs: number) => {
	const scaledWidth = Number((SVG.BOMB_WIDTH * SVG.BOMB_PULSE_SCALE).toFixed(SVG.PRECISION));
	const scaledHeight = Number((SVG.BOMB_HEIGHT * SVG.BOMB_PULSE_SCALE).toFixed(SVG.PRECISION));
	const scaledX = Number((SVG.BOMB_X - (scaledWidth - SVG.BOMB_WIDTH) / 2).toFixed(SVG.PRECISION));
	const scaledY = Number((SVG.BOMB_Y - (scaledHeight - SVG.BOMB_HEIGHT) / 2).toFixed(SVG.PRECISION));
	const ref = getDefaultBombRef();
	const baseX = getOffsetPositionAnimation(positions, SVG.BOMB_X, 'x');
	const baseY = getOffsetPositionAnimation(positions, SVG.BOMB_Y, 'y');
	const scaledXAnim = getOffsetPositionAnimation(positions, scaledX, 'x');
	const scaledYAnim = getOffsetPositionAnimation(positions, scaledY, 'y');

	return [
		`<use x="${baseX.initial}" y="${baseY.initial}" width="${SVG.BOMB_WIDTH}" height="${SVG.BOMB_HEIGHT}" href="${ref}" opacity="1">${renderPositionAttributeAnimation('x', baseX.animation, totalDurationMs)}${renderPositionAttributeAnimation('y', baseY.animation, totalDurationMs)}<animate attributeName="opacity" calcMode="discrete" dur="${SVG.BOMB_PULSE_DURATION_MS}ms" repeatCount="indefinite" keyTimes="0;0.5;1" values="1;0;1"/></use>`,
		`<use x="${scaledXAnim.initial}" y="${scaledYAnim.initial}" width="${scaledWidth}" height="${scaledHeight}" href="${ref}" opacity="0">${renderPositionAttributeAnimation('x', scaledXAnim.animation, totalDurationMs)}${renderPositionAttributeAnimation('y', scaledYAnim.animation, totalDurationMs)}<animate attributeName="opacity" calcMode="discrete" dur="${SVG.BOMB_PULSE_DURATION_MS}ms" repeatCount="indefinite" keyTimes="0;0.5;1" values="0;1;0"/></use>`
	].join('');
};

const getOffsetPositionAnimation = (positions: string[], offset: number, axis: 'x' | 'y') => {
	const axisIndex = axis === 'x' ? 0 : 1;
	const values = positions.map((position) => {
		const coordinate = Number(position.split(' ')[axisIndex] ?? 0);
		return `${Number((coordinate + offset).toFixed(SVG.PRECISION))}`;
	});
	return {
		initial: values[0] ?? `${offset}`,
		animation: buildChangingValuesAnimation(values)
	};
};

const renderPositionAttributeAnimation = (
	attributeName: 'x' | 'y',
	animation: ReturnType<typeof buildChangingValuesAnimation>,
	totalDurationMs: number
) =>
	animation
		? `<animate attributeName="${attributeName}" calcMode="linear" dur="${totalDurationMs}ms" repeatCount="indefinite" keyTimes="${animation.keyTimes}" values="${animation.values}"/>`
		: '';

const renderExplosionAnimation = (store: BombermanStore, explosion: ExplosionEvent, totalDurationMs: number) => {
	const totalFrames = store.gameHistory.length;
	let svg = '';

	for (let elapsedFrame = 0; elapsedFrame < explosion.remainingFrames; elapsedFrame++) {
		const startFrame = explosion.frameIndex + elapsedFrame;
		const endFrameExclusive = startFrame + 1;
		if (startFrame >= totalFrames) break;

		const opacityAnim = buildValueWindowAnimation(
			totalFrames,
			startFrame,
			Math.min(endFrameExclusive, totalFrames),
			`${SVG.EXPLOSION_OPACITY}`
		);
		const initialOpacity = startFrame === 0 ? `${SVG.EXPLOSION_OPACITY}` : '0';

		svg += `<g opacity="${initialOpacity}">`;
		svg += `<use href="#${getExplosionShapeId(explosion, elapsedFrame)}" transform="translate(${centerPosition(explosion.x, explosion.y)})"/>`;
		if (opacityAnim) {
			svg += `<animate attributeName="opacity" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite" keyTimes="${opacityAnim.keyTimes}" values="${opacityAnim.values}"/>`;
		}
		svg += `</g>`;
	}

	return svg;
};

const renderExplosionShape = (animation: BlastAnimationContext) => {
	const { explosion } = animation;
	const arms = getExplosionArmLengths(explosion);
	const activeArms = (
		[
			['left', arms.left],
			['right', arms.right],
			['up', arms.up],
			['down', arms.down]
		] as [BlastDirection, number][]
	).filter(([, length]) => length > 0);

	return [
		...activeArms.map(([direction, length]) => renderBlastArmBody(animation, direction, length)),
		...renderBlastCenterConnectors(animation, arms),
		...activeArms.map(([direction, length]) => {
			const endPosition = getExplosionArmOffset(direction, length);
			return renderBlastSprite('end', endPosition.x, endPosition.y, direction, animation);
		}),
		renderBlastSprite('center', 0, 0, 'right', animation)
	].join('');
};

const getExplosionArmOffset = (direction: BlastDirection, distance: number) => {
	switch (direction) {
		case 'left':
			return { x: -distance, y: 0 };
		case 'right':
			return { x: distance, y: 0 };
		case 'up':
			return { x: 0, y: -distance };
		case 'down':
			return { x: 0, y: distance };
	}
};

const renderBlastSprite = (kind: BlastSpriteKind, x: number, y: number, direction: BlastDirection, animation: BlastAnimationContext) => {
	const placement = getBlastPlacement(kind, x, y, direction);
	const rotation = placement.degrees === 0 ? '' : ` transform="rotate(${placement.degrees} ${placement.centerX} ${placement.centerY})"`;
	return `<use x="${placement.x}" y="${placement.y}" width="${placement.width}" height="${placement.height}" href="${getStaticBlastRef(kind, animation)}"${rotation}/>`;
};

const renderBlastArmBody = (animation: BlastAnimationContext, direction: BlastDirection, length: number) => {
	const placement = getBlastArmBodyPlacement(direction, length);
	const rotation = placement.degrees === 0 ? '' : ` transform="rotate(${placement.degrees} ${placement.centerX} ${placement.centerY})"`;
	return `<use x="${placement.x}" y="${placement.y}" width="${placement.width}" height="${placement.height}" href="${getStaticBlastRef('segment', animation)}"${rotation}/>`;
};

const getBlastPlacement = (kind: BlastSpriteKind, x: number, y: number, direction: BlastDirection) => {
	const cellStep = CELL_SIZE + GAP_SIZE;
	const cellCenterX = x * cellStep;
	const cellCenterY = y * cellStep;
	const cellX = cellCenterX - CELL_SIZE / 2;
	const cellY = cellCenterY - CELL_SIZE / 2;

	if (kind === 'center') {
		const size = SVG.BLAST_THICKNESS;
		return {
			x: cellCenterX - size / 2,
			y: cellCenterY - size / 2,
			width: size,
			height: size,
			centerX: cellCenterX,
			centerY: cellCenterY,
			degrees: 0
		};
	}

	const axisLength = CELL_SIZE;
	const thickness = SVG.BLAST_THICKNESS;

	switch (direction) {
		case 'left':
			return {
				x: cellX,
				y: cellCenterY - thickness / 2,
				width: axisLength,
				height: thickness,
				centerX: cellX + axisLength / 2,
				centerY: cellCenterY,
				degrees: 180
			};
		case 'right':
			return {
				x: cellX,
				y: cellCenterY - thickness / 2,
				width: axisLength,
				height: thickness,
				centerX: cellX + axisLength / 2,
				centerY: cellCenterY,
				degrees: 0
			};
		case 'up':
			return {
				x: cellCenterX - axisLength / 2,
				y: cellCenterY - thickness / 2,
				width: axisLength,
				height: thickness,
				centerX: cellCenterX,
				centerY: cellCenterY,
				degrees: -90
			};
		case 'down':
			return {
				x: cellCenterX - axisLength / 2,
				y: cellCenterY - thickness / 2,
				width: axisLength,
				height: thickness,
				centerX: cellCenterX,
				centerY: cellCenterY,
				degrees: 90
			};
	}
};

const renderBlastCenterConnectors = (animation: BlastAnimationContext, arms: ReturnType<typeof getExplosionArmLengths>) => {
	const connectors: string[] = [];
	if (arms.left > 0 || arms.right > 0) connectors.push(renderBlastCenterConnector(animation, 'horizontal'));
	if (arms.up > 0 || arms.down > 0) connectors.push(renderBlastCenterConnector(animation, 'vertical'));
	return connectors;
};

const renderBlastCenterConnector = (animation: BlastAnimationContext, axis: 'horizontal' | 'vertical') => {
	const placement = getBlastCenterConnectorPlacement(axis);
	const rotation = placement.degrees === 0 ? '' : ` transform="rotate(${placement.degrees} ${placement.centerX} ${placement.centerY})"`;
	return `<use x="${placement.x}" y="${placement.y}" width="${placement.width}" height="${placement.height}" href="${getStaticBlastRef('segment', animation)}"${rotation}/>`;
};

const getBlastCenterConnectorPlacement = (axis: 'horizontal' | 'vertical') => {
	const cellX = -CELL_SIZE / 2;
	const cellY = -CELL_SIZE / 2;
	const cellCenterX = 0;
	const cellCenterY = 0;
	const thickness = SVG.BLAST_THICKNESS;

	return {
		x: cellX,
		y: cellCenterY - thickness / 2,
		width: CELL_SIZE,
		height: thickness,
		centerX: cellCenterX,
		centerY: cellCenterY,
		degrees: axis === 'horizontal' ? 0 : 90
	};
};

const getBlastArmBodyPlacement = (direction: BlastDirection, length: number) => {
	const originCenterX = 0;
	const originCenterY = 0;
	const cellStep = CELL_SIZE + GAP_SIZE;
	const end = getExplosionArmOffset(direction, length);
	const endCenterX = end.x * cellStep;
	const endCenterY = end.y * cellStep;
	const thickness = SVG.BLAST_THICKNESS;

	if (direction === 'left' || direction === 'right') {
		const left = Math.min(originCenterX, endCenterX);
		const right = Math.max(originCenterX, endCenterX);
		return {
			x: left,
			y: originCenterY - thickness / 2,
			width: right - left,
			height: thickness,
			centerX: (left + right) / 2,
			centerY: originCenterY,
			degrees: direction === 'left' ? 180 : 0
		};
	}

	const top = Math.min(originCenterY, endCenterY);
	const bottom = Math.max(originCenterY, endCenterY);
	return {
		x: originCenterX - (bottom - top) / 2,
		y: (top + bottom) / 2 - thickness / 2,
		width: bottom - top,
		height: thickness,
		centerX: originCenterX,
		centerY: (top + bottom) / 2,
		degrees: direction === 'up' ? -90 : 90
	};
};

const getExplosionArmLengths = (explosion: ExplosionEvent) => {
	let left = 0;
	let right = 0;
	let up = 0;
	let down = 0;

	for (const cell of explosion.affectedCells) {
		if (cell.y === explosion.y) {
			if (cell.x < explosion.x) left = Math.max(left, explosion.x - cell.x);
			if (cell.x > explosion.x) right = Math.max(right, cell.x - explosion.x);
		}
		if (cell.x === explosion.x) {
			if (cell.y < explosion.y) up = Math.max(up, explosion.y - cell.y);
			if (cell.y > explosion.y) down = Math.max(down, cell.y - explosion.y);
		}
	}

	return { left, right, up, down };
};

const indexCellEvents = (events: CellEvent[]) => {
	const eventsByPosition = new Map<string, CellEvent[]>();
	for (const event of events) {
		const key = cellEventKey(event.x, event.y);
		const cellEvents = eventsByPosition.get(key);
		if (cellEvents) {
			cellEvents.push(event);
		} else {
			eventsByPosition.set(key, [event]);
		}
	}
	return eventsByPosition;
};

const cellEventKey = (x: number, y: number) => `${x}:${y}`;

const getExplosionShapeId = (explosion: ExplosionEvent, spriteFrameIndex: number) => {
	const arms = getExplosionArmLengths(explosion);
	return `bm-explosion-shape-${normalizeBlastFrameIndex(spriteFrameIndex)}-${arms.left}-${arms.right}-${arms.up}-${arms.down}`;
};

const normalizeBlastFrameIndex = (spriteFrameIndex: number) => spriteFrameIndex % BLAST_SPRITES.center.length;

const getStaticBlastRef = (kind: BlastSpriteKind, { spriteFrameIndex }: BlastAnimationContext) => {
	const cycle = BLAST_SPRITES[kind];
	return toSpriteRef(cycle[spriteFrameIndex % cycle.length]);
};

const buildSpriteDefs = (store: BombermanStore) => {
	const symbols = new Map<string, SpriteSymbol>();
	for (const playerChains of Object.values(PLAYER_SPRITE_CHAINS)) {
		for (const cycle of Object.values(playerChains)) {
			for (const sprite of cycle) symbols.set(sprite.id, sprite);
		}
	}
	for (const cycle of Object.values(PLAYER_DEATH_SPRITE_CHAINS)) {
		for (const sprite of cycle) symbols.set(sprite.id, sprite);
	}
	symbols.set(BOMB_SPRITE.id, BOMB_SPRITE);
	for (const cycle of Object.values(BLAST_SPRITES)) {
		for (const sprite of cycle) symbols.set(sprite.id, sprite);
	}
	for (const sprite of Object.values(ITEM_SPRITES)) symbols.set(sprite.id, sprite);

	const spriteDefs = Array.from(symbols.entries())
		.map(
			([
				id,
				sprite
			]) => `<symbol id="${id}" viewBox="0 0 ${sprite.frame.width} ${sprite.frame.height}" overflow="visible"${sprite.preserveAspectRatio ? ` preserveAspectRatio="${sprite.preserveAspectRatio}"` : ''}>
				<image width="${sprite.frame.width}" height="${sprite.frame.height}" href="${sprite.frame.data}" preserveAspectRatio="xMidYMid meet" style="image-rendering: pixelated;"${sprite.flipX ? ` transform="translate(${sprite.frame.width} 0) scale(-1 1)"` : ''}/>
			</symbol>`
		)
		.join('');

	return `<defs>${spriteDefs}${buildExplosionShapeDefs(store)}</defs>`;
};

const buildExplosionShapeDefs = (store: BombermanStore) => {
	const shapeDefs = new Map<string, string>();

	for (const explosion of store.explosionEvents) {
		for (let elapsedFrame = 0; elapsedFrame < explosion.remainingFrames; elapsedFrame++) {
			const spriteFrameIndex = normalizeBlastFrameIndex(elapsedFrame);
			const id = getExplosionShapeId(explosion, spriteFrameIndex);
			if (shapeDefs.has(id)) continue;
			shapeDefs.set(id, `<g id="${id}">${renderExplosionShape({ explosion, spriteFrameIndex })}</g>`);
		}
	}

	return Array.from(shapeDefs.values()).join('');
};

const toSpriteRef = (sprite: SpriteSymbol) => `#${sprite.id}`;

const getDefaultPlayerRef = (playerId: PlayerState['id']) => toSpriteRef(PLAYER_SPRITE_CHAINS[playerId].down[0]);

const getDefaultBombRef = () => toSpriteRef(BOMB_SPRITE);

const getItemRef = (type: ItemState['type']) => toSpriteRef(ITEM_SPRITES[type]);

export const Renderer = {
	generateAnimatedSVG
};
