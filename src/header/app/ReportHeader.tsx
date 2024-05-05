import styled from "@emotion/styled";
import { faArrowLeft } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReverseLocation from "../../features/geocode/ReverseLocation";
import { useParams } from "react-router";
import Sun from "./Sun";

const BackButton = styled.div`
  position: absolute;
  left: 0;

  width: 50px;
  height: 50px;
  font-size: 1.3em;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Location = styled.div`
  font-size: 0.91em;
  margin: auto;
  width: 60%;

  text-align: center;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export default function ReportHeader() {
  const { location } = useParams<"location">();
  const [lat, lon] = (location ?? "").split(",");

  if (!lat || !lon || isNaN(+lat) || isNaN(+lon)) return null;

  return <ReportHeaderValidProps lat={lat} lon={lon} />;
}

export interface ReportHeaderProps {
  lat: string;
  lon: string;
}

function ReportHeaderValidProps({ lat, lon }: ReportHeaderProps) {
  return (
    <>
      <BackButton>
        <FontAwesomeIcon icon={faArrowLeft} />
      </BackButton>
      <Location>
        <ReverseLocation lat={lat} lon={lon} />
      </Location>
      <Sun lat={lat} lon={lon} />
    </>
  );
}
