import styled from "@emotion/styled/macro";
import { ReactComponent as Email } from "./email.svg";

const TermsContainer = styled.div`
  width: 100%;
  max-width: 975px;
  margin: 1em auto;
`;

const Warning = styled.strong`
  color: yellow;
`;

export default function Terms() {
  return (
    <TermsContainer>
      <h1>Reach Me</h1>

      <p>Have a question?</p>

      <Email />

      <h1>Privacy Policy</h1>

      <p>Last Updated: September 1st, 2021</p>

      <p>
        <strong>
          PPG.report does not collect or share personal information.
        </strong>{" "}
      </p>

      <p>
        PPG.report does not use cookies. Your preferences are stored on your
        device, and are not transmitted to the server.
      </p>

      <h3>
        3<sup>rd</sup> Party APIs
      </h3>

      <section>
        <strong>We do not store geolocations.</strong> However, geolocations may
        be shared with the following third parties in order to provide you
        information:
        <ol>
          <li>
            <strong>NOAA's Rapid Refresh software</strong> —{" "}
            <a
              href="https://rucsoundings.noaa.gov"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://rucsoundings.noaa.gov
            </a>
            <br />
            <strong>Purpose:</strong> To show you weather information.
          </li>
          <br />
          <li>
            <strong>OpenStreetMap's Nominatim service</strong> —{" "}
            <a
              href="https://nominatim.openstreetmap.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://nominatim.openstreetmap.org
            </a>
            <br />
            <strong>Purpose:</strong> To retrieve a human readable location for
            given coordinates, and to find coordinates for a given query.
          </li>
        </ol>
      </section>

      <h1>Terms of Use</h1>

      <p>Last Updated: September 1st, 2021</p>

      <p>
        <Warning>⚠️ Warning! Fly at your own risk.</Warning>
      </p>

      <p>
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
        IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
        CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
        TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
        SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      </p>
    </TermsContainer>
  );
}
