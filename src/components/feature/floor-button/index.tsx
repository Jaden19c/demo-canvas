import {
  BaseButton,
  type BaseButtonProps,
} from "@/components/feature/base-button";
import clsx from "clsx";
import styles from "./styles.module.scss";

type Props = BaseButtonProps & {
  isSelected?: boolean;
};
export const FloorButton = ({ children, isSelected, ...props }: Props) => {
  return (
    <BaseButton
      {...props}
      className={clsx(
        styles["floor-button"],
        isSelected && styles["floor-button--selected"]
      )}
    >
      {children}
    </BaseButton>
  );
};
