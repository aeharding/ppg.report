import styled from "@emotion/styled";
import fig11f from "./Ch2-Fig11f.png";
import fig12fi from "./Ch2-Fig12fi.png";
import fig13 from "./Ch2-Fig13.png";
import fig14 from "./Ch2-Fig14.png";
import fig15 from "./Ch2-Fig15.png";
import { css } from "@emotion/react";

const BookExtract = styled.div`
  padding: 0 1rem;
  text-align: justify;

  line-height: 1.5;

  --primary: #00a2ff;

  h2 {
    font-size: 1.1rem;
    color: var(--primary);
  }
`;

const Figure = styled.figure`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;

  figcaption {
    font-size: 0.8em;

    aside {
      display: inline;
      color: var(--primary);
      font-weight: bold;
    }
  }
`;

const DefinitionList = styled.ul`
  font-style: italic;
  color: var(--primary);

  li:not(:last-of-type) {
    margin-bottom: 1rem;
  }
`;

const Img = styled.img<{ padding?: boolean }>`
  width: 100%;

  ${({ padding }) =>
    !padding &&
    css`
      margin: 0 -1rem;
      width: calc(100% + 2rem);
    `}
`;

export default function LapseRate() {
  return (
    <>
      <p>
        The following is an extract from Chapter 2 of "Understanding the Sky" by
        Dennis Pagen. It's a fantastic reference that will make you become a
        better pilot, especially when it comes to micrometeorology.
      </p>

      <p>
        So much weather doesn't show up in forecasts, yet can have a huge effect
        on local flying conditions. That's why I highly recommend this book.
      </p>

      <p>
        If you're interested, please consider purchasing through my affiliate
        link, which will support both the book author and me.
      </p>
      <BookExtract>
        <h2>THE LAPSE RATE</h2>

        <p>
          Stable and unstable air is a concept we must explore in great depth to
          understand how convective lift (thermals) is created. But first we
          must picture the temperature profile or lapse rate of the air.
        </p>

        <p>
          As mentioned earlier, the air is heated from below by the ground.
          Also, the atmosphere becomes less dense with altitude. These two
          factors combine to create the normal situation of warmer air at the
          surface and gradually cooling air as altitude is gained.
        </p>

        <p>
          Look at figure 11 below. The curve drawn at A is the ideal temperature
          profile or lapse rate of a &ldquo;normal&rdquo; atmosphere. You can
          see that as we go up in altitude, we go down in temperature. The
          atmosphere is rarely normal, but this lapse rate is the average found
          around the Earth. This average lapse rate is known as the standard
          lapse rate (SLR) and exhibits a drop of 3.6 &deg;F per 1,000 ft or 2.0
          &deg;C/1,000 ft or 2.0 &deg;C/300 m.
        </p>

        <Figure>
          <Img
            src={fig11f}
            css={css`
              filter: invert(1) brightness(0.8);
            `}
            padding
          />

          <figcaption>
            {" "}
            <aside>Fig. 11: THE LAPSE RATE</aside> The curve drawn at A is the
            ideal temperature profile or lapse rate of a &ldquo;normal&rdquo;
            atmosphere. Curve B is a more realistic situation at night and shows
            a ground inversion. Curve C is the daytime situation and is known as
            unstable.
          </figcaption>
        </Figure>

        <p>
          Now look at the curve B. This is a more realistic situation at night.
          Here we see the air is much cooler near the ground due to contact with
          the cold ground. This feature is called a ground inversion and is the
          typical state of affairs at night. This inversion may extend upwards
          to 1,000 ft (300 m) or more depending on the amount of wind present to
          create mixing.
        </p>

        <p>
          The word inversion refers to the fact that the air&rsquo;s temperature
          actually increases or at least doesn&rsquo;t cool as much as normal
          for a given gain in altitude in the inversion layer. An inversion
          layer contains stable air as we shall see.
        </p>

        <p>
          If we look higher up in the graph we see another inversion layer at
          about 5,000 ft. Here the air gets warmer as we climb then drops off
          again. This is a common feature of the atmosphere and will be
          explained below.
        </p>

        <p>
          The daytime situation is very similar to the curve at C. Here we see
          the air near the ground heated well beyond the normal amount. This
          intense ground heating spreads its warmth upward increasingly as the
          day progresses through convection currents. The dashed lines in curve
          B and C show the gradual change of the lapse rate from night through
          morning to the maximum midday heating. As evening falls the reverse
          process takes place. Such a lapse rate as shown in the lower part of
          curve C is known as unstable for reasons we shall see.
        </p>

        <h2>STABILITY AND INSTABILITY</h2>

        <p>
          Stable air is air that wants to stay where it is in the vertical
          dimension. Let&rsquo;s see how this works. Imagine a bubble of air
          rising in the atmosphere as pictured in figure 12. As it rises it
          expands due to reduced pressure. This pressure drop is fairly linear
          in the lower 10,000 ft (3,000&#8239;m) and the uniform expansion of
          the air bubble cools it at a rate of 5.5 &deg;F per 1,000&#8239;ft or
          3 &deg;C per 1,000 ft or 1 &deg;C per 100 m. The same expansion and
          cooling will occur in a helium or hot air balloon as they rise without
          added heat.
        </p>

        <Figure>
          <Img
            src={fig12fi}
            css={css`
              filter: invert(1) brightness(0.8) hue-rotate(180deg);
            `}
            padding
          />

          <figcaption>
            {" "}
            <aside>Fig. 12: THE MEANING OF STABILITY</aside> A bubble of air
            (bottom) is rising in an atmosphere whose lapse rate cools off less
            than 5.5&#160;&deg;/1,000 ft (1&#160;&deg;C/100 m). The bubble is
            cooling faster than the surrounding air as it climbs. Eventually it
            reaches a height where it is the same temperature as its
            surroundings (middle). If it is forced to go higher than this
            equilibrium level it would drop back down because it would be cooler
            than the surrounding air.
          </figcaption>
        </Figure>

        <p>
          The rate of cooling a rising parcel of air undergoes &ndash;
          5.5&#160;&deg;F /1,000 ft (1 &deg;C/100 m) &ndash; is known as the Dry
          Adiabatic Lapse Rate or DALR. It is dry not because there is no water
          vapor in the air parcel, but because this vapor is not condensing or
          changing to visible cloud. It is adiabatic because no heat is gained
          from or lost to the surrounding air. In the real-life situation some
          mixing with the surrounding air may occur, but this is usually of
          limited extent.
        </p>

        <p>
          Now we know that warmer air at a given level is less dense than cooler
          air at that level because they both experience the same pressure but
          the warmer air is more energetic so the molecules are spread further
          apart. Thus warmer air wants to rise when it is surrounded by cooler
          air because it is less dense and lighter, while cooler air wants to
          sink when it is surrounded by warmer air because it is heavier. This
          is the same principle that causes less dense wood to rise in water and
          more dense rock to sink.
        </p>

        <p>
          If our happy bubble of air was rising in an atmosphere whose lapse
          rate cooled off less than 5.5&#160;&deg;/1,000 ft (1&#160;&deg;C/100
          m), then the bubble would be cooling faster than the surrounding air
          as it climbed and eventually it would reach a height where it was the
          same temperature as its surroundings as shown in the figure. In fact
          if it was forced to go higher than this equilibrium point it would get
          the urge to drop back down to the equilibrium level because it would
          be cooler, and thus heavier, than the surrounding air. This is the
          meaning of stability.
        </p>

        <p>
          Unstable air is just the opposite. If the lapse rate of the air cools
          more than 5.5&#8239;&deg;F/ 1,000&#8239;ft (1&#8239;&deg;C/100 m), a
          parcel of air forced upward will not cool as much as the surrounding
          air so it will continue to rise (see figure 13). Instability of the
          air means that it is out of balance, for the air in the lower layers
          is too warm for it to remain tranquil in the vertical dimension (note
          that horizontal wind blows in stable and unstable conditions).
          Unstable air wants to turn turtle to distribute the heat upward.
        </p>

        <Figure>
          <Img
            src={fig13}
            css={css`
              filter: invert(1) brightness(0.8) hue-rotate(180deg);
            `}
            padding
          />

          <figcaption>
            {" "}
            <aside>Fig. 13: THE MEANING OF INSTABILITY</aside> Instability of
            the air means that it is out of balance, for the air in the lower
            layers is too warm for it to remain tranquil in the vertical
            dimension. If the lapse rate of the air cools more than
            5.5&#8239;&deg;F/ 1,000&#8239;ft (1&#8239;&deg;C/100 m), a parcel of
            air forced upward will not cool as much as the surrounding air so it
            will continue to rise.
          </figcaption>
        </Figure>

        <p>
          We can now form the concise definitions:
          <DefinitionList>
            <li>
              <strong>Stable air</strong> occurs when the lapse rate is less
              than the DALR (5.5 &deg;F/ 1,000 ft [1 &deg;C/100 m]).
            </li>
            <li>
              <strong>Unstable air</strong> occurs when the lapse rate is
              greater than the DALR.
            </li>
          </DefinitionList>
        </p>

        <p>
          It is important to note that in stable conditions a parcel of air
          moved downward will want to move back up to equilibrium while a parcel
          moved downward in unstable conditions wants to continue downward. The
          latter point accounts for much of the widespread sink found on
          unstable days. Also the nature of stability and instability is what
          causes some days to exhibit more buoyancy than others in ridge lift.
          Of course, unstable conditions lead to thermals (bubbles of convective
          lift) which are featured in later chapters.
        </p>

        <p>
          Now look back at figure 11. The solid curve A which shows the SLR can
          be seen to be stable because the temperature drops less than the DALR
          which is shown by the dashed lines. If the lapse rate is greater than
          the DALR it is known as superadiabatic. Such a lapse rate is shown in
          the lower portion of curve C. A superadiabatic lapse rate generally
          only occurs over hot deserts or close to the ground on sunny days in
          less torrid climes.
        </p>

        <h2>INDICATIONS OF STABILITY</h2>

        <p>
          Pilots of all sorts should be able to detect the general stability of
          the air before they commit body and soul to its mercies. Perhaps you
          are a soaring pilot and wish to hunt thermal lift, or possibly you
          want to motor around in glassy air. In the first case you need
          unstable conditions and in the second you must look for stable and
          slow moving air.
        </p>

        <p>
          In general, a clear night followed by a clear morning will bring
          unstable conditions for the clear night allows a thick layer of cold
          air to form, which is unstable with respect to the air warmed at
          ground level in the morning. However, a very cold night delays the
          onset of deep convection because of the low level inversion as shown
          at the bottom of curve B in figure 11. On the other hand, overcast
          days and periods of days where the air has continuously warmed tend to
          be more stable.
        </p>

        <p>
          Cloud types (see Chapter 3) are always indicators of stability.
          Cumulus or tumbled clouds are caused by vertical currents and always
          imply instability. Stratus or layer clouds are usually signs of
          stability. Likewise, smoke that rises to a certain level then spreads
          out signifies stable conditions while high rising smoke means unstable
          conditions.
        </p>

        <p>
          Dust devils, gusty winds (away from turbulence inducing structures)
          and good visibility are also signs of unstable air while steady winds,
          fog layers and poor visibility due to haze and smoke denote stable
          air. These effects are summarized in figure 14.
        </p>

        <Figure>
          <Img
            src={fig14}
            css={css`
              filter: brightness(0.8);
            `}
          />

          <figcaption>
            {" "}
            <aside>Fig. 14: STABILITY INDICATIONS</aside> Cloud types are
            indicators of how stable an air mass is.
            <br />
            Top: Stratus or layer clouds are usually signs of stability.
            Likewise, smoke that rises to a certain level then spreads out
            signifies stable conditions. Steady winds, fog layers and haze and
            smoke denote stable air.
            <br />
            Bottom: High rising smoke means unstable conditions. Cumulus or
            tumbled clouds are caused by vertical currents and always imply
            instability. Dust devils, gusty winds and good visibility are also
            signs of unstable air.
          </figcaption>
        </Figure>

        <h2>THE STABILITY OF LAYERS</h2>

        <p>
          Here we turn our attention to the ways which the stability of the air
          mass or that of certain layers changes. First we note there is a daily
          variation from the sun&rsquo;s heating. Also, whole new air masses can
          enter the area as when cold and warm fronts bully their way through.
          These new air masses typically have different temperature profiles and
          thus different stability (we cover fronts in Chapter 4).
        </p>

        <p>
          Along coastal areas marine air usually invades the land in the warm
          season. This air is cool and pushes under the warmer land air mass.
          The result is cool, stable air near the ground topped by warmer
          unstable air. This is known as the marine inversion. It is
          &ldquo;inverted&rdquo; because the cool air is below the warmer air.
          Typically stratus clouds are formed at the top of this marine layer if
          it is thick, or fog if it is thin.
        </p>

        <p>
          In mountainous terrain, warm air moving into the area may flow across
          the tops of the valleys rather than descend the slopes. This leaves
          pools of cool air below the upper warm layer which again results in an
          inversion layer at mountain top height. Lift is suppressed in this
          inversion layer and stops soon after entering it. Also in mountainous
          areas, at night cool air formed at the surface will slide down the
          slopes to fill the valley with cool, stable air. It may take hours
          before the sun can heat and mix this stable valley air.
        </p>

        <p>
          One of the most common and important ways that the stability of air
          masses changes or inversion layers are formed is by lifting or sinking
          of the entire air mass. This is such an important point that we note
          it specially:
        </p>

        <p>
          When an air mass is lifted it becomes less stable. When an air mass
          sinks it becomes more stable.
        </p>

        <p>
          To see why this principle is so, look at figure 15. Here we see a
          rising layer of air. As it is lifted it stretches vertically and the
          top expands faster than the bottom, thus cooling more. In the example
          shown, the layer starts at 5,000 ft with a lapse rate identical to the
          entire air mass (3.5&#160;&deg;F/1,000 feet). As it rises the layer
          cools at the dry adiabatic rate (DALR) of 5.5&#160;&deg;F/1,000 ft.
        </p>

        <Figure>
          <Img
            src={fig15}
            css={css`
              filter: brightness(2);
            `}
          />

          <figcaption>
            {" "}
            <aside>Fig. 15: LAYER STABILITY CHANGES</aside> As a rising layer of
            air is lifted it stretches vertically and the top expands faster
            than the bottom, thus cooling more. Therefore, the lifted layer is
            considerably less stable than before. A sinking layer will become
            more stable in the same manner.
          </figcaption>
        </Figure>

        <p>
          After some time the bottom of the layer reaches 15,000 ft but the top
          is nearly at 18,000 ft due to vertical stretching. Thus the bottom of
          the layer has cooled to 22 &deg;F which is 77 &deg;F &ndash; 5.5 &deg;
          x 10 (thousand feet). The top has cooled to 9.5 &deg;F which is 70
          &deg;F &ndash; 5.5&deg; x 11 (thousand feet). The difference in the
          top and bottom layers is now 22&deg; &ndash; 9.5&deg; or 12.5 &deg;F.
          Since 3,000 feet separates the top and bottom, the lapse rate is now
          (12.5 divided by 3) or 4.2 &deg;F per 1,000 ft. This is considerably
          less stable than the 3.5 &deg;F/1,000 ft we started with.
        </p>

        <p>
          In a similar manner a sinking layer will become more stable. The
          result of a descending layer is often an inversion if the descent
          lasts long enough. The upper level inversions shown in figure 11 are
          caused precisely by this mechanism. Very often such an inversion puts
          a cap on thermal heights and is especially found in high pressure
          dominated weather (see Chapter 4).
        </p>

        <p>
          The results of an ascending layer at different times can be widespread
          lift bands, fat, gentle thermals, improved soaring conditions,
          altocumulus clouds and mackerel sky (clouds that look like the scales
          of a fish). Ascending layers are caused by the lift created by moving
          fronts, surface warming and low pressure systems. Descending layers
          are notably associated with high pressure systems and surface cooling.
        </p>

        <h2>THE MOIST LAPSE RATE</h2>

        <p>
          In the previous chapter we discovered that rising air that contains
          water vapor expands and cools so that its relative humidity increases.
          If this process continues, the relative humidity reaches 100%,
          saturation is said to occur and the air&rsquo;s temperature has
          reached the dew point. If this air is lifted further, condensation
          begins that causes the release of latent heat. The release of latent
          heat warms the air so it no longer cools at the DALR as it continues
          to rise. The lapse rate that occurs when condensation takes place is
          called the Moist Adiabatic Lapse Rate (MALR) This lapse rate is
          between 2 &deg; and 5 &deg;F per 1,000 ft (1.1&deg; to 2.8 &deg;C/300
          m) depending on the original temperature of the rising air, and
          averages about 3 &deg;F per 1,000 ft (0.5&#160;&deg;C/100&#160;m).
        </p>

        <p>
          The average MALR along with the DALR and the Standard Lapse Rate (SLR)
          is shown in figure 16. When the temperature profile of the air lies
          between the DALR and the MALR it is said to be conditionally unstable.
          This means that it will be unstable if the air is saturated and
          further produces condensation. This is the case in clouds that form in
          stable air and grow vertically. Also in the figure we have labeled the
          area to the right of the MALR as absolutely stable for a parcel of air
          rising in an air mass with a lapse rate in this region will always
          want to return to its point of origin, even if condensation occurs.
          The area to the left of the DALR is where absolutely unstable
          conditions occur with the spontaneous generation of thermals. A lapse
          rate in this region is termed superadiabatic as mentioned earlier.
          Such a super lapse rate condition rarely lasts long in nature except
          very close to the ground on sunny days. This is because thermal
          currents distribute heat upwards and thus they modify the lapse rate.
        </p>

        <p>
          The whole process of water vapor rising and exchanging heat with the
          atmosphere is very important to the weather process. For each ton of
          water that condenses, almost 2 million BTUs (British Thermal Units) of
          latent heat is released to the atmosphere. This energy is the main
          thing that powers thunderstorms, tornados, hurricanes and other strong
          wind sources. We can think of water vapor as a transporter of heat in
          our atmosphere that causes heat imbalances that &ldquo;weather&rdquo;
          works to straighten out. Water is the great modifier.
        </p>

        <p>
          &#61569;FIG. 16: Relationship of Important Lapse Rates The average
          MALR along with the DALR and the Standard Lapse Rate (SLR) is shown.
          To the right lapse rate is said to be absolutely stable, to the left
          it is said to be superadiabatic and absolutely unstable. This is where
          thermals are spontaneously generated.
        </p>
      </BookExtract>
    </>
  );
}
