import styled from "@emotion/styled/macro";

const PromoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  background: linear-gradient(140deg, rgb(0 25 51), rgb(0 25 255));
  background: linear-gradient(
    140deg,
    color(display-p3 0 0.1 0.2),
    color(display-p3 0 0.1 1)
  );
  padding: 1rem;
  margin: 0 1rem;
  border-radius: 1rem;
`;

const PromoButton = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
  font-size: 1.1em;

  align-self: flex-end;

  span {
    font-size: 1.1em;
  }
`;

interface PromoProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function Promo({ onClick }: PromoProps) {
  return (
    <PromoContainer onClick={onClick}>
      Obsessed about weather? For a better experience, get the app installed on
      your homescreen.
      <PromoButton>
        Install app <span>🚀</span>
      </PromoButton>
    </PromoContainer>
  );
}
