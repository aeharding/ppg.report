import styled from "@emotion/styled/macro";

const TermsContainer = styled.div`
  width: 100%;
  max-width: 975px;
  margin: 1em auto;
`;

export default function Terms() {
  return (
    <TermsContainer>
      <h1>Privacy Policy</h1>

      <p>
        <strong>
          PPG.report does not collect or share personal information.
        </strong>{" "}
      </p>

      <p>PPG.report does not use cookies.</p>

      <p>
        Your geolocation may be shared with NOAA's Rapid Refresh software
        available at https://rucsoundings.noaa.gov/. NOAA's Rapid Refresh
        software is the sole 3rd party API used for PPG.report.
      </p>

      <h1>Terms of Use</h1>

      <p>
        <strong style={{ color: "yellow" }}>
          ⚠️ Warning! Fly at your own risk!
        </strong>
      </p>

      <p>
        No liability is accepted and all liability is explicitly disclaimed and
        rejected by PPG.report and the user, by using PPG.report, releases and
        agrees to hold PPG.report's creators harmless from any and all claims
        for any and all damages, injuries and deaths that may result from using
        the information provided on PPG.report.
      </p>
      <p>
        This release, indemnity and hold harmless agreement is intended to be as
        broad as applicable law allows and shall be interpreted under the law of
        the United States, State of Wisconsin. PPG.report is intended for use in
        the United States only.
      </p>
      <p>
        The user's use of PPG.report is acceptance of this agreement, as well as
        being consent to the terms of this release, indemnity and hold harmless
        agreement. The user's use of PPG.report shall serve as consideration for
        this agreement. Should the user challenge the enforceability of this
        release, indemnity and hold harmless agreement, the user agrees to pay
        all attorney’s fees and costs incurred by PPG.report at the trial and
        all appellate court levels. Should the user refuse PPG.report’s tender
        of defense and indemnity, the user shall be liable for all attorney fees
        and costs as well as any settlement paid by or judgment against
        PPG.report as a result of any and all claims, in addition to all
        pre-tender fees and costs incurred by PPG.report.
      </p>
      <p>
        This agreement is severable in full and therefore to the extent that any
        term(s) of this agreement may be found unenforceable or void, it is the
        intention of the parties to give the balance of this agreement full
        effect.
      </p>
    </TermsContainer>
  );
}
