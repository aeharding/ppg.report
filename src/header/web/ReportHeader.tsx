import { faMapMarkerAlt } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import ReverseLocation from "../../features/geocode/ReverseLocation";
import Sun from "./Sun";

export const Icon = styled(FontAwesomeIcon)`
  && {
    width: 1.3em;
  }
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
      <Icon icon={faMapMarkerAlt} />{" "}
      <a
        href={`http://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=12&layers=M`}
        target="_blank"
        rel="noreferrer noopener"
      >
        <ReverseLocation lat={lat} lon={lon} />
      </a>
      <br />
      <Sun lat={lat} lon={lon} />
    </>
  );
}
