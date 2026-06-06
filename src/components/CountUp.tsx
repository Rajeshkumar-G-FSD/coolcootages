/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
}

export default function CountUp({ from = 0, to, duration = 1.8, decimals = 0 }: CountUpProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    // Use IntersectionObserver to start counting only when visible
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasTriggered]);

  useEffect(() => {
    if (!hasTriggered) {
      if (nodeRef.current) {
        nodeRef.current.textContent = from.toFixed(decimals);
      }
      return;
    }

    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1], // Custom premium ease-out
      onUpdate(value) {
        node.textContent = value.toFixed(decimals);
      },
    });

    return () => {
      controls.stop();
    };
  }, [from, to, duration, decimals, hasTriggered]);

  return <span ref={nodeRef}>{from.toFixed(decimals)}</span>;
}
