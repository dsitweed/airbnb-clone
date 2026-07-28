import BackButton from './BackButton';

interface HeadingProps {
  title: string;
  subTitle?: string;
  center?: boolean;
  backBtn?: boolean;
}

export default function Heading({
  title,
  subTitle,
  center,
  backBtn,
}: HeadingProps) {
  return (
    <div className="flex items-center justify-between">
      <div className={center ? 'text-center' : 'text-start'}>
        <h3 className="text-2xl leading-tight font-bold">{title}</h3>
        <p className="mt-2 font-light text-neutral-500 md:mt-1">{subTitle}</p>
      </div>
      {backBtn ? <BackButton /> : null}
    </div>
  );
}
