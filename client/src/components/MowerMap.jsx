import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MowerMap = ({
    position = { x: 0, y: 0 },
    battery,
    mode = 'Shape',
    shape = 'Square',
    text = ''
}) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 600;
        const height = 400;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous

        // 1. Draw Lawn Background
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "#dcfce7")
            .attr("stroke", "#16a34a")
            .attr("stroke-width", 5);

        // 2. Draw Grid
        const gridSize = 40;
        for (let x = 0; x <= width; x += gridSize) {
            svg.append("line").attr("x1", x).attr("y1", 0).attr("x2", x).attr("y2", height)
                .attr("stroke", "#86efac").attr("stroke-width", 1);
        }
        for (let y = 0; y <= height; y += gridSize) {
            svg.append("line").attr("x1", 0).attr("y1", y).attr("x2", width).attr("y2", y)
                .attr("stroke", "#86efac").attr("stroke-width", 1);
        }

        // 3. Draw Projected Path (Visualization)
        const pathGroup = svg.append("g").attr("class", "path-layer");

        if (mode === 'Shape') {
            const center = { x: width / 2, y: height / 2 };
            const size = 100;
            let d = "";

            if (shape === 'Square') {
                d = `M ${center.x - size},${center.y - size} h ${size * 2} v ${size * 2} h -${size * 2} z`;
            } else if (shape === 'Triangle') {
                d = `M ${center.x},${center.y - size} L ${center.x + size},${center.y + size} L ${center.x - size},${center.y + size} z`;
            } else if (shape === 'Circle') {
                pathGroup.append("circle")
                    .attr("cx", center.x)
                    .attr("cy", center.y)
                    .attr("r", size)
                    .attr("fill", "none")
                    .attr("stroke", "rgba(22, 163, 74, 0.4)")
                    .attr("stroke-width", 40) // Wide cut path
                    .attr("stroke-dasharray", "10,5");
            } else if (shape === 'Star') {
                // Simplified star path
                d = `M ${center.x},${center.y - size} 
                  L ${center.x + size * 0.3},${center.y - size * 0.3} 
                  L ${center.x + size},${center.y - size * 0.3} 
                  L ${center.x + size * 0.5},${center.y + size * 0.2} 
                  L ${center.x + size * 0.8},${center.y + size} 
                  L ${center.x},${center.y + size * 0.6} 
                  L ${center.x - size * 0.8},${center.y + size} 
                  L ${center.x - size * 0.5},${center.y + size * 0.2} 
                  L ${center.x - size},${center.y - size * 0.3} 
                  L ${center.x - size * 0.3},${center.y - size * 0.3} z`;
            }

            if (d && shape !== 'Circle') {
                pathGroup.append("path")
                    .attr("d", d)
                    .attr("fill", "none")
                    .attr("stroke", "rgba(22, 163, 74, 0.4)")
                    .attr("stroke-width", 40)
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-dasharray", "10,5");
            }
        } else if (mode === 'Text' && text) {
            // Draw Text Path
            pathGroup.append("text")
                .attr("x", width / 2)
                .attr("y", height / 2 + 20) // approximate center vertical alignment
                .attr("text-anchor", "middle")
                .attr("font-family", "monospace")
                .attr("font-weight", "bold")
                .attr("font-size", "120px")
                .attr("fill", "rgba(22, 163, 74, 0.2)") // Cut grass look
                .attr("stroke", "rgba(22, 163, 74, 0.6)")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "5,5")
                .text(text);
        }

        // 4. Draw Mower (Data driven)
        // Handle both structure: {x,y} from Simulator or {positionX, positionY} from Monitor
        // Actually Monitor.jsx passes {x: positionX, y: positionY} constructed, or raw?
        // Let's rely on props being passed as {x,y}
        const posX = position.x ?? position.positionX ?? 0;
        const posY = position.y ?? position.positionY ?? 0;

        const mowerX = posX * gridSize + (gridSize / 2);
        const mowerY = posY * gridSize + (gridSize / 2);

        const mowerGroup = svg.append("g")
            .attr("transform", `translate(${mowerX}, ${mowerY})`);

        // Mower Body
        mowerGroup.append("circle")
            .attr("r", 15)
            .attr("fill", "#ef4444")
            .attr("stroke", "#991b1b")
            .attr("stroke-width", 2);

        // Direction Line
        mowerGroup.append("line")
            .attr("x1", 0).attr("y1", 0).attr("x2", 20).attr("y2", 0)
            .attr("stroke", "black").attr("stroke-width", 2);

    }, [position, mode, shape, text]);

    return (
        <div className="flex flex-col items-center justify-center p-2 rounded-xl">
            <svg
                ref={svgRef}
                viewBox="0 0 600 400"
                className="w-full h-full bg-grass-50 rounded-lg shadow-inner"
                preserveAspectRatio="xMidYMid meet"
            />
            <div className="mt-4 text-xs font-mono text-slate-400">
                POS: [{position.x || position.positionX}, {position.y || position.positionY}] | BAT: {battery}%
            </div>
        </div>
    );
};

export default MowerMap;
