import React, { useEffect, useRef } from "react";
import "../Cursor.css";

interface Cursor {
  delay: number;
  _x: number;
  _y: number;
  endX: number;
  endY: number;
  cursorVisible: boolean;
  cursorEnlarged: boolean;
  $dot: HTMLDivElement;
  $outline: HTMLDivElement;
  dotSize?: number;
  outlineSize?: number;
  init: () => void;
  setupEventListeners: () => void;
  animateDotOutline: () => void;
  toggleCursorSize: () => void;
  toggleCursorVisibility: () => void;
}

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dotRef.current || !outlineRef.current) return;

    const cursor: Cursor = {
      delay: 8,
      _x: 0,
      _y: 0,
      endX: window.innerWidth / 2,
      endY: window.innerHeight / 2,
      cursorVisible: true,
      cursorEnlarged: false,
      $dot: dotRef.current,
      $outline: outlineRef.current,

      init: function () {
        // Set up element sizes
        this.dotSize = this.$dot.offsetWidth;
        this.outlineSize = this.$outline.offsetWidth;

        this.setupEventListeners();
        this.animateDotOutline();
      },

      setupEventListeners: function () {
        const self = this;

        // Anchor hovering
        document.querySelectorAll("a").forEach(function (el) {
          el.addEventListener("mouseover", function () {
            self.cursorEnlarged = true;
            self.toggleCursorSize();
          });
          el.addEventListener("mouseout", function () {
            self.cursorEnlarged = false;
            self.toggleCursorSize();
          });
        });

        // Click events
        document.addEventListener("mousedown", function () {
          self.cursorEnlarged = true;
          self.toggleCursorSize();
        });
        document.addEventListener("mouseup", function () {
          self.cursorEnlarged = false;
          self.toggleCursorSize();
        });

        const handleMouseMove = (e: MouseEvent) => {
          // Show the cursor
          self.cursorVisible = true;
          self.toggleCursorVisibility();

          // Position the dot
          self.endX = e.clientX;
          self.endY = e.clientY;
          self.$dot.style.top = self.endY + "px";
          self.$dot.style.left = self.endX + "px";
        };

        const handleMouseEnter = () => {
          self.cursorVisible = true;
          self.toggleCursorVisibility();
          self.$dot.style.opacity = "1";
          self.$outline.style.opacity = "1";
        };

        const handleMouseLeave = () => {
          self.cursorVisible = true;
          self.toggleCursorVisibility();
          self.$dot.style.opacity = "0";
          self.$outline.style.opacity = "0";
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseenter", handleMouseEnter);
        document.addEventListener("mouseleave", handleMouseLeave);

        // Return cleanup function for these event listeners
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseenter", handleMouseEnter);
          document.removeEventListener("mouseleave", handleMouseLeave);
        };
      },

      animateDotOutline: function () {
        const self = this;

        self._x += (self.endX - self._x) / self.delay;
        self._y += (self.endY - self._y) / self.delay;
        self.$outline.style.top = self._y + "px";
        self.$outline.style.left = self._x + "px";

        requestAnimationFrame(self.animateDotOutline.bind(self));
      },

      toggleCursorSize: function () {
        const self = this;

        if (self.cursorEnlarged) {
          self.$dot.style.transform = "translate(-50%, -50%) scale(0.75)";
          self.$outline.style.transform = "translate(-50%, -50%) scale(1.5)";
        } else {
          self.$dot.style.transform = "translate(-50%, -50%) scale(1)";
          self.$outline.style.transform = "translate(-50%, -50%) scale(1)";
        }
      },

      toggleCursorVisibility: function () {
        const self = this;

        if (self.cursorVisible) {
          self.$dot.style.opacity = "1";
          self.$outline.style.opacity = "1";
        } else {
          self.$dot.style.opacity = "0";
          self.$outline.style.opacity = "0";
        }
      },
    };

    cursor.init();

    // Cleanup function
    return () => {
      // The event listeners added in setupEventListeners are now cleaned up
      // by the cleanup function returned from setupEventListeners
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot"></div>
      <div ref={outlineRef} className="cursor-dot-outline"></div>
    </>
  );
};

export default CustomCursor;
