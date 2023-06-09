import { SVGProps } from "react";

export default function Icon({ ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0.22 171 468.8 298"
      {...props}
    >
      <defs>
        <linearGradient id="holiday-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          {createGradientStops(findTodaysColorStops())}
        </linearGradient>
      </defs>
      <g fill="url(#holiday-gradient)">
        <path d="M11 320c3 0 6-1 8-4 1-1 63-81 205-81a11 11 0 100-22C71 213 5 299 2 303a11 11 0 009 17z" />
        <path d="M405 171c-48 0-61 24-63 27-2 5 0 11 5 14s12 1 14-4c1-1 10-16 44-16 39 0 43 30 43 43 0 16-18 64-96 64-46 0-73-7-97-13-20-4-38-9-63-9-55 0-157 44-191 113a11 11 0 0019 9c31-60 124-100 172-100 22 0 39 4 58 8 25 6 53 13 102 13 96 0 117-63 117-85 0-30-16-64-64-64z" />
        <path d="M224 341c-113 0-137 69-138 72a11 11 0 0020 6s20-56 118-56c96 0 139 26 139 53 0 26-18 32-32 32s-30-13-35-18a11 11 0 10-16 15c3 2 26 24 51 24s53-14 53-53c0-36-42-75-160-75z" />
      </g>
    </svg>
  );
}

function findTodaysColorStops(): string[] {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  if (month === 6 && day === 19) {
    // Juneteenth
    return ["#b7372b", "#d8a617", "#216330"];
  } else if (month === 6 && day === 28) {
    // Pride day
    return ["#E40303", "#FF8C00", "#FFED00", "#008026", "#24408E", "#732982"];
  } else {
    return ["currentColor"];
  }
}

const createGradientStops = (colors: string[]): JSX.Element[] => {
  const totalStops = colors.length;
  const stopPercentage = 100 / (totalStops - 1);

  return colors.map((color, index) => (
    <stop key={index} offset={`${index * stopPercentage}%`} stopColor={color} />
  ));
};
