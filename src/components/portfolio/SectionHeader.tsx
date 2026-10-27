import FadeUp from "./FadeUp";

// Editorial section header: mono overline in magenta + serif title.
export default function SectionHeader({
  overline,
  title,
  description,
  testId,
}: {
  overline: string;
  title: string;
  description?: string;
  testId: string;
}) {
  return (
    <FadeUp className="mb-10 sm:mb-14">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#9b1c61]">
        {overline}
      </p>
      <h2
        data-testid={testId}
        className="mt-3 font-heading text-2xl tracking-tight text-[#1a1619] sm:text-3xl lg:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5c5258]">{description}</p>
      ) : null}
    </FadeUp>
  );
}
