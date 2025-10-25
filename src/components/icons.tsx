import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      <path d="M12 22V12"></path>
      <path d="M20 12v5"></path>
      <path d="M4 12v5"></path>
    </svg>
  );
}

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.5 9.5L9.5 14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.49997 10.5C7.3954 10.5 6.49997 9.60457 6.49997 8.5C6.49997 7.39543 7.3954 6.5 8.49997 6.5C9.60454 6.5 10.5 7.39543 10.5 8.5C10.5 9.60457 9.60454 10.5 8.49997 10.5Z"
        fill="currentColor"
      />
      <path
        d="M15.5 17.5C14.3954 17.5 13.5 16.6046 13.5 15.5C13.5 14.3954 14.3954 13.5 15.5 13.5C16.6046 13.5 17.5 14.3954 17.5 15.5C17.5 16.6046 16.6046 17.5 15.5 17.5Z"
        fill="currentColor"
      />
    </svg>
  ),
};
