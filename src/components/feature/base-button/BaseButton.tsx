// BaseButton.tsx
import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";

export type BaseButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "prefix" | "suffix"
> & {
  isLoading?: boolean;
};

export const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ children, className, ...props }, ref) => {
    const localRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => localRef.current!);

    return (
      <button
        ref={localRef}
        className={clsx(
          "m-0 inline-flex appearance-none items-center justify-center gap-2 p-0 focus:ring-0 focus:outline-none",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

BaseButton.displayName = "BaseButton";
