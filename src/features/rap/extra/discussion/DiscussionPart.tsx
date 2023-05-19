import { StyledLinkify, linkifyOptions } from "./Discussion";
import DiscussionPartHeader from "./DiscussionPartHeader";

interface DiscussionPartContainerProps {
  header: string;
  children: React.ReactNode;
  issuingOffice: string;
}

export default function DiscussionPart({
  header,
  children,
  issuingOffice,
}: DiscussionPartContainerProps) {
  const lowercaseHeader = header
    .toLowerCase()
    .replace(issuingOffice.toLowerCase(), issuingOffice.toUpperCase())
    .replace(/(^|\s|\/)([a-z])/g, function (m, p1, p2) {
      return p1 + p2.toUpperCase();
    });

  return (
    <div>
      <DiscussionPartHeader>{lowercaseHeader}</DiscussionPartHeader>
      <StyledLinkify tagName="div" options={linkifyOptions}>
        {children}
      </StyledLinkify>
    </div>
  );
}
