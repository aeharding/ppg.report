import styled from "@emotion/styled/macro";

const Link = styled.a`
  position: absolute;
  bottom: 4px;
  right: 6px;
  font-size: 0.9em;

  z-index: 401;

  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;

  transform: translate3d(0, 0, 0);

  && {
    color: rgba(255, 255, 255, 0.7);
    pointer-events: auto;
  }
`;

export default function Attribution() {
  return (
    <Link
      href="https://www.openstreetmap.org/copyright"
      target="_blank"
      rel="noopener"
    >
      &copy; OpenStreetMap
    </Link>
  );
}
