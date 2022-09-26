import styled from "@emotion/styled/macro";
import { outputP3ColorFromRGB } from "../helpers/colors";
import { ReactComponent as Email } from "./email.svg";
import pJson from "../../package.json";

const A = styled.a`
  text-decoration: underline;
`;

const TermsContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 1em auto;
  padding: 0 2em;
`;

const Warning = styled.strong`
  ${outputP3ColorFromRGB([255, 255, 0])}
`;

export default function Terms() {
  return (
    <TermsContainer>
      <h2>About</h2>

      <p>
        Your device is currently using ppg.report version {pJson.version}. View
        information about this release{" "}
        <A
          href={`https://github.com/aeharding/ppg.report/releases/tag/v${pJson.version}`}
        >
          on Github
        </A>
        .
      </p>

      <h2>Attribution</h2>

      <p>
        Geocoding, reverse geocoding, and map tiles{" "}
        <a href="https://www.openstreetmap.org/copyright">
          &copy; OpenStreetMap contributors
        </a>
      </p>

      <h2>Reach Me</h2>

      <p>Have a question?</p>

      <Email />

      <h2>Privacy Policy</h2>

      <p>Last Updated: September 19th, 2022</p>

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
            <strong>Purpose:</strong> To show you weather information,
            especially as it relates to conditions aloft.
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
          <br />
          <li>
            <strong>NOAA Aviation Weather Center Text Data Server</strong> —{" "}
            <a
              href="https://aviationweather.gov/dataserver"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://aviationweather.gov/dataserver
            </a>
            <br />
            <strong>Purpose:</strong> To retrieve nearby airport TAF reports,
            G‑AIRMETs, SIGMETs, and CWAs to enhance available weather
            information.
          </li>
          <br />
          <li>
            <strong>National Weather Service API</strong> —{" "}
            <a
              href="https://www.weather.gov/documentation/services-web-api"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://api.weather.gov
            </a>
            <br />
            <strong>Purpose:</strong> To retrieve hourly weather information for
            your location.
          </li>
          <br />
          <li>
            <strong>TimeZoneDB</strong> —{" "}
            <a
              href="https://timezonedb.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://timezonedb.com
            </a>
            <br />
            <strong>Purpose:</strong> To retrieve the time zone for a given
            geolocation.
            <br />
            <strong>Note:</strong> This is a fallback API, and will only be
            called when the National Weather Service API fails.
          </li>
          <br />
          <li>
            <strong>USGS Elevation Point Query Service</strong> —{" "}
            <a
              href="https://nationalmap.gov/epqs"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://nationalmap.gov/epqs
            </a>
            <br />
            <strong>Purpose:</strong> To retrieve elevation for a location
          </li>
          <br />
          <li>
            <strong>Google Elevation API</strong> —{" "}
            <a
              href="https://developers.google.com/maps/documentation/elevation/start"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://developers.google.com
            </a>
            <br />
            <strong>Purpose:</strong> To retrieve elevation for a location,
            worldwide
            <br />
            <strong>Note:</strong> This is a fallback API, and will only be
            called when the USGS Elevation Point Query Service either fails or
            the queried location is outside the United States.
          </li>
          <br />
          <li>
            <strong>OpenStreetMap Tile Server</strong> —{" "}
            <a
              href="https://operations.osmfoundation.org/policies/tiles/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://operations.osmfoundation.org
            </a>
            <br />
            <strong>Purpose:</strong> To provide maps for weather alerts
          </li>
          <br />
          <li>
            <strong>OGC Web Services</strong> —{" "}
            <a
              href="https://mesonet.agron.iastate.edu/ogc"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://mesonet.agron.iastate.edu
            </a>
            <br />
            <strong>Purpose:</strong> To provide radar overlays on maps for
            weather alerts
          </li>
        </ol>
      </section>

      <h2>Terms of Use</h2>

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
