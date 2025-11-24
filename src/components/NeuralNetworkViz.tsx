import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';

interface Node {
  id: number;
  x: number;
  y: number;
  layer: number;
  value: number;
  connections: number[];
}

interface Connection {
  from: number;
  to: number;
  weight: number;
  active: boolean;
}

export const NeuralNetworkViz: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { x: mouseX, y: mouseY } = useMousePosition();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initializeNetwork();
    };

    const initializeNetwork = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const layers = [4, 6, 6, 4];
      const newNodes: Node[] = [];
      const newConnections: Connection[] = [];
      let nodeId = 0;

      layers.forEach((nodeCount, layerIndex) => {
        const layerX = (width / (layers.length + 1)) * (layerIndex + 1);
        const spacing = height / (nodeCount + 1);

        for (let i = 0; i < nodeCount; i++) {
          const node: Node = {
            id: nodeId,
            x: layerX,
            y: spacing * (i + 1),
            layer: layerIndex,
            value: Math.random(),
            connections: [],
          };

          if (layerIndex > 0) {
            const prevLayerStart = newNodes.findIndex((n) => n.layer === layerIndex - 1);
            const prevLayerEnd = newNodes.findIndex((n) => n.layer === layerIndex);
            const prevLayerNodes =
              prevLayerEnd === -1
                ? newNodes.slice(prevLayerStart)
                : newNodes.slice(prevLayerStart, prevLayerEnd);

            prevLayerNodes.forEach((prevNode) => {
              node.connections.push(prevNode.id);
              newConnections.push({
                from: prevNode.id,
                to: nodeId,
                weight: Math.random(),
                active: false,
              });
            });
          }

          newNodes.push(node);
          nodeId++;
        }
      });

      setNodes(newNodes);
      setConnections(newConnections);
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      time += 0.01;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      const rect = canvas.getBoundingClientRect();
      const relativeMouseX = mouseX - rect.left;
      const relativeMouseY = mouseY - rect.top;

      const updatedConnections = connections.map((conn) => {
        const fromNode = nodes.find((n) => n.id === conn.from);
        const toNode = nodes.find((n) => n.id === conn.to);

        if (!fromNode || !toNode) return conn;

        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        const distToMouse = Math.hypot(relativeMouseX - midX, relativeMouseY - midY);

        return {
          ...conn,
          active: distToMouse < 150,
        };
      });

      updatedConnections.forEach((conn) => {
        const fromNode = nodes.find((n) => n.id === conn.from);
        const toNode = nodes.find((n) => n.id === conn.to);

        if (!fromNode || !toNode) return;

        const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);

        if (conn.active) {
          gradient.addColorStop(0, `rgba(0, 255, 255, ${conn.weight * 0.8})`);
          gradient.addColorStop(0.5, `rgba(255, 0, 255, ${conn.weight * 0.8})`);
          gradient.addColorStop(1, `rgba(0, 255, 255, ${conn.weight * 0.8})`);
          ctx.lineWidth = 2;
        } else {
          gradient.addColorStop(0, `rgba(100, 100, 255, ${conn.weight * 0.2})`);
          gradient.addColorStop(1, `rgba(100, 100, 255, ${conn.weight * 0.1})`);
          ctx.lineWidth = 1;
        }

        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);

        const controlX = (fromNode.x + toNode.x) / 2;
        const controlY = (fromNode.y + toNode.y) / 2 + Math.sin(time + conn.weight * 10) * 20;
        ctx.quadraticCurveTo(controlX, controlY, toNode.x, toNode.y);
        ctx.stroke();

        if (conn.active) {
          const progress = (Math.sin(time * 3 + conn.weight * 10) + 1) / 2;
          const t = progress;
          const particleX =
            (1 - t) * (1 - t) * fromNode.x +
            2 * (1 - t) * t * controlX +
            t * t * toNode.x;
          const particleY =
            (1 - t) * (1 - t) * fromNode.y +
            2 * (1 - t) * t * controlY +
            t * t * toNode.y;

          const particleGradient = ctx.createRadialGradient(
            particleX,
            particleY,
            0,
            particleX,
            particleY,
            8
          );
          particleGradient.addColorStop(0, 'rgba(0, 255, 255, 1)');
          particleGradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.5)');
          particleGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

          ctx.fillStyle = particleGradient;
          ctx.beginPath();
          ctx.arc(particleX, particleY, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      nodes.forEach((node) => {
        const distToMouse = Math.hypot(relativeMouseX - node.x, relativeMouseY - node.y);
        const isNear = distToMouse < 100;

        const pulse = Math.sin(time * 2 + node.id) * 0.5 + 0.5;
        const baseRadius = 6 + pulse * 2;
        const radius = isNear ? baseRadius * 1.5 : baseRadius;

        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2);

        if (isNear) {
          gradient.addColorStop(0, 'rgba(0, 255, 255, 1)');
          gradient.addColorStop(0.3, 'rgba(255, 0, 255, 0.8)');
          gradient.addColorStop(0.6, 'rgba(0, 255, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
        } else {
          gradient.addColorStop(0, `rgba(100, 150, 255, ${node.value})`);
          gradient.addColorStop(0.5, `rgba(100, 150, 255, ${node.value * 0.5})`);
          gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isNear ? 'rgba(255, 255, 255, 1)' : 'rgba(200, 200, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        if (isNear) {
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, connections, mouseX, mouseY]);

  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />

      <div className="absolute top-4 left-4 text-white/60 text-xs font-mono">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Neural Network Active</span>
        </div>
        <div className="text-white/40">
          Hover to activate connections
        </div>
      </div>
    </motion.div>
  );
};
