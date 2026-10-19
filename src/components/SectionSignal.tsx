import { Reveal } from "./Reveal";
import { Text } from "./primitives";

type SectionSignalProps = {
  index: string;
  label: string;
};

export function SectionSignal({ index, label }: SectionSignalProps) {
  return (
    <Reveal className="section-signal" delay={120}>
      <Text className="micro-label">{index}</Text>
      <span className="signal-line" aria-hidden="true">
        <span />
      </span>
      <Text className="micro-label signal-next">{label}</Text>
    </Reveal>
  );
}
