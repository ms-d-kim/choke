"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";
import { graphLinks, graphNodes } from "@/data";
import type { Direction, GraphNode } from "@/data";
import { DIRECTION_SCORE } from "@/lib/scenario";

type SimNode = GraphNode & {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};
type SimLink = { source: SimNode | string; target: SimNode | string; kind: string };

function radiusFor(n: GraphNode) {
  if (n.type === "hub") return 30;
  if (n.type === "chokepoint") return 22;
  return 8;
}

function chokepointTone(push?: Direction) {
  if (!push) return { ring: "#ff9e1b", fill: "#1c1606" };
  const s = DIRECTION_SCORE[push];
  if (s > 0) return { ring: "#ff4338", fill: "#220b09" }; // tighten → red
  if (s < 0) return { ring: "#25d366", fill: "#08170e" }; // ease → green
  return { ring: "#ff9e1b", fill: "#1c1606" };
}

const ROLE_COLOR: Record<string, string> = {
  long: "#25d366",
  watch: "#ffcf4a",
  pressured: "#ff4338",
  core: "#ff9e1b",
};

export function ValueChainGraph({
  impacts,
  loading,
  onSelect,
}: {
  impacts?: Record<string, Direction>;
  loading?: boolean;
  onSelect?: (id: string, type: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(840);
  const [height, setHeight] = useState(460);
  const [, setVersion] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const dragRef = useRef<string | null>(null);
  const movedRef = useRef(false);

  const { nodes, links, nodeById, adjacency } = useMemo(() => {
    const nodes: SimNode[] = graphNodes.map((n, i) => ({
      ...n,
      x: 420 + Math.cos((i / graphNodes.length) * Math.PI * 2) * 150,
      y: 230 + Math.sin((i / graphNodes.length) * Math.PI * 2) * 130,
    }));
    const nodeById: Record<string, SimNode> = Object.fromEntries(
      nodes.map((n) => [n.id, n]),
    );
    const links: SimLink[] = graphLinks.map((l) => ({ ...l }));
    const adjacency: Record<string, Set<string>> = {};
    for (const l of graphLinks) {
      (adjacency[l.source] ??= new Set()).add(l.target);
      (adjacency[l.target] ??= new Set()).add(l.source);
    }
    return { nodes, links, nodeById, adjacency };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const simRef = useRef<any>(null);

  useEffect(() => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const sim: any = (forceSimulation as any)(nodes)
      .force(
        "link",
        (forceLink as any)(links)
          .id((d: any) => d.id)
          .distance((l: any) => (l.kind === "supplies" ? 64 : 150))
          .strength(0.45),
      )
      .force(
        "charge",
        (forceManyBody as any)().strength((d: any) =>
          d.type === "company" ? -190 : -780,
        ),
      )
      .force("collide", (forceCollide as any)().radius((d: any) => radiusFor(d) + 12))
      .force("center", (forceCenter as any)(width / 2, height / 2))
      .force("x", (forceX as any)(width / 2).strength(0.05))
      .force("y", (forceY as any)(height / 2).strength(0.06))
      .on("tick", () => setVersion((v) => v + 1));
    simRef.current = sim;
    return () => sim.stop();
    /* eslint-enable @typescript-eslint/no-explicit-any */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links]);

  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;
    sim.force("center", forceCenter(width / 2, height / 2));
    sim.force("x", forceX(width / 2).strength(0.05));
    sim.force("y", forceY(height / 2).strength(0.06));
    sim.alpha(0.25).restart();
  }, [width, height]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect?.width) setWidth(Math.max(320, rect.width));
      if (rect?.height) setHeight(Math.max(360, rect.height));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function toSvg(e: { clientX: number; clientY: number }) {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  function startDrag(e: React.PointerEvent, id: string) {
    e.preventDefault();
    dragRef.current = id;
    movedRef.current = false;
    const p = toSvg(e);
    const n = nodeById[id];
    n.fx = p.x;
    n.fy = p.y;
    svgRef.current?.setPointerCapture(e.pointerId);
    simRef.current?.alphaTarget(0.3).restart();
  }
  function handleMove(e: React.PointerEvent) {
    const id = dragRef.current;
    if (!id) return;
    movedRef.current = true;
    const p = toSvg(e);
    const n = nodeById[id];
    n.fx = p.x;
    n.fy = p.y;
  }
  function endDrag() {
    const id = dragRef.current;
    if (!id) return;
    const n = nodeById[id];
    n.fx = null;
    n.fy = null;
    dragRef.current = null;
    simRef.current?.alphaTarget(0);
  }

  const hoverNode = hover ? nodeById[hover] : null;

  return (
    <div ref={wrapRef} className="relative h-full min-h-[420px] w-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        onPointerMove={handleMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="block touch-none select-none"
      >
        {/* links */}
        {links.map((l, i) => {
          const s = l.source as SimNode;
          const t = l.target as SimNode;
          if (typeof s !== "object" || s.x == null) return null;
          const active = !!hover && (s.id === hover || t.id === hover);
          return (
            <line
              key={i}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke={active ? "#ff9e1b" : "#2c2c32"}
              strokeWidth={active ? 1.6 : 1}
              opacity={hover && !active ? 0.18 : 0.65}
            />
          );
        })}

        {/* nodes */}
        {nodes.map((n) => {
          const r = radiusFor(n);
          const dimmed =
            !!hover && hover !== n.id && !adjacency[hover]?.has(n.id);
          const isChoke = n.type === "chokepoint";
          const isHub = n.type === "hub";
          const tone = isChoke ? chokepointTone(impacts?.[n.id]) : null;
          const fill = isHub ? "#ff9e1b" : isChoke ? tone!.fill : "#101013";
          const stroke = isHub
            ? "#ffd9a0"
            : isChoke
              ? tone!.ring
              : ROLE_COLOR[n.role ?? "core"] ?? "#5a5a62";
          const push = isChoke ? impacts?.[n.id] : undefined;
          const arrow =
            push && DIRECTION_SCORE[push] > 0
              ? "▲"
              : push && DIRECTION_SCORE[push] < 0
                ? "▼"
                : "";
          return (
            <g
              key={n.id}
              transform={`translate(${n.x},${n.y})`}
              style={{ cursor: "pointer", opacity: dimmed ? 0.28 : 1 }}
              onPointerDown={(e) => startDrag(e, n.id)}
              onPointerEnter={() => setHover(n.id)}
              onPointerLeave={() => setHover(null)}
              onClick={() => {
                if (!movedRef.current) onSelect?.(n.id, n.type);
              }}
            >
              <circle
                r={r}
                fill={fill}
                stroke={stroke}
                strokeWidth={isChoke ? 2.5 : isHub ? 2 : 1.5}
              />
              {(isHub || isChoke) && (
                <text
                  textAnchor="middle"
                  dy="0.32em"
                  fontSize={isHub ? 11 : 11}
                  fontWeight={700}
                  fill={isHub ? "#0a0a0a" : "#f3f1ec"}
                  className="font-mono"
                  style={{ pointerEvents: "none" }}
                >
                  {n.label}
                </text>
              )}
              {isChoke && arrow && (
                <text
                  textAnchor="middle"
                  y={-r - 6}
                  fontSize={11}
                  fontWeight={700}
                  fill={tone!.ring}
                  className="font-mono"
                  style={{ pointerEvents: "none" }}
                >
                  {arrow}
                </text>
              )}
              {n.type === "company" && (
                <text
                  textAnchor="middle"
                  y={r + 12}
                  fontSize={9.5}
                  fill={dimmed ? "#5a5a62" : "#b9b7b1"}
                  className="font-mono"
                  style={{ pointerEvents: "none" }}
                >
                  {n.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* hover readout */}
      {hoverNode && (
        <div className="pointer-events-none absolute left-3 top-3 max-w-[240px] border border-border bg-popover/95 px-2.5 py-1.5 backdrop-blur">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-semibold text-foreground">
              {hoverNode.name}
            </span>
            {hoverNode.role && (
              <span
                className="font-mono text-[9px] uppercase tracking-wider"
                style={{ color: ROLE_COLOR[hoverNode.role] }}
              >
                {hoverNode.role}
              </span>
            )}
          </div>
          {hoverNode.blurb && (
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
              {hoverNode.blurb}
            </p>
          )}
          {hoverNode.type === "company" && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Tap to jump to the board.
            </p>
          )}
        </div>
      )}

      {loading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/55 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 border border-amber/30 bg-card px-3 py-1.5 font-mono text-xs text-amber">
            <Loader2 className="size-3.5 animate-spin" />
            simulating…
          </div>
        </div>
      )}
    </div>
  );
}
