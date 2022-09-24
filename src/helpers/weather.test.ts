import { undoFixedWidthText } from "./weather";

describe("undoFixedWidthText", () => {
  const fixed = undoFixedWidthText(
    `
The Texas Commission on Environmental Quality (TCEQ) has issued an
Ozone Action Day for the Houston, Galveston, and Brazoria area for
Saturday, September 24, 2022.

Atmospheric conditions are expected to be favorable for producing
high levels of ozone pollution in the Houston, Galveston, and
surrounding areas on Saturday. You can help prevent ozone pollution by
sharing a ride, walking, riding a bicycle, taking your lunch to work,
avoiding drive through lanes, conserving energy and keeping your vehicle
proper tuned.

For more information on ozone:
Ozone: The Facts www.tceq.texas.gov/airquality/monops/ozonefacts.html
EPA AirNow: www.airnow.gov/?city=Houston&state=TX&country=USA
Take Care of Texas: www.takecareoftexas.org/conservation-tips/keep-our-
air-clean
  `.trim()
  );

  test("renders entire entire line", () => {
    expect(fixed).toContain(
      "The Texas Commission on Environmental Quality (TCEQ) has issued an Ozone Action Day for the Houston, Galveston, and Brazoria area for Saturday, September 24, 2022."
    );
  });

  test("renders with preserved link", () => {
    expect(fixed).toContain(
      "www.takecareoftexas.org/conservation-tips/keep-our-air-clean"
    );
  });
});
